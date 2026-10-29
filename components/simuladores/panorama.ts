/**
 * Geometria da panorâmica esquemática (SVG original).
 * Tudo é desenhado num sistema “base” plano (1000 × 520) e passa por `warp`,
 * que aplica os parâmetros de posicionamento (curva do plano oclusal,
 * inclinação, largura por lado etc.). Lado esquerdo da tela = lado DIREITO
 * do paciente, como numa panorâmica convencional.
 */

export const W = 1000;
export const H = 520;
export const CX = 500;
export const OCC = 255; // plano oclusal (base)

export interface PanoParams {
  /** Curvatura do plano oclusal: 0,3 normal; > 1 “sorriso” exagerado; < 0 invertido. */
  smile: number;
  /** Inclinação lateral (−1…1): um lado mais alto que o outro. */
  tilt: number;
  /** Escala horizontal dos posteriores/ramo do lado direito do paciente (esquerda da tela). */
  scaleR: number;
  /** Idem, lado esquerdo do paciente (direita da tela). */
  scaleL: number;
  /** Largura dos dentes anteriores (1 normal; < 1 estreitos; > 1 largos). */
  antWidth: number;
  blurUpperAnt: number;
  blurLowerAnt: number;
  /** Deslocamento vertical do palato duro (positivo = desce sobre os ápices). */
  palateY: number;
  palateWidth: number;
  /** Faixa radiolúcida de ar sobre os ápices superiores (0…1). */
  airBand: number;
  /** Radiopacidade vertical anterior: fantasma da coluna (0…1). */
  spineGhost: number;
  /** Hioide subindo (negativo = sobe e se sobrepõe à mandíbula). */
  hyoidY: number;
  /** Côndilos subindo (negativo = saem pelo topo). */
  condyleY: number;
  /** Ramos/côndilos deslocados para fora (cortados nas laterais). */
  ramusCut: number;
  /** Sobreposição na região de pré-molares (0…1). */
  premolarOverlap: number;
  /** Brinco: imagem real + fantasma (0…1). */
  earring: number;
  /** Movimento: ondulações/degraus na borda inferior (0…1). */
  motion: number;
  /** Colar de tireoide: área radiopaca anterior (0…1). */
  collar: number;
  /** Fantasmas mais evidentes (0…1). */
  ghostsBoost: number;
}

export const NORMAL: PanoParams = {
  smile: 0.3,
  tilt: 0,
  scaleR: 1,
  scaleL: 1,
  antWidth: 1,
  blurUpperAnt: 0,
  blurLowerAnt: 0,
  palateY: 0,
  palateWidth: 1,
  airBand: 0,
  spineGhost: 0,
  hyoidY: 0,
  condyleY: 0,
  ramusCut: 0,
  premolarOverlap: 0,
  earring: 0,
  motion: 0,
  collar: 0,
  ghostsBoost: 0,
};

const ANT = 105; // limite da região anterior (até o canino)

export type Pt = [number, number];

/** Escala horizontal local (para largura de dentes). */
export function localScale(p: PanoParams, x: number) {
  const d = Math.abs(x - CX);
  if (d <= ANT) return p.antWidth;
  return x < CX ? p.scaleR : p.scaleL;
}

/** Aplica os parâmetros de posicionamento a um ponto do sistema base. */
export function warp(p: PanoParams, x: number, y: number): Pt {
  const s = x < CX ? -1 : 1;
  const d = Math.abs(x - CX);
  const side = s < 0 ? p.scaleR : p.scaleL;
  let X = d <= ANT ? CX + s * d * p.antWidth : CX + s * (ANT * p.antWidth + (d - ANT) * side);
  if (d > 300) X += s * p.ramusCut * 75 * Math.min(1, (d - 300) / 90);
  const u = (x - CX) / 420;
  const wy = 0.55 + 0.45 * (y / H);
  let Y = y + (-p.smile * 120 * u * u + p.tilt * 45 * u) * wy;
  if (p.motion && y > 280) {
    Y += p.motion * (x > 590 ? 11 : 0) * Math.min(1, (y - 280) / 120);
    if (y > 400) Y += p.motion * 6 * Math.sin(x / 13);
  }
  return [X, Y];
}

export const wp = (p: PanoParams, pts: Pt[]) => pts.map(([x, y]) => warp(p, x, y));

/** Caminho suave (Catmull-Rom → Bézier). */
export function smooth(pts: Pt[], closed = false, tension = 0.5): string {
  if (pts.length < 2) return "";
  const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 1; i <= n; i++) {
    const p0 = P[i - 1];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[i + 2];
    const k = tension / 3;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return closed ? `${d} Z` : d;
}

export const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [W - x, y]);

// ------------------------------------------------------------------
// Dentes
// ------------------------------------------------------------------

export interface ToothSpec {
  i: number; // 0 = incisivo central … 7 = terceiro molar
  upper: boolean;
  side: -1 | 1;
  x: number; // centro (base)
  w: number; // largura (base)
  crown: number;
  root: number;
  roots: 1 | 2;
}

const UPPER_W = [36, 30, 32, 30, 30, 46, 44, 40];
const LOWER_W = [26, 28, 31, 31, 32, 48, 46, 42];
const ROOT = [62, 60, 80, 60, 60, 50, 48, 44];
const LOWER_ROOT = [58, 60, 76, 62, 62, 52, 50, 46];

export function teeth(p: PanoParams): ToothSpec[] {
  const list: ToothSpec[] = [];
  for (const upper of [true, false]) {
    const widths = upper ? UPPER_W : LOWER_W;
    for (const side of [-1, 1] as const) {
      let edge = CX + side * 1.5;
      widths.forEach((w, i) => {
        // sobreposição em pré-molares: o passo encolhe e os dentes se sobrepõem
        const step = i === 3 || i === 4 ? w - p.premolarOverlap * 13 : w;
        const x = edge + side * (step / 2);
        edge += side * step;
        list.push({
          i,
          upper,
          side,
          x,
          w,
          crown: upper ? 44 : 41,
          root: upper ? ROOT[i] : LOWER_ROOT[i],
          roots: i >= 5 ? 2 : 1,
        });
      });
    }
  }
  return list;
}

/** Contorno do dente em coordenadas locais (oclusal em y = 0, ápice para y < 0). */
export function toothPath(w: number, ch: number, rl: number, roots: 1 | 2) {
  const h = w / 2;
  const cerv = w * 0.42;
  const top = -(ch + rl);
  const crownSide = `M ${-h} 0 Q ${-h - 1} ${-ch * 0.6} ${-cerv} ${-ch}`;
  const close = `L ${cerv} ${-ch} Q ${h + 1} ${-ch * 0.6} ${h} 0 Q 0 4 ${-h} 0 Z`;
  if (roots === 1) {
    return `${crownSide} L ${-w * 0.17} ${top} Q 0 ${top - 5} ${w * 0.17} ${top} ${close}`;
  }
  return `${crownSide} L ${-w * 0.36} ${top + 4} Q ${-w * 0.27} ${top - 3} ${-w * 0.16} ${top + 4} L 0 ${-(ch + rl * 0.38)} L ${w * 0.16} ${top + 4} Q ${w * 0.27} ${top - 3} ${w * 0.36} ${top + 4} ${close}`;
}

export function enamelPath(w: number, ch: number) {
  const h = w / 2;
  const cerv = w * 0.44;
  return `M ${-h} 0 Q ${-h - 1} ${-ch * 0.6} ${-cerv} ${-ch * 0.92} L ${cerv} ${-ch * 0.92} Q ${h + 1} ${-ch * 0.6} ${h} 0 Q 0 4 ${-h} 0 Z`;
}

// ------------------------------------------------------------------
// Contornos anatômicos (lado esquerdo da tela; o outro lado é espelhado)
// ------------------------------------------------------------------

/** Mandíbula: do centro inferior, contornando o lado esquerdo, até o centro superior. */
export const MANDIBLE_LEFT: Pt[] = [
  [500, 497],
  [400, 493],
  [300, 484],
  [205, 466],
  [138, 436],
  [110, 398],
  [100, 330],
  [94, 250],
  [90, 182],
  [84, 146],
  [86, 124],
  [100, 114],
  [116, 122],
  [122, 148],
  [138, 176],
  [162, 190],
  [184, 184],
  [200, 166],
  [206, 160],
  [214, 182],
  [224, 228],
  [236, 272],
  [256, 297],
  [330, 303],
  [420, 305],
  [500, 306],
];

export const INFERIOR_BORDER_LEFT: Pt[] = [
  [104, 380],
  [118, 418],
  [148, 444],
  [205, 467],
  [300, 485],
  [400, 494],
  [500, 498],
];

export const SINUS_LEFT: Pt[] = [
  [236, 70],
  [300, 48],
  [372, 56],
  [404, 92],
  [400, 132],
  [372, 156],
  [320, 166],
  [272, 158],
  [238, 132],
  [226, 98],
];

export const NASAL: Pt[] = [
  [410, 44],
  [460, 30],
  [540, 30],
  [590, 44],
  [598, 90],
  [594, 120],
  [500, 124],
  [406, 120],
  [402, 90],
];

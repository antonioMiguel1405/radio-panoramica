/**
 * Modelo axial SIMPLIFICADO (2D, vista superior) do ciclo panorâmico.
 * Coordenadas: nariz para cima (−y); lado direito do paciente = +x.
 * O ciclo começa formando o lado direito do paciente (esquerda da imagem)
 * e termina no lado esquerdo — como numa panorâmica convencional.
 */

export const RS = 170; // distância centro → fonte
export const RR = 140; // distância centro → receptor
export const BEAM_HALF = 8; // meia largura do feixe em fenda

export type V = { x: number; y: number };

/** Centro de rotação: desloca-se num arco atrás das arcadas durante o ciclo. */
export function center(t: number): V {
  return { x: -35 * Math.cos(Math.PI * t), y: 15 + 10 * Math.sin(Math.PI * t) };
}

/** Direção fonte → receptor: começa apontando para a direita do paciente e gira até a esquerda. */
export function direction(t: number): V {
  const a = Math.PI * t;
  return { x: Math.cos(a), y: -Math.sin(a) };
}

export function source(t: number): V {
  const c = center(t);
  const d = direction(t);
  return { x: c.x - RS * d.x, y: c.y - RS * d.y };
}

export function receptor(t: number): V {
  const c = center(t);
  const d = direction(t);
  return { x: c.x + RR * d.x, y: c.y + RR * d.y };
}

export type ImageKind = "real" | "fantasma";

export interface BeamEvent {
  t: number;
  kind: ImageKind;
  /** Distância do objeto ao centro de rotação, ao longo do feixe. */
  depth: number;
}

/** Relação do objeto com o feixe num instante. */
export function relation(obj: V, t: number) {
  const c = center(t);
  const d = direction(t);
  const rx = obj.x - c.x;
  const ry = obj.y - c.y;
  const proj = rx * d.x + ry * d.y; // + lado do receptor, − lado da fonte
  const perp = d.x * ry - d.y * rx;
  const hit = Math.abs(perp) <= BEAM_HALF && proj > -RS && proj < RR;
  return { proj, perp, hit, kind: (proj >= 0 ? "real" : "fantasma") as ImageKind };
}

/** Momentos do ciclo em que o feixe atravessa o objeto. */
export function events(obj: V, samples = 720): BeamEvent[] {
  const list: BeamEvent[] = [];
  let start = -1;
  let kind: ImageKind = "real";
  let depthSum = 0;
  let n = 0;
  const flush = (end: number) => {
    if (start < 0) return;
    list.push({ t: (start + end) / 2 / samples, kind, depth: depthSum / n });
    start = -1;
    depthSum = 0;
    n = 0;
  };
  for (let i = 0; i <= samples; i++) {
    const r = relation(obj, i / samples);
    if (r.hit) {
      if (start >= 0 && r.kind !== kind) flush(i - 1);
      if (start < 0) {
        start = i;
        kind = r.kind;
      }
      depthSum += Math.abs(r.proj);
      n++;
    } else flush(i - 1);
  }
  flush(samples);
  return list;
}

export const PRESETS: { id: string; label: string; pos: V }[] = [
  { id: "brinco-d", label: "Brinco (orelha direita)", pos: { x: 96, y: 12 } },
  { id: "brinco-e", label: "Brinco (orelha esquerda)", pos: { x: -96, y: 12 } },
  { id: "ramo-d", label: "Ramo direito", pos: { x: 74, y: 12 } },
  { id: "incisivo", label: "Incisivo", pos: { x: 0, y: -70 } },
  { id: "coluna", label: "Coluna cervical", pos: { x: 0, y: 62 } },
];

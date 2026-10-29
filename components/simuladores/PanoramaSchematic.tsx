"use client";

import { useId, type ReactNode } from "react";
import {
  CX,
  H,
  INFERIOR_BORDER_LEFT,
  MANDIBLE_LEFT,
  NASAL,
  OCC,
  SINUS_LEFT,
  W,
  enamelPath,
  localScale,
  mirror,
  smooth,
  teeth,
  toothPath,
  warp,
  wp,
  type PanoParams,
  type Pt,
} from "./panorama";

/** Paleta fixa de “radiografia” (independe do tema). */
const C = {
  bg: "#040708",
  bone: "#8d9a9f",
  cortex: "#e8eff1",
  dentin: "#c9d4d7",
  enamel: "#f4f8f9",
  pulp: "#2a3438",
  dark: "#000000",
  soft: "#56646a",
};

interface Props {
  params: PanoParams;
  /** viewBox opcional (recorte/lupa). */
  viewBox?: string;
  title: string;
  className?: string;
  children?: ReactNode;
  showSides?: boolean;
}

export function PanoramaSchematic({ params: p, viewBox, title, className = "", children, showSides = true }: Props) {
  const uid = useId().replace(/:/g, "");
  const id = (s: string) => `${uid}-${s}`;
  const P = (x: number, y: number) => warp(p, x, y);
  const path = (pts: Pt[], closed = false) => smooth(wp(p, pts), closed);

  const mandible = path([...MANDIBLE_LEFT, ...mirror(MANDIBLE_LEFT).reverse().slice(1, -1)], true);
  const inferior = path([...INFERIOR_BORDER_LEFT, ...mirror(INFERIOR_BORDER_LEFT).reverse().slice(1)]);
  const sinusL = path(SINUS_LEFT, true);
  const sinusR = path(mirror(SINUS_LEFT), true);
  const nasal = path(NASAL, true);

  const maxilla = path(
    [
      [200, 205],
      [208, 160],
      [240, 136],
      [330, 128],
      [420, 122],
      [500, 120],
      [580, 122],
      [670, 128],
      [760, 136],
      [792, 160],
      [800, 205],
      [700, 214],
      [600, 213],
      [500, 212],
      [400, 213],
      [300, 214],
    ],
    true,
  );

  const condyleShift = (pt: Pt): Pt => [pt[0], pt[1] + p.condyleY];
  const tth = teeth(p);
  const ghostOpacity = 0.06 + p.ghostsBoost * 0.24;

  const vertebrae = (x0: number) =>
    [0, 1, 2, 3, 4].map((k) => {
      const [x, y] = P(x0, 190 + k * 70);
      return <rect key={k} x={x - 18} y={y} width={36} height={56} rx={8} fill={C.bone} opacity={0.5} />;
    });

  return (
    <svg
      viewBox={viewBox ?? `0 0 ${W} ${H}`}
      role="img"
      aria-label={title}
      className={`block h-auto w-full select-none ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      <title>{title}</title>
      <defs>
        <radialGradient id={id("vig")} cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id={id("bone")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={C.bone} stopOpacity="0.5" />
          <stop offset="100%" stopColor={C.bone} stopOpacity="0.38" />
        </linearGradient>
        <filter id={id("bu")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={p.blurUpperAnt.toFixed(2)} />
        </filter>
        <filter id={id("bl")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={p.blurLowerAnt.toFixed(2)} />
        </filter>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id("soft3")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <clipPath id={id("clip")}>
          <rect x="0" y="0" width={W} height={H} rx="26" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id("clip")})`}>
        <rect x="0" y="0" width={W} height={H} fill={C.bg} />

        {/* Coluna cervical nas laterais */}
        <g>{vertebrae(18)}</g>
        <g>{vertebrae(982)}</g>

        {/* Fantasmas dos ramos contralaterais (sempre sutis; mais evidentes em alguns erros) */}
        <g filter={`url(#${id("soft")})`} opacity={ghostOpacity}>
          <path d={path([[300, 70], [345, 80], [360, 260], [320, 330], [285, 250]], true)} fill={C.cortex} />
          <path d={path(mirror([[300, 70], [345, 80], [360, 260], [320, 330], [285, 250]]), true)} fill={C.cortex} />
        </g>

        {/* Órbitas */}
        <path d={path([[262, 36], [300, 20], [360, 18], [400, 34]])} stroke={C.cortex} strokeWidth="4" fill="none" opacity="0.55" />
        <path d={path(mirror([[262, 36], [300, 20], [360, 18], [400, 34]]))} stroke={C.cortex} strokeWidth="4" fill="none" opacity="0.55" />

        {/* Maxila */}
        <path d={maxilla} fill={`url(#${id("bone")})`} />
        {/* Seios maxilares (radiolúcidos) com assoalho */}
        <path d={sinusL} fill={C.dark} opacity="0.72" />
        <path d={sinusR} fill={C.dark} opacity="0.72" />
        <path d={path(SINUS_LEFT.slice(4, 9))} stroke={C.cortex} strokeWidth="3" fill="none" opacity="0.75" />
        <path d={path(mirror(SINUS_LEFT.slice(4, 9)))} stroke={C.cortex} strokeWidth="3" fill="none" opacity="0.75" />
        {/* Fossa nasal, septo e conchas */}
        <path d={nasal} fill={C.dark} opacity="0.8" />
        <path d={path([[500, 34], [498, 80], [500, 120]])} stroke={C.cortex} strokeWidth="5" fill="none" opacity="0.7" />
        {[440, 560].map((x) => {
          const [ex, ey] = P(x, 98);
          return <ellipse key={x} cx={ex} cy={ey} rx={30} ry={13} fill={C.soft} opacity="0.75" />;
        })}
        {/* Assoalho da fossa nasal */}
        <path d={path([[404, 121], [450, 124], [500, 125], [550, 124], [596, 121]])} stroke={C.cortex} strokeWidth="3.5" fill="none" opacity="0.85" />
        {/* Espinha nasal anterior */}
        <path d={path([[486, 124], [500, 116], [514, 124]])} stroke={C.cortex} strokeWidth="4" fill="none" />
        {/* Processo zigomático da maxila (em U) */}
        <path d={path([[318, 66], [322, 104], [338, 118], [354, 104], [358, 66]])} stroke={C.cortex} strokeWidth="5" fill="none" opacity="0.7" />
        <path d={path(mirror([[318, 66], [322, 104], [338, 118], [354, 104], [358, 66]]))} stroke={C.cortex} strokeWidth="5" fill="none" opacity="0.7" />
        {/* Arcos zigomáticos */}
        <path d={path([[140, 112], [200, 106], [260, 104], [312, 92]])} stroke={C.cortex} strokeWidth="11" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d={path(mirror([[140, 112], [200, 106], [260, 104], [312, 92]]))} stroke={C.cortex} strokeWidth="11" fill="none" opacity="0.55" strokeLinecap="round" />
        {/* Fossa pterigopalatina (gota invertida) e lâmina pterigoide */}
        {[0, 1].map((k) => {
          const pts: Pt[] = [[226, 52], [238, 70], [234, 104], [228, 124], [222, 104], [218, 70]];
          const lam: Pt[] = [[222, 136], [216, 176], [210, 214]];
          return (
            <g key={k}>
              <path d={path(k ? mirror(pts) : pts, true)} fill={C.dark} opacity="0.85" />
              <path d={path(k ? mirror(lam) : lam)} stroke={C.cortex} strokeWidth="3" fill="none" opacity="0.55" />
            </g>
          );
        })}

        {/* ATM: fossa mandibular, eminência articular, meato, mastoide, estiloide */}
        {[0, 1].map((k) => {
          const m = (pts: Pt[]) => (k ? mirror(pts) : pts);
          const [mx, my] = P(k ? W - 52 : 52, 80);
          const [sx, sy] = P(k ? W - 40 : 40, 150);
          return (
            <g key={k}>
              <path d={path(m([[70, 106], [86, 92], [104, 88], [122, 94], [134, 106]]))} stroke={C.cortex} strokeWidth="4" fill="none" opacity="0.8" />
              <path d={path(m([[134, 106], [146, 96], [160, 96], [172, 108]]))} stroke={C.cortex} strokeWidth="5" fill="none" opacity="0.7" />
              <ellipse cx={mx} cy={my} rx={14} ry={11} fill={C.dark} stroke={C.bone} strokeWidth="2" opacity="0.95" />
              <ellipse cx={sx} cy={sy} rx={17} ry={28} fill={C.bone} opacity="0.45" />
              <path d={path(m([[66, 128], [80, 180], [100, 236]]))} stroke={C.cortex} strokeWidth="3" fill="none" opacity="0.55" />
            </g>
          );
        })}

        {/* Espaço aéreo (radiolúcido) sobre os ramos */}
        <path d={path([[150, 150], [158, 230], [166, 320], [170, 410]])} stroke={C.dark} strokeWidth="22" fill="none" opacity="0.45" />
        <path d={path(mirror([[150, 150], [158, 230], [166, 320], [170, 410]]))} stroke={C.dark} strokeWidth="22" fill="none" opacity="0.45" />

        {/* Mandíbula */}
        <g>
          <path d={mandible} fill={`url(#${id("bone")})`} />
          {/* côndilos (deslocáveis) */}
          {[0, 1].map((k) => {
            const head: Pt = k ? [W - 100, 116] : [100, 116];
            const [hx, hy] = warp(p, ...condyleShift(head));
            return <ellipse key={k} cx={hx} cy={hy} rx={18} ry={13} fill={C.bone} opacity="0.75" />;
          })}
          <path d={inferior} stroke={C.cortex} strokeWidth="9" fill="none" opacity="0.88" strokeLinecap="round" />
          {/* bordas posteriores dos ramos */}
          <path d={path([[100, 330], [94, 250], [90, 182]])} stroke={C.cortex} strokeWidth="4" fill="none" opacity="0.6" />
          <path d={path(mirror([[100, 330], [94, 250], [90, 182]]))} stroke={C.cortex} strokeWidth="4" fill="none" opacity="0.6" />
          {/* Canal da mandíbula e forames */}
          {[0, 1].map((k) => {
            const m = (pts: Pt[]) => (k ? mirror(pts) : pts);
            const canal: Pt[] = [[162, 266], [200, 300], [258, 344], [318, 364], [362, 372]];
            const [fx, fy] = P(k ? W - 162 : 162, 262);
            const [mx, my] = P(k ? W - 366 : 366, 372);
            return (
              <g key={k}>
                <path d={path(m(canal))} stroke={C.dark} strokeWidth="11" fill="none" opacity="0.5" />
                <path d={path(m(canal.map(([x, y]) => [x, y - 6] as Pt)))} stroke={C.cortex} strokeWidth="1.6" fill="none" opacity="0.6" />
                <path d={path(m(canal.map(([x, y]) => [x, y + 6] as Pt)))} stroke={C.cortex} strokeWidth="1.6" fill="none" opacity="0.6" />
                <ellipse cx={fx} cy={fy} rx={10} ry={8} fill={C.dark} opacity="0.75" />
                <ellipse cx={mx} cy={my} rx={9} ry={7} fill={C.dark} opacity="0.85" />
                {/* linha oblíqua e milo-hióidea */}
                <path d={path(m([[236, 262], [262, 300], [304, 322]]))} stroke={C.cortex} strokeWidth="3" fill="none" opacity="0.65" />
                <path d={path(m([[246, 332], [300, 360], [356, 396]]))} stroke={C.cortex} strokeWidth="2.4" fill="none" opacity="0.5" />
                {/* fossa da glândula submandibular */}
                <ellipse {...ellipseAt(P, k ? W - 300 : 300, 420)} rx={62} ry={20} fill={C.dark} opacity="0.32" />
              </g>
            );
          })}
          {/* Forame lingual / espinhas genianas */}
          {(() => {
            const [x, y] = P(CX, 440);
            return (
              <g>
                <circle cx={x} cy={y} r={10} fill="none" stroke={C.cortex} strokeWidth="3" opacity="0.7" />
                <circle cx={x} cy={y} r={3} fill={C.dark} />
              </g>
            );
          })()}
        </g>

        {/* Tecidos moles: palato mole, dorso da língua, lóbulos da orelha */}
        <g opacity="0.5">
          <path d={path([[290, 146], [240, 182], [196, 236]])} stroke={C.soft} strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d={path(mirror([[290, 146], [240, 182], [196, 236]]))} stroke={C.soft} strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d={path([[190, 290], [212, 250], [262, 228], [320, 222]])} stroke={C.soft} strokeWidth="6" fill="none" />
          <path d={path(mirror([[190, 290], [212, 250], [262, 228], [320, 222]]))} stroke={C.soft} strokeWidth="6" fill="none" />
          <ellipse {...ellipseAt(P, 62, 262)} rx={20} ry={34} fill={C.soft} />
          <ellipse {...ellipseAt(P, W - 62, 262)} rx={20} ry={34} fill={C.soft} />
        </g>

        {/* Osso hioide (abaixo da mandíbula) */}
        {[0, 1].map((k) => {
          const pts: Pt[] = [[250, 508], [300, 505], [356, 500]];
          const moved = (k ? mirror(pts) : pts).map(([x, y]) => [x, y + p.hyoidY] as Pt);
          return <path key={k} d={path(moved)} stroke={C.cortex} strokeWidth="11" fill="none" opacity="0.6" strokeLinecap="round" />;
        })}

        {/* Dentes */}
        {(["upper", "lower"] as const).map((arch) => (
          <g key={arch}>
            {/* posteriores */}
            {tth
              .filter((t) => (arch === "upper") === t.upper && t.i >= 3)
              .map((t) => (
                <Tooth key={`${arch}-${t.side}-${t.i}`} p={p} t={t} />
              ))}
            {/* anteriores (com borramento próprio) */}
            <g filter={`url(#${id(arch === "upper" ? "bu" : "bl")})`}>
              {tth
                .filter((t) => (arch === "upper") === t.upper && t.i < 3)
                .map((t) => (
                  <Tooth key={`${arch}-${t.side}-${t.i}`} p={p} t={t} />
                ))}
            </g>
          </g>
        ))}

        {/* Forame/canal incisivo e sutura palatina mediana */}
        {(() => {
          const [x, y] = P(CX, 145);
          return <ellipse cx={x} cy={y} rx={7} ry={9} fill={C.dark} opacity="0.75" />;
        })()}
        <path d={path([[CX, 158], [CX, 205]])} stroke={C.dark} strokeWidth="2.2" fill="none" opacity="0.8" />

        {/* Palato duro (desce e alarga com mento elevado) + imagem projetada do lado oposto */}
        <g opacity="0.78">
          {[0, 1].map((k) => {
            const pts: Pt[] = [[262, 136], [330, 142], [400, 144], [452, 142]];
            const shifted = (k ? mirror(pts) : pts).map(([x, y]) => [x, y + p.palateY] as Pt);
            return (
              <path key={k} d={path(shifted)} stroke={C.cortex} strokeWidth={9 * p.palateWidth} fill="none" strokeLinecap="round" />
            );
          })}
        </g>
        <g opacity="0.16" filter={`url(#${id("soft3")})`}>
          {[0, 1].map((k) => {
            const pts: Pt[] = [[290, 108], [380, 112], [450, 110]];
            return <path key={k} d={path(k ? mirror(pts) : pts)} stroke={C.cortex} strokeWidth="12" fill="none" />;
          })}
        </g>

        {/* Faixa radiolúcida de ar (língua fora do palato) */}
        {p.airBand > 0.01 && (
          <path
            d={path([[250, 168], [330, 172], [420, 176], [500, 177], [580, 176], [670, 172], [750, 168]])}
            stroke={C.dark}
            strokeWidth="34"
            fill="none"
            opacity={0.82 * p.airBand}
            filter={`url(#${id("soft3")})`}
          />
        )}

        {/* Fantasma da coluna cervical (postura curvada) */}
        {p.spineGhost > 0.01 && (
          <g filter={`url(#${id("soft")})`} opacity={0.6 * p.spineGhost}>
            {(() => {
              const [x1, y1] = P(CX, 150);
              return <rect x={x1 - 52} y={y1} width={104} height={H} rx={40} fill={C.cortex} />;
            })()}
          </g>
        )}

        {/* Colar de tireoide */}
        {p.collar > 0.01 && (
          <path
            d={smooth([P(330, 520), P(345, 430), P(420, 400), P(500, 394), P(580, 400), P(655, 430), P(670, 520)])}
            fill={C.enamel}
            opacity={0.9 * p.collar}
          />
        )}

        {/* Brinco: real (lado do brinco) + fantasma (lado oposto, mais alto, maior e borrado) */}
        {p.earring > 0.01 && (
          <g opacity={p.earring}>
            {(() => {
              const [x, y] = P(70, 300);
              return (
                <g>
                  <circle cx={x} cy={y} r={11} fill="none" stroke="#ffffff" strokeWidth="5" />
                  <circle cx={x} cy={y + 18} r={5} fill="#ffffff" />
                </g>
              );
            })()}
            {(() => {
              const [x, y] = P(W - 150, 228);
              return (
                <g filter={`url(#${id("soft3")})`} opacity="0.6">
                  <ellipse cx={x} cy={y} rx={36} ry={16} fill="none" stroke="#ffffff" strokeWidth="9" />
                  <ellipse cx={x} cy={y + 24} rx={16} ry={7} fill="#ffffff" />
                </g>
              );
            })()}
          </g>
        )}

        <rect x="0" y="0" width={W} height={H} fill={`url(#${id("vig")})`} pointerEvents="none" />

        {showSides && (
          <g fontFamily="var(--font-inter), system-ui, sans-serif" fontWeight="700" fontSize="22" fill="#9fb5bc">
            <text x="30" y="40">D</text>
            <text x={W - 30} y="40" textAnchor="end">
              E
            </text>
          </g>
        )}
        {children}
      </g>
    </svg>
  );
}

function ellipseAt(P: (x: number, y: number) => Pt, x: number, y: number) {
  const [cx, cy] = P(x, y);
  return { cx, cy };
}

function Tooth({ p, t }: { p: PanoParams; t: ReturnType<typeof teeth>[number] }) {
  const [x, y] = warp(p, t.x, OCC);
  const [xa, ya] = warp(p, t.x - 2, OCC);
  const [xb, yb] = warp(p, t.x + 2, OCC);
  const angle = (Math.atan2(yb - ya, xb - xa) * 180) / Math.PI;
  const sx = localScale(p, t.x);
  const gap = t.upper ? -1.5 : 1.5;
  const flip = t.upper ? 1 : -1;
  return (
    <g transform={`translate(${x.toFixed(1)} ${(y + gap).toFixed(1)}) rotate(${angle.toFixed(2)}) scale(${sx.toFixed(3)} ${flip})`}>
      <path d={toothPath(t.w, t.crown, t.root, t.roots)} fill="#c9d4d7" opacity="0.68" />
      <path d={enamelPath(t.w, t.crown)} fill="#f4f8f9" opacity="0.72" />
      <path
        d={`M 0 ${-t.crown * 0.45} L 0 ${-(t.crown + t.root * 0.82)}`}
        stroke="#2a3438"
        strokeWidth={t.w * 0.13}
        strokeLinecap="round"
        opacity="0.75"
      />
    </g>
  );
}

export { H as PANO_H, W as PANO_W, CX as PANO_CX };

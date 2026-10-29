import type { ReactNode } from "react";
import type { FigureId } from "@/lib/types";

/**
 * Ilustrações esquemáticas ORIGINAIS (SVG). Não reproduzem imagens da aula.
 * Cores via tokens CSS para funcionar nos temas claro e escuro.
 */

const T = "var(--text)";
const M = "var(--muted)";
const L = "var(--border)";
const A = "var(--accent)";
const S2 = "var(--surface-2)";
const SRC = "#f59e0b"; // fonte
const REC = "#38bdf8"; // receptor

function Frame({
  title,
  caption,
  children,
  viewBox,
}: {
  title: string;
  caption: ReactNode;
  children: ReactNode;
  viewBox: string;
}) {
  return (
    <figure className="print-avoid mx-auto my-6 max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface">
      <svg
        viewBox={viewBox}
        role="img"
        aria-label={title}
        className="block h-auto w-full"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <title>{title}</title>
        {children}
      </svg>
      <figcaption className="border-t border-line bg-surface-2 px-4 py-2.5 text-sm text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

function Label({
  x,
  y,
  children,
  anchor = "middle",
  size = 15,
  color = T,
  weight = 500,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  size?: number;
  color?: string;
  weight?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={color} fontWeight={weight}>
      {children}
    </text>
  );
}

/** Arcada vista de cima (U aberto para baixo = posterior). */
function ArchTop({ cx, cy, s = 1, stroke = T }: { cx: number; cy: number; s?: number; stroke?: string }) {
  const w = 62 * s;
  const h = 78 * s;
  return (
    <path
      d={`M ${cx - w} ${cy + h * 0.55} C ${cx - w} ${cy - h * 0.2}, ${cx - w * 0.55} ${cy - h * 0.62}, ${cx} ${cy - h * 0.62} C ${cx + w * 0.55} ${cy - h * 0.62}, ${cx + w} ${cy - h * 0.2}, ${cx + w} ${cy + h * 0.55}`}
      fill="none"
      stroke={stroke}
      strokeWidth={7 * s}
      strokeLinecap="round"
      strokeDasharray={`${9 * s} ${3 * s}`}
    />
  );
}

// ------------------------------------------------------------------
function FigRotacao() {
  return (
    <Frame
      viewBox="0 0 420 300"
      title="Vista superior: fonte e receptor giram em lados opostos ao redor da cabeça imóvel"
      caption={
        <>
          Vista superior esquemática. Fonte e receptor giram juntos, sempre em lados opostos; o
          centro de rotação (ponto) se desloca durante o ciclo. O paciente fica imóvel.
        </>
      }
    >
      <defs>
        <marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={A} />
        </marker>
      </defs>
      {/* cabeça */}
      <ellipse cx="210" cy="150" rx="78" ry="96" fill={S2} stroke={L} strokeWidth="2" />
      <path d="M 200 56 Q 210 44 220 56" fill="none" stroke={L} strokeWidth="2" />
      <Label x={210} y={36} size={14} color={M}>
        face (anterior)
      </Label>
      <ArchTop cx={210} cy={130} s={0.8} />
      {/* trajeto do centro de rotação */}
      <path d="M 180 170 Q 210 186 240 170" fill="none" stroke={A} strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="196" cy="173" r="5" fill={A} />
      <Label x={300} y={214} size={14} color={A} anchor="middle">
        centro de rotação
      </Label>
      <path d="M 262 203 L 201 176" stroke={A} strokeWidth="1.2" />
      {/* feixe */}
      <polygon points="62,252 70,262 345,82 337,72" fill={SRC} opacity="0.18" />
      <line x1="66" y1="257" x2="341" y2="77" stroke={SRC} strokeWidth="1.5" strokeDasharray="5 4" />
      {/* fonte */}
      <g transform="translate(66 257) rotate(-33)">
        <rect x="-26" y="-14" width="40" height="28" rx="6" fill={SRC} />
      </g>
      <Label x={10} y={292} size={13} weight={600} anchor="start">
        Fonte de raios X
      </Label>
      {/* receptor */}
      <g transform="translate(345 78) rotate(-33)">
        <rect x="-4" y="-34" width="10" height="68" rx="3" fill={REC} />
      </g>
      <Label x={360} y={30} size={13} weight={600}>
        Receptor
      </Label>
      {/* setas de rotação */}
      <path d="M 300 262 A 150 150 0 0 0 372 170" fill="none" stroke={A} strokeWidth="2.5" markerEnd="url(#arw)" />
      <path d="M 120 40 A 150 150 0 0 0 48 132" fill="none" stroke={A} strokeWidth="2.5" markerEnd="url(#arw)" />
      <Label x={210} y={232} size={13} color={M}>
        paciente imóvel
      </Label>
    </Frame>
  );
}

// ------------------------------------------------------------------
function FigAparelho() {
  return (
    <Frame
      viewBox="0 0 420 320"
      title="Esquema lateral do aparelho panorâmico com seus componentes"
      caption="Esquema lateral simplificado: fonte e receptor presos ao braço giratório; apoios posicionam o paciente."
    >
      {/* coluna */}
      <rect x="352" y="20" width="26" height="290" rx="6" fill={S2} stroke={L} strokeWidth="2" />
      {/* braço */}
      <rect x="70" y="28" width="300" height="20" rx="8" fill={S2} stroke={L} strokeWidth="2" />
      <circle cx="210" cy="38" r="7" fill={A} />
      {/* fonte (esq.) */}
      <rect x="62" y="48" width="18" height="70" fill={S2} stroke={L} strokeWidth="2" />
      <rect x="40" y="110" width="62" height="58" rx="10" fill={SRC} />
      {/* receptor (dir.) */}
      <rect x="320" y="48" width="14" height="70" fill={S2} stroke={L} strokeWidth="2" />
      <rect x="314" y="110" width="26" height="110" rx="6" fill={REC} />
      {/* feixe */}
      <polygon points="102,150 314,128 314,200 102,156" fill={SRC} opacity="0.16" />
      {/* cabeça de perfil (voltada para a direita / receptor) */}
      <path
        d="M 170 92 C 210 76 262 88 270 128 C 274 146 286 154 284 164 C 282 172 274 170 276 180 C 280 190 272 196 268 204 C 264 214 254 220 238 220 L 224 258 L 176 258 L 182 214 C 160 200 150 170 154 140 C 156 116 160 100 170 92 Z"
        fill={S2}
        stroke={M}
        strokeWidth="2"
      />
      {/* bloco de mordida + apoio de mento */}
      <rect x="262" y="182" width="52" height="7" rx="3" fill={A} />
      <rect x="244" y="222" width="60" height="9" rx="4" fill={L} />
      <rect x="296" y="182" width="8" height="49" fill={L} />
      {/* cefalostato */}
      <rect x="196" y="66" width="8" height="40" rx="3" fill={L} />
      {/* alças */}
      <rect x="150" y="278" width="200" height="10" rx="5" fill={L} />
      {/* rótulos */}
      <Label x={70} y={190} weight={600}>Fonte (ampola)</Label>
      <Label x={330} y={240} weight={600} anchor="middle">Receptor</Label>
      <Label x={286} y={176} size={14} color={A} anchor="end">bloco de mordida</Label>
      <Label x={240} y={246} size={14} color={M} anchor="end">apoio de mento</Label>
      <Label x={196} y={62} size={14} color={M} anchor="end">cefalostato</Label>
      <Label x={150} y={304} size={14} color={M} anchor="start">alças para as mãos</Label>
      <Label x={218} y={22} size={14} color={A} anchor="start">braço giratório</Label>
    </Frame>
  );
}

// ------------------------------------------------------------------
function FigCamada() {
  return (
    <Frame
      viewBox="-24 0 504 330"
      title="Vista superior da camada de imagem em forma de ferradura, mais estreita na região anterior"
      caption={
        <>
          A camada (faixa colorida) acompanha a arcada em ferradura e é <strong>mais estreita na
          frente</strong>. Deslocado para o lado da fonte (lingual) o objeto fica <strong>mais
          largo</strong>; para o lado do receptor (vestibular), <strong>mais estreito</strong>.
        </>
      }
    >
      {/* camada: contorno externo e interno */}
      <path
        d="M 78 300 C 70 170, 120 52, 210 46 C 300 52, 350 170, 342 300 L 292 300 C 296 190, 266 78, 210 74 C 154 78, 124 190, 128 300 Z"
        fill={A}
        opacity="0.22"
      />
      <path d="M 78 300 C 70 170, 120 52, 210 46 C 300 52, 350 170, 342 300" fill="none" stroke={A} strokeWidth="2" />
      <path d="M 128 300 C 124 190, 154 78, 210 74 C 266 78, 296 190, 292 300" fill="none" stroke={A} strokeWidth="2" />
      {/* arcada */}
      <path
        d="M 103 300 C 97 180, 137 62, 210 60 C 283 62, 323 180, 317 300"
        fill="none"
        stroke={T}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="12 4"
      />
      {/* anotações */}
      <Label x={210} y={26} weight={600}>anterior: camada mais estreita</Label>
      <path d="M 210 32 L 210 44" stroke={T} strokeWidth="1.5" />
      <Label x={36} y={322} anchor="start" weight={600}>posterior: mais larga</Label>
      {/* vestibular x lingual */}
      <Label x={474} y={236} anchor="end" size={14} color={REC} weight={600}>vestibular</Label>
      <Label x={474} y={252} anchor="end" size={14} color={M}>lado do receptor</Label>
      <Label x={474} y={268} anchor="end" size={14} color={M}>→ mais estreito</Label>
      <path d="M 384 246 L 352 246" stroke={REC} strokeWidth="1.5" />
      <Label x={210} y={170} size={14} color={SRC} weight={600}>lingual</Label>
      <Label x={210} y={186} size={14} color={M}>lado da fonte</Label>
      <Label x={210} y={202} size={14} color={M}>→ mais largo</Label>
    </Frame>
  );
}

// ------------------------------------------------------------------
function FigAngulo() {
  return (
    <Frame
      viewBox="0 0 440 260"
      title="Ângulo negativo: a lanterna abaixo do objeto projeta a sombra mais alta"
      caption={
        <>
          Analogia da aula: a <strong>lanterna abaixo</strong> do objeto projeta a sombra{" "}
          <strong>mais alta</strong> na parede. O feixe panorâmico também vem de baixo para cima
          (aprox. −7°, varia por fabricante).
        </>
      }
    >
      {/* chão e parede */}
      <line x1="20" y1="230" x2="420" y2="230" stroke={L} strokeWidth="2" />
      <rect x="380" y="30" width="16" height="200" fill={S2} stroke={L} strokeWidth="2" />
      <Label x={388} y={22} size={14} color={M}>parede</Label>
      {/* lanterna */}
      <g transform="translate(70 196) rotate(-12)">
        <rect x="-30" y="-10" width="44" height="20" rx="4" fill={SRC} />
        <rect x="14" y="-14" width="10" height="28" rx="3" fill={SRC} />
      </g>
      <Label x={64} y={226} size={14} weight={600}>lanterna (fonte)</Label>
      {/* feixe */}
      <polygon points="94,186 380,70 380,150 94,196" fill={SRC} opacity="0.14" />
      {/* objeto */}
      <rect x="200" y="140" width="22" height="34" rx="4" fill={T} />
      <Label x={211} y={196} size={14} weight={600}>objeto</Label>
      {/* projeção */}
      <line x1="94" y1="191" x2="380" y2="96" stroke={SRC} strokeWidth="1.5" strokeDasharray="5 4" />
      <rect x="380" y="86" width="16" height="48" fill={T} opacity="0.75" />
      <Label x={374} y={80} size={14} anchor="end" weight={600}>sombra mais alta</Label>
      {/* altura real */}
      <line x1="222" y1="157" x2="380" y2="157" stroke={M} strokeWidth="1" strokeDasharray="2 4" />
      <Label x={374} y={172} size={13} anchor="end" color={M}>altura real do objeto</Label>
      {/* ângulo */}
      <path d="M 140 190 A 50 50 0 0 0 138 174" fill="none" stroke={A} strokeWidth="2" />
      <line x1="94" y1="191" x2="180" y2="191" stroke={A} strokeWidth="1.2" strokeDasharray="3 3" />
      <Label x={150} y={166} size={14} color={A} weight={600}>ângulo negativo</Label>
    </Frame>
  );
}

// ------------------------------------------------------------------
function FigPosicionamento() {
  return (
    <Frame
      viewBox="0 0 440 270"
      title="Planos de referência: Frankfurt paralelo ao solo e plano sagital mediano perpendicular ao solo"
      caption={
        <>
          <strong>Frankfurt paralelo ao solo</strong> (vista lateral) e <strong>plano sagital
          mediano perpendicular ao solo e centralizado</strong> (vista frontal). Incisivos topo a
          topo na ranhura do bloco.
        </>
      }
    >
      {/* solo */}
      <line x1="16" y1="250" x2="424" y2="250" stroke={L} strokeWidth="2" />
      <Label x={424} y={266} size={13} color={M} anchor="end">solo</Label>
      {/* perfil lateral */}
      <path
        d="M 60 70 C 100 40 160 48 172 92 C 176 108 188 116 186 126 C 184 134 176 132 178 142 C 182 152 174 158 170 166 C 166 176 156 182 140 182 L 128 226 L 80 226 L 86 178 C 62 162 50 130 54 104 C 56 88 52 78 60 70 Z"
        fill={S2}
        stroke={M}
        strokeWidth="2"
      />
      <line x1="30" y1="112" x2="206" y2="112" stroke={A} strokeWidth="2.5" />
      <Label x={118} y={104} size={14} color={A} weight={600}>Frankfurt ∥ solo</Label>
      <rect x="172" y="146" width="36" height="6" rx="3" fill={SRC} />
      <Label x={118} y={244} size={14} color={M}>vista lateral</Label>
      {/* vista frontal */}
      <ellipse cx="330" cy="120" rx="62" ry="78" fill={S2} stroke={M} strokeWidth="2" />
      <ellipse cx="306" cy="106" rx="9" ry="5" fill={M} />
      <ellipse cx="354" cy="106" rx="9" ry="5" fill={M} />
      <path d="M 314 164 Q 330 172 346 164" fill="none" stroke={M} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 300 196 L 300 232 M 360 196 L 360 232" stroke={M} strokeWidth="2" />
      <line x1="330" y1="22" x2="330" y2="250" stroke={REC} strokeWidth="2.5" />
      <rect x="326" y="244" width="8" height="6" fill={REC} />
      <path d="M 330 238 L 342 238 L 342 250" fill="none" stroke={REC} strokeWidth="1.5" />
      <Label x={336} y={18} size={14} color={REC} weight={600} anchor="start">sagital mediano ⟂ solo</Label>
      <Label x={330} y={266} size={14} color={M}>vista frontal</Label>
    </Frame>
  );
}

// ------------------------------------------------------------------
function FigRealFantasma() {
  return (
    <Frame
      viewBox="0 0 440 230"
      title="Imagem real entre o centro de rotação e o receptor; imagem fantasma entre o centro de rotação e a fonte"
      caption={
        <>
          Num dado instante do ciclo: objeto entre o <strong>centro de rotação e o receptor</strong> →
          imagem <strong>real</strong>; entre o <strong>centro de rotação e a fonte</strong> → imagem{" "}
          <strong>fantasma</strong> (oposta, alta, grande e borrada).
        </>
      }
    >
      {/* zonas */}
      <rect x="64" y="86" width="166" height="58" rx="8" fill="#a855f7" opacity="0.16" />
      <rect x="230" y="86" width="150" height="58" rx="8" fill={A} opacity="0.18" />
      <line x1="54" y1="115" x2="392" y2="115" stroke={SRC} strokeWidth="2" strokeDasharray="6 5" />
      {/* fonte */}
      <rect x="18" y="96" width="40" height="38" rx="8" fill={SRC} />
      <Label x={38} y={162} weight={600}>Fonte</Label>
      {/* receptor */}
      <rect x="384" y="70" width="12" height="90" rx="3" fill={REC} />
      <Label x={392} y={184} weight={600}>Receptor</Label>
      {/* centro */}
      <circle cx="230" cy="115" r="7" fill={T} />
      <Label x={230} y={176} weight={600}>centro de rotação</Label>
      <line x1="230" y1="124" x2="230" y2="160" stroke={T} strokeWidth="1" />
      {/* objetos */}
      <circle cx="140" cy="115" r="9" fill="none" stroke={T} strokeWidth="3" />
      <circle cx="312" cy="115" r="9" fill="none" stroke={T} strokeWidth="3" />
      <Label x={147} y={70} weight={700} color="#a855f7">zona FANTASMA</Label>
      <Label x={147} y={210} size={14} color={M}>(entre centro e fonte)</Label>
      <Label x={305} y={70} weight={700} color={A}>zona REAL</Label>
      <Label x={305} y={210} size={14} color={M}>(entre centro e receptor)</Label>
    </Frame>
  );
}

// ------------------------------------------------------------------
/** Gráfico de barras simples (série única, rótulo direto, tabela no texto). */
function FigEstrela() {
  const bars = [
    { label: "Periapical", value: 0.55 },
    { label: "Panorâmica", value: 0.28 },
  ];
  const x0 = 116;
  const w = 270;
  return (
    <Frame
      viewBox="0 0 420 170"
      title="Sensibilidade para periodontite apical em Estrela et al. 2008: periapical 0,55 e panorâmica 0,28"
      caption={
        <>
          Estrela et al., J Endod 2008 (888 pacientes, 1.508 dentes), em comparação com a TCFC.
          Escala de 0 a 1.
        </>
      }
    >
      <Label x={16} y={24} anchor="start" size={13} weight={600}>
        Sensibilidade para periodontite apical
      </Label>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={x0 + t * w} y1="40" x2={x0 + t * w} y2="138" stroke={L} strokeWidth="1" />
          <Label x={x0 + t * w} y={156} size={13} color={M}>
            {t.toLocaleString("pt-BR")}
          </Label>
        </g>
      ))}
      {bars.map((b, i) => {
        const y = 52 + i * 44;
        return (
          <g key={b.label}>
            <title>{`${b.label}: ${b.value.toLocaleString("pt-BR")}`}</title>
            <Label x={x0 - 10} y={y + 17} anchor="end" size={13}>
              {b.label}
            </Label>
            <path
              d={`M ${x0} ${y} H ${x0 + b.value * w - 4} Q ${x0 + b.value * w} ${y} ${x0 + b.value * w} ${y + 4} V ${y + 20} Q ${x0 + b.value * w} ${y + 24} ${x0 + b.value * w - 4} ${y + 24} H ${x0} Z`}
              fill={A}
            />
            <Label x={x0 + b.value * w + 8} y={y + 17} anchor="start" size={13} weight={700}>
              {b.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Label>
          </g>
        );
      })}
      <line x1={x0} y1="40" x2={x0} y2="138" stroke={M} strokeWidth="1.5" />
    </Frame>
  );
}

const registry: Partial<Record<FigureId, () => ReactNode>> = {
  rotacao: FigRotacao,
  aparelho: FigAparelho,
  camada: FigCamada,
  angulo: FigAngulo,
  posicionamento: FigPosicionamento,
  "real-fantasma": FigRealFantasma,
  estrela: FigEstrela,
};

export function Figure({ id }: { id: FigureId }) {
  const Comp = registry[id];
  return Comp ? <Comp /> : null;
}

export { FigRotacao };

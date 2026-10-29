"use client";

import { useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { SourceBadge } from "../SourceBadge";
import { BEAM_HALF, PRESETS, center, direction, events, receptor, relation, source, type V } from "./ghostGeometry";

const CYCLE_SECONDS = 8;
const STRIP_W = 600;
const MARGIN = 44;
/** Posição horizontal na faixa para um instante do ciclo (com margens para o fantasma). */
const sx = (t: number) => MARGIN + t * (STRIP_W - 2 * MARGIN);
const SPEEDS = [0.5, 1, 2];

/** Arcada (vista superior) para contexto. */
const ARCH = Array.from({ length: 14 }, (_, i) => {
  const a = Math.PI * (1.06 - (1.12 * (i + 0.5)) / 14);
  return { x: 58 * Math.cos(a), y: 18 - 88 * Math.sin(a) };
});

const sideOf = (t: number) => (t < 0.5 ? "no lado direito (D)" : "no lado esquerdo (E)");

/** “1 imagem real no lado direito (D)”, “2 imagens fantasmas …”. */
function describeImages(list: { t: number }[], kind: "real" | "fantasma") {
  if (list.length === 0) return "";
  const noun = list.length === 1 ? `1 imagem ${kind}` : `${list.length} imagens ${kind === "real" ? "reais" : "fantasmas"}`;
  const sides = [...new Set(list.map((e) => sideOf(e.t)))].join(" e ");
  return `${noun} ${sides}`;
}

export function GhostSimulator() {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [obj, setObj] = useState<V>(PRESETS[0].pos);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const tRef = useRef(t);
  const scrubId = useId();

  const evs = useMemo(() => events(obj), [obj]);

  // Animação do ciclo
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.max(0, (now - last) / 1000);
      last = now;
      const next = Math.min(1, tRef.current + (dt * speed) / CYCLE_SECONDS);
      tRef.current = next;
      setT(next);
      if (next >= 1) setPlaying(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  const togglePlay = () => {
    if (!playing && tRef.current >= 1) {
      tRef.current = 0;
      setT(0);
    }
    setPlaying((p) => !p);
  };

  const scrub = (v: number) => {
    tRef.current = v;
    setT(v);
    setPlaying(false);
  };

  const toSvg = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: Math.max(-200, Math.min(200, pt.x)), y: Math.max(-170, Math.min(170, pt.y)) };
  }, []);

  const c = center(t);
  const d = direction(t);
  const s = source(t);
  const r = receptor(t);
  const now = relation(obj, t);
  const perpX = -d.y * BEAM_HALF;
  const perpY = d.x * BEAM_HALF;
  const centerPath = Array.from({ length: 21 }, (_, i) => center(i / 20))
    .map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const reals = evs.filter((e) => e.kind === "real");
  const ghosts = evs.filter((e) => e.kind === "fantasma");

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Vista axial */}
      <figure className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
        <svg
          ref={svgRef}
          viewBox="-230 -205 460 400"
          role="img"
          aria-label="Vista superior: fonte e receptor girando ao redor da cabeça; arraste o objeto"
          className="block h-auto w-full touch-none select-none"
          onPointerMove={(e) => {
            if (!dragging) return;
            const p = toSvg(e);
            if (p) setObj(p);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
        >
          {/* zonas real/fantasma no instante atual */}
          <polygon
            points={`${c.x + perpX * 1.6},${c.y + perpY * 1.6} ${r.x + perpX * 1.6},${r.y + perpY * 1.6} ${r.x - perpX * 1.6},${r.y - perpY * 1.6} ${c.x - perpX * 1.6},${c.y - perpY * 1.6}`}
            fill="var(--accent)"
            opacity="0.25"
          />
          <polygon
            points={`${c.x + perpX * 1.6},${c.y + perpY * 1.6} ${s.x + perpX * 1.6},${s.y + perpY * 1.6} ${s.x - perpX * 1.6},${s.y - perpY * 1.6} ${c.x - perpX * 1.6},${c.y - perpY * 1.6}`}
            fill="#a855f7"
            opacity="0.2"
          />
          {/* cabeça */}
          <ellipse cx="0" cy="-5" rx="92" ry="112" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="2" />
          <path d="M -12 -116 Q 0 -134 12 -116" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="2" />
          <ellipse cx="94" cy="0" rx="7" ry="16" fill="var(--surface-3)" />
          <ellipse cx="-94" cy="0" rx="7" ry="16" fill="var(--surface-3)" />
          <text x="0" y="-150" textAnchor="middle" fontSize="12" fill="var(--muted)">
            face
          </text>
          <text x="150" y="-150" textAnchor="middle" fontSize="12" fill="var(--muted)">
            direita do paciente →
          </text>
          {/* coluna e arcada */}
          <circle cx="0" cy="62" r="14" fill="var(--surface-3)" stroke="var(--border)" />
          {ARCH.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="6" fill="var(--muted)" opacity="0.55" />
          ))}
          {/* trajeto do centro de rotação */}
          <path d={centerPath} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* feixe */}
          <polygon
            points={`${s.x + perpX},${s.y + perpY} ${r.x + perpX},${r.y + perpY} ${r.x - perpX},${r.y - perpY} ${s.x - perpX},${s.y - perpY}`}
            fill="#fbbf24"
            opacity="0.35"
          />
          {/* fonte e receptor */}
          <g transform={`translate(${s.x} ${s.y}) rotate(${(Math.atan2(d.y, d.x) * 180) / Math.PI})`}>
            <rect x="-22" y="-13" width="26" height="26" rx="6" fill="#f59e0b" />
          </g>
          <g transform={`translate(${r.x} ${r.y}) rotate(${(Math.atan2(d.y, d.x) * 180) / Math.PI})`}>
            <rect x="0" y="-34" width="8" height="68" rx="3" fill="#38bdf8" />
          </g>
          <circle cx={c.x} cy={c.y} r="5" fill="var(--text)" />
          {/* objeto arrastável */}
          <g
            role="button"
            tabIndex={0}
            aria-label={`Objeto (brinco) arrastável. Use as setas para mover. Agora: ${
              now.hit ? (now.kind === "real" ? "formando imagem real" : "formando imagem fantasma") : "fora do feixe"
            }.`}
            className="cursor-grab outline-none focus-visible:[&>circle:first-child]:stroke-[var(--focus)]"
            onPointerDown={(e) => {
              (e.currentTarget.ownerSVGElement ?? e.currentTarget).setPointerCapture?.(e.pointerId);
              setDragging(true);
            }}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 12 : 4;
              const map: Record<string, [number, number]> = {
                ArrowUp: [0, -step],
                ArrowDown: [0, step],
                ArrowLeft: [-step, 0],
                ArrowRight: [step, 0],
              };
              const m = map[e.key];
              if (m) {
                e.preventDefault();
                setObj((o) => ({ x: o.x + m[0], y: o.y + m[1] }));
              }
            }}
          >
            <circle cx={obj.x} cy={obj.y} r="20" fill="transparent" stroke="transparent" strokeWidth="3" />
            <circle
              cx={obj.x}
              cy={obj.y}
              r="8"
              fill="none"
              stroke={now.hit ? (now.kind === "real" ? "var(--accent)" : "#c084fc") : "var(--text)"}
              strokeWidth="3.5"
            />
            <circle cx={obj.x} cy={obj.y + 11} r="3" fill="var(--text)" />
          </g>
        </svg>
        <figcaption className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line bg-surface-2 px-4 py-2 text-xs text-muted">
          <span>
            <span className="mr-1 inline-block size-2.5 rounded-sm bg-[var(--accent)] opacity-60" />
            centro → receptor: zona da imagem real
          </span>
          <span>
            <span className="mr-1 inline-block size-2.5 rounded-sm bg-[#a855f7] opacity-60" />
            centro → fonte: zona da imagem fantasma
          </span>
        </figcaption>
      </figure>

      <div className="min-w-0 space-y-4">
        {/* Controles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent"
          >
            {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            {playing ? "Pausar" : t >= 1 ? "Repetir ciclo" : "Iniciar ciclo"}
          </button>
          <button
            type="button"
            onClick={() => scrub(0)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-medium text-fg"
          >
            <RotateCcw className="size-4" aria-hidden /> Zerar
          </button>
          <div className="flex items-center gap-1 rounded-xl border border-line bg-surface-2 p-1" role="group" aria-label="Velocidade">
            {SPEEDS.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={speed === v}
                onClick={() => setSpeed(v)}
                className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold tabular-nums ${speed === v ? "bg-surface text-fg shadow-sm" : "text-muted"}`}
              >
                {v.toLocaleString("pt-BR")}×
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor={scrubId} className="text-sm font-semibold text-fg">
            Momento do ciclo
          </label>
          <input
            id={scrubId}
            type="range"
            min={0}
            max={1}
            step={0.002}
            value={t}
            onChange={(e) => scrub(Number(e.target.value))}
            aria-valuetext={`${Math.round(t * 100)}% do ciclo`}
            className="mt-1 w-full accent-[var(--accent)]"
          />
        </div>

        {/* Presets */}
        <div role="group" aria-label="Posicionar o objeto" className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setObj(p.pos);
                scrub(0);
              }}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                obj.x === p.pos.x && obj.y === p.pos.y
                  ? "border-accent bg-accent-soft font-semibold text-fg"
                  : "border-line bg-surface text-muted hover:text-fg"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {!reduce && t === 0 && !playing && (
          <p className="text-xs text-muted">Dica: arraste o brinco na vista superior e aperte “Iniciar ciclo”.</p>
        )}

        {/* Faixa da panorâmica em formação */}
        <figure className="overflow-hidden rounded-2xl border border-[#1d3b44] bg-[#040708]">
          <svg viewBox={`0 0 ${STRIP_W} 200`} role="img" aria-label="Panorâmica esquemática sendo formada durante o ciclo" className="block h-auto w-full">
            <defs>
              <filter id="ghost-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <rect width={STRIP_W} height="200" fill="#040708" />
            <rect width={sx(t)} height="200" fill="#0c171b" />
            {/* dentes esquemáticos para referência */}
            {Array.from({ length: 16 }, (_, i) => (
              <g key={i} opacity={(i + 0.5) / 16 <= t ? 0.5 : 0.12}>
                <rect x={110 + i * 24} y={112} width={18} height={26} rx={5} fill="#c9d4d7" />
                <rect x={110 + i * 24} y={140} width={18} height={24} rx={5} fill="#c9d4d7" />
              </g>
            ))}
            {evs
              .filter((e) => e.t <= t)
              .map((e, i) =>
                e.kind === "real" ? (
                  <g key={i}>
                    <circle cx={sx(e.t)} cy={96} r={9} fill="none" stroke="#ffffff" strokeWidth="3.5" />
                    <circle cx={sx(e.t)} cy={110} r={3} fill="#ffffff" />
                  </g>
                ) : (
                  <g key={i} filter="url(#ghost-blur)" opacity="0.6">
                    <ellipse
                      cx={sx(e.t)}
                      cy={58}
                      rx={9 * (1.7 + e.depth / 60)}
                      ry={12}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="6"
                    />
                  </g>
                ),
              )}
            <line x1={sx(t)} y1="0" x2={sx(t)} y2="200" stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
            <text x="12" y="24" fontSize="16" fontWeight="700" fill="#9fb5bc">
              D
            </text>
            <text x={STRIP_W - 12} y="24" fontSize="16" fontWeight="700" fill="#9fb5bc" textAnchor="end">
              E
            </text>
          </svg>
          <figcaption className="bg-[#0b1418] px-3 py-1.5 text-xs text-[#9fb5bc]">
            Panorâmica em formação: a imagem é “escrita” da esquerda (lado direito do paciente) para a direita.
          </figcaption>
        </figure>

        {/* Explicação */}
        <div aria-live="polite" className="rounded-2xl border border-line bg-surface p-4 shadow-card">
          {now.hit ? (
            now.kind === "real" ? (
              <p className="text-fg">
                Agora o objeto está <strong>entre o centro de rotação e o receptor</strong> → forma{" "}
                <strong className="text-accent-strong">imagem real</strong> (nítida, na altura e no lado verdadeiros).
              </p>
            ) : (
              <p className="text-fg">
                Agora o objeto está <strong>entre o centro de rotação e a fonte</strong> → forma{" "}
                <strong className="text-complement">imagem fantasma</strong>: no lado oposto, mais alta, maior e borrada.
              </p>
            )
          ) : (
            <p className="text-fg">
              {evs.length === 0 ? (
                "Nesta posição o objeto não é atravessado pelo feixe — aproxime-o das arcadas ou da orelha."
              ) : (
                <>
                  Neste ciclo o objeto gera <strong>{describeImages(reals, "real")}</strong>
                  {ghosts.length > 0 && (
                    <>
                      {reals.length > 0 ? " e " : ""}
                      <strong>{describeImages(ghosts, "fantasma")}</strong>
                    </>
                  )}
                  .
                </>
              )}
            </p>
          )}
          <p className="mt-2 text-xs text-muted">
            A altura maior do fantasma decorre do ângulo negativo do feixe (de baixo para cima), que não aparece nesta
            vista superior. Modelo simplificado em 2D: trajetórias reais variam por fabricante.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SourceBadge source="aula" slides={[17, 47, 48, 49, 50, 51, 56]} size="xs" />
            <SourceBadge source="complementar" size="xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

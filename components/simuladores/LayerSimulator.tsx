"use client";

import { useId, useMemo, useState } from "react";
import { Rich } from "../Rich";
import { SourceBadge } from "../SourceBadge";
import { NORMAL, type PanoParams } from "./panorama";
import { PanoramaSchematic } from "./PanoramaSchematic";

/** Metade da espessura anterior da camada, na mesma escala do deslocamento (−1…1). */
const TOLERANCE = 0.16;

function paramsFor(d: number): PanoParams {
  const k = Math.max(0, (Math.abs(d) - TOLERANCE) / (1 - TOLERANCE));
  const forward = d > 0;
  return {
    ...NORMAL,
    antWidth: forward ? 1 - 0.42 * k : 1 + 0.5 * k,
    blurUpperAnt: 2.8 * k,
    blurLowerAnt: 2.8 * k,
    premolarOverlap: forward ? 0.9 * k : 0,
    ramusCut: forward ? 0 : 0.9 * k,
    ghostsBoost: forward ? 0 : k,
  };
}

function describe(d: number) {
  const a = Math.abs(d);
  if (a <= TOLERANCE)
    return {
      tone: "ok" as const,
      title: "Arcada dentro da camada de imagem",
      text: "Incisivos nítidos e com largura proporcional. É o objetivo do posicionamento: incisivos topo a topo na ranhura do bloco de mordida.",
    };
  const intensity = a < 0.5 ? "levemente " : "";
  if (d > 0)
    return {
      tone: "bad" as const,
      title: `Arcada ${intensity}à frente da camada`,
      text: "Os incisivos ficam mais perto do receptor (vestibular à camada): aparecem **estreitos e borrados**; surge sobreposição na região de pré-molares.",
    };
  return {
    tone: "bad" as const,
    title: `Arcada ${intensity}atrás da camada`,
    text: "Os incisivos ficam mais perto da fonte (lingual à camada): aparecem **alargados e borrados**; ramos/côndilos podem ser cortados nas laterais e os fantasmas ficam mais evidentes.",
  };
}

export function LayerSimulator() {
  const [d, setD] = useState(0);
  const sliderId = useId();
  const params = useMemo(() => paramsFor(d), [d]);
  const info = describe(d);
  const shift = -d * 34; // à frente = para cima na vista superior

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="min-w-0 space-y-4">
        {/* Vista superior */}
        <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
          <svg viewBox="0 0 400 330" role="img" aria-label="Vista superior da arcada e da camada de imagem" className="block h-auto w-full">
            <defs>
              <marker id="lay-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
              </marker>
            </defs>
            <text x="200" y="20" textAnchor="middle" fontSize="13" fill="var(--muted)">
              anterior (face)
            </text>
            {/* receptor (frente) e fonte (atrás), esquemáticos */}
            <rect x="140" y="28" width="120" height="7" rx="3" fill="#38bdf8" opacity="0.8" />
            <text x="270" y="36" fontSize="12" fill="#38bdf8">
              receptor
            </text>
            <rect x="170" y="308" width="60" height="14" rx="4" fill="#f59e0b" opacity="0.85" />
            <text x="240" y="320" fontSize="12" fill="#f59e0b">
              fonte
            </text>
            {/* camada: mais estreita na frente */}
            <path
              d="M 70 290 C 64 170, 116 62, 200 56 C 284 62, 336 170, 330 290 L 286 290 C 290 186, 252 80, 200 76 C 148 80, 110 186, 114 290 Z"
              fill="var(--accent)"
              opacity="0.22"
            />
            <path d="M 70 290 C 64 170, 116 62, 200 56 C 284 62, 336 170, 330 290" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <path d="M 114 290 C 110 186, 148 80, 200 76 C 252 80, 290 186, 286 290" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            {/* arcada móvel */}
            <g transform={`translate(0 ${shift.toFixed(1)})`} style={{ transition: "transform 80ms linear" }}>
              <path
                d="M 92 290 C 87 178, 132 68, 200 66 C 268 68, 313 178, 308 290"
                fill="none"
                stroke="var(--text)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray="13 4"
              />
            </g>
            <line x1="365" y1="120" x2="365" y2="70" stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#lay-arrow)" />
            <text x="372" y="100" fontSize="12" fill="var(--muted)" transform="rotate(90 372 100)">
              à frente
            </text>
          </svg>
          <figcaption className="border-t border-line bg-surface-2 px-4 py-2 text-xs text-muted">
            Vista superior esquemática: a faixa é a camada de imagem, mais estreita na frente.
          </figcaption>
        </figure>

        <div>
          <label htmlFor={sliderId} className="flex items-center justify-between text-sm font-semibold text-fg">
            <span>Posição anteroposterior da arcada</span>
            <span className="text-muted tabular-nums">{d === 0 ? "centrada" : `${d > 0 ? "+" : ""}${Math.round(d * 100)}`}</span>
          </label>
          <input
            id={sliderId}
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            aria-valuetext={info.title}
            className="mt-2 w-full accent-[var(--accent)]"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>← para trás</span>
            <button type="button" onClick={() => setD(0)} className="rounded px-1.5 font-medium text-accent hover:underline">
              centralizar
            </button>
            <span>à frente →</span>
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="overflow-hidden rounded-2xl border border-[#1d3b44] bg-[#040708]">
          <PanoramaSchematic params={params} title={`Panorâmica esquemática: ${info.title}`} />
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="overflow-hidden rounded-2xl border border-[#1d3b44] bg-[#040708]">
            <PanoramaSchematic
              params={params}
              viewBox="360 120 280 260"
              showSides={false}
              title="Ampliação da região dos incisivos"
            />
            <p className="bg-[#0b1418] px-3 py-1.5 text-center text-xs text-[#9fb5bc]">Lupa: incisivos</p>
          </div>
          <div
            aria-live="polite"
            className={`rounded-2xl border p-4 ${
              info.tone === "ok" ? "border-success/50 bg-success-soft" : "border-danger/40 bg-danger-soft"
            }`}
          >
            <p className="font-display font-bold text-fg">{info.title}</p>
            <p className="mt-1 text-sm text-fg">
              <Rich text={info.text} />
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SourceBadge source="aula" slides={[17, 18, 24, 25, 26, 27]} size="xs" />
          <SourceBadge source="complementar" size="xs" />
          <span className="text-xs text-muted">Formato da camada e aspecto das imagens: literatura complementar.</span>
        </div>
      </div>
    </div>
  );
}

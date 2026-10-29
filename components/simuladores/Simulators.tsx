"use client";

import { Bone, Ghost, Layers, TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import type { SimulatorTab } from "@/lib/types";
import { AnatomyExplorer } from "./AnatomyExplorer";
import { ErrorSimulator } from "./ErrorSimulator";
import { GhostSimulator } from "./GhostSimulator";
import { LayerSimulator } from "./LayerSimulator";

const tabs: { id: SimulatorTab; label: string; short: string; Icon: typeof Layers; intro: string }[] = [
  {
    id: "camada",
    label: "Camada de imagem",
    short: "Camada",
    Icon: Layers,
    intro: "Mova a arcada para frente e para trás e veja o efeito nos incisivos.",
  },
  {
    id: "fantasma",
    label: "Imagem real × fantasma",
    short: "Real × fantasma",
    Icon: Ghost,
    intro: "Arraste um objeto e acompanhe o ciclo: entre centro e receptor → real; entre centro e fonte → fantasma.",
  },
  {
    id: "erros",
    label: "Erros de posicionamento",
    short: "Erros",
    Icon: TriangleAlert,
    intro: "Escolha um erro e veja a panorâmica se deformar — ou encare o desafio “qual é o erro?”.",
  },
  {
    id: "anatomia",
    label: "Anatomia",
    short: "Anatomia",
    Icon: Bone,
    intro: "Explore as estruturas no esquema ou treine: onde está? / qual é?",
  },
];

const isTab = (v: string | null): v is SimulatorTab => tabs.some((t) => t.id === v);

export function Simulators() {
  const params = useSearchParams();
  const fromUrl = params.get("aba");
  const [tab, setTab] = useState<SimulatorTab>(isTab(fromUrl) ? fromUrl : "camada");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const idx = tabs.findIndex((t) => t.id === tab);

  const select = (i: number, focus = false) => {
    const t = tabs[i];
    setTab(t.id);
    try {
      window.history.replaceState(null, "", `?aba=${t.id}`);
    } catch {
      // ignora (ex.: sandbox)
    }
    if (focus) refs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = tabs.length;
    const map: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  const current = tabs[idx];
  return (
    <div>
      <div role="tablist" aria-label="Simuladores" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tabs.map((t, i) => {
          const sel = t.id === tab;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-selected={sel}
              aria-controls={`${base}-panel`}
              tabIndex={sel ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors ${
                sel ? "border-accent bg-accent-soft text-accent-strong" : "border-line bg-surface text-muted hover:text-fg"
              }`}
            >
              <t.Icon className="size-4 shrink-0" aria-hidden />
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      <section
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${tab}`}
        className="mt-6"
      >
        <h2 className="font-display text-2xl font-bold">{current.label}</h2>
        <p className="mt-1 mb-5 text-muted">{current.intro}</p>
        {tab === "camada" && <LayerSimulator />}
        {tab === "fantasma" && <GhostSimulator />}
        {tab === "erros" && <ErrorSimulator />}
        {tab === "anatomia" && <AnatomyExplorer />}
      </section>
    </div>
  );
}

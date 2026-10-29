"use client";

import {
  BookOpen,
  Check,
  FileText,
  FlaskConical,
  GalleryVerticalEnd,
  ListChecks,
  Network,
  Zap,
  CalendarDays,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { trailMinutes, trilhas } from "@/content/trilhas";
import { formatMinutes } from "@/lib/format";
import { setTrailStep, useHydrated, useProgress } from "@/lib/progress";
import type { Trail, TrailStep } from "@/lib/types";

const kindIcon: Record<TrailStep["kind"], typeof BookOpen> = {
  modulo: BookOpen,
  quiz: ListChecks,
  flashcards: GalleryVerticalEnd,
  simulador: FlaskConical,
  revisao: FileText,
  mapa: Network,
};

const trailIcon: Record<Trail["id"], typeof Zap> = {
  relampago: Zap,
  completa: Calendar,
  "tres-dias": CalendarDays,
};

export function TrailPlanner() {
  const [active, setActive] = useState(0);
  const progress = useProgress();
  const hydrated = useHydrated();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const trail = trilhas[active];
  const steps = trail.blocks.flatMap((b) => b.steps);
  const done = steps.filter((s) => progress.trail[s.id]).length;

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % trilhas.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + trilhas.length) % trilhas.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = trilhas.length - 1;
    else return;
    e.preventDefault();
    setActive(n);
    tabsRef.current[n]?.focus();
  };

  return (
    <section aria-labelledby="plano-h" className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <h2 id="plano-h" className="font-display text-xl font-bold">
        Plano de revisão para a prova
      </h2>
      <p className="mt-1 text-sm text-muted">Escolha uma trilha e marque cada etapa ao terminar.</p>

      <div role="tablist" aria-label="Trilhas de revisão" className="mt-4 grid grid-cols-3 gap-2">
        {trilhas.map((t, i) => {
          const Icon = trailIcon[t.id];
          const selected = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition-colors ${
                selected
                  ? "border-accent bg-accent-soft text-accent-strong"
                  : "border-line bg-surface-2 text-muted hover:text-fg"
              }`}
            >
              <Icon className="size-5" aria-hidden />
              <span className="text-[0.8rem] leading-tight font-semibold sm:text-sm">{t.name}</span>
              <span className="text-xs">{t.duration}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`} className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-fg">{trail.description}</p>
          <p className="text-xs text-muted tabular-nums">
            {done}/{steps.length} etapas · ~{formatMinutes(trailMinutes(trail))}
          </p>
        </div>
        <div className="mt-3 space-y-4">
          {trail.blocks.map((block) => (
            <div key={block.title}>
              <h3 className="mb-2 text-sm font-semibold text-fg">{block.title}</h3>
              <ol className="space-y-1.5">
                {block.steps.map((st) => {
                  const Icon = kindIcon[st.kind];
                  const checked = !!progress.trail[st.id];
                  return (
                    <li key={st.id} className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/50 pr-2">
                      <label className="flex shrink-0 cursor-pointer items-center p-2.5">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={checked}
                          disabled={!hydrated}
                          onChange={(e) => setTrailStep(st.id, e.target.checked)}
                        />
                        <span
                          aria-hidden
                          className={`inline-flex size-6 items-center justify-center rounded-md border-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)] ${
                            checked ? "border-success bg-success text-white" : "border-line bg-surface"
                          }`}
                        >
                          {checked && <Check className="size-4" strokeWidth={3} />}
                        </span>
                        <span className="sr-only">Concluí: {st.label}</span>
                      </label>
                      <Link
                        href={st.href}
                        className={`flex min-w-0 flex-1 items-center gap-2 py-2 text-sm hover:underline ${
                          checked ? "text-muted line-through" : "text-fg"
                        }`}
                      >
                        <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                        <span className="min-w-0 flex-1">{st.label}</span>
                        <span className="shrink-0 text-xs text-muted tabular-nums">{st.minutes} min</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

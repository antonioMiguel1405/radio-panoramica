"use client";

import { Check, CircleCheck } from "lucide-react";
import { setModuleDone, useHydrated, useProgress, useStorageAvailable } from "@/lib/progress";

/** Caixa “Concluí este módulo”. */
export function ModuleCompleteToggle({ slug, title }: { slug: string; title: string }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const storage = useStorageAvailable();
  const done = !!progress.modules[slug];
  return (
    <div className="no-print rounded-2xl border border-line bg-surface p-4">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={done}
          disabled={!hydrated}
          onChange={(e) => setModuleDone(slug, e.target.checked)}
        />
        <span
          aria-hidden
          className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)] ${
            done ? "border-success bg-success text-white" : "border-line bg-surface"
          }`}
        >
          {done && <Check className="size-5" strokeWidth={3} />}
        </span>
        <span>
          <span className="block font-semibold text-fg">Concluí este módulo</span>
          <span className="block text-sm text-muted">
            {done ? `“${title}” marcado como concluído.` : "Marque quando souber explicar os objetivos."}
          </span>
        </span>
      </label>
      {hydrated && !storage && (
        <p className="mt-2 text-xs text-warning">
          O navegador bloqueou o armazenamento local: o progresso vale só nesta visita.
        </p>
      )}
    </div>
  );
}

/** Selo pequeno de módulo concluído (lista do roteiro). */
export function ModuleDoneBadge({ slug }: { slug: string }) {
  const progress = useProgress();
  if (!progress.modules[slug]) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">
      <CircleCheck className="size-3.5" aria-hidden />
      Concluído
    </span>
  );
}

/** Barra: X de N módulos concluídos. */
export function ModulesBar({ slugs }: { slugs: string[] }) {
  const progress = useProgress();
  const done = slugs.filter((s) => progress.modules[s]).length;
  const pct = slugs.length ? done / slugs.length : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-medium text-fg">Seu progresso</span>
        <span className="tabular-nums text-muted">
          {done} de {slugs.length} módulos
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-surface-3"
        role="progressbar"
        aria-label="Módulos concluídos"
        aria-valuemin={0}
        aria-valuemax={slugs.length}
        aria-valuenow={done}
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}

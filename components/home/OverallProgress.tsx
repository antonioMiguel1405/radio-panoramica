"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { flashcards } from "@/content/flashcards";
import { moduleSlugs } from "@/content/modules";
import { quiz } from "@/content/quiz";
import {
  moduleCount,
  overallProgress,
  quizMastery,
  resetProgress,
  useHydrated,
  useProgress,
  useStorageAvailable,
} from "@/lib/progress";
import { ProgressRing } from "../ProgressRing";

const questionIds = quiz.map((q) => q.id);

export function OverallProgress() {
  const s = useProgress();
  const hydrated = useHydrated();
  const storage = useStorageAvailable();
  const [confirming, setConfirming] = useState(false);
  const overall = overallProgress(s, moduleSlugs, questionIds);
  const mods = moduleCount(s, moduleSlugs);
  const mastery = quizMastery(s, questionIds);
  const known = flashcards.filter((f) => s.cards[f.id] === "sei").length;
  const lastSim = s.simulados[s.simulados.length - 1];

  return (
    <section
      aria-labelledby="progresso-h"
      className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <ProgressRing value={overall} size={128} stroke={11} label="Progresso geral">
          <span className="font-display text-3xl font-extrabold tabular-nums">{Math.round(overall * 100)}%</span>
          <span className="text-[0.7rem] text-muted">geral</span>
        </ProgressRing>
        <div className="w-full min-w-0 flex-1">
          <h2 id="progresso-h" className="font-display text-lg font-bold">
            Seu progresso
          </h2>
          <p className="text-sm text-muted">70% módulos concluídos + 30% domínio do quiz.</p>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-surface-2 px-2 py-2.5">
              <dt className="text-[0.7rem] text-muted">Módulos</dt>
              <dd className="font-display text-lg font-bold tabular-nums">
                {mods}/{moduleSlugs.length}
              </dd>
            </div>
            <div className="rounded-xl bg-surface-2 px-2 py-2.5">
              <dt className="text-[0.7rem] text-muted">Quiz</dt>
              <dd className="font-display text-lg font-bold tabular-nums">{Math.round(mastery * 100)}%</dd>
            </div>
            <div className="rounded-xl bg-surface-2 px-2 py-2.5">
              <dt className="text-[0.7rem] text-muted">Cards “sei”</dt>
              <dd className="font-display text-lg font-bold tabular-nums">
                {known}/{flashcards.length}
              </dd>
            </div>
          </dl>
          {lastSim && (
            <p className="mt-2 text-xs text-muted">
              Último simulado: {lastSim.score}/{lastSim.total} acertos.
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
        <span>
          {hydrated && !storage
            ? "Armazenamento bloqueado: o progresso vale só nesta visita."
            : "Salvo apenas neste navegador."}
        </span>
        {confirming ? (
          <span className="flex items-center gap-2">
            <span>Apagar todo o progresso?</span>
            <button
              type="button"
              className="rounded-md bg-danger px-2 py-1 font-semibold text-white"
              onClick={() => {
                resetProgress();
                setConfirming(false);
              }}
            >
              Apagar
            </button>
            <button type="button" className="rounded-md px-2 py-1 hover:bg-surface-2" onClick={() => setConfirming(false)}>
              Cancelar
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-surface-2 hover:text-fg"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Zerar progresso
          </button>
        )}
      </div>
    </section>
  );
}

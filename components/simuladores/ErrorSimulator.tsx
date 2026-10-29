"use client";

import { Check, CircleCheck, CircleX, Eye, RefreshCw, Target, X } from "lucide-react";
import { useState } from "react";
import { positioningErrors } from "@/content/errors";
import { recordChallengeScore, useProgress } from "@/lib/progress";
import { shuffle } from "@/lib/shuffle";
import { Rich } from "../Rich";
import { SourceBadge } from "../SourceBadge";
import { ERROR_PRESETS } from "./errorPresets";
import { PanoramaSchematic } from "./PanoramaSchematic";
import { useTween } from "./useTween";

type Mode = "explorar" | "desafio";

interface Round {
  answer: string;
  options: string[];
  picked: string | null;
}

const byId = new Map(positioningErrors.map((e) => [e.id, e]));

function newRound(prev?: string): Round {
  const pool = positioningErrors.filter((e) => e.id !== prev);
  const answer = pool[Math.floor(Math.random() * pool.length)].id;
  const others = shuffle(positioningErrors.filter((e) => e.id !== answer)).slice(0, 3).map((e) => e.id);
  return { answer, options: shuffle([answer, ...others]), picked: null };
}

export function ErrorSimulator() {
  const [mode, setMode] = useState<Mode>("explorar");
  const [selected, setSelected] = useState<string>("normal");
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState({ hits: 0, total: 0, streak: 0 });
  const progress = useProgress();

  const shownId = mode === "desafio" ? (round?.answer ?? "normal") : selected;
  const params = useTween(ERROR_PRESETS[shownId] ?? ERROR_PRESETS.normal);
  const err = byId.get(shownId);
  const revealed = mode === "explorar" || (round?.picked ?? null) !== null;

  const startChallenge = () => {
    setMode("desafio");
    setScore({ hits: 0, total: 0, streak: 0 });
    setRound(newRound());
  };

  const pick = (id: string) => {
    if (!round || round.picked) return;
    const ok = id === round.answer;
    const next = { hits: score.hits + (ok ? 1 : 0), total: score.total + 1, streak: ok ? score.streak + 1 : 0 };
    setScore(next);
    recordChallengeScore(next.streak);
    setRound({ ...round, picked: id });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-line bg-surface-2 p-1" role="group" aria-label="Modo do simulador">
          <button
            type="button"
            aria-pressed={mode === "explorar"}
            onClick={() => setMode("explorar")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
              mode === "explorar" ? "bg-surface text-fg shadow-sm" : "text-muted"
            }`}
          >
            <Eye className="size-4" aria-hidden /> Explorar
          </button>
          <button
            type="button"
            aria-pressed={mode === "desafio"}
            onClick={startChallenge}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
              mode === "desafio" ? "bg-surface text-fg shadow-sm" : "text-muted"
            }`}
          >
            <Target className="size-4" aria-hidden /> Desafio
          </button>
        </div>
        {mode === "desafio" && (
          <p className="text-sm text-muted tabular-nums">
            Acertos: <strong className="text-fg">{score.hits}/{score.total}</strong> · sequência {score.streak} · recorde{" "}
            {progress.challengeBest}
          </p>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-3">
          <div className="overflow-hidden rounded-2xl border border-[#1d3b44] bg-[#040708]">
            <PanoramaSchematic
              params={params}
              title={
                mode === "desafio" && !revealed
                  ? "Panorâmica esquemática com um erro de posicionamento a identificar"
                  : `Panorâmica esquemática: ${err ? err.name : "posicionamento correto"}`
              }
            />
          </div>
          <p className="text-xs text-muted">
            Esquema didático (não é uma radiografia real). Lado esquerdo da imagem = lado direito do paciente (D).
          </p>
        </div>

        <div className="min-w-0">
          {mode === "explorar" ? (
            <ExplainPanel id={selected} />
          ) : (
            round && (
              <section aria-labelledby="desafio-h" className="rounded-2xl border border-line bg-surface p-4 shadow-card">
                <h3 id="desafio-h" className="font-display text-lg font-bold">
                  Qual é o erro desta imagem?
                </h3>
                <ul className="mt-3 space-y-2">
                  {round.options.map((id) => {
                    const e = byId.get(id)!;
                    const isAnswer = id === round.answer;
                    const isPicked = id === round.picked;
                    const state = !round.picked
                      ? "border-line bg-surface hover:border-accent/60"
                      : isAnswer
                        ? "border-success bg-success-soft"
                        : isPicked
                          ? "border-danger bg-danger-soft"
                          : "border-line opacity-70";
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          disabled={!!round.picked}
                          onClick={() => pick(id)}
                          className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium text-fg ${state}`}
                        >
                          {round.picked && isAnswer && <Check className="size-4 text-success" aria-hidden />}
                          {round.picked && isPicked && !isAnswer && <X className="size-4 text-danger" aria-hidden />}
                          {e.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div aria-live="polite">
                  {round.picked && (
                    <div className="mt-3 space-y-3">
                      <p
                        className={`flex items-center gap-2 font-semibold ${
                          round.picked === round.answer ? "text-success" : "text-danger"
                        }`}
                      >
                        {round.picked === round.answer ? (
                          <CircleCheck className="size-5" aria-hidden />
                        ) : (
                          <CircleX className="size-5" aria-hidden />
                        )}
                        {round.picked === round.answer ? "Acertou!" : `Era: ${byId.get(round.answer)?.name}`}
                      </p>
                      <ExplainBody id={round.answer} />
                      <button
                        type="button"
                        onClick={() => setRound(newRound(round.answer))}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent"
                      >
                        <RefreshCw className="size-4" aria-hidden /> Próxima imagem
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )
          )}
        </div>
      </div>

      {mode === "explorar" && (
        <div role="group" aria-label="Escolher o erro de posicionamento" className="flex flex-wrap gap-2">
          <ErrButton active={selected === "normal"} onClick={() => setSelected("normal")}>
            ✓ Posicionamento correto
          </ErrButton>
          {positioningErrors.map((e) => (
            <ErrButton key={e.id} active={selected === e.id} onClick={() => setSelected(e.id)}>
              {e.name}
            </ErrButton>
          ))}
        </div>
      )}
    </div>
  );
}

function ErrButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-2 text-sm transition-colors ${
        active ? "border-danger bg-danger-soft font-semibold text-fg" : "border-line bg-surface text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function ExplainPanel({ id }: { id: string }) {
  return (
    <section aria-live="polite" className="rounded-2xl border border-line bg-surface p-4 shadow-card">
      {id === "normal" ? (
        <>
          <h3 className="font-display text-lg font-bold">Posicionamento correto</h3>
          <p className="mt-2 text-sm text-fg">
            Plano oclusal em leve “sorriso”, lados simétricos, incisivos nítidos e proporcionais. Escolha
            um erro abaixo para ver a imagem se deformar.
          </p>
          <p className="mt-2 text-sm text-muted">
            Referências: Frankfurt paralelo ao solo, sagital mediano perpendicular e centralizado, incisivos
            topo a topo na ranhura, língua no palato.
          </p>
          <SourceBadge source="aula" slides={[23, 24, 25, 29, 42]} size="xs" className="mt-2" />
        </>
      ) : (
        <ExplainBody id={id} withTitle />
      )}
    </section>
  );
}

function ExplainBody({ id, withTitle = false }: { id: string; withTitle?: boolean }) {
  const e = byId.get(id);
  if (!e) return null;
  return (
    <div className="space-y-3 text-sm">
      {withTitle && <h3 className="font-display text-lg font-bold">{e.name}</h3>}
      <div className="flex gap-2">
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-bold">1</span>
        <div>
          <p className="font-semibold text-fg">Causa</p>
          <p className="text-fg">{e.cause}</p>
          <SourceBadge {...e.causeRef} size="xs" className="mt-1" />
        </div>
      </div>
      <div className="flex gap-2">
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-bold">2</span>
        <div>
          <p className="font-semibold text-fg">Aspecto na imagem</p>
          <p className="text-fg">
            <Rich text={e.aspect} />
          </p>
          <SourceBadge {...e.aspectRef} size="xs" className="mt-1" />
        </div>
      </div>
      <div className="flex gap-2">
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-xs font-bold text-white">3</span>
        <div>
          <p className="font-semibold text-fg">Como corrigir</p>
          <p className="text-fg">{e.correction}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleCheck,
  CircleX,
  Clock,
  ListChecks,
  RotateCcw,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getModule, modules } from "@/content/modules";
import { quiz } from "@/content/quiz";
import { formatClock } from "@/lib/format";
import { recordQuizAnswer, recordSimulado, useProgress } from "@/lib/progress";
import { shuffle } from "@/lib/shuffle";
import type { QuizQuestion } from "@/lib/types";
import { SourceBadge } from "../SourceBadge";

type Mode = "praticar" | "simulado";

interface Item {
  q: QuizQuestion;
  /** Ordem de exibição: índices das alternativas originais (0 = correta). */
  order: number[];
}

interface Session {
  mode: Mode;
  items: Item[];
  index: number;
  /** Alternativa original escolhida em cada questão. */
  answers: (number | null)[];
  startedAt: number;
  limitSeconds: number | null;
  finishedAt: number | null;
}

const SIMULADO_SIZE = 10;
const SIMULADO_SECONDS = 15 * 60;
const letters = ["A", "B", "C", "D"];

function buildItems(qs: QuizQuestion[]): Item[] {
  return qs.map((q) => ({ q, order: shuffle([0, 1, 2, 3]) }));
}

export function Quiz() {
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<Mode>("praticar");
  const [moduleFilter, setModuleFilter] = useState<string>("todos");
  const [timed, setTimed] = useState(true);
  const progress = useProgress();

  const pool = useMemo(
    () => (moduleFilter === "todos" ? quiz : quiz.filter((q) => q.module === moduleFilter)),
    [moduleFilter],
  );
  const wrongIds = useMemo(
    () => quiz.filter((q) => progress.quiz[q.id] === false).map((q) => q.id),
    [progress.quiz],
  );

  const start = (qs: QuizQuestion[], m: Mode, limit: number | null) => {
    setSession({
      mode: m,
      items: buildItems(qs),
      index: 0,
      answers: qs.map(() => null),
      startedAt: Date.now(),
      limitSeconds: limit,
      finishedAt: null,
    });
    window.scrollTo({ top: 0 });
  };

  const startFromSetup = () => {
    if (mode === "simulado") {
      start(shuffle(pool).slice(0, SIMULADO_SIZE), "simulado", timed ? SIMULADO_SECONDS : null);
    } else {
      start(shuffle(pool), "praticar", null);
    }
  };

  if (!session) {
    return (
      <Setup
        mode={mode}
        setMode={setMode}
        moduleFilter={moduleFilter}
        setModuleFilter={setModuleFilter}
        timed={timed}
        setTimed={setTimed}
        poolSize={pool.length}
        wrongCount={wrongIds.length}
        answeredCount={Object.keys(progress.quiz).length}
        onStart={startFromSetup}
        onReviewWrong={() => start(shuffle(quiz.filter((q) => wrongIds.includes(q.id))), "praticar", null)}
        lastSimulado={progress.simulados[progress.simulados.length - 1]}
      />
    );
  }

  if (session.finishedAt) {
    return (
      <Results
        session={session}
        onRetryWrong={(qs) => start(qs, "praticar", null)}
        onRestart={() => setSession(null)}
      />
    );
  }

  return <Runner session={session} setSession={setSession} />;
}

// ------------------------------------------------------------------
function Setup(props: {
  mode: Mode;
  setMode: (m: Mode) => void;
  moduleFilter: string;
  setModuleFilter: (m: string) => void;
  timed: boolean;
  setTimed: (t: boolean) => void;
  poolSize: number;
  wrongCount: number;
  answeredCount: number;
  onStart: () => void;
  onReviewWrong: () => void;
  lastSimulado?: { score: number; total: number; seconds: number };
}) {
  const { mode, setMode, moduleFilter, setModuleFilter, timed, setTimed, poolSize } = props;
  const count = mode === "simulado" ? Math.min(SIMULADO_SIZE, poolSize) : poolSize;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section aria-labelledby="config-h" className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
        <h2 id="config-h" className="font-display text-xl font-bold">
          Montar a sessão
        </h2>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-fg">Modo</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ["praticar", "Praticar", "Todas as questões do filtro, sem tempo.", BookOpen],
                ["simulado", "Simulado", "10 questões aleatórias, com cronômetro opcional.", Timer],
              ] as const
            ).map(([value, label, desc, Icon]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-2xl border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)] ${
                  mode === value ? "border-accent bg-accent-soft" : "border-line bg-surface-2 hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="modo"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  className="sr-only"
                />
                <span className="flex items-center gap-2 font-semibold text-fg">
                  <Icon className="size-4" aria-hidden /> {label}
                </span>
                <span className="mt-1 block text-xs text-muted">{desc}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="filtro-modulo" className="text-sm font-semibold text-fg">
            Módulo
          </label>
          <select
            id="filtro-modulo"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-line bg-surface px-3 text-fg"
          >
            <option value="todos">Todos os módulos ({quiz.length} questões)</option>
            {modules.map((m) => {
              const n = quiz.filter((q) => q.module === m.slug).length;
              return (
                <option key={m.slug} value={m.slug}>
                  {m.number}. {m.shortTitle} ({n})
                </option>
              );
            })}
          </select>
        </div>

        {mode === "simulado" && (
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
              className="size-5 accent-[var(--accent)]"
            />
            <span className="text-sm text-fg">
              Cronômetro de {SIMULADO_SECONDS / 60} minutos (encerra automaticamente)
            </span>
          </label>
        )}

        <button
          type="button"
          onClick={props.onStart}
          disabled={poolSize === 0}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent shadow-card disabled:opacity-50 sm:w-auto"
        >
          Começar ({count} {count === 1 ? "questão" : "questões"}) <ArrowRight className="size-4" aria-hidden />
        </button>
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-card">
          <h2 className="font-display text-lg font-bold">Seu histórico</h2>
          <p className="mt-1 text-sm text-muted">
            {props.answeredCount} de {quiz.length} questões já respondidas.
          </p>
          {props.lastSimulado && (
            <p className="mt-1 text-sm text-muted">
              Último simulado: <strong className="text-fg">{props.lastSimulado.score}/{props.lastSimulado.total}</strong> em{" "}
              {formatClock(props.lastSimulado.seconds)}.
            </p>
          )}
          <button
            type="button"
            onClick={props.onReviewWrong}
            disabled={props.wrongCount === 0}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm font-semibold text-fg hover:border-danger/60 disabled:opacity-50"
          >
            <RotateCcw className="size-4" aria-hidden /> Revisar meus erros ({props.wrongCount})
          </button>
        </div>
        <div className="rounded-3xl border border-line bg-surface-2 p-5 text-sm text-muted">
          <p className="font-semibold text-fg">Como funciona</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>As alternativas são embaralhadas a cada sessão.</li>
            <li>Depois de responder, veja por que cada alternativa está certa ou errada.</li>
            <li>Atalhos: teclas 1–4 (ou A–D) escolhem; Enter avança.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

// ------------------------------------------------------------------
function Runner({
  session,
  setSession,
}: {
  session: Session;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}) {
  const item = session.items[session.index];
  const chosen = session.answers[session.index];
  const answered = chosen !== null;
  const total = session.items.length;
  const isLast = session.index === total - 1;
  const mod = getModule(item.q.module);
  const [now, setNow] = useState(() => session.startedAt);
  const nextRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const finish = useCallback(() => {
    if (session.finishedAt) return;
    const finishedAt = Date.now();
    if (session.mode === "simulado") {
      recordSimulado({
        score: session.answers.filter((a) => a === 0).length,
        total: session.items.length,
        seconds: Math.round((finishedAt - session.startedAt) / 1000),
        at: finishedAt,
      });
    }
    setSession({ ...session, finishedAt });
  }, [session, setSession]);

  // Cronômetro
  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (session.limitSeconds && (t - session.startedAt) / 1000 >= session.limitSeconds) finish();
    }, 500);
    return () => window.clearInterval(id);
  }, [session.limitSeconds, session.startedAt, finish]);

  const answer = useCallback(
    (original: number) => {
      if (answered) return;
      recordQuizAnswer(item.q.id, original === 0);
      const answers = [...session.answers];
      answers[session.index] = original;
      setSession({ ...session, answers });
      window.setTimeout(() => nextRef.current?.focus(), 0);
    },
    [answered, item.q.id, session, setSession],
  );

  const next = useCallback(() => {
    if (isLast) finish();
    else {
      setSession({ ...session, index: session.index + 1 });
      window.setTimeout(() => headingRef.current?.focus(), 0);
    }
  }, [isLast, finish, session, setSession]);

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      const pos = ["1", "2", "3", "4"].indexOf(k) >= 0 ? Number(k) - 1 : ["a", "b", "c", "d"].indexOf(k);
      if (pos >= 0 && !answered) {
        e.preventDefault();
        answer(item.order[pos]);
      } else if (k === "enter" && answered && target.tagName !== "BUTTON" && target.tagName !== "A") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, answer, next, item.order]);

  const elapsed = Math.max(0, (now - session.startedAt) / 1000);
  const remaining = session.limitSeconds ? session.limitSeconds - elapsed : null;
  const correctSoFar = session.answers.filter((a) => a === 0).length;

  return (
    <div className="mx-auto max-w-3xl" style={{ ["--mod" as string]: mod?.color }}>
      {/* Barra superior */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold text-fg">
          Questão {session.index + 1} de {total}
        </span>
        <span className="text-muted">
          <CircleCheck className="mr-1 inline size-4 text-success" aria-hidden />
          {correctSoFar} acerto{correctSoFar === 1 ? "" : "s"}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 tabular-nums text-muted" aria-live="off">
          <Clock className="size-4" aria-hidden />
          {remaining !== null ? (
            <span className={remaining < 60 ? "font-bold text-danger" : ""}>{formatClock(remaining)}</span>
          ) : (
            formatClock(elapsed)
          )}
        </span>
        <button
          type="button"
          onClick={finish}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-muted hover:bg-surface-2 hover:text-fg"
        >
          <X className="size-4" aria-hidden /> Encerrar
        </button>
      </div>
      <div
        className="mb-6 h-2 overflow-hidden rounded-full bg-surface-3"
        role="progressbar"
        aria-label="Progresso da sessão"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={session.index + (answered ? 1 : 0)}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${((session.index + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={item.q.id + session.index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-7"
          aria-labelledby="pergunta"
        >
          <div className="flex flex-wrap items-center gap-2">
            {mod && (
              <span className="mod-tint inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                <span className="mod-text">
                  Módulo {mod.number} · {mod.shortTitle}
                </span>
              </span>
            )}
            <SourceBadge source={item.q.source} slides={item.q.slides} size="xs" />
          </div>
          <h2
            id="pergunta"
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 font-display text-xl leading-snug font-bold text-balance outline-none sm:text-2xl"
          >
            {item.q.question}
          </h2>

          <ul className="mt-5 space-y-2.5" aria-label="Alternativas">
            {item.order.map((orig, pos) => {
              const opt = item.q.options[orig];
              const isCorrect = orig === 0;
              const isChosen = chosen === orig;
              let state = "border-line bg-surface hover:border-accent/60 hover:bg-surface-2";
              if (answered) {
                if (isCorrect) state = "border-success bg-success-soft";
                else if (isChosen) state = "border-danger bg-danger-soft";
                else state = "border-line bg-surface opacity-80";
              }
              return (
                <li key={orig}>
                  <button
                    type="button"
                    onClick={() => answer(orig)}
                    disabled={answered}
                    aria-pressed={isChosen}
                    className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors disabled:cursor-default ${state}`}
                  >
                    <span
                      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        answered && isCorrect
                          ? "bg-success text-white"
                          : answered && isChosen
                            ? "bg-danger text-white"
                            : "bg-surface-3 text-fg"
                      }`}
                      aria-hidden
                    >
                      {answered && isCorrect ? <Check className="size-4" /> : answered && isChosen ? <X className="size-4" /> : letters[pos]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-fg">
                        <span className="sr-only">
                          Alternativa {letters[pos]}
                          {answered ? (isCorrect ? " (correta)" : isChosen ? " (sua resposta, incorreta)" : "") : ""}:{" "}
                        </span>
                        {opt.text}
                      </span>
                      {answered && (
                        <span className={`mt-1 block text-sm ${isCorrect ? "text-success" : isChosen ? "text-danger" : "text-muted"}`}>
                          {isCorrect ? "Correta — " : "Incorreta — "}
                          <span className="text-fg/80">{opt.why}</span>
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div aria-live="polite">
            {answered && (
              <div
                className={`mt-5 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 ${
                  chosen === 0 ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                }`}
              >
                {chosen === 0 ? <CircleCheck className="size-5" aria-hidden /> : <CircleX className="size-5" aria-hidden />}
                <p className="font-semibold">{chosen === 0 ? "Acertou!" : "Não foi dessa vez."}</p>
                {mod && (
                  <Link href={`/roteiro/${mod.slug}`} className="ml-auto text-sm font-medium text-fg underline">
                    Revisar módulo {mod.number}
                  </Link>
                )}
              </div>
            )}
          </div>

          {answered && (
            <div className="mt-5 flex justify-end">
              <button
                ref={nextRef}
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent shadow-card"
              >
                {isLast ? "Ver resultado" : "Próxima"} <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------------
function Results({
  session,
  onRetryWrong,
  onRestart,
}: {
  session: Session;
  onRetryWrong: (qs: QuizQuestion[]) => void;
  onRestart: () => void;
}) {
  const answeredItems = session.items.filter((_, i) => session.answers[i] !== null);
  const correct = session.items.filter((_, i) => session.answers[i] === 0).length;
  const wrong = session.items
    .map((it, i) => ({ it, chosen: session.answers[i] }))
    .filter((x) => x.chosen !== 0);
  const total = session.items.length;
  const pct = total ? correct / total : 0;
  const seconds = Math.round(((session.finishedAt ?? session.startedAt) - session.startedAt) / 1000);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const verdict =
    pct >= 0.9 ? "Excelente! Pronto para a prova." : pct >= 0.7 ? "Muito bom — revise os erros abaixo." : pct >= 0.5 ? "No caminho — volte aos módulos dos erros." : "Vale revisar o roteiro e tentar de novo.";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-3xl border border-line bg-surface p-6 text-center shadow-card">
        <Trophy className="mx-auto size-10 text-warning" aria-hidden />
        <h2 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-3xl font-extrabold outline-none">
          {correct} de {total} acertos
        </h2>
        <p className="mt-1 text-lg text-muted">
          {Math.round(pct * 100)}% · {formatClock(seconds)}
          {session.mode === "simulado" ? " · simulado" : ""}
        </p>
        <p className="mt-2 text-fg">{verdict}</p>
        {answeredItems.length < total && (
          <p className="mt-1 text-sm text-muted">
            {total - answeredItems.length} questão(ões) ficaram sem resposta e contam como erro.
          </p>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {wrong.length > 0 && (
            <button
              type="button"
              onClick={() => onRetryWrong(wrong.map((w) => w.it.q))}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent"
            >
              <RotateCcw className="size-4" aria-hidden /> Refazer os erros ({wrong.length})
            </button>
          )}
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold text-fg"
          >
            <ListChecks className="size-4" aria-hidden /> Nova sessão
          </button>
        </div>
      </section>

      {wrong.length > 0 && (
        <section aria-labelledby="erros-h">
          <h2 id="erros-h" className="font-display text-xl font-bold">
            Para revisar
          </h2>
          <ol className="mt-3 space-y-3">
            {wrong.map(({ it, chosen }) => {
              const mod = getModule(it.q.module);
              return (
                <li
                  key={it.q.id}
                  className="rounded-2xl border border-line bg-surface p-4"
                  style={{ ["--mod" as string]: mod?.color }}
                >
                  <p className="mod-text text-xs font-bold">
                    Módulo {mod?.number} · {mod?.shortTitle}
                  </p>
                  <p className="mt-1 font-semibold text-fg">{it.q.question}</p>
                  {chosen !== null && (
                    <p className="mt-2 text-sm text-danger">
                      <X className="mr-1 inline size-4" aria-hidden />
                      Sua resposta: {it.q.options[chosen].text} <span className="text-muted">— {it.q.options[chosen].why}</span>
                    </p>
                  )}
                  <p className="mt-1 text-sm text-success">
                    <Check className="mr-1 inline size-4" aria-hidden />
                    Correta: {it.q.options[0].text} <span className="text-muted">— {it.q.options[0].why}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <SourceBadge source={it.q.source} slides={it.q.slides} size="xs" />
                    {mod && (
                      <Link href={`/roteiro/${mod.slug}`} className="text-sm font-medium text-accent underline">
                        Ir para o módulo
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}

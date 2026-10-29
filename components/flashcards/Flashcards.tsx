"use client";

import { ArrowLeft, ArrowRight, Check, PartyPopper, RefreshCw, RotateCcw, Shuffle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flashcards } from "@/content/flashcards";
import { getModule, modules } from "@/content/modules";
import { resetCards, setCardStatus, useProgress, type ProgressState } from "@/lib/progress";
import { shuffle } from "@/lib/shuffle";
import type { Flashcard } from "@/lib/types";
import { SourceBadge } from "../SourceBadge";

/** Quantas posições à frente um cartão “Revisar” volta na fila. */
const REVIEW_GAP = 3;

interface Session {
  queue: string[];
  total: number;
  known: number;
  reviews: number;
}

const byId = new Map(flashcards.map((c) => [c.id, c]));

/** Ordem inicial: marcados “Revisar” primeiro, depois os novos e, por fim, os “Sei”. */
function buildQueue(cards: Flashcard[], s: ProgressState) {
  const review = cards.filter((c) => s.cards[c.id] === "revisar");
  const fresh = cards.filter((c) => !s.cards[c.id]);
  const known = cards.filter((c) => s.cards[c.id] === "sei");
  return [...shuffle(review), ...shuffle(fresh), ...shuffle(known)].map((c) => c.id);
}

export function Flashcards() {
  const progress = useProgress();
  const [moduleFilter, setModuleFilter] = useState("todos");
  const [onlyReview, setOnlyReview] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const filtered = useMemo(() => {
    let list = moduleFilter === "todos" ? flashcards : flashcards.filter((c) => c.module === moduleFilter);
    if (onlyReview) list = list.filter((c) => progress.cards[c.id] === "revisar");
    return list;
  }, [moduleFilter, onlyReview, progress.cards]);

  const scope = moduleFilter === "todos" ? flashcards : flashcards.filter((c) => c.module === moduleFilter);
  const stats = {
    sei: scope.filter((c) => progress.cards[c.id] === "sei").length,
    revisar: scope.filter((c) => progress.cards[c.id] === "revisar").length,
  };

  const start = () => {
    const queue = buildQueue(filtered, progress);
    setSession({ queue, total: queue.length, known: 0, reviews: 0 });
  };

  if (session) {
    return <Deck session={session} setSession={setSession} onExit={() => setSession(null)} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section aria-labelledby="fc-config" className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
        <h2 id="fc-config" className="font-display text-xl font-bold">
          Escolher o baralho
        </h2>
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-fg">Módulo</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip active={moduleFilter === "todos"} onClick={() => setModuleFilter("todos")} color="var(--accent)">
              Todos ({flashcards.length})
            </Chip>
            {modules.map((m) => {
              const n = flashcards.filter((c) => c.module === m.slug).length;
              if (!n) return null;
              return (
                <Chip key={m.slug} active={moduleFilter === m.slug} onClick={() => setModuleFilter(m.slug)} color={m.color}>
                  {m.number}. {m.shortTitle} ({n})
                </Chip>
              );
            })}
          </div>
        </fieldset>
        <label className="mt-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={onlyReview}
            onChange={(e) => setOnlyReview(e.target.checked)}
            className="size-5 accent-[var(--accent)]"
          />
          <span className="text-sm text-fg">Somente os marcados “Revisar”</span>
        </label>
        <button
          type="button"
          onClick={start}
          disabled={filtered.length === 0}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent shadow-card disabled:opacity-50 sm:w-auto"
        >
          <Shuffle className="size-4" aria-hidden /> Começar ({filtered.length} {filtered.length === 1 ? "cartão" : "cartões"})
        </button>
        {filtered.length === 0 && onlyReview && (
          <p className="mt-2 text-sm text-muted">Nenhum cartão marcado “Revisar” neste filtro. 🎉</p>
        )}
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-card">
          <h2 className="font-display text-lg font-bold">Neste filtro</h2>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-success-soft px-2 py-2.5">
              <dt className="text-xs text-success">Sei</dt>
              <dd className="font-display text-xl font-bold tabular-nums">{stats.sei}</dd>
            </div>
            <div className="rounded-xl bg-warning-soft px-2 py-2.5">
              <dt className="text-xs text-warning">Revisar</dt>
              <dd className="font-display text-xl font-bold tabular-nums">{stats.revisar}</dd>
            </div>
            <div className="rounded-xl bg-surface-2 px-2 py-2.5">
              <dt className="text-xs text-muted">Novos</dt>
              <dd className="font-display text-xl font-bold tabular-nums">{scope.length - stats.sei - stats.revisar}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => resetCards(scope.map((c) => c.id))}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted hover:bg-surface-2 hover:text-fg"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Zerar marcações deste filtro
          </button>
        </div>
        <div className="rounded-3xl border border-line bg-surface-2 p-5 text-sm text-muted">
          <p className="font-semibold text-fg">Repetição simples</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Os marcados “Revisar” aparecem primeiro na próxima sessão.</li>
            <li>“Revisar” devolve o cartão {REVIEW_GAP} posições à frente na fila; “Sei” o retira.</li>
            <li>Atalhos: Espaço vira · ← Revisar · → Sei.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Chip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{ ["--mod" as string]: color }}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active ? "mod-tint font-semibold text-fg" : "border-line bg-surface text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function Deck({
  session,
  setSession,
  onExit,
}: {
  session: Session;
  setSession: (s: Session) => void;
  onExit: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const card = session.queue.length ? byId.get(session.queue[0]) : undefined;
  const mod = card ? getModule(card.module) : undefined;
  const done = session.total - session.queue.length;

  const mark = useCallback(
    (status: "sei" | "revisar") => {
      if (!card) return;
      setCardStatus(card.id, status);
      const rest = session.queue.slice(1);
      if (status === "sei") {
        setSession({ ...session, queue: rest, known: session.known + 1 });
      } else {
        const pos = Math.min(REVIEW_GAP, rest.length);
        setSession({
          ...session,
          queue: [...rest.slice(0, pos), card.id, ...rest.slice(pos)],
          reviews: session.reviews + 1,
        });
      }
      setFlipped(false);
      cardRef.current?.focus();
    },
    [card, session, setSession],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !card) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "SELECT") return;
      if (e.key === " " && tag !== "BUTTON") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight" && flipped) {
        e.preventDefault();
        mark("sei");
      } else if (e.key === "ArrowLeft" && flipped) {
        e.preventDefault();
        mark("revisar");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, flipped, mark]);

  if (!card) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-line bg-surface p-8 text-center shadow-card">
        <PartyPopper className="mx-auto size-10 text-accent" aria-hidden />
        <h2 className="mt-3 font-display text-2xl font-extrabold">Baralho concluído!</h2>
        <p className="mt-2 text-muted">
          {session.total} cartões dominados nesta sessão · {session.reviews} revisões no caminho.
        </p>
        <button
          type="button"
          onClick={onExit}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent"
        >
          <RefreshCw className="size-4" aria-hidden /> Nova sessão
        </button>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-xl" style={{ ["--mod" as string]: mod?.color }}>
      <div className="mb-3 flex items-center gap-3 text-sm">
        <span className="font-semibold text-fg tabular-nums">
          {done} de {session.total} dominados
        </span>
        <span className="text-muted tabular-nums">· {session.queue.length} na fila</span>
        <button type="button" onClick={onExit} className="ml-auto rounded-lg px-2 py-1 text-muted hover:bg-surface-2 hover:text-fg">
          Sair
        </button>
      </div>
      <div
        className="mb-5 h-2 overflow-hidden rounded-full bg-surface-3"
        role="progressbar"
        aria-label="Cartões dominados"
        aria-valuemin={0}
        aria-valuemax={session.total}
        aria-valuenow={done}
      >
        <div className="h-full rounded-full bg-success transition-[width]" style={{ width: `${(done / session.total) * 100}%` }} />
      </div>

      <div className="flip-scene">
        <button
          ref={cardRef}
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="flip-card relative block h-80 w-full rounded-3xl text-left sm:h-72"
          data-flipped={flipped}
          aria-label={flipped ? "Cartão virado: resposta visível. Clique para ver a pergunta." : "Clique para ver a resposta."}
        >
          <span className="flip-face mod-tint absolute inset-0 flex flex-col rounded-3xl border-2 p-6 shadow-card" aria-hidden={flipped}>
            <span className="mod-text text-xs font-bold">
              Módulo {mod?.number} · {mod?.shortTitle}
            </span>
            <span className="flex flex-1 items-center justify-center text-center font-display text-2xl leading-snug font-bold text-balance text-fg">
              {card.front}
            </span>
            <span className="text-center text-xs text-muted">Toque para virar</span>
          </span>
          <span
            className="flip-face flip-back absolute inset-0 flex flex-col rounded-3xl border-2 border-[var(--mod)] bg-surface p-6 shadow-card"
            aria-hidden={!flipped}
          >
            <span className="mod-text text-xs font-bold">Resposta</span>
            <span className="flex flex-1 items-center justify-center text-center text-lg leading-relaxed text-fg">{card.back}</span>
            <span className="flex justify-center">
              <SourceBadge source={card.source} slides={card.slides} size="xs" />
            </span>
          </span>
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {flipped ? `Resposta: ${card.back}` : `Pergunta: ${card.front}`}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => mark("revisar")}
          disabled={!flipped}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-warning/60 bg-warning-soft px-4 py-3.5 font-semibold text-fg disabled:opacity-40"
        >
          <ArrowLeft className="size-4" aria-hidden /> Revisar
        </button>
        <button
          type="button"
          onClick={() => mark("sei")}
          disabled={!flipped}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-success/60 bg-success-soft px-4 py-3.5 font-semibold text-fg disabled:opacity-40"
        >
          <Check className="size-4" aria-hidden /> Sei <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      {!flipped && <p className="mt-2 text-center text-xs text-muted">Vire o cartão para marcar.</p>}
    </div>
  );
}

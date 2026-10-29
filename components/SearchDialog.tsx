"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookMarked, FileText, GalleryVerticalEnd, Hash, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { search, type SearchEntry, type SearchKind } from "@/lib/search";
import { Rich } from "./Rich";

const kindLabel: Record<SearchKind, string> = {
  modulo: "Módulo",
  topico: "Tópico",
  glossario: "Glossário",
  flashcard: "Flashcard",
};

const kindIcon: Record<SearchKind, typeof FileText> = {
  modulo: BookMarked,
  topico: Hash,
  glossario: FileText,
  flashcard: GalleryVerticalEnd,
};

const suggestions = ["fantasma", "camada", "mento", "Frankfurt", "brinco", "hioide", "Estrela"];

export function SearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg sm:px-3"
        aria-label="Buscar (Ctrl+K)"
        aria-haspopup="dialog"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">Buscar</span>
        <kbd className="hidden rounded border border-line bg-surface-2 px-1.5 font-sans text-[0.7rem] text-muted md:inline">
          Ctrl K
        </kbd>
      </button>
      <AnimatePresence>{open && <SearchPanel onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previous = useRef<Element | null>(null);
  const router = useRouter();
  const listId = useId();
  const results = useMemo(() => search(query), [query]);
  const safeActive = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    previous.current = document.activeElement;
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      if (previous.current instanceof HTMLElement) previous.current.focus();
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${safeActive}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [safeActive]);

  const go = useCallback(
    (e: SearchEntry) => {
      onClose();
      router.push(e.href);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((safeActive + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((safeActive - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter" && results[safeActive]) {
      e.preventDefault();
      go(results[safeActive]);
    } else if (e.key === "Tab") {
      // mantém o foco dentro do diálogo
      const focusables = e.currentTarget.querySelectorAll<HTMLElement>("input, button, a[href]");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-3 pt-[8vh] backdrop-blur-sm sm:p-6 sm:pt-[12vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar no material"
        className="flex max-h-[80dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        initial={{ y: -12, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -12, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2 border-b border-line px-3">
          <Search className="size-5 shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Buscar tópicos, glossário e flashcards…"
            className="h-14 w-full min-w-0 bg-transparent text-base text-fg outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${safeActive}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
            aria-label="Fechar busca"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain">
          {query.trim() === "" ? (
            <div className="p-4">
              <p className="mb-2 text-sm text-muted">Sugestões:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm text-fg hover:border-accent/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">
                Dica: a busca ignora acentos — “angulo” encontra “ângulo”. Use ↑ ↓ e Enter.
              </p>
            </div>
          ) : results.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted" role="status">
              Nada encontrado para “{query}”.
            </p>
          ) : (
            <ul ref={listRef} id={listId} role="listbox" aria-label="Resultados" className="p-2">
              {results.map((r, i) => {
                const Icon = kindIcon[r.kind];
                return (
                  <li
                    key={r.id}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === safeActive}
                    data-index={i}
                  >
                    <Link
                      href={r.href}
                      onClick={() => onClose()}
                      onMouseEnter={() => setActive(i)}
                      tabIndex={-1}
                      className={`flex gap-3 rounded-xl px-3 py-2.5 ${
                        i === safeActive ? "bg-surface-2" : ""
                      }`}
                      style={{ ["--mod" as string]: r.color }}
                    >
                      <span className="mod-tint mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border">
                        <Icon className="mod-text size-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-medium text-fg">{r.title}</span>
                          <span className="text-xs text-muted">
                            {kindLabel[r.kind]}
                            {r.area ? ` · ${r.area}` : ""}
                          </span>
                        </span>
                        <span className="line-clamp-2 text-sm text-muted">
                          <Rich text={r.snippet} />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

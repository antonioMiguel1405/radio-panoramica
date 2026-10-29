"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { MindNode } from "@/content/mindmap";
import { getModule } from "@/content/modules";
import { Rich } from "../Rich";
import { SourceBadge } from "../SourceBadge";

const kindLabel = { root: "Visão geral", module: "Módulo", topic: "Tópico", point: "Ponto-chave" } as const;

interface Props {
  node: MindNode;
  parentLabel?: string;
  expanded: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
}

/** Painel lateral (desktop) / gaveta inferior (celular) com os detalhes do nó. */
export function NodeDrawer({ node, parentLabel, expanded, onClose, onSelect, onExpand }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mod = node.moduleSlug ? getModule(node.moduleSlug) : undefined;
  const href = mod ? `/roteiro/${mod.slug}${node.topicId ? `#${node.topicId}` : ""}` : "/roteiro";

  useEffect(() => {
    headingRef.current?.focus();
  }, [node.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="drawer-title"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-x-2 bottom-2 z-20 flex max-h-[62%] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl lg:inset-x-auto lg:top-3 lg:right-3 lg:bottom-3 lg:max-h-none lg:w-[24rem]"
      style={{ ["--mod" as string]: node.color }}
    >
      <div className="mod-bar h-1.5 shrink-0" />
      <div className="flex items-start gap-2 border-b border-line px-4 pt-3 pb-3">
        <div className="min-w-0 flex-1">
          <p className="mod-text text-xs font-bold tracking-wide uppercase">
            {kindLabel[node.kind]}
            {parentLabel && node.kind !== "module" ? <span className="font-medium normal-case text-muted"> · {parentLabel}</span> : null}
          </p>
          <h2 id="drawer-title" ref={headingRef} tabIndex={-1} className="mt-0.5 font-display text-lg leading-snug font-bold outline-none">
            {node.label}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
          aria-label="Fechar detalhes"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 text-[0.95rem]">
        {node.kind === "point" ? (
          <>
            <p className="leading-relaxed text-fg">
              <Rich text={node.text ?? node.label} />
            </p>
            {node.source && <SourceBadge source={node.source} slides={node.slides} />}
          </>
        ) : (
          node.text && (
            <p className="leading-relaxed text-fg">
              <Rich text={node.text} />
            </p>
          )
        )}

        {node.kind === "module" && mod && (
          <div>
            <p className="mb-1.5 text-sm font-semibold text-fg">Objetivos</p>
            <ul className="space-y-1 text-sm text-muted">
              {mod.objectives.map((o) => (
                <li key={o} className="flex gap-2">
                  <span aria-hidden className="mod-bar mt-2 size-1.5 shrink-0 rounded-full" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        {node.children.length > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-semibold text-fg">
              {node.kind === "root" ? "Módulos" : node.kind === "module" ? "Tópicos" : "Pontos-chave"}
            </p>
            <ul className="space-y-1">
              {node.children.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-surface-2"
                    style={{ ["--mod" as string]: c.color }}
                  >
                    <span aria-hidden className="mod-bar mt-1.5 size-2 shrink-0 rounded-full" />
                    <span className="min-w-0 flex-1 text-fg">{c.label}</span>
                    {c.kind === "point" && c.source && (
                      <span className={`shrink-0 text-[0.7rem] ${c.source === "aula" ? "text-accent-strong" : "text-complement"}`}>
                        {c.source === "aula" ? "aula" : "compl."}
                      </span>
                    )}
                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line bg-surface-2 px-4 py-3">
        {node.children.length > 0 && !expanded && node.kind !== "root" && (
          <button
            type="button"
            onClick={() => onExpand(node.id)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-fg hover:border-accent/60"
          >
            Expandir no mapa
          </button>
        )}
        {node.kind !== "root" && (
          <Link
            href={href}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-on-accent"
          >
            Ir para o módulo <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </motion.aside>
  );
}

import { flashcards } from "@/content/flashcards";
import { glossary } from "@/content/glossary";
import { getModule, modules } from "@/content/modules";
import { plain } from "./format";
import type { Source } from "./types";

export type SearchKind = "modulo" | "topico" | "glossario" | "flashcard";

export interface SearchEntry {
  id: string;
  kind: SearchKind;
  title: string;
  snippet: string;
  href: string;
  color: string;
  context: string;
  /** Módulo ou área exibida no resultado. */
  area: string;
  source?: Source;
  slides?: number[];
  haystack: string;
  titleKey: string;
}

/** Minúsculas e sem acentos: “Câmara” → “camara”. */
export function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function entry(e: Omit<SearchEntry, "haystack" | "titleKey">): SearchEntry {
  return {
    ...e,
    titleKey: normalize(e.title),
    haystack: normalize(`${e.title} ${e.snippet} ${e.context}`),
  };
}

let cache: SearchEntry[] | null = null;

export function getIndex(): SearchEntry[] {
  if (cache) return cache;
  const list: SearchEntry[] = [];
  for (const m of modules) {
    list.push(
      entry({
        id: `m:${m.slug}`,
        kind: "modulo",
        title: `Módulo ${m.number} — ${m.title}`,
        snippet: m.summary,
        href: `/roteiro/${m.slug}`,
        color: m.color,
        context: m.objectives.join(" "),
        area: "",
      }),
    );
    for (const t of m.topics) {
      list.push(
        entry({
          id: `t:${m.slug}:${t.id}`,
          kind: "topico",
          title: t.title,
          snippet: t.summary,
          href: `/roteiro/${m.slug}#${t.id}`,
          color: m.color,
          area: m.shortTitle,
          context: `${m.shortTitle} ${t.points.map((p) => `${p.label} ${plain(p.text)}`).join(" ")}`,
          source: t.points[0]?.source,
        }),
      );
    }
  }
  for (const g of glossary) {
    const m = g.module ? getModule(g.module) : undefined;
    list.push(
      entry({
        id: `g:${g.term}`,
        kind: "glossario",
        title: g.term,
        snippet: g.definition,
        href: m ? `/roteiro/${m.slug}` : "/roteiro",
        color: m?.color ?? "#64748b",
        context: m?.shortTitle ?? "",
        area: m?.shortTitle ?? "",
        source: g.source,
        slides: g.slides,
      }),
    );
  }
  for (const f of flashcards) {
    const m = getModule(f.module);
    list.push(
      entry({
        id: `f:${f.id}`,
        kind: "flashcard",
        title: f.front,
        snippet: f.back,
        href: "/flashcards",
        color: m?.color ?? "#64748b",
        context: m?.shortTitle ?? "",
        area: m?.shortTitle ?? "",
        source: f.source,
        slides: f.slides,
      }),
    );
  }
  cache = list;
  return list;
}

/** Busca simples por termos (todos devem aparecer), com pontuação por título. */
export function search(query: string, limit = 30): SearchEntry[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const results: { e: SearchEntry; score: number }[] = [];
  for (const e of getIndex()) {
    if (!terms.every((t) => e.haystack.includes(t))) continue;
    let score = 0;
    for (const t of terms) {
      if (e.titleKey.startsWith(t)) score += 6;
      else if (e.titleKey.includes(t)) score += 3;
      else score += 1;
    }
    if (e.kind === "modulo") score += 1;
    if (e.kind === "glossario") score += 0.5;
    results.push({ e, score });
  }
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.e);
}

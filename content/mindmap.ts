import type { Source } from "@/lib/types";
import { meta } from "./meta";
import { modules } from "./modules";

/**
 * Árvore do mapa mental — DERIVADA automaticamente de `modules.ts`
 * (raiz → módulos → tópicos → pontos-chave). Nunca edite à mão.
 */
export type MindKind = "root" | "module" | "topic" | "point";

export interface MindNode {
  id: string;
  kind: MindKind;
  label: string;
  color: string;
  moduleSlug?: string;
  topicId?: string;
  text?: string;
  source?: Source;
  slides?: number[];
  children: MindNode[];
}

export const ROOT_COLOR = "#0b7480";

export const mindmap: MindNode = {
  id: "root",
  kind: "root",
  label: meta.titulo,
  color: ROOT_COLOR,
  text: meta.subtitulo,
  children: modules.map((m) => ({
    id: `m:${m.slug}`,
    kind: "module",
    label: `${m.number}. ${m.shortTitle}`,
    color: m.color,
    moduleSlug: m.slug,
    text: m.summary,
    children: m.topics.map((t) => ({
      id: `t:${m.slug}:${t.id}`,
      kind: "topic",
      label: t.title,
      color: m.color,
      moduleSlug: m.slug,
      topicId: t.id,
      text: t.summary,
      children: t.points.map((p, i) => ({
        id: `p:${m.slug}:${t.id}:${i}`,
        kind: "point",
        label: p.label,
        color: m.color,
        moduleSlug: m.slug,
        topicId: t.id,
        text: p.text,
        source: p.source,
        slides: p.slides,
        children: [],
      })),
    })),
  })),
};

/** Índice plano de todos os nós por id. */
export function indexMindmap(root: MindNode = mindmap) {
  const map = new Map<string, MindNode>();
  const walk = (n: MindNode) => {
    map.set(n.id, n);
    n.children.forEach(walk);
  };
  walk(root);
  return map;
}

"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { memo, useContext } from "react";
import { MindMapContext } from "./context";
import type { MindFlowNode } from "./layout";

const hidden = { opacity: 0, pointerEvents: "none" as const, width: 1, height: 1, minWidth: 0, minHeight: 0, border: 0 };
const center = { ...hidden, left: "50%", top: "50%", transform: "translate(-50%, -50%)" };

function MindNodeViewBase({ data }: NodeProps<MindFlowNode>) {
  const { node, side, hasChildren, expanded, selected, depth, mode } = data;
  const ctx = useContext(MindMapContext);
  const isRoot = node.kind === "root";
  const count = node.children.length;

  const toggleIcon = expanded ? (
    <Minus className="size-3.5" aria-hidden />
  ) : side === "left" && mode === "arvore" ? (
    <ChevronLeft className="size-3.5" aria-hidden />
  ) : mode === "arvore" ? (
    <ChevronRight className="size-3.5" aria-hidden />
  ) : (
    <Plus className="size-3.5" aria-hidden />
  );

  const toggle = hasChildren && !isRoot && (
    <button
      type="button"
      className="nodrag nopan inline-flex h-8 min-w-8 shrink-0 items-center justify-center gap-0.5 rounded-lg border border-line bg-surface px-1.5 text-xs font-semibold text-muted hover:text-fg"
      aria-expanded={expanded}
      aria-label={`${expanded ? "Recolher" : "Expandir"} “${node.label}” (${count} ${count === 1 ? "item" : "itens"})`}
      onClick={(e) => {
        e.stopPropagation();
        ctx.toggle(node.id);
      }}
    >
      {toggleIcon}
      {!expanded && <span className="tabular-nums">{count}</span>}
    </button>
  );

  const body = (
    <button
      type="button"
      onClick={() => ctx.select(node.id)}
      className="nodrag nopan min-w-0 flex-1 rounded-lg text-left"
      aria-label={`${node.label} — abrir detalhes`}
    >
      <span
        className={`block leading-snug ${
          isRoot
            ? "font-display text-lg font-extrabold text-white"
            : depth === 1
              ? "font-display text-[0.95rem] font-bold text-fg"
              : depth === 2
                ? "text-sm font-semibold text-fg"
                : "text-[0.82rem] text-fg"
        }`}
      >
        {node.label}
      </span>
      {node.kind === "point" && node.source && (
        <span
          className={`mt-0.5 block text-[0.65rem] font-medium ${
            node.source === "aula" ? "text-accent-strong" : "text-complement"
          }`}
        >
          {node.source === "aula" ? "Da aula" : "Complementar"}
        </span>
      )}
    </button>
  );

  return (
    <div
      className={`group relative flex items-center gap-2 rounded-xl border px-2.5 py-2 shadow-card transition-shadow ${
        isRoot ? "border-transparent px-4 py-3" : "mod-tint"
      } ${selected ? "ring-2 ring-[var(--focus)] ring-offset-2 ring-offset-[var(--bg)]" : ""}`}
      style={{
        ["--mod" as string]: node.color,
        background: isRoot ? `linear-gradient(135deg, ${node.color}, #0e4f57)` : undefined,
        borderLeftWidth: !isRoot && mode === "arvore" && side !== "left" ? 5 : undefined,
        borderRightWidth: !isRoot && mode === "arvore" && side === "left" ? 5 : undefined,
        borderLeftColor: !isRoot && side !== "left" ? node.color : undefined,
        borderRightColor: !isRoot && side === "left" ? node.color : undefined,
      }}
    >
      {side === "left" && mode === "arvore" ? (
        <>
          {toggle}
          {body}
        </>
      ) : (
        <>
          {body}
          {toggle}
        </>
      )}

      <Handle id="t-l" type="target" position={Position.Left} style={hidden} isConnectable={false} />
      <Handle id="t-r" type="target" position={Position.Right} style={hidden} isConnectable={false} />
      <Handle id="t-c" type="target" position={Position.Top} style={center} isConnectable={false} />
      <Handle id="s-r" type="source" position={Position.Right} style={hidden} isConnectable={false} />
      <Handle id="s-l" type="source" position={Position.Left} style={hidden} isConnectable={false} />
      <Handle id="s-c" type="source" position={Position.Bottom} style={center} isConnectable={false} />
    </div>
  );
}

export const MindNodeView = memo(MindNodeViewBase);

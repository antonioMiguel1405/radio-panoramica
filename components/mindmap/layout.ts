import { hierarchy, tree, type HierarchyPointNode } from "d3-hierarchy";
import type { Edge, Node } from "@xyflow/react";
import type { MindKind, MindNode } from "@/content/mindmap";

export type LayoutMode = "arvore" | "radial";
export type Side = "right" | "left" | "center";

export const NODE_WIDTH: Record<MindKind, number> = {
  root: 230,
  module: 214,
  topic: 206,
  point: 214,
};

/** Distância horizontal entre níveis (modo árvore). */
const COL = [0, 290, 260, 260];
/** Distância vertical mínima entre irmãos (modo árvore). */
const ROW = 66;

export interface MindFlowData extends Record<string, unknown> {
  node: MindNode;
  side: Side;
  mode: LayoutMode;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  selected: boolean;
}

export type MindFlowNode = Node<MindFlowData, "mind">;

interface Vis {
  node: MindNode;
  children: Vis[];
}

function visible(node: MindNode, expanded: Set<string>): Vis {
  return {
    node,
    children: expanded.has(node.id) ? node.children.map((c) => visible(c, expanded)) : [],
  };
}

function colX(depth: number) {
  let x = 0;
  for (let d = 1; d <= depth; d++) x += COL[Math.min(d, COL.length - 1)];
  return x;
}

export function computeLayout(
  root: MindNode,
  expanded: Set<string>,
  mode: LayoutMode,
  selectedId: string | null,
): { nodes: MindFlowNode[]; edges: Edge[] } {
  const vis = visible(root, expanded);
  const nodes: MindFlowNode[] = [];
  const edges: Edge[] = [];

  const pushNode = (v: Vis, x: number, y: number, side: Side, depth: number) => {
    nodes.push({
      id: v.node.id,
      type: "mind",
      position: { x, y },
      data: {
        node: v.node,
        side,
        mode,
        depth,
        hasChildren: v.node.children.length > 0,
        expanded: expanded.has(v.node.id),
        selected: v.node.id === selectedId,
      },
      style: { width: NODE_WIDTH[v.node.kind] },
      // Dimensões de referência (minimapa) até o React Flow medir o nó.
      initialWidth: NODE_WIDTH[v.node.kind],
      initialHeight: v.node.kind === "root" ? 64 : 50,
      draggable: false,
      selectable: false,
      focusable: false,
    });
  };

  const pushEdge = (parent: MindNode, child: MindNode, side: Side, depth: number) => {
    const radial = mode === "radial";
    edges.push({
      id: `${parent.id}->${child.id}`,
      source: parent.id,
      target: child.id,
      sourceHandle: radial ? "s-c" : side === "left" ? "s-l" : "s-r",
      targetHandle: radial ? "t-c" : side === "left" ? "t-r" : "t-l",
      type: radial ? "straight" : "default",
      style: {
        stroke: child.color,
        strokeWidth: depth <= 1 ? 3 : depth === 2 ? 2 : 1.5,
        strokeOpacity: depth <= 1 ? 0.85 : 0.6,
      },
      focusable: false,
      selectable: false,
    });
  };

  if (mode === "arvore") {
    pushNode(vis, 0, 0, "center", 0);
    // Divide os módulos entre direita e esquerda equilibrando as folhas visíveis.
    const leafCount = (v: Vis): number =>
      v.children.length ? v.children.reduce((sum, c) => sum + leafCount(c), 0) : 1;
    const counts = vis.children.map(leafCount);
    const total = counts.reduce((a, b) => a + b, 0);
    let half = Math.ceil(vis.children.length / 2);
    let best = Infinity;
    for (let i = 1, acc = 0; i < vis.children.length; i++) {
      acc += counts[i - 1];
      const diff = Math.abs(total - 2 * acc);
      if (diff < best) {
        best = diff;
        half = i;
      }
    }
    const sides: [Side, Vis[]][] = [
      ["right", vis.children.slice(0, half)],
      ["left", vis.children.slice(half)],
    ];
    for (const [side, kids] of sides) {
      if (kids.length === 0) continue;
      const h = hierarchy<Vis>({ node: vis.node, children: kids }, (d) => d.children);
      const laid = tree<Vis>()
        .nodeSize([ROW, 1])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.3))(h);
      laid.each((d) => {
        if (d.depth === 0) return;
        const x = (side === "left" ? -1 : 1) * colX(d.depth);
        pushNode(d.data, x, d.x, side, d.depth);
        if (d.parent) pushEdge(d.parent.data.node, d.data.node, side, d.depth);
      });
    }
    return { nodes, edges };
  }

  // Radial
  const h = hierarchy<Vis>(vis, (d) => d.children);
  const leaves = h.leaves().length;
  const maxDepth = Math.max(1, h.height);
  // Espaço suficiente no anel externo para nós de ~210 px sem sobreposição.
  const step = Math.max(280, (leaves * 118) / (2 * Math.PI * maxDepth));
  const laid = tree<Vis>()
    .size([2 * Math.PI, 1])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / Math.max(1, a.depth))(h);
  laid.each((d: HierarchyPointNode<Vis>) => {
    const r = d.depth * step;
    const a = d.x - Math.PI / 2;
    pushNode(d.data, r * Math.cos(a), r * Math.sin(a), d.depth === 0 ? "center" : "right", d.depth);
    if (d.parent) pushEdge(d.parent.data.node, d.data.node, "center", d.depth);
  });
  return { nodes, edges };
}

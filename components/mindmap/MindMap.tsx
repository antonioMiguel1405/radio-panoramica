"use client";

import "@xyflow/react/dist/style.css";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  getViewportForBounds,
  useNodesInitialized,
  useReactFlow,
  type FitViewOptions,
  type NodeChange,
} from "@xyflow/react";
import { AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Crosshair, Download, Expand, GitFork, LoaderCircle, Orbit, Shrink } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { indexMindmap, mindmap, type MindNode } from "@/content/mindmap";
import { MindMapContext } from "./context";
import { computeLayout, type LayoutMode, type MindFlowNode } from "./layout";
import { MindNodeView } from "./MindNodeView";
import { NodeDrawer } from "./NodeDrawer";

type Padding = NonNullable<FitViewOptions["padding"]>;

const nodeTypes = { mind: MindNodeView };
const index = indexMindmap();
const parentOf = new Map<string, string>();
index.forEach((n) => n.children.forEach((c) => parentOf.set(c.id, n.id)));
const allExpandable = [...index.values()].filter((n) => n.children.length > 0).map((n) => n.id);

function ancestors(id: string) {
  const list: string[] = [];
  let p = parentOf.get(id);
  while (p) {
    list.push(p);
    p = parentOf.get(p);
  }
  return list;
}

function useMediaQuery(q: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(q);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(q).matches,
    () => false,
  );
}

/** Nó inicial vindo da URL (?no=m:slug), lido uma única vez no cliente. */
function initialFromUrl(): string | null {
  try {
    const id = new URLSearchParams(window.location.search).get("no");
    return id && index.has(id) ? id : null;
  } catch {
    return null;
  }
}

type Focus = { kind: "all" } | { kind: "node"; id: string } | null;

function MindMapInner() {
  const [initial] = useState(initialFromUrl);
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>(["root"]);
    if (initial) {
      ancestors(initial).forEach((a) => s.add(a));
      s.add(initial);
    }
    return s;
  });
  const [selected, setSelected] = useState<string | null>(initial);
  const [mode, setMode] = useState<LayoutMode>("arvore");
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const focus = useRef<Focus>(initial ? { kind: "node", id: initial } : { kind: "all" });
  const wrapper = useRef<HTMLDivElement>(null);
  const rf = useReactFlow();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const initialized = useNodesInitialized();

  const layout = useMemo(
    () => computeLayout(mindmap, expanded, mode, selected),
    [expanded, mode, selected],
  );
  const edges = layout.edges;

  // Nós controlados: guardamos as medidas reportadas pelo React Flow
  // (necessárias para fitView, minimapa e useNodesInitialized).
  const [measured, setMeasured] = useState<Record<string, { width: number; height: number }>>({});
  const onNodesChange = useCallback((changes: NodeChange<MindFlowNode>[]) => {
    setMeasured((prev) => {
      let next = prev;
      for (const c of changes) {
        if (c.type !== "dimensions" || !c.dimensions) continue;
        const old = prev[c.id];
        if (old && old.width === c.dimensions.width && old.height === c.dimensions.height) continue;
        if (next === prev) next = { ...prev };
        next[c.id] = { width: c.dimensions.width, height: c.dimensions.height };
      }
      return next;
    });
  }, []);
  const nodes = useMemo(
    () => layout.nodes.map((n) => (measured[n.id] ? { ...n, measured: measured[n.id] } : n)),
    [layout.nodes, measured],
  );

  // Ajusta a câmera depois que o layout muda (expandir, recolher, trocar layout).
  useEffect(() => {
    const f = focus.current;
    // Só enquadra depois que o React Flow mediu os nós novos.
    if (!f || !initialized) return;
    // O pedido só é consumido quando o timer dispara (novas medições podem reiniciá-lo).
    const t = window.setTimeout(() => {
      focus.current = null;
      if (f.kind === "all") {
        rf.fitView({ padding: 0.12, duration: 450, maxZoom: 1 });
      } else {
        const n = index.get(f.id);
        const ids = [f.id, ...(expanded.has(f.id) ? (n?.children.map((c) => c.id) ?? []) : [])];
        // Reserva espaço para o painel de detalhes aberto (embaixo no celular, à direita no desktop).
        const padding: Padding = selected
          ? desktop
            ? { top: "8%", bottom: "8%", left: "6%", right: "420px" }
            : { top: "6%", bottom: "64%", x: "6%" }
          : 0.35;
        rf.fitView({ nodes: ids.map((id) => ({ id })), padding, duration: 450, maxZoom: 1.1 });
      }
    }, 60);
    return () => window.clearTimeout(t);
  }, [nodes, rf, expanded, selected, desktop, initialized]);

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // recolhe também os descendentes
        const walk = (n: MindNode) => n.children.forEach((c) => (next.delete(c.id), walk(c)));
        const node = index.get(id);
        if (node) walk(node);
      } else next.add(id);
      return next;
    });
    focus.current = { kind: "node", id };
  }, []);

  const select = useCallback((id: string) => {
    setSelected(id);
    const anc = ancestors(id);
    setExpanded((prev) => {
      if (anc.every((a) => prev.has(a))) return prev;
      const next = new Set(prev);
      anc.forEach((a) => next.add(a));
      return next;
    });
    focus.current = { kind: "node", id };
  }, []);

  const expandAll = () => {
    setExpanded(new Set(allExpandable));
    focus.current = { kind: "all" };
    setStatus("Todos os ramos expandidos.");
  };
  const collapseAll = () => {
    setExpanded(new Set(["root"]));
    setSelected(null);
    focus.current = { kind: "all" };
    setStatus("Ramos recolhidos.");
  };
  const center = () => rf.fitView({ padding: 0.12, duration: 450, maxZoom: 1 });
  const switchMode = (m: LayoutMode) => {
    if (m === mode) return;
    setMode(m);
    focus.current = { kind: "all" };
  };

  const exportPng = async () => {
    const viewportEl = wrapper.current?.querySelector<HTMLElement>(".react-flow__viewport");
    if (!viewportEl) return;
    setExporting(true);
    setStatus("Gerando imagem…");
    try {
      // método da instância: respeita o nodeOrigin centralizado
      const bounds = rf.getNodesBounds(rf.getNodes());
      const pad = 80;
      const scale = 2;
      const width = Math.min(6000, Math.ceil(bounds.width + pad * 2));
      const height = Math.min(6000, Math.ceil(bounds.height + pad * 2));
      const vp = getViewportForBounds(bounds, width, height, 0.1, 2, 0.04);
      const bg = getComputedStyle(document.body).backgroundColor || "#ffffff";
      const dataUrl = await toPng(viewportEl, {
        backgroundColor: bg,
        width,
        height,
        pixelRatio: scale,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`,
        },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "mapa-mental-radiografia-panoramica.png";
      a.click();
      setStatus("Imagem PNG baixada.");
    } catch {
      setStatus("Não foi possível exportar a imagem neste navegador.");
    } finally {
      setExporting(false);
    }
  };

  const selectedNode = selected ? index.get(selected) : undefined;
  const parentLabel = selected ? index.get(parentOf.get(selected) ?? "")?.label : undefined;
  const actions = useMemo(() => ({ toggle, select }), [toggle, select]);
  const btn =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-2 text-sm font-medium text-fg hover:border-accent/60 disabled:opacity-60 sm:px-3";

  return (
    <MindMapContext.Provider value={actions}>
      <div className="no-print flex flex-wrap items-center gap-1.5 border-b border-line bg-surface px-3 py-2 sm:gap-2">
        <div className="mr-auto flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-0.5" role="group" aria-label="Layout do mapa">
          {(
            [
              ["arvore", "Árvore", GitFork],
              ["radial", "Radial", Orbit],
            ] as const
          ).map(([m, label, Icon]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => switchMode(m)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium sm:px-2.5 ${
                mode === m ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
              }`}
            >
              <Icon className="hidden size-4 sm:block" aria-hidden />
              {label}
            </button>
          ))}
        </div>
        <button type="button" className={btn} onClick={expandAll} aria-label="Expandir tudo">
          <Expand className="size-4" aria-hidden />
          <span className="hidden sm:inline">Expandir tudo</span>
        </button>
        <button type="button" className={btn} onClick={collapseAll} aria-label="Recolher tudo">
          <Shrink className="size-4" aria-hidden />
          <span className="hidden sm:inline">Recolher tudo</span>
        </button>
        <button type="button" className={btn} onClick={center} aria-label="Centralizar">
          <Crosshair className="size-4" aria-hidden />
          <span className="hidden sm:inline">Centralizar</span>
        </button>
        <button type="button" className={btn} onClick={exportPng} disabled={exporting} aria-label="Exportar PNG">
          {exporting ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Download className="size-4" aria-hidden />}
          <span className="hidden sm:inline">Exportar PNG</span>
        </button>
        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>
      </div>

      <div ref={wrapper} className="relative h-[calc(100dvh-8.5rem)] min-h-[26rem] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          nodeOrigin={[0.5, 0.5]}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          minZoom={0.15}
          maxZoom={2}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
          onPaneClick={() => setSelected(null)}
          aria-label="Mapa mental interativo"
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="var(--border)" />
          <Controls showInteractive={false} position="bottom-left" aria-label="Zoom do mapa" />
          {desktop && (
            <MiniMap
              pannable
              zoomable
              position="bottom-right"
              nodeColor={(n) => (n.data as { node: MindNode }).node.color}
              nodeStrokeWidth={0}
              ariaLabel="Minimapa"
              style={{ marginRight: selectedNode ? "25.5rem" : undefined }}
            />
          )}
        </ReactFlow>

        <AnimatePresence>
          {selectedNode && (
            <NodeDrawer
              key={selectedNode.id}
              node={selectedNode}
              parentLabel={parentLabel}
              expanded={expanded.has(selectedNode.id)}
              onClose={() => setSelected(null)}
              onSelect={select}
              onExpand={(id) => {
                if (!expanded.has(id)) toggle(id);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </MindMapContext.Provider>
  );
}

export default function MindMap() {
  return (
    <ReactFlowProvider>
      <MindMapInner />
    </ReactFlowProvider>
  );
}

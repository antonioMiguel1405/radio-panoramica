"use client";

import dynamic from "next/dynamic";

/** O React Flow depende de medidas do navegador: renderiza só no cliente. */
const MindMap = dynamic(() => import("./MindMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center text-muted" role="status">
      Carregando o mapa mental…
    </div>
  ),
});

export function MindMapClient() {
  return <MindMap />;
}

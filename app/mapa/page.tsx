import type { Metadata } from "next";
import { MindMapClient } from "@/components/mindmap/MindMapClient";

export const metadata: Metadata = {
  title: "Mapa mental",
  description:
    "Mapa mental interativo de Radiografia Panorâmica: módulos, tópicos e pontos-chave com selo de origem e slides de referência.",
};

export default function MapaPage() {
  return (
    <div>
      <h1 className="sr-only">Mapa mental — Radiografia Panorâmica</h1>
      <p className="sr-only">
        Use os botões de cada nó para expandir ou recolher ramos e toque no texto do nó para abrir os detalhes.
      </p>
      <MindMapClient />
    </div>
  );
}

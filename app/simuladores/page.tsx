import type { Metadata } from "next";
import { Suspense } from "react";
import { Simulators } from "@/components/simuladores/Simulators";

export const metadata: Metadata = {
  title: "Simuladores",
  description:
    "Simuladores visuais de Radiografia Panorâmica: camada de imagem, imagem real × fantasma, erros de posicionamento e anatomia.",
};

export default function SimuladoresPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent">Aprender vendo</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Simuladores</h1>
        <p className="mt-3 text-lg text-muted">
          Esquemas SVG originais e interativos para os três conceitos centrais da panorâmica — e um
          treino de anatomia. Funcionam com toque, mouse e teclado.
        </p>
      </header>
      <Suspense fallback={<p className="text-muted" role="status">Carregando simuladores…</p>}>
        <Simulators />
      </Suspense>
    </div>
  );
}

import type { Metadata } from "next";
import { Flashcards } from "@/components/flashcards/Flashcards";
import { flashcards } from "@/content/flashcards";

export const metadata: Metadata = {
  title: "Flashcards",
  description: `${flashcards.length} flashcards de Radiografia Panorâmica com repetição simples.`,
};

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent">Memorização</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Flashcards</h1>
        <p className="mt-3 text-lg text-muted">
          Leia a pergunta, responda mentalmente, vire o cartão e seja honesto: “Sei” ou “Revisar”. Os
          cartões para revisar voltam antes.
        </p>
      </header>
      <Flashcards />
    </div>
  );
}

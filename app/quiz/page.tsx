import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import { quiz } from "@/content/quiz";

export const metadata: Metadata = {
  title: "Quiz",
  description: `${quiz.length} questões comentadas de Radiografia Panorâmica, com filtro por módulo e simulado cronometrado.`,
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent">Prática ativa</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Quiz com correção comentada</h1>
        <p className="mt-3 text-lg text-muted">
          {quiz.length} questões de múltipla escolha baseadas no conteúdo do roteiro. Depois de cada
          resposta, veja por que a certa é certa — e por que as outras não são.
        </p>
      </header>
      <Quiz />
    </div>
  );
}

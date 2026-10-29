import type { Trail, TrailStep } from "@/lib/types";
import { getModule } from "./modules";

const mod = (slug: string, trail: string, minutes?: number): TrailStep => {
  const m = getModule(slug);
  if (!m) throw new Error(`Módulo inexistente na trilha: ${slug}`);
  return {
    id: `${trail}:mod:${slug}`,
    label: `Módulo ${m.number} — ${m.shortTitle}`,
    href: `/roteiro/${slug}`,
    minutes: minutes ?? m.minutes,
    kind: "modulo",
  };
};

const step = (
  trail: string,
  id: string,
  label: string,
  href: string,
  minutes: number,
  kind: TrailStep["kind"],
): TrailStep => ({ id: `${trail}:${id}`, label, href, minutes, kind });

/** Planos de revisão para a prova. */
export const trilhas: Trail[] = [
  {
    id: "relampago",
    name: "Revisão relâmpago",
    duration: "1 h",
    description: "Para a véspera: só o que mais cai, com prática ativa.",
    blocks: [
      {
        title: "Núcleo da prova (35 min)",
        steps: [
          step("relampago", "revisao", "Ler a folha de revisão", "/revisao", 10, "revisao"),
          mod("imagens-reais-e-fantasmas", "relampago", 10),
          mod("erros-de-posicionamento", "relampago", 10),
          step("relampago", "sim-erros", "Simulador: desafio dos erros", "/simuladores?aba=erros", 5, "simulador"),
        ],
      },
      {
        title: "Prática (25 min)",
        steps: [
          step("relampago", "simulado", "Quiz: simulado de 10 questões", "/quiz", 15, "quiz"),
          step("relampago", "cards", "Flashcards: revisar os marcados", "/flashcards", 10, "flashcards"),
        ],
      },
    ],
  },
  {
    id: "completa",
    name: "Revisão completa",
    duration: "1 dia",
    description: "Todos os módulos em três blocos, com prática ao fim de cada um.",
    blocks: [
      {
        title: "Manhã — fundamentos",
        steps: [
          step("completa", "mapa", "Visão geral no mapa mental", "/mapa", 10, "mapa"),
          mod("conceito", "completa"),
          mod("aparelho", "completa"),
          mod("camada-de-imagem", "completa"),
          mod("angulo-negativo", "completa"),
          step("completa", "sim-camada", "Simulador: camada de imagem", "/simuladores?aba=camada", 10, "simulador"),
        ],
      },
      {
        title: "Tarde — técnica e imagem",
        steps: [
          mod("posicionamento", "completa"),
          mod("erros-de-posicionamento", "completa"),
          mod("imagens-reais-e-fantasmas", "completa"),
          step("completa", "sim-fantasma", "Simulador: imagem real × fantasma", "/simuladores?aba=fantasma", 10, "simulador"),
          step("completa", "sim-erros", "Simulador: erros de posicionamento", "/simuladores?aba=erros", 10, "simulador"),
          mod("anatomia", "completa"),
        ],
      },
      {
        title: "Noite — clínica e fixação",
        steps: [
          mod("vantagens", "completa"),
          mod("desvantagens", "completa"),
          mod("indicacoes", "completa"),
          mod("interpretacao", "completa"),
          step("completa", "quiz", "Quiz: todas as questões", "/quiz", 30, "quiz"),
          step("completa", "cards", "Flashcards: baralho completo", "/flashcards", 20, "flashcards"),
          step("completa", "revisao", "Folha de revisão", "/revisao", 15, "revisao"),
        ],
      },
    ],
  },
  {
    id: "tres-dias",
    name: "Estudo em 3 dias",
    duration: "3 dias",
    description: "Estudo espaçado: um bloco por dia, revisando o anterior com flashcards.",
    blocks: [
      {
        title: "Dia 1 — como a imagem se forma",
        steps: [
          step("tres-dias", "d1-mapa", "Mapa mental: visão geral", "/mapa", 10, "mapa"),
          mod("conceito", "tres-dias"),
          mod("aparelho", "tres-dias"),
          mod("camada-de-imagem", "tres-dias"),
          mod("angulo-negativo", "tres-dias"),
          step("tres-dias", "d1-sim", "Simulador: camada de imagem", "/simuladores?aba=camada", 10, "simulador"),
          step("tres-dias", "d1-cards", "Flashcards dos módulos 1–4", "/flashcards", 10, "flashcards"),
        ],
      },
      {
        title: "Dia 2 — técnica, erros e imagens",
        steps: [
          step("tres-dias", "d2-cards", "Flashcards: revisar marcados do dia 1", "/flashcards", 10, "flashcards"),
          mod("posicionamento", "tres-dias"),
          mod("erros-de-posicionamento", "tres-dias"),
          mod("imagens-reais-e-fantasmas", "tres-dias"),
          mod("anatomia", "tres-dias"),
          step("tres-dias", "d2-sims", "Simuladores: fantasma, erros e anatomia", "/simuladores?aba=fantasma", 25, "simulador"),
          step("tres-dias", "d2-quiz", "Quiz por módulo (5 a 8)", "/quiz", 20, "quiz"),
        ],
      },
      {
        title: "Dia 3 — clínica e simulado",
        steps: [
          mod("vantagens", "tres-dias"),
          mod("desvantagens", "tres-dias"),
          mod("indicacoes", "tres-dias"),
          mod("interpretacao", "tres-dias"),
          step("tres-dias", "d3-simulado", "Quiz: simulado cronometrado", "/quiz", 20, "quiz"),
          step("tres-dias", "d3-erros", "Revisar os erros do simulado", "/quiz", 10, "quiz"),
          step("tres-dias", "d3-revisao", "Folha de revisão (imprimir)", "/revisao", 15, "revisao"),
        ],
      },
    ],
  },
];

export const trailMinutes = (t: Trail) =>
  t.blocks.reduce((sum, b) => sum + b.steps.reduce((s, st) => s + st.minutes, 0), 0);

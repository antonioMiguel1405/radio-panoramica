import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContentTable } from "@/components/ContentTable";
import { ErrorTable } from "@/components/ErrorTable";
import { PrintButton } from "@/components/PrintButton";
import { Rich } from "@/components/Rich";
import { meta } from "@/content/meta";
import { getModule } from "@/content/modules";
import { formatSlides } from "@/lib/format";
import type { KeyPoint, Module } from "@/lib/types";

export const metadata: Metadata = {
  title: "Revisão rápida",
  description: "Folha de revisão de Radiografia Panorâmica, otimizada para impressão em A4 ou PDF.",
};

function mod(slug: string): Module {
  const m = getModule(slug);
  if (!m) throw new Error(`Módulo inexistente: ${slug}`);
  return m;
}

function topic(slug: string, id: string) {
  const t = mod(slug).topics.find((x) => x.id === id);
  if (!t) throw new Error(`Tópico inexistente: ${slug}/${id}`);
  return t;
}

/** Marcador compacto de origem: A (aula, com slides) ou C (complementar). */
function Tag({ p }: { p: Pick<KeyPoint, "source" | "slides"> }) {
  const slides = formatSlides(p.slides)?.replace(/^Slides? /, "");
  return (
    <sup
      className={`ml-1 rounded px-1 text-[0.62rem] font-semibold ${
        p.source === "aula" ? "bg-accent-soft text-accent-strong" : "bg-complement-soft text-complement"
      }`}
      title={p.source === "aula" ? "Da aula" : "Complementar"}
    >
      {p.source === "aula" ? `A${slides ? ` ${slides}` : ""}` : "C"}
    </sup>
  );
}

function Points({ points }: { points: KeyPoint[] }) {
  return (
    <ul className="space-y-1">
      {points.map((p, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--mod)]" />
          <span>
            <Rich text={p.text} />
            <Tag p={p} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Section({
  n,
  title,
  color,
  children,
  className = "",
}: {
  n: number;
  title: string;
  color: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-line bg-surface p-4 print:rounded-none print:border-0 print:border-t print:p-0 print:pt-2 ${className}`}
      style={{ ["--mod" as string]: color }}
    >
      <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold print:text-[12pt]">
        <span className="inline-flex size-6 items-center justify-center rounded-md bg-[var(--mod)] text-xs font-bold text-white">
          {n}
        </span>
        {title}
      </h2>
      <div className="space-y-2 text-[0.92rem] leading-snug print:text-[9.5pt]">{children}</div>
    </section>
  );
}

export default function RevisaoPage() {
  const m7 = mod("imagens-reais-e-fantasmas");
  const m8 = mod("anatomia");
  const pegadinhas = ["camada-de-imagem", "angulo-negativo", "posicionamento", "erros-de-posicionamento", "imagens-reais-e-fantasmas", "desvantagens", "indicacoes"]
    .flatMap((s) => mod(s).callouts.filter((c) => c.variant === "pegadinha"));
  const mnemonicos = ["camada-de-imagem", "angulo-negativo", "posicionamento", "erros-de-posicionamento", "imagens-reais-e-fantasmas", "desvantagens"]
    .flatMap((s) => mod(s).callouts.filter((c) => c.variant === "mnemonico"));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 print:mb-3">
        <div>
          <p className="text-sm font-semibold text-accent print:text-[9pt]">
            {meta.disciplina} · {meta.instituicao}
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight print:text-[18pt]">
            Folha de revisão — {meta.titulo}
          </h1>
          <p className="mt-1 text-sm text-muted print:text-[8.5pt]">
            Baseada na aula do {meta.professor}. Legenda: <Tag p={{ source: "aula", slides: [17] }} /> da aula (nº do
            slide) · <Tag p={{ source: "complementar" }} /> complementar.
          </p>
        </div>
        <PrintButton />
      </header>

      <div className="space-y-4 print:space-y-3">
        <Section n={1} title="Formação da imagem e camada de imagem" color={mod("conceito").color}>
          <Points points={[...topic("conceito", "principio").points, ...topic("conceito", "centro-movel").points]} />
          <Points
            points={[
              ...topic("camada-de-imagem", "definicao-camada").points,
              ...topic("camada-de-imagem", "espessura").points,
              ...topic("camada-de-imagem", "ampliacao").points,
              ...topic("camada-de-imagem", "medidas").points,
            ]}
          />
        </Section>

        <Section n={2} title="Ângulo negativo" color={mod("angulo-negativo").color}>
          <Points points={mod("angulo-negativo").topics.flatMap((t) => t.points)} />
        </Section>

        <Section n={3} title="Posicionamento correto" color={mod("posicionamento").color}>
          <Points points={[...topic("posicionamento", "preparo").points, ...topic("posicionamento", "exposicao").points]} />
          {topic("posicionamento", "planos").table && (
            <ContentTable table={topic("posicionamento", "planos").table!} color={mod("posicionamento").color} />
          )}
        </Section>

        <Section n={4} title="Erros de posicionamento: causa → aspecto → correção" color={mod("erros-de-posicionamento").color} className="print-break-before">
          <p className="text-xs text-muted">
            Causas: aula (slides 24–41 e 56), exceto língua, movimento e colar (complementar). Aspectos na imagem:
            complementar, exceto objetos metálicos (slide 56).
          </p>
          <ErrorTable compact />
        </Section>

        <Section n={5} title="Imagem real × fantasma × dupla" color={m7.color}>
          <Points
            points={[
              ...topic("imagens-reais-e-fantasmas", "real").points,
              ...topic("imagens-reais-e-fantasmas", "fantasma").points,
              ...topic("imagens-reais-e-fantasmas", "multiplas").points,
              ...topic("imagens-reais-e-fantasmas", "brinco").points,
            ]}
          />
          {topic("imagens-reais-e-fantasmas", "classificacao").table && (
            <ContentTable table={topic("imagens-reais-e-fantasmas", "classificacao").table!} color={m7.color} />
          )}
        </Section>

        <Section n={6} title="Anatomia radiográfica (estruturas a reconhecer)" color={m8.color}>
          <div className="grid gap-2 sm:grid-cols-2 print:grid-cols-2">
            {m8.topics.map((t) => (
              <p key={t.id}>
                <strong>{t.title}:</strong> {t.points.map((p) => p.label).join(", ")}.
                <Tag p={t.points[0]} />
              </p>
            ))}
          </div>
        </Section>

        <div className="grid gap-4 md:grid-cols-3 print:grid-cols-3 print:gap-3">
          {(["vantagens", "desvantagens", "indicacoes"] as const).map((slug, i) => {
            const m = mod(slug);
            const points = m.topics.filter((t) => t.id !== "estrela").flatMap((t) => t.points);
            return (
              <Section key={slug} n={7 + i} title={m.title} color={m.color}>
                <ul className="space-y-1">
                  {points.map((p, k) => (
                    <li key={k} className="flex gap-1.5">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--mod)]" />
                      <span>
                        <Rich text={p.text} />
                        <Tag p={p} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            );
          })}
        </div>

        <Section n={10} title="Evidência da aula: Estrela et al., J Endod 2008" color={mod("desvantagens").color}>
          <Points points={topic("desvantagens", "estrela").points} />
        </Section>

        <Section n={11} title="Interpretação sistemática (6 passos)" color={mod("interpretacao").color}>
          <Points points={mod("interpretacao").topics.flatMap((t) => t.points)} />
        </Section>

        <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section n={12} title="Pegadinhas de prova" color="#ef4444">
            <ul className="space-y-1.5">
              {pegadinhas.map((c) => (
                <li key={c.title}>
                  <strong>{c.title}.</strong> <Rich text={c.text} />
                  <Tag p={c} />
                </li>
              ))}
            </ul>
          </Section>
          <Section n={13} title="Mnemônicos" color="#a855f7">
            <ul className="space-y-1.5">
              {mnemonicos.map((c) => (
                <li key={c.title}>
                  <strong>{c.title}:</strong> <Rich text={c.text} />
                  <Tag p={c} />
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted print:mt-3 print:text-[7.5pt]">
        {meta.titulo} — material de estudo produzido com auxílio de IA, baseado na aula do {meta.professor} (
        {meta.instituicao}). Grupo: {meta.grupo.join(", ")}.
      </p>
    </div>
  );
}

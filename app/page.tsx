import {
  ArrowRight,
  FileText,
  FlaskConical,
  GalleryVerticalEnd,
  ListChecks,
  Network,
  Route,
} from "lucide-react";
import Link from "next/link";
import { HeroArt } from "@/components/home/HeroArt";
import { OverallProgress } from "@/components/home/OverallProgress";
import { TrailPlanner } from "@/components/home/TrailPlanner";
import { ModuleIcon } from "@/components/ModuleIcon";
import { SourceBadge } from "@/components/SourceBadge";
import { flashcards } from "@/content/flashcards";
import { meta } from "@/content/meta";
import { modules, totalMinutes } from "@/content/modules";
import { quiz } from "@/content/quiz";
import { formatMinutes } from "@/lib/format";

const cards = [
  {
    href: "/mapa",
    title: "Mapa mental",
    text: "Todo o conteúdo numa árvore interativa: expanda, recolha e toque nos nós.",
    Icon: Network,
  },
  {
    href: "/roteiro",
    title: "Roteiro",
    text: `12 módulos com objetivos, pegadinhas e autoverificação (${formatMinutes(totalMinutes)}).`,
    Icon: Route,
  },
  {
    href: "/quiz",
    title: "Quiz",
    text: `${quiz.length} questões comentadas, filtro por módulo e simulado cronometrado.`,
    Icon: ListChecks,
  },
  {
    href: "/flashcards",
    title: "Flashcards",
    text: `${flashcards.length} cartões com “Sei” / “Revisar” e repetição simples.`,
    Icon: GalleryVerticalEnd,
  },
  {
    href: "/simuladores",
    title: "Simuladores",
    text: "Camada de imagem, real × fantasma, erros de posicionamento e anatomia.",
    Icon: FlaskConical,
  },
  {
    href: "/revisao",
    title: "Revisão rápida",
    text: "Folha de revisão densa, pronta para imprimir ou salvar em PDF.",
    Icon: FileText,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-sm font-semibold text-accent">
            {meta.disciplina} · {meta.instituicao}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
            {meta.titulo}
          </h1>
          <p className="mt-3 text-xl text-muted sm:text-2xl">{meta.subtitulo}</p>
          <p className="mt-4 max-w-xl text-fg/85">
            Estude pela aula do {meta.professor}: cada informação tem selo de origem e os números
            dos slides para você acompanhar.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <SourceBadge source="aula" slides={[17, 18]} />
            <SourceBadge source="complementar" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/roteiro/conceito"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent shadow-card transition-transform hover:-translate-y-0.5"
            >
              Começar o roteiro <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold text-fg hover:border-accent/60"
            >
              <Network className="size-4" aria-hidden /> Abrir mapa mental
            </Link>
          </div>
        </div>
        <HeroArt />
      </section>

      {/* Acessos */}
      <section aria-labelledby="acessos-h">
        <h2 id="acessos-h" className="sr-only">
          Acessos
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ href, title, text, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/60"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-display text-lg font-bold text-fg">
                    {title}
                    <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm text-muted">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Progresso + plano */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_1.35fr]">
        <div className="space-y-6">
          <OverallProgress />
          <section aria-labelledby="modulos-h" className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <h2 id="modulos-h" className="font-display text-lg font-bold">
              Os 12 módulos
            </h2>
            <ol className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {modules.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/roteiro/${m.slug}`}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-2"
                    style={{ ["--mod" as string]: m.color }}
                  >
                    <span className="mod-tint inline-flex size-7 shrink-0 items-center justify-center rounded-md border">
                      <ModuleIcon name={m.icon} className="mod-text size-3.5" />
                    </span>
                    <span className="text-fg">
                      <span className="text-muted tabular-nums">{m.number}.</span> {m.shortTitle}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <TrailPlanner />
      </div>
    </div>
  );
}

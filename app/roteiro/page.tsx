import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";
import { ModuleDoneBadge, ModulesBar } from "@/components/ModuleProgress";
import { moduleSlugs, modules, totalMinutes } from "@/content/modules";
import { formatMinutes } from "@/lib/format";

export const metadata: Metadata = {
  title: "Roteiro de estudos",
  description: "Os 12 módulos do roteiro de estudos de Radiografia Panorâmica, com objetivos, conteúdo e autoverificação.",
};

export default function RoteiroPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">Roteiro de estudos</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">12 módulos, do princípio à interpretação</h1>
        <p className="mt-3 text-lg text-muted">
          Cada módulo traz objetivos de prova, conteúdo em blocos curtos com selo de origem (aula ou
          complementar), pegadinhas, mnemônicos e perguntas de autoverificação.
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
          <Clock className="size-4" aria-hidden /> Tempo total estimado: {formatMinutes(totalMinutes)}
        </p>
      </header>

      <div className="mt-6 max-w-md">
        <ModulesBar slugs={moduleSlugs} />
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/roteiro/${m.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-[var(--mod)]"
              style={{ ["--mod" as string]: m.color }}
            >
              <div className="flex items-start gap-3">
                <span className="mod-tint inline-flex size-11 shrink-0 items-center justify-center rounded-xl border">
                  <ModuleIcon name={m.icon} className="mod-text size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted">Módulo {m.number}</p>
                  <h2 className="font-display text-lg leading-snug font-bold text-fg">{m.title}</h2>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted">{m.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden /> {m.minutes} min
                </span>
                <span>·</span>
                <span>{m.topics.length} tópicos</span>
                <ModuleDoneBadge slug={m.slug} />
                <ArrowRight
                  className="ml-auto size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

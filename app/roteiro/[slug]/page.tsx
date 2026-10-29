import { ArrowLeft, ArrowRight, ChevronDown, Clock, FlaskConical, Map, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnatomySlot } from "@/components/AnatomySlot";
import { Callout } from "@/components/Callout";
import { ContentTable } from "@/components/ContentTable";
import { ErrorTable } from "@/components/ErrorTable";
import { Figure } from "@/components/figures/Figures";
import { ModuleIcon } from "@/components/ModuleIcon";
import { ModuleCompleteToggle } from "@/components/ModuleProgress";
import { Rich } from "@/components/Rich";
import { SourceBadge } from "@/components/SourceBadge";
import { getModule, getModuleNeighbors, modules } from "@/content/modules";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/roteiro/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) return {};
  return { title: `Módulo ${m.number}: ${m.title}`, description: m.summary };
}

export default async function ModulePage({ params }: PageProps<"/roteiro/[slug]">) {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) notFound();
  const { prev, next } = getModuleNeighbors(slug);
  const style = { ["--mod" as string]: m.color };

  return (
    <article style={style}>
      {/* Cabeçalho do módulo */}
      <header className="mod-tint border-b">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <nav aria-label="Trilha de navegação" className="text-sm text-muted">
            <Link href="/roteiro" className="hover:text-fg hover:underline">
              Roteiro
            </Link>
            <span aria-hidden> / </span>
            <span aria-current="page">Módulo {m.number}</span>
          </nav>
          <div className="mt-4 flex items-start gap-4">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--mod)] text-white shadow-card">
              <ModuleIcon name={m.icon} className="size-7" />
            </span>
            <div className="min-w-0">
              <p className="mod-text text-sm font-bold">Módulo {m.number} de {modules.length}</p>
              <h1 className="font-display text-2xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
                {m.title}
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg text-fg/85">{m.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden /> {m.minutes} min de estudo
            </span>
            <Link
              href={`/mapa?no=m:${m.slug}`}
              className="no-print inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 hover:text-fg"
            >
              <Map className="size-4" aria-hidden /> Ver no mapa mental
            </Link>
            {m.simulator && (
              <Link
                href={`/simuladores?aba=${m.simulator.tab}`}
                className="no-print inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 hover:text-fg"
              >
                <FlaskConical className="size-4" aria-hidden /> {m.simulator.label}
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 space-y-10">
          {/* Objetivos */}
          <section aria-labelledby="objetivos" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <h2 id="objetivos" className="flex items-center gap-2 font-display text-lg font-bold">
              <Target className="mod-text size-5" aria-hidden /> Objetivos — na prova, saiba explicar:
            </h2>
            <ul className="mt-3 space-y-2">
              {m.objectives.map((o) => (
                <li key={o} className="flex gap-2.5 text-fg">
                  <span aria-hidden className="mod-bar mt-2 size-1.5 shrink-0 rounded-full" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tópicos */}
          {m.topics.map((t, ti) => (
            <section key={t.id} id={t.id} aria-labelledby={`${t.id}-h`} className="scroll-mt-24">
              <h2 id={`${t.id}-h`} className="flex items-baseline gap-3 font-display text-xl font-bold sm:text-2xl">
                <span className="mod-text text-base font-extrabold tabular-nums">
                  {m.number}.{ti + 1}
                </span>
                {t.title}
              </h2>
              <p className="mt-1 text-muted">{t.summary}</p>

              {slug === "anatomia" && t.figure === "anatomia" ? (
                <AnatomySlot />
              ) : (
                t.figure && <Figure id={t.figure} />
              )}

              {t.points.every((p) => p.text === p.label) ? (
                // Lista de nomes (ex.: estruturas anatômicas): formato compacto, um selo só.
                <div className="mt-4 rounded-xl border border-line bg-surface p-4">
                  <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                    {t.points.map((p) => (
                      <li key={p.label} className="flex items-center gap-2 text-fg">
                        <span aria-hidden className="mod-bar size-2 shrink-0 rounded-full" />
                        {p.label}
                      </li>
                    ))}
                  </ul>
                  <SourceBadge source={t.points[0].source} slides={t.points[0].slides} size="xs" className="mt-3" />
                </div>
              ) : (
                <ul className="prose-study mt-4 space-y-3">
                  {t.points.map((p, i) => (
                    <li key={i} className="flex gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                      <span aria-hidden className="mod-bar mt-2.5 size-2 shrink-0 rounded-full" />
                      <div className="min-w-0">
                        <p className="text-fg">
                          <Rich text={p.text} />
                        </p>
                        <SourceBadge source={p.source} slides={p.slides} size="xs" className="mt-1.5" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {t.table && <ContentTable table={t.table} color={m.color} />}
            </section>
          ))}

          {slug === "erros-de-posicionamento" && (
            <section id="tabela" aria-labelledby="tabela-h" className="scroll-mt-24">
              <h2 id="tabela-h" className="font-display text-xl font-bold sm:text-2xl">
                Tabela completa: causa → aspecto → correção
              </h2>
              <p className="mt-1 mb-4 text-muted">
                Causas conforme a aula; aspectos na imagem descritos pela literatura complementar.
              </p>
              <ErrorTable />
            </section>
          )}

          {/* Pegadinhas e mnemônicos */}
          {m.callouts.length > 0 && (
            <section id="destaques" aria-labelledby="destaques-h" className="scroll-mt-24">
              <h2 id="destaques-h" className="font-display text-xl font-bold sm:text-2xl">
                Pegadinhas, mnemônicos e dicas
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {m.callouts.map((c) => (
                  <Callout key={c.title} data={c} />
                ))}
              </div>
            </section>
          )}

          {/* Autoverificação */}
          <section id="autoverificacao" aria-labelledby="auto-h" className="scroll-mt-24">
            <h2 id="auto-h" className="font-display text-xl font-bold sm:text-2xl">
              Autoverificação
            </h2>
            <p className="mt-1 text-muted">Tente responder em voz alta antes de revelar.</p>
            <div className="mt-4 space-y-3">
              {m.selfCheck.map((s, i) => (
                <details key={i} className="group print-avoid rounded-xl border border-line bg-surface open:shadow-card">
                  <summary className="flex cursor-pointer list-none items-start gap-3 rounded-xl px-4 py-3 font-medium text-fg [&::-webkit-details-marker]:hidden">
                    <span className="mod-tint inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold tabular-nums">
                      {i + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{s.q}</span>
                    <ChevronDown
                      className="mt-1 size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                    <span className="sr-only">Mostrar resposta</span>
                  </summary>
                  <div className="border-t border-line px-4 py-3 pl-14 text-fg">
                    <p className="text-xs font-semibold tracking-wide text-success uppercase">Resposta</p>
                    <p className="mt-1">
                      <Rich text={s.a} />
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <ModuleCompleteToggle slug={m.slug} title={m.shortTitle} />

          {/* Navegação */}
          <nav aria-label="Módulos vizinhos" className="no-print grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/roteiro/${prev.slug}`}
                className="group rounded-2xl border border-line bg-surface p-4 hover:border-[var(--mod)]"
                style={{ ["--mod" as string]: prev.color }}
              >
                <span className="flex items-center gap-1 text-sm text-muted">
                  <ArrowLeft className="size-4" aria-hidden /> Anterior
                </span>
                <span className="mt-1 block font-semibold text-fg">
                  {prev.number}. {prev.shortTitle}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/roteiro/${next.slug}`}
                className="group rounded-2xl border border-line bg-surface p-4 text-right hover:border-[var(--mod)]"
                style={{ ["--mod" as string]: next.color }}
              >
                <span className="flex items-center justify-end gap-1 text-sm text-muted">
                  Próximo <ArrowRight className="size-4" aria-hidden />
                </span>
                <span className="mt-1 block font-semibold text-fg">
                  {next.number}. {next.shortTitle}
                </span>
              </Link>
            ) : (
              <Link href="/quiz" className="rounded-2xl border border-line bg-surface p-4 text-right hover:border-accent">
                <span className="flex items-center justify-end gap-1 text-sm text-muted">
                  Fim do roteiro <ArrowRight className="size-4" aria-hidden />
                </span>
                <span className="mt-1 block font-semibold text-fg">Testar no quiz</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Sumário lateral */}
        <aside className="no-print hidden lg:block" aria-label="Neste módulo">
          <div className="sticky top-24 rounded-2xl border border-line bg-surface p-4 text-sm">
            <p className="mb-2 font-semibold text-fg">Neste módulo</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#objetivos" className="text-muted hover:text-fg">
                  Objetivos
                </a>
              </li>
              {m.topics.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="flex gap-1.5 text-muted hover:text-fg">
                    <span className="tabular-nums">
                      {m.number}.{i + 1}
                    </span>
                    <span>{t.title}</span>
                  </a>
                </li>
              ))}
              {slug === "erros-de-posicionamento" && (
                <li>
                  <a href="#tabela" className="text-muted hover:text-fg">
                    Tabela completa
                  </a>
                </li>
              )}
              {m.callouts.length > 0 && (
                <li>
                  <a href="#destaques" className="text-muted hover:text-fg">
                    Pegadinhas e mnemônicos
                  </a>
                </li>
              )}
              <li>
                <a href="#autoverificacao" className="text-muted hover:text-fg">
                  Autoverificação
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

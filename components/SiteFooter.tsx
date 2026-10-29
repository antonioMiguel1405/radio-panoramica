import { meta } from "@/content/meta";
import { SourceBadge } from "./SourceBadge";

export function SiteFooter() {
  return (
    <footer className="site-footer mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-muted md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <p>
            Baseado na aula de Radiografia Panorâmica do {meta.professor} — {meta.instituicao}.
            Material de estudo produzido com auxílio de IA.
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <span>Legenda:</span>
            <SourceBadge source="aula" />
            <span>conteúdo dos slides</span>
            <SourceBadge source="complementar" />
            <span>literatura clássica de radiologia</span>
          </p>
          <p className="text-xs">
            Ilustrações: esquemas SVG originais e didáticos — não reproduzem imagens da aula.
          </p>
        </div>
        <div>
          <p className="font-medium text-fg">Grupo</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {meta.grupo.map((nome) => (
              <li key={nome}>{nome}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs">
            {meta.disciplina} · {meta.instituicao}
          </p>
        </div>
      </div>
    </footer>
  );
}

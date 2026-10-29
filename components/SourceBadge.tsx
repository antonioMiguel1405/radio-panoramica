import { BookOpen, Sparkles } from "lucide-react";
import { formatSlides } from "@/lib/format";
import type { Source } from "@/lib/types";

interface Props {
  source: Source;
  slides?: number[];
  size?: "sm" | "xs";
  className?: string;
}

/** Selo discreto de origem: “Da aula” (com slides) ou “Complementar”. */
export function SourceBadge({ source, slides, size = "sm", className = "" }: Props) {
  const slideText = source === "aula" ? formatSlides(slides) : null;
  const isAula = source === "aula";
  const pad = size === "xs" ? "px-1.5 py-0 text-[0.68rem]" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex max-w-full flex-wrap items-center gap-x-1 gap-y-0.5 rounded-full border font-medium leading-5 align-middle ${pad} ${
        isAula
          ? "border-accent/35 bg-accent-soft text-accent-strong"
          : "border-complement/35 bg-complement-soft text-complement"
      } ${className}`}
      title={
        isAula
          ? "Conteúdo dos slides da aula"
          : "Conteúdo complementar (literatura clássica de radiologia)"
      }
    >
      {isAula ? (
        <BookOpen aria-hidden className="size-3 shrink-0" />
      ) : (
        <Sparkles aria-hidden className="size-3 shrink-0" />
      )}
      <span>{isAula ? "Da aula" : "Complementar"}</span>
      {slideText && (
        <>
          <span aria-hidden className="opacity-50">
            ·
          </span>
          <span className="tabular-nums">{slideText}</span>
        </>
      )}
    </span>
  );
}

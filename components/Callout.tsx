import { Brain, Lightbulb, TriangleAlert } from "lucide-react";
import type { Callout as CalloutData } from "@/lib/types";
import { Rich } from "./Rich";
import { SourceBadge } from "./SourceBadge";

const styles = {
  pegadinha: {
    label: "Pegadinha de prova",
    Icon: TriangleAlert,
    box: "border-danger/40 bg-danger-soft",
    icon: "text-danger",
  },
  mnemonico: {
    label: "Mnemônico",
    Icon: Brain,
    box: "border-complement/40 bg-complement-soft",
    icon: "text-complement",
  },
  dica: {
    label: "Dica",
    Icon: Lightbulb,
    box: "border-warning/40 bg-warning-soft",
    icon: "text-warning",
  },
} as const;

export function Callout({ data }: { data: CalloutData }) {
  const s = styles[data.variant];
  return (
    <aside className={`print-avoid rounded-2xl border p-4 ${s.box}`} aria-label={`${s.label}: ${data.title}`}>
      <div className="flex items-start gap-3">
        <s.Icon className={`mt-0.5 size-5 shrink-0 ${s.icon}`} aria-hidden />
        <div className="min-w-0 space-y-1.5">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">{s.label}</p>
          <p className="font-display font-bold text-fg">{data.title}</p>
          <p className="text-[0.95rem] leading-relaxed text-fg">
            <Rich text={data.text} />
          </p>
          <SourceBadge source={data.source} slides={data.slides} size="xs" />
        </div>
      </div>
    </aside>
  );
}

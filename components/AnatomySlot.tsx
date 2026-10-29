import Link from "next/link";

/** Espaço do esquema anatômico interativo no Módulo 8. */
export function AnatomySlot() {
  return (
    <div className="my-6 rounded-2xl border border-dashed border-line bg-surface-2 p-5 text-sm text-muted">
      O esquema anatômico interativo fica em{" "}
      <Link href="/simuladores?aba=anatomia" className="font-medium text-accent underline">
        Simuladores → Anatomia
      </Link>
      .
    </div>
  );
}

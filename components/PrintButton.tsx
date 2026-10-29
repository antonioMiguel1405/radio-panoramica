"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent shadow-card"
    >
      <Printer className="size-4" aria-hidden /> Imprimir / Salvar PDF
    </button>
  );
}

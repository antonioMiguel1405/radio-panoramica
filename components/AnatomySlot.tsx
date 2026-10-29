import { AnatomyExplorer } from "./simuladores/AnatomyExplorer";

/** Esquema anatômico interativo do Módulo 8. */
export function AnatomySlot() {
  return (
    <div className="no-print my-6 rounded-2xl border border-line bg-surface p-4">
      <AnatomyExplorer compact />
    </div>
  );
}

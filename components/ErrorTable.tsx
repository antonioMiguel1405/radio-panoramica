import { positioningErrors } from "@/content/errors";
import { Rich } from "./Rich";
import { SourceBadge } from "./SourceBadge";

/** Tabela completa de erros de posicionamento (causa → aspecto → correção). */
export function ErrorTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className={`w-full border-collapse text-left ${compact ? "text-[0.8rem]" : "min-w-[40rem] text-sm"}`}>
        <caption className="sr-only">Erros de posicionamento: causa, aspecto na imagem e correção</caption>
        <thead className="bg-surface-2">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Erro (causa)</th>
            <th scope="col" className="px-3 py-2 font-semibold">Aspecto na imagem</th>
            <th scope="col" className="px-3 py-2 font-semibold">Correção</th>
          </tr>
        </thead>
        <tbody>
          {positioningErrors.map((e) => (
            <tr key={e.id} className="border-t border-line align-top">
              <th scope="row" className="px-3 py-2 font-medium">
                <span className="block font-semibold text-fg">{e.name}</span>
                <span className="block font-normal text-muted">{e.cause}</span>
                {!compact && <SourceBadge className="mt-1" size="xs" {...e.causeRef} />}
              </th>
              <td className="px-3 py-2">
                <Rich text={e.aspect} />
                {!compact && (
                  <div className="mt-1">
                    <SourceBadge size="xs" {...e.aspectRef} />
                  </div>
                )}
              </td>
              <td className="px-3 py-2">{e.correction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

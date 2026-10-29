import type { ContentTable as TableData } from "@/lib/types";
import { Rich } from "./Rich";
import { SourceBadge } from "./SourceBadge";

export function ContentTable({ table, color }: { table: TableData; color?: string }) {
  return (
    <figure className="print-avoid my-5">
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
          <caption className="border-b border-line bg-surface-2 px-3 py-2 text-left font-semibold text-fg">
            {table.caption}
          </caption>
          <thead>
            <tr style={color ? { ["--mod" as string]: color } : undefined}>
              {table.headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className={`border-b border-line px-3 py-2 font-semibold text-fg ${color ? "mod-tint" : "bg-surface"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="odd:bg-surface even:bg-surface-2/60">
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="border-t border-line px-3 py-2 align-top font-medium text-fg">
                      <Rich text={cell} />
                    </th>
                  ) : (
                    <td key={j} className="border-t border-line px-3 py-2 align-top text-fg">
                      <Rich text={cell} />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        <SourceBadge source={table.source} slides={table.slides} size="xs" />
        {table.note && <span>{table.note}</span>}
      </figcaption>
    </figure>
  );
}

import { SourceItem } from "@/types/tarif";
import { formatSourceLabel } from "@/lib/format";

export function SourcesList({ title, items }: { title: string; items: SourceItem[] }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
        Keine Quellen vorhanden.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item, index) => (
          <li key={`${item.document_name}-${index}`} className="rounded-2xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-800">{formatSourceLabel(item)}</p>
            {item.chunk_text ? (
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{item.chunk_text}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
import Card from "@/components/ui/Card";
import { SourceItem } from "@/types/chat";

type SourcesSectionProps = {
  gdlSources: SourceItem[];
  evgSources: SourceItem[];
};

function SourceColumn({
  title,
  sources
}: {
  title: string;
  sources: SourceItem[];
}) {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>

      {sources.length === 0 ? (
        <p className="text-zinc-500">Keine Quellen vorhanden.</p>
      ) : (
        <ul className="space-y-3">
          {sources.map((source, index) => (
            <li key={`${source.document}-${source.page ?? "x"}-${index}`} className="rounded-xl bg-zinc-50 p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-medium text-zinc-900">{source.document}</p>

                {source.union ? (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
                    {source.union}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                {source.tarif ? <span>Tarif: {source.tarif}</span> : null}
                {source.tarifType ? <span>Typ: {source.tarifType}</span> : null}
                {source.funktionsgruppe ? <span>FG: {source.funktionsgruppe}</span> : null}
                {source.page != null ? <span>Seite: {source.page}</span> : null}
                {source.paragraph != null ? <span>Abschnitt: {source.paragraph}</span> : null}
                {source.similarity != null ? (
                  <span>Similarity: {source.similarity}</span>
                ) : null}
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-700">{source.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function SourcesSection({
  gdlSources,
  evgSources
}: SourcesSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        Quellen
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <SourceColumn title="GDL-Quellen" sources={gdlSources} />
        <SourceColumn title="EVG-Quellen" sources={evgSources} />
      </div>
    </section>
  );
}
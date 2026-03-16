import Card from "@/components/ui/Card";
import { SourceItem } from "@/types/chat";

type SourcesSectionProps = {
  gdlSources: SourceItem[];
  evgSources: SourceItem[];
};

function SourceColumn({
  title,
  sources,
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
            <li key={index} className="rounded-xl bg-zinc-50 p-4">
              <p className="font-medium text-zinc-900">{source.document_name}</p>

              {source.snippet && (
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {source.snippet}
                </p>
              )}

              {source.paragraph_id && (
                <p className="mt-2 text-xs text-zinc-500">
                  Paragraph-ID: {source.paragraph_id}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function SourcesSection({
  gdlSources,
  evgSources,
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
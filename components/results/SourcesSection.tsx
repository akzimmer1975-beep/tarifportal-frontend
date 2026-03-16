import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { SourceItem } from "@/types/chat";

type SourcesSectionProps = {
  gdlSources: SourceItem[];
  evgSources: SourceItem[];
};

function SourceList({
  title,
  items,
}: {
  title: string;
  items: SourceItem[];
}) {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">Keine Quellen vorhanden.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="rounded-xl bg-zinc-50 p-4">
              <p className="font-medium text-zinc-900">{item.document_name}</p>

              {item.snippet && (
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {item.snippet}
                </p>
              )}

              {item.paragraph_id && (
                <p className="mt-2 text-xs text-zinc-500">
                  Paragraph-ID: {item.paragraph_id}
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
    <Section title="Quellen">
      <div className="grid gap-6 lg:grid-cols-2">
        <SourceList title="GDL-Quellen" items={gdlSources} />
        <SourceList title="EVG-Quellen" items={evgSources} />
      </div>
    </Section>
  );
}
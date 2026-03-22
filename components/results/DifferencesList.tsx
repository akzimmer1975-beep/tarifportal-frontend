import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

type DifferencesListProps = {
  gdlItems: string[];
  evgItems: string[];
};

function DiffColumn({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>

      {items.length === 0 ? (
        <p className="text-zinc-500">Keine Unterschiede gefunden.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="rounded-xl bg-zinc-50 p-4 text-zinc-800">
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function DifferencesList({
  gdlItems,
  evgItems
}: DifferencesListProps) {
  return (
    <Section title="Unterschiede">
      <div className="grid gap-6 lg:grid-cols-2">
        <DiffColumn title="GDL" items={gdlItems} />
        <DiffColumn title="EVG" items={evgItems} />
      </div>
    </Section>
  );
}
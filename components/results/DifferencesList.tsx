import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

type DifferencesListProps = {
  items: string[];
};

export default function DifferencesList({ items }: DifferencesListProps) {
  return (
    <Section title="Unterschiede">
      <Card>
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
    </Section>
  );
}
import Card from "@/components/ui/Card";

type TextListSectionProps = {
  title: string;
  items: string[];
};

export default function TextListSection({ title, items }: TextListSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h2>

      <Card>
        {items.length === 0 ? (
          <p className="text-zinc-500">Keine Einträge vorhanden.</p>
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
    </section>
  );
}
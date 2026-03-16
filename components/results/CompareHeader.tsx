import Card from "@/components/ui/Card";

type CompareHeaderProps = {
  query: string;
  kurzfazit: string;
};

export default function CompareHeader({
  query,
  kurzfazit,
}: CompareHeaderProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-500">Tariffrage</p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          {query}
        </h1>
      </div>

      <div className="rounded-xl bg-zinc-50 p-4">
        <p className="text-sm font-medium text-zinc-500">Kurzfazit</p>
        <p className="mt-2 text-base leading-7 text-zinc-800">
          {kurzfazit || "Kein Kurzfazit vorhanden."}
        </p>
      </div>
    </Card>
  );
}
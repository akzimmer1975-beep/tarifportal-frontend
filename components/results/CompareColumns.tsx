import Card from "@/components/ui/Card";

type CompareColumnsProps = {
  gdl: string;
  evg: string;
};

export default function CompareColumns({ gdl, evg }: CompareColumnsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <div className="border-b border-zinc-200 pb-3">
          <h2 className="text-xl font-semibold text-zinc-950">GDL</h2>
        </div>
        <p className="whitespace-pre-line leading-7 text-zinc-700">
          {gdl || "Keine GDL-Angaben vorhanden."}
        </p>
      </Card>

      <Card className="space-y-4">
        <div className="border-b border-zinc-200 pb-3">
          <h2 className="text-xl font-semibold text-zinc-950">EVG</h2>
        </div>
        <p className="whitespace-pre-line leading-7 text-zinc-700">
          {evg || "Keine EVG-Angaben vorhanden."}
        </p>
      </Card>
    </div>
  );
}
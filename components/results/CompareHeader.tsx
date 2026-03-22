"use client";

import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

type CompareHeaderProps = {
  query: string;
  kurzfazit: string;
};

export default function CompareHeader({ query, kurzfazit }: CompareHeaderProps) {
  const router = useRouter();

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Tariffrage</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">
            {query}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← Zurück
        </button>
      </div>

      <div className="rounded-xl bg-zinc-50 p-4">
        <p className="text-sm font-medium text-zinc-500">Kurzfazit</p>
        <p className="mt-2 leading-7 text-zinc-800">{kurzfazit}</p>
      </div>
    </Card>
  );
}
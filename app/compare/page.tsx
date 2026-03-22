"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { askTarifQuestion } from "@/lib/api";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await askTarifQuestion(query);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  if (loading) {
    return <div className="p-6">🔄 Lade Antwort...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">❌ {error}</div>;
  }

  if (!data) return null;

  const structured = data.structured;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Frage */}
        <div className="rounded-2xl border p-4 bg-gray-50">
          <p className="text-sm text-gray-500">Deine Frage</p>
          <p className="font-medium">{query}</p>
        </div>

        {/* Kurzfazit */}
        <div className="rounded-2xl border p-6 bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-2">📌 Kurzfazit</h2>
          <p>{structured?.kurzfazit}</p>
        </div>

        {/* Vergleich */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* GDL */}
          <div className="rounded-2xl border p-6 bg-blue-50">
            <h3 className="font-bold mb-2">GDL</h3>
            <p>{structured?.gdl}</p>
          </div>

          {/* EVG */}
          <div className="rounded-2xl border p-6 bg-green-50">
            <h3 className="font-bold mb-2">EVG</h3>
            <p>{structured?.evg}</p>
          </div>

        </div>

        {/* Unterschiede */}
        {structured?.unterschiede?.length > 0 && (
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-bold mb-3">⚖️ Unterschiede</h3>
            <ul className="list-disc pl-5 space-y-2">
              {structured.unterschiede.map((u: string, i: number) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Gemeinsamkeiten */}
        {structured?.gemeinsamkeiten?.length > 0 && (
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-bold mb-3">🤝 Gemeinsamkeiten</h3>
            <ul className="list-disc pl-5 space-y-2">
              {structured.gemeinsamkeiten.map((g: string, i: number) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}
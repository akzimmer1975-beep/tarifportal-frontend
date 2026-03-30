import CompareColumns from "@/components/results/CompareColumns";
import CompareHeader from "@/components/results/CompareHeader";
import SourcesSection from "@/components/results/SourcesSection";
import TextListSection from "@/components/results/TextListSection";
import { askTarifQuestion } from "@/lib/api";

type ComparePageProps = {
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const query = params.query?.trim() || "";

  if (!query) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-semibold text-amber-900">
            Keine Tariffrage angegeben
          </h1>
          <p className="mt-2 text-amber-800">
            Bitte gehe zurück zur Startseite und gib eine Frage ein.
          </p>
        </div>
      </main>
    );
  }

  try {
    const result = await askTarifQuestion(query);

    return (
      <main className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
          <CompareHeader
            query={query}
            kurzfazit={result.structured?.kurzfazit || "Kein Kurzfazit vorhanden."}
          />

          <CompareColumns
            gdl={result.structured?.gdl || "Keine GDL-Angaben vorhanden."}
            evg={result.structured?.evg || "Keine EVG-Angaben vorhanden."}
          />

          <TextListSection
            title="Unterschiede"
            items={result.structured?.unterschiede || []}
          />

          <TextListSection
            title="Gemeinsamkeiten"
            items={result.structured?.gemeinsamkeiten || []}
          />

          <SourcesSection
            gdlSources={result.sourcesByUnion?.GDL || []}
            evgSources={result.sourcesByUnion?.EVG || []}
          />
        </div>
      </main>
    );
  } catch (error) {
    console.error(error);

    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-900">
            Fehler beim Laden der Tarifantwort
          </h1>
          <p className="mt-2 text-red-800">
            Die Anfrage an das Backend auf Render konnte nicht erfolgreich verarbeitet werden.
          </p>
          <p className="mt-2 text-sm text-red-700">
            Prüfe die API-URL, CORS und ob dein Render-Service aktiv ist.
          </p>
        </div>
      </main>
    );
  }
}
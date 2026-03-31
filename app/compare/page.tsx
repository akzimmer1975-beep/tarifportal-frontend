import CompareHeader from "@/components/results/CompareHeader";
import CompareSections from "@/components/results/CompareSections";
import SimilaritiesList from "@/components/results/SimilaritiesList";
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

    const sections =
      "sections" in result && Array.isArray(result.sections)
        ? result.sections
        : [];

    const structured =
      result.structured && typeof result.structured === "object"
        ? result.structured
        : undefined;

    const kurzfazit =
      structured && "kurzfazit" in structured && typeof structured.kurzfazit === "string"
        ? structured.kurzfazit
        : "Kein Kurzfazit vorhanden.";

    const topicKey =
      structured && "topicKey" in structured && typeof structured.topicKey === "string"
        ? structured.topicKey
        : undefined;

    const gemeinsamkeiten =
      structured &&
      "gemeinsamkeiten" in structured &&
      Array.isArray(structured.gemeinsamkeiten)
        ? structured.gemeinsamkeiten
        : [];

    return (
      <main className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
          <CompareHeader query={query} kurzfazit={kurzfazit} />

          <CompareSections query={query} topicKey={topicKey} sections={sections} />

          <SimilaritiesList items={gemeinsamkeiten} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("ComparePage Error:", error);

    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-900">
            Fehler beim Laden der Tarifantwort
          </h1>
          <p className="mt-2 text-red-800">
            Die Anfrage an das Backend konnte nicht erfolgreich verarbeitet werden.
          </p>
        </div>
      </main>
    );
  }
}
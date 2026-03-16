import { askTarifQuestion } from "@/lib/api";
import { AnswerView } from "@/components/answer-view";

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query?.trim() || "";

  if (!query) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Keine Frage übergeben</h1>
          <p className="mt-3 text-gray-600">Bitte gehe zurück zur Startseite und stelle eine Frage.</p>
        </div>
      </main>
    );
  }

  try {
    const result = await askTarifQuestion(query);
console.log("API RESULT:", JSON.stringify(result, null, 2));
    return <AnswerView query={query} result={result} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";

    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-700">Antwort konnte nicht geladen werden</h1>
          <p className="mt-3 text-gray-700">{message}</p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-2xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            ← Zur Startseite
          </a>
        </div>
      </main>
    );
  }
}
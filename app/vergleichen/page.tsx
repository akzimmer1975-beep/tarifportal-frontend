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

function normalizeSources(
  sources: any[],
  union: "GDL" | "EVG"
) {
  return sources.map((s) => ({
    document: s.document ?? s.documentName ?? "Unbekannt",
    union: s.union ?? union,
    text: s.text ?? s.excerpt ?? "",
    fullText: s.fullText ?? s.full_text ?? "",
    page: s.page ?? s.pageNumber,
    paragraph: s.paragraph,
    paragraphFrom: s.paragraphFrom,
    paragraphTo: s.paragraphTo,
    tarif: s.tarif ?? s.tariffwerk,
    tarifType: s.tarifType ?? s.tariffType,
    funktionsgruppe: s.funktionsgruppe,
    similarity: s.similarity,
  }));
}

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

    const structured =
      result?.structured && typeof result.structured === "object"
        ? result.structured
        : undefined;

    const kurzfazit =
      typeof structured?.kurzfazit === "string"
        ? structured.kurzfazit
        : "Kein Kurzfazit vorhanden.";

    const gdl =
      Array.isArray(structured?.gdl) || typeof structured?.gdl === "string"
        ? structured.gdl
        : "Keine GDL-Angaben vorhanden.";

    const evg =
      Array.isArray(structured?.evg) || typeof structured?.evg === "string"
        ? structured.evg
        : "Keine EVG-Angaben vorhanden.";

    const unterschiede = Array.isArray(structured?.unterschiede)
      ? structured.unterschiede
      : [];

    const gemeinsamkeiten = Array.isArray(structured?.gemeinsamkeiten)
      ? structured.gemeinsamkeiten
      : [];

    const topicKey =
      structured &&
      "topicKey" in structured &&
      typeof structured.topicKey === "string"
        ? structured.topicKey
        : undefined;

    return (
      <main className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
          <CompareHeader query={query} kurzfazit={kurzfazit} />

          <CompareColumns gdl={gdl} evg={evg} />

          <TextListSection
            title="Unterschiede"
            items={unterschiede}
          />

          <TextListSection
            title="Gemeinsamkeiten"
            items={gemeinsamkeiten}
          />

          <SourcesSection
            query={query}
            topicKey={topicKey}
            gdlSources={normalizeSources(result.sourcesByUnion?.GDL || [], "GDL")}
            evgSources={normalizeSources(result.sourcesByUnion?.EVG || [], "EVG")}
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
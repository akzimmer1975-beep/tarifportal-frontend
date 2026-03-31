import CompareColumns from "@/components/results/CompareColumns";
import CompareHeader from "@/components/results/CompareHeader";
import DifferencesList from "@/components/results/DifferencesList";
import SimilaritiesList from "@/components/results/SimilaritiesList";
import SourcesSection from "@/components/results/SourcesSection";
import { BackHomeButton } from "@/components/back-home-button";
import Card from "@/components/ui/Card";
import type { ChatResponseBody, SourceItem } from "@/types/chat";

type AnswerViewProps = {
  query: string;
  result: ChatResponseBody;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeText(value: unknown, fallback: string): string {
  if (isNonEmptyString(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    const items = value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );

    if (items.length > 0) {
      return items.join("\n\n");
    }
  }

  return fallback;
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );
  }

  if (isNonEmptyString(value)) {
    return [value];
  }

  return [];
}

function normalizeSources(value: unknown): SourceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is SourceItem =>
      typeof item === "object" &&
      item !== null &&
      "document" in item &&
      typeof item.document === "string"
  );
}

function SingleAnswerSection({ answer }: { answer: string }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        Antwort
      </h2>

      <Card>
        <p className="whitespace-pre-line leading-7 text-zinc-800">{answer}</p>
      </Card>
    </section>
  );
}

function SingleSourcesSection({ sources }: { sources: SourceItem[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        Quellen
      </h2>

      <Card>
        {sources.length === 0 ? (
          <p className="text-zinc-500">Keine Quellen vorhanden.</p>
        ) : (
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li
                key={`${source.document}-${source.page ?? "x"}-${index}`}
                className="rounded-xl bg-zinc-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-medium text-zinc-900">{source.document}</p>

                  {source.union ? (
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
                      {source.union}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                  {source.tarif ? <span>Tarif: {source.tarif}</span> : null}
                  {source.tarifType ? <span>Typ: {source.tarifType}</span> : null}
                  {source.funktionsgruppe ? (
                    <span>FG: {source.funktionsgruppe}</span>
                  ) : null}
                  {source.page != null ? <span>Seite: {source.page}</span> : null}
                  {source.paragraph != null ? (
                    <span>Abschnitt: {source.paragraph}</span>
                  ) : null}
                  {source.similarity != null ? (
                    <span>Similarity: {source.similarity}</span>
                  ) : null}
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-700">
                  {source.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

export function AnswerView({ query, result }: AnswerViewProps) {
  const mode = result.mode;
  const sources = normalizeSources(result.sources);
  const rawSourcesByUnion = result.sourcesByUnion ?? { GDL: [], EVG: [] };

  const sourcesByUnion = {
    GDL: normalizeSources(rawSourcesByUnion.GDL),
    EVG: normalizeSources(rawSourcesByUnion.EVG),
  };

  const structured =
    result.structured && typeof result.structured === "object"
      ? result.structured
      : undefined;

  const kurzfazit = normalizeText(
    structured?.kurzfazit,
    isNonEmptyString(result.answer) ? result.answer : "Kein Kurzfazit vorhanden."
  );

  const gdl = normalizeText(
    structured?.gdl,
    mode === "compare"
      ? "Keine GDL-Angaben vorhanden."
      : isNonEmptyString(result.answer)
        ? result.answer
        : "Keine GDL-Angaben vorhanden."
  );

  const evg = normalizeText(
    structured?.evg,
    mode === "compare"
      ? "Keine EVG-Angaben vorhanden."
      : isNonEmptyString(result.answer)
        ? result.answer
        : "Keine EVG-Angaben vorhanden."
  );

  const unterschiede = normalizeStringArray(structured?.unterschiede);
  const gemeinsamkeiten = normalizeStringArray(structured?.gemeinsamkeiten);

  const topicKey =
    structured &&
    "topicKey" in structured &&
    typeof structured.topicKey === "string"
      ? structured.topicKey
      : undefined;

  if (mode === "single") {
    return (
      <main className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <BackHomeButton />

          <Card className="space-y-4 border-amber-200 bg-amber-50">
            <div>
              <p className="text-sm font-medium text-amber-700">Tariffrage</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-amber-950">
                {query}
              </h1>
            </div>

            <p className="leading-7 text-amber-900">
              Für diese Anfrage wurde eine Einzelantwort statt einer Vergleichsantwort geliefert.
              Die Inhalte werden deshalb in einer Fallback-Ansicht angezeigt.
            </p>
          </Card>

          <SingleAnswerSection
            answer={normalizeText(result.answer, "Keine Antwort vorhanden.")}
          />
          <SingleSourcesSection sources={sources} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <BackHomeButton />

        <CompareHeader query={query} kurzfazit={kurzfazit} />

        <CompareColumns gdl={gdl} evg={evg} />

        <div className="grid gap-6 lg:grid-cols-2">
          <DifferencesList items={unterschiede} />
          <SimilaritiesList items={gemeinsamkeiten} />
        </div>

        <SourcesSection
          query={query}
          topicKey={topicKey}
          gdlSources={sourcesByUnion.GDL}
          evgSources={sourcesByUnion.EVG}
        />
      </div>
    </main>
  );
}
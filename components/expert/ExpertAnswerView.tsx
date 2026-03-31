"use client";

import { useMemo, useState } from "react";
import ExpertModeBadge from "@/components/expert/ExpertModeBadge";
import ExpertWarningPanel from "@/components/expert/ExpertWarningPanel";
import ExpertFeedbackPanel from "@/components/feedback/ExpertFeedbackPanel";
import type { ExpertChatResponse, ExpertChatSource } from "@/types/expert";

type ExpertAnswerViewProps = {
  question: string;
  response: ExpertChatResponse;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeItems(items: unknown): string[] {
  if (Array.isArray(items)) {
    return items.filter(isNonEmptyString);
  }

  if (isNonEmptyString(items)) {
    return [items];
  }

  return [];
}

function safeText(value: unknown, fallback = "Keine Angabe"): string {
  return isNonEmptyString(value) ? value : fallback;
}

function TextList({
  title,
  items,
}: {
  title: string;
  items: unknown;
}) {
  const normalizedItems = normalizeItems(items);

  if (!normalizedItems.length) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>

      <ul className="mt-3 space-y-2">
        {normalizedItems.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="rounded-xl bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-800"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SourceMetaLine({ source }: { source: ExpertChatSource }) {
  const parts = [
    isNonEmptyString(source.union) ? source.union : null,
    isNonEmptyString(source.tariffType) ? source.tariffType : null,
    isNonEmptyString(source.tariffwerk) ? source.tariffwerk : null,
    typeof source.pageNumber === "number" ? `Seite ${source.pageNumber}` : null,
    isNonEmptyString(source.sectionLabel) ? source.sectionLabel : null,
  ].filter(Boolean) as string[];

  if (!parts.length) {
    return <p className="mt-1 text-sm text-neutral-600">Keine Zusatzangaben vorhanden.</p>;
  }

  return <p className="mt-1 text-sm text-neutral-600">{parts.join(" · ")}</p>;
}

function SourceModal({
  source,
  onClose,
}: {
  source: ExpertChatSource | null;
  onClose: () => void;
}) {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-neutral-950">
              {safeText(source.documentName, "Unbekannte Quelle")}
            </h3>
            <SourceMetaLine source={source} />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-500"
          >
            Schließen
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <section>
            <div className="mb-2 text-sm font-semibold text-neutral-900">Treffertext</div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-7 text-neutral-800">
              {safeText(source.excerpt, "Kein Auszug vorhanden.")}
            </div>
          </section>

          <section>
            <div className="mb-2 text-sm font-semibold text-neutral-900">Volltext / Absatz</div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm leading-7 text-neutral-800">
              {safeText(
                source.fullText,
                "Für diese Quelle wurde noch kein Volltext geliefert."
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ExpertAnswerView({
  question,
  response,
}: ExpertAnswerViewProps) {
  const [openSource, setOpenSource] = useState<ExpertChatSource | null>(null);

  const sources = useMemo(() => {
    return Array.isArray(response.sources) ? response.sources : [];
  }, [response.sources]);

  const structured =
    response && typeof response.structured === "object" && response.structured !== null
      ? response.structured
      : undefined;

  const rubrics = Array.isArray(structured?.rubrics) ? structured.rubrics : [];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-neutral-500">Expertenfrage</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
              {question}
            </h1>
          </div>

          <ExpertModeBadge />
        </div>

        <ExpertWarningPanel
          warning={response.warning}
          insufficientSources={response.insufficientSources}
        />

        <div className="mt-5 space-y-4">
          {isNonEmptyString(structured?.kurzfazit) ? (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Kurzfazit
              </div>
              <p className="mt-2 text-sm leading-7 text-neutral-800">
                {structured?.kurzfazit}
              </p>
            </div>
          ) : null}

          {isNonEmptyString(response.answer) ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Antworttext
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-800">
                {response.answer}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <TextList title="GDL" items={structured?.gdl} />
        <TextList title="EVG" items={structured?.evg} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TextList title="Unterschiede" items={structured?.unterschiede} />
        <TextList title="Gemeinsamkeiten" items={structured?.gemeinsamkeiten} />
      </div>

      {rubrics.length ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-950">Unterrubriken</h3>

          <div className="mt-4 space-y-3">
            {rubrics.map((rubric, rubricIndex) => {
              const rubricItems = normalizeItems(
                rubric && typeof rubric === "object" ? (rubric as { items?: unknown }).items : []
              );

              const rubricKey =
                rubric && typeof rubric === "object" && isNonEmptyString((rubric as { key?: unknown }).key)
                  ? (rubric as { key: string }).key
                  : `rubric-${rubricIndex}`;

              const rubricLabel =
                rubric && typeof rubric === "object" && isNonEmptyString((rubric as { label?: unknown }).label)
                  ? (rubric as { label: string }).label
                  : `Rubrik ${rubricIndex + 1}`;

              return (
                <details
                  key={rubricKey}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <summary className="cursor-pointer font-medium text-neutral-900">
                    {rubricLabel}
                  </summary>

                  {rubricItems.length ? (
                    <ul className="mt-3 space-y-2">
                      {rubricItems.map((item, itemIndex) => (
                        <li
                          key={`${rubricKey}-${itemIndex}`}
                          className="rounded-lg bg-white px-3 py-2 text-sm text-neutral-800"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-3 text-sm text-neutral-500">
                      Keine Einträge vorhanden.
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-950">Verwendete Quellen</h3>

        {sources.length === 0 ? (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Keine passenden Quellen geliefert. Diese Frage sollte im Expertenbereich
            nachbearbeitet werden.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {sources.map((source, index) => (
              <button
                key={`${safeText(source.documentName, "quelle")}-${index}`}
                type="button"
                onClick={() => setOpenSource(source)}
                className="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-left transition hover:border-neutral-400 hover:bg-white"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                  <span className="font-semibold text-neutral-900">
                    {safeText(source.documentName, "Unbekannte Quelle")}
                  </span>

                  {isNonEmptyString(source.union) ? <span>· {source.union}</span> : null}
                  {typeof source.pageNumber === "number" ? (
                    <span>· Seite {source.pageNumber}</span>
                  ) : null}
                  {isNonEmptyString(source.sectionLabel) ? (
                    <span>· {source.sectionLabel}</span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm leading-6 text-neutral-800">
                  {safeText(source.excerpt, "Kein Auszug vorhanden.")}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      <ExpertFeedbackPanel question={question} response={response} />

      <SourceModal source={openSource} onClose={() => setOpenSource(null)} />
    </div>
  );
}
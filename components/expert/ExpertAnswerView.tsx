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

function TextList({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items?.length) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-800"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
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
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{source.documentName}</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {source.union ? `${source.union} · ` : ""}
              {source.tariffType ? `${source.tariffType} · ` : ""}
              {source.tariffwerk ? `${source.tariffwerk} · ` : ""}
              {source.pageNumber ? `Seite ${source.pageNumber} · ` : ""}
              {source.sectionLabel || "ohne Abschnittsangabe"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium hover:border-neutral-500"
          >
            Schließen
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <div className="mb-2 text-sm font-semibold text-neutral-900">Treffertext</div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-7 text-neutral-800">
              {source.excerpt || "Kein Auszug vorhanden."}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-neutral-900">Volltext / Absatz</div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm leading-7 text-neutral-800">
              {source.fullText || "Für diese Quelle wurde noch kein Volltext geliefert."}
            </div>
          </div>
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

  const sources = useMemo(() => response.sources || [], [response.sources]);
  const structured = response.structured;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-neutral-500">Expertenfrage</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{question}</h1>
          </div>
          <ExpertModeBadge />
        </div>

        <ExpertWarningPanel
          warning={response.warning}
          insufficientSources={response.insufficientSources}
        />

        <div className="mt-5 space-y-4">
          {structured?.kurzfazit ? (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Kurzfazit
              </div>
              <p className="mt-2 text-sm leading-7 text-neutral-800">
                {structured.kurzfazit}
              </p>
            </div>
          ) : null}

          {response.answer ? (
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

      {structured?.rubrics?.length ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Unterrubriken</h3>
          <div className="mt-4 space-y-3">
            {structured.rubrics.map((rubric) => (
              <details
                key={rubric.key}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
              >
                <summary className="cursor-pointer font-medium text-neutral-900">
                  {rubric.label}
                </summary>
                <ul className="mt-3 space-y-2">
                  {rubric.items.map((item, index) => (
                    <li
                      key={`${rubric.key}-${index}`}
                      className="rounded-lg bg-white px-3 py-2 text-sm text-neutral-800"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Verwendete Quellen</h3>

        {sources.length === 0 ? (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Keine passenden Quellen geliefert. Diese Frage sollte im Expertenbereich nachbearbeitet werden.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {sources.map((source, index) => (
              <button
                key={`${source.documentName}-${index}`}
                type="button"
                onClick={() => setOpenSource(source)}
                className="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-left transition hover:border-neutral-400 hover:bg-white"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                  <span className="font-semibold text-neutral-900">
                    {source.documentName}
                  </span>
                  {source.union ? <span>· {source.union}</span> : null}
                  {source.pageNumber ? <span>· Seite {source.pageNumber}</span> : null}
                  {source.sectionLabel ? <span>· {source.sectionLabel}</span> : null}
                </div>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-800">
                  {source.excerpt}
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
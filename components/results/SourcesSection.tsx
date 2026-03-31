"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import SourceModal from "./SourceModal";
import type { SourceItem } from "@/types/chat";

type SourcesSectionProps = {
  query: string;
  topicKey?: string;
  sectionKey?: string;
  title?: string;
  gdlSources: SourceItem[];
  evgSources: SourceItem[];
};

type ModalState = {
  source: SourceItem | null;
  mode: "select" | "manual";
};

function formatParagraphLabel(source: SourceItem) {
  if (source.paragraph != null) {
    return `§ / Abschnitt ${source.paragraph}`;
  }

  return "";
}

function formatSimilarity(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return value.toFixed(4);
}

function SourceColumn({
  title,
  sources,
  onOpen,
  onOpenManual,
}: {
  title: string;
  sources: SourceItem[];
  onOpen: (source: SourceItem) => void;
  onOpenManual: (source: SourceItem) => void;
}) {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>

      {sources.length === 0 ? (
        <p className="text-zinc-500">Keine Quellen vorhanden.</p>
      ) : (
        <ul className="space-y-3">
          {sources.map((source, index) => {
            const similarityLabel = formatSimilarity(source.similarity);
            const previewText = source.text || "Kein Text vorhanden.";

            return (
              <li
                key={`${source.document}-${source.page ?? "x"}-${index}`}
                className="rounded-xl bg-zinc-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-base font-semibold text-zinc-950">
                    {source.document}
                  </p>

                  {source.union ? (
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
                      {source.union}
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-xs text-zinc-500">
                  {formatParagraphLabel(source)}
                  {source.page != null ? ` · Seite ${source.page}` : ""}
                </p>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                  {source.tarif ? <span>Tarif: {source.tarif}</span> : null}
                  {source.tarifType ? <span>Typ: {source.tarifType}</span> : null}
                  {source.funktionsgruppe ? <span>FG: {source.funktionsgruppe}</span> : null}
                  {similarityLabel ? <span>Similarity: {similarityLabel}</span> : null}
                </div>

                <p className="mt-3 line-clamp-5 whitespace-pre-wrap text-sm italic leading-6 text-zinc-700">
                  {previewText}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onOpen(source)}
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Tarifstelle anzeigen
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenManual(source)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
                  >
                    Eigene Quelle eintragen
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default function SourcesSection({
  query,
  topicKey,
  sectionKey,
  title = "Quellen",
  gdlSources,
  evgSources,
}: SourcesSectionProps) {
  const [modalState, setModalState] = useState<ModalState>({
    source: null,
    mode: "select",
  });

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <SourceColumn
            title="GDL-Quellen"
            sources={gdlSources}
            onOpen={(source) => setModalState({ source, mode: "select" })}
            onOpenManual={(source) => setModalState({ source, mode: "manual" })}
          />

          <SourceColumn
            title="EVG-Quellen"
            sources={evgSources}
            onOpen={(source) => setModalState({ source, mode: "select" })}
            onOpenManual={(source) => setModalState({ source, mode: "manual" })}
          />
        </div>
      </section>

      <SourceModal
        open={!!modalState.source}
        onClose={() => setModalState({ source: null, mode: "select" })}
        query={query}
        topicKey={topicKey}
        sectionKey={sectionKey}
        source={modalState.source}
        initialMode={modalState.mode}
      />
    </>
  );
}
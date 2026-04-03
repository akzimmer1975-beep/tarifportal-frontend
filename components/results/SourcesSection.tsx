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

type LooseSource = SourceItem & Record<string, unknown>;

function pickString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function pickNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function getDocumentName(source: LooseSource): string {
  return (
    pickString(
      source.document,
      source.documentName,
      source.document_name,
      source.source_document_name,
      source.name,
      source.title
    ) ?? "Unbekannte Quelle"
  );
}

function getPreviewText(source: LooseSource): string {
  return (
    pickString(
      source.text,
      source.sourceText,
      source.source_text,
      source.excerpt,
      source.quote,
      source.chunk_text,
      source.full_text,
      source.source_full_text
    ) ?? "Kein Auszug vorhanden."
  );
}

function getUnion(source: LooseSource): string | null {
  return pickString(
    source.union,
    source.unionName,
    source.union_name,
    source.source_union_name
  );
}

function getTarif(source: LooseSource): string | null {
  return pickString(
    source.tarif,
    source.tariffwerk,
    source.tariffWerk,
    source.source_tariffwerk
  );
}

function getTariffType(source: LooseSource): string | null {
  return pickString(
    source.tarifType,
    source.tariffType,
    source.tariff_type,
    source.source_tarif_type,
    source.source_tariff_type
  );
}

function getFunktionsgruppe(source: LooseSource): string | null {
  return pickString(
    source.funktionsgruppe,
    source.funktionsGruppe,
    source.source_funktionsgruppe
  );
}

function getPage(source: LooseSource): number | null {
  return pickNumber(
    source.page,
    source.pageNumber,
    source.page_number,
    source.source_page_number
  );
}

function getParagraph(source: LooseSource): number | null {
  return pickNumber(
    source.paragraph,
    source.paragraphIndex,
    source.paragraph_index,
    source.source_paragraph_index
  );
}

function getSectionLabel(source: LooseSource): string | null {
  return pickString(source.sectionLabel, source.section_label);
}

function getSimilarity(source: LooseSource): number | null {
  return pickNumber(source.similarity, source.score, source.source_similarity);
}

function formatParagraphLabel(source: LooseSource) {
  const paragraph = getParagraph(source);
  const sectionLabel = getSectionLabel(source);

  if (paragraph != null && sectionLabel) {
    return `Abs. ${paragraph} · ${sectionLabel}`;
  }

  if (paragraph != null) {
    return `Abs. ${paragraph}`;
  }

  if (sectionLabel) {
    return sectionLabel;
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
            const looseSource = source as LooseSource;

            const documentName = getDocumentName(looseSource);
            const unionLabel = getUnion(looseSource);
            const previewText = getPreviewText(looseSource);
            const similarityLabel = formatSimilarity(getSimilarity(looseSource));
            const page = getPage(looseSource);
            const paragraphLabel = formatParagraphLabel(looseSource);
            const tarif = getTarif(looseSource);
            const tariffType = getTariffType(looseSource);
            const funktionsgruppe = getFunktionsgruppe(looseSource);

            return (
              <li
                key={`${documentName}-${page ?? "x"}-${index}`}
                className="rounded-xl bg-zinc-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-base font-semibold text-zinc-950">
                    {documentName}
                  </p>

                  {unionLabel ? (
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
                      {unionLabel}
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-xs text-zinc-500">
                  {paragraphLabel}
                  {page != null ? `${paragraphLabel ? " · " : ""}Seite ${page}` : ""}
                </p>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                  {tarif ? <span>Tarif: {tarif}</span> : null}
                  {tariffType ? <span>Typ: {tariffType}</span> : null}
                  {funktionsgruppe ? <span>FG: {funktionsgruppe}</span> : null}
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
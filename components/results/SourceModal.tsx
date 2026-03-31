"use client";

import { useEffect } from "react";
import type { SourceItem } from "@/types/chat";

type SourceModalProps = {
  open: boolean;
  onClose: () => void;
  query: string;
  topicKey?: string;
  sectionKey?: string;
  source: SourceItem | null;
  initialMode?: "select" | "manual";
};

function formatParagraphLabel(source: SourceItem | null) {
  if (!source) return "—";

  if (source.paragraph != null) {
    return `§ / Abschnitt ${source.paragraph}`;
  }

  return "—";
}

function formatSimilarity(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return value.toFixed(4);
}

export default function SourceModal({
  open,
  onClose,
  query,
  topicKey,
  sectionKey,
  source,
  initialMode = "select",
}: SourceModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !source) return null;

  const similarityLabel = formatSimilarity(source.similarity);
  const displayText = source.fullText || source.text || "Kein Text vorhanden.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Tarifquelle
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              {source.document}
            </h2>

            <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
              {source.union ? (
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  {source.union}
                </span>
              ) : null}

              {source.tarif ? (
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  Tarif: {source.tarif}
                </span>
              ) : null}

              {source.tarifType ? (
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  Typ: {source.tarifType}
                </span>
              ) : null}

              {source.funktionsgruppe ? (
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  FG: {source.funktionsgruppe}
                </span>
              ) : null}

              {source.page != null ? (
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  Seite: {source.page}
                </span>
              ) : null}

              <span className="rounded-full bg-zinc-100 px-2 py-1">
                {formatParagraphLabel(source)}
              </span>

              {similarityLabel ? (
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  Similarity: {similarityLabel}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
          >
            Schließen
          </button>
        </div>

        <div className="mt-6 grid gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Anfragekontext
            </h3>

            <div className="mt-3 space-y-2 text-sm text-zinc-700">
              <p>
                <span className="font-medium text-zinc-900">Frage:</span> {query}
              </p>

              {topicKey ? (
                <p>
                  <span className="font-medium text-zinc-900">Thema:</span> {topicKey}
                </p>
              ) : null}

              {sectionKey ? (
                <p>
                  <span className="font-medium text-zinc-900">Abschnitt:</span> {sectionKey}
                </p>
              ) : null}

              <p>
                <span className="font-medium text-zinc-900">Modus:</span>{" "}
                {initialMode === "manual" ? "Eigene Quelle eintragen" : "Quelle auswählen"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Volltext / Fundstelle
            </h3>

            <div className="mt-3 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-sm leading-7 text-zinc-800">
              {displayText}
            </div>
          </section>

          {source.text && source.fullText && source.text !== source.fullText ? (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Treffer-Auszug
              </h3>

              <div className="mt-3 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-sm leading-7 text-zinc-800">
                {source.text}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
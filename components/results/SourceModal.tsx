"use client";

import { useState } from "react";
import { sendFeedback } from "@/lib/api/feedback";
import type { SourceItem } from "@/types/feedback";

type Props = {
  open: boolean;
  onClose: () => void;
  query: string;
  topicKey?: string;
  sectionKey?: string;
  source: SourceItem | null;
};

export default function SourceModal({
  open,
  onClose,
  query,
  topicKey,
  sectionKey,
  source
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [customDocumentName, setCustomDocumentName] = useState("");
  const [customUnionName, setCustomUnionName] = useState("");
  const [customTariffType, setCustomTariffType] = useState("");
  const [customTariffwerk, setCustomTariffwerk] = useState("");
  const [customFunktionsgruppe, setCustomFunktionsgruppe] = useState("");
  const [customPageNumber, setCustomPageNumber] = useState("");
  const [customParagraphIndex, setCustomParagraphIndex] = useState("");
  const [customText, setCustomText] = useState("");
  const [customComment, setCustomComment] = useState("");

  if (!open || !source) return null;

  async function handleSourceFeedback(
    feedbackType: "relevant" | "preferred" | "not_relevant"
  ) {
    try {
      setLoading(true);
      setMessage(null);

      await sendFeedback({
        queryText: query,
        topicKey,
        sectionKey,
        targetType: "source",
        feedbackType,
        source: {
          documentName: source.document,
          unionName: source.union,
          tariffType: source.tariffType,
          tariffwerk: source.tariffwerk,
          funktionsgruppe: source.funktionsgruppe,
          pageNumber: source.page ?? null,
          paragraphIndex: source.paragraph ?? null,
          text: source.text,
          similarity: source.similarity ?? null
        }
      });

      setMessage("Feedback gespeichert.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCustomSourceSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      await sendFeedback({
        queryText: query,
        topicKey,
        sectionKey,
        targetType: "custom_source",
        feedbackType: "custom_source",
        customSource: {
          documentName: customDocumentName || undefined,
          unionName: customUnionName || undefined,
          tariffType: customTariffType || undefined,
          tariffwerk: customTariffwerk || undefined,
          funktionsgruppe: customFunktionsgruppe || undefined,
          pageNumber: customPageNumber ? Number(customPageNumber) : null,
          paragraphIndex: customParagraphIndex ? Number(customParagraphIndex) : null,
          text: customText || undefined,
          comment: customComment || undefined
        }
      });

      setMessage("Eigene Quelle gespeichert.");

      setCustomDocumentName("");
      setCustomUnionName("");
      setCustomTariffType("");
      setCustomTariffwerk("");
      setCustomFunktionsgruppe("");
      setCustomPageNumber("");
      setCustomParagraphIndex("");
      setCustomText("");
      setCustomComment("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">Quelle prüfen</h3>
            <p className="text-sm text-slate-500">Volltext lesen und Feedback speichern</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Schließen
          </button>
        </div>

        <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-xl border bg-slate-50 p-4 text-sm">
              <div><strong>Dokument:</strong> {source.document || "—"}</div>
              <div><strong>Gewerkschaft:</strong> {source.union || "—"}</div>
              <div><strong>Tarifart:</strong> {source.tariffType || "—"}</div>
              <div><strong>Tarifwerk:</strong> {source.tariffwerk || "—"}</div>
              <div><strong>Funktionsgruppe:</strong> {source.funktionsgruppe || "—"}</div>
              <div><strong>Seite:</strong> {source.page ?? "—"}</div>
              <div><strong>Paragraph:</strong> {source.paragraph ?? "—"}</div>
              <div><strong>Similarity:</strong> {source.similarity ?? "—"}</div>
            </div>

            <div className="rounded-xl border p-4">
              <h4 className="mb-3 font-medium">Vollständiger Quellentext</h4>
              <div className="max-h-[380px] overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {source.text || "Kein Text vorhanden."}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSourceFeedback("relevant")}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Quelle passt
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSourceFeedback("preferred")}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Als Referenz merken
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSourceFeedback("not_relevant")}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Quelle passt nicht
              </button>
            </div>

            {message && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {message}
              </div>
            )}
          </div>

          <div>
            <form onSubmit={handleCustomSourceSubmit} className="space-y-3 rounded-xl border p-4">
              <h4 className="font-medium">Eigene Quelle angeben</h4>

              <input
                value={customDocumentName}
                onChange={(e) => setCustomDocumentName(e.target.value)}
                placeholder="Dokumentname"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              <input
                value={customUnionName}
                onChange={(e) => setCustomUnionName(e.target.value)}
                placeholder="Gewerkschaft"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              <input
                value={customTariffType}
                onChange={(e) => setCustomTariffType(e.target.value)}
                placeholder="Tarifart"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              <input
                value={customTariffwerk}
                onChange={(e) => setCustomTariffwerk(e.target.value)}
                placeholder="Tarifwerk"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              <input
                value={customFunktionsgruppe}
                onChange={(e) => setCustomFunktionsgruppe(e.target.value)}
                placeholder="Funktionsgruppe"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={customPageNumber}
                  onChange={(e) => setCustomPageNumber(e.target.value)}
                  placeholder="Seite"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  value={customParagraphIndex}
                  onChange={(e) => setCustomParagraphIndex(e.target.value)}
                  placeholder="Paragraph"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Textstelle"
                rows={6}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              <textarea
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value)}
                placeholder="Warum passt diese Quelle besser?"
                rows={4}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Eigene Quelle speichern
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
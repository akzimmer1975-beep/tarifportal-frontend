"use client";

import { useEffect, useMemo, useState } from "react";
import { sendFeedback } from "@/lib/api/feedback";
import {
  getDocuments,
  getParagraphs,
  type ApiDocument,
  type ApiParagraph
} from "@/lib/api/documents";
import type { SourceItem } from "@/types/chat";

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

  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [paragraphs, setParagraphs] = useState<ApiParagraph[]>([]);
  const [paragraphsLoading, setParagraphsLoading] = useState(false);

  const [selectedParagraphKey, setSelectedParagraphKey] = useState("");
  const [customComment, setCustomComment] = useState("");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadDocuments() {
      try {
        setDocumentsLoading(true);
        const data = await getDocuments();
        if (!active) return;
        setDocuments(data.documents);
      } catch (error) {
        if (!active) return;
        setMessage(
          error instanceof Error
            ? error.message
            : "Dokumente konnten nicht geladen werden."
        );
      } finally {
        if (active) setDocumentsLoading(false);
      }
    }

    loadDocuments();

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!selectedItemId) {
      setParagraphs([]);
      setSelectedParagraphKey("");
      return;
    }

    let active = true;

    async function loadParagraphs() {
      try {
        setParagraphsLoading(true);
        setMessage(null);
        const data = await getParagraphs(selectedItemId);
        if (!active) return;
        setParagraphs(data.paragraphs);
      } catch (error) {
        if (!active) return;
        setMessage(
          error instanceof Error
            ? error.message
            : "Paragraphen konnten nicht geladen werden."
        );
      } finally {
        if (active) setParagraphsLoading(false);
      }
    }

    loadParagraphs();

    return () => {
      active = false;
    };
  }, [selectedItemId]);

  const selectedDocument = useMemo(
    () => documents.find((doc) => doc.item_id === selectedItemId) ?? null,
    [documents, selectedItemId]
  );

  const selectedParagraph = useMemo(
    () =>
      paragraphs.find(
        (p) =>
          `${p.page_number ?? ""}-${p.paragraph_index ?? ""}` ===
          selectedParagraphKey
      ) ?? null,
    [paragraphs, selectedParagraphKey]
  );

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
          tariffType: source.tarifType,
          tariffwerk: source.tarif,
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

  async function handlePreferredSourceSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedDocument) {
      setMessage("Bitte zuerst einen Tarifvertrag auswählen.");
      return;
    }

    if (!selectedParagraph) {
      setMessage("Bitte einen Paragraphen / Absatz auswählen.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const text =
        customComment.trim().length > 0
          ? `${selectedParagraph.chunk_text}\n\nHinweis des Nutzers:\n${customComment.trim()}`
          : selectedParagraph.chunk_text;

      await sendFeedback({
        queryText: query,
        topicKey,
        sectionKey,
        targetType: "source",
        feedbackType: "preferred",
        source: {
          documentName: selectedDocument.name,
          unionName: selectedDocument.union_name,
          tariffType: selectedDocument.tarif_type,
          tariffwerk: selectedDocument.tariffwerk,
          funktionsgruppe: selectedDocument.funktionsgruppe,
          pageNumber: selectedParagraph.page_number ?? null,
          paragraphIndex: selectedParagraph.paragraph_index ?? null,
          text,
          similarity: null
        }
      });

      setMessage("Eigene Quelle gespeichert.");
      setSelectedItemId("");
      setParagraphs([]);
      setSelectedParagraphKey("");
      setCustomComment("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">Quelle prüfen</h3>
            <p className="text-sm text-slate-500">
              Volltext lesen, bewerten oder bessere Quelle auswählen
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Schließen
          </button>
        </div>

        <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-xl border bg-slate-50 p-4 text-sm">
              <div>
                <strong>Dokument:</strong> {source.document || "—"}
              </div>
              <div>
                <strong>Gewerkschaft:</strong> {source.union || "—"}
              </div>
              <div>
                <strong>Tarifart:</strong> {source.tarifType || "—"}
              </div>
              <div>
                <strong>Tarifwerk:</strong> {source.tarif || "—"}
              </div>
              <div>
                <strong>Funktionsgruppe:</strong> {source.funktionsgruppe || "—"}
              </div>
              <div>
                <strong>Seite:</strong> {source.page ?? "—"}
              </div>
              <div>
                <strong>Paragraph / Absatz:</strong> {source.paragraph ?? "—"}
              </div>
              <div>
                <strong>Similarity:</strong> {source.similarity ?? "—"}
              </div>
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
                onClick={() => handleSourceFeedback("not_relevant")}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Quelle passt nicht
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border p-4">
            <div>
              <h4 className="font-medium">Bessere Quelle auswählen</h4>
              <p className="mt-1 text-sm text-slate-500">
                Erst Tarifvertrag wählen, dann Paragraph / Absatz auswählen.
              </p>
            </div>

            <form onSubmit={handlePreferredSourceSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tarifvertrag</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  disabled={documentsLoading || loading}
                >
                  <option value="">Bitte auswählen</option>
                  {documents.map((doc) => (
                    <option key={doc.item_id} value={doc.item_id}>
                      {doc.name}
                      {doc.union_name ? ` · ${doc.union_name}` : ""}
                      {doc.tariffwerk ? ` · ${doc.tariffwerk}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Paragraph / Absatz</label>
                <select
                  value={selectedParagraphKey}
                  onChange={(e) => setSelectedParagraphKey(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  disabled={!selectedItemId || paragraphsLoading || loading}
                >
                  <option value="">
                    {paragraphsLoading
                      ? "Lade Paragraphen ..."
                      : "Bitte auswählen"}
                  </option>
                  {paragraphs.map((p, index) => {
                    const key = `${p.page_number ?? ""}-${p.paragraph_index ?? ""}`;
                    return (
                      <option key={`${key}-${index}`} value={key}>
                        Seite {p.page_number ?? "—"} · Absatz {p.paragraph_index ?? "—"}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedParagraph ? (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Ausgewählter Text
                  </p>
                  <div className="max-h-52 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {selectedParagraph.chunk_text}
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Kommentar / Hinweis
                </label>
                <textarea
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Optional: Warum ist diese Quelle aus deiner Sicht passender?"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedDocument || !selectedParagraph}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Eigene Quelle speichern
              </button>
            </form>

            {message ? (
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
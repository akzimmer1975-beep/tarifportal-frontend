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

type ModalMode = "select" | "manual";

type Props = {
  open: boolean;
  onClose: () => void;
  query: string;
  topicKey?: string;
  sectionKey?: string;
  source: SourceItem | null;
  initialMode?: ModalMode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatParagraphLabel(source: SourceItem | null) {
  if (!source) return "—";

  const from = source.paragraphFrom ?? null;
  const to = source.paragraphTo ?? null;

  if (from != null && to != null) {
    return from === to ? String(from) : `${from}–${to}`;
  }

  if (source.paragraph != null) {
    return String(source.paragraph);
  }

  return "—";
}

function formatSimilarity(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toFixed(4);
}

export default function SourceModal({
  open,
  onClose,
  query,
  topicKey,
  sectionKey,
  source,
  initialMode = "select"
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [mode, setMode] = useState<ModalMode>(initialMode);

  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [paragraphs, setParagraphs] = useState<ApiParagraph[]>([]);
  const [paragraphsLoading, setParagraphsLoading] = useState(false);

  const [selectedParagraphKey, setSelectedParagraphKey] = useState("");
  const [customComment, setCustomComment] = useState("");

  const [manualDoc, setManualDoc] = useState("");
  const [manualUnion, setManualUnion] = useState("");
  const [manualTarifType, setManualTarifType] = useState("");
  const [manualTariffwerk, setManualTariffwerk] = useState("");
  const [manualFunktionsgruppe, setManualFunktionsgruppe] = useState("");
  const [manualPage, setManualPage] = useState("");
  const [manualParagraph, setManualParagraph] = useState("");
  const [manualText, setManualText] = useState("");
  const [manualComment, setManualComment] = useState("");

  useEffect(() => {
    if (!open) return;

    setMode(initialMode);
    setMessage(null);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, initialMode]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadDocuments() {
      try {
        setDocumentsLoading(true);
        setMessage(null);

        const data = await getDocuments();

        if (!active) return;
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
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
        setParagraphs(Array.isArray(data.paragraphs) ? data.paragraphs : []);
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

  const paragraphLabel = useMemo(() => formatParagraphLabel(source), [source]);

  const displayFullText = source?.fullText || source?.text || "";
  const displayCurrentText = source?.text || "";
  const displayPreviousText = source?.previousText || "";
  const displayNextText = source?.nextText || "";

  if (!open || !source) return null;

  function resetSelectMode() {
    setSelectedItemId("");
    setParagraphs([]);
    setSelectedParagraphKey("");
    setCustomComment("");
  }

  function resetManualMode() {
    setManualDoc("");
    setManualUnion("");
    setManualTarifType("");
    setManualTariffwerk("");
    setManualFunktionsgruppe("");
    setManualPage("");
    setManualParagraph("");
    setManualText("");
    setManualComment("");
  }

  async function handleSourceFeedback(
    feedbackType: "relevant" | "not_relevant"
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
          tarifType: source.tarifType,
          tariffwerk: source.tarif,
          funktionsgruppe: source.funktionsgruppe,
          pageNumber: source.page ?? null,
          paragraphIndex: source.paragraph ?? null,
          text: displayFullText || displayCurrentText,
          similarity: source.similarity ?? null
        }
      });

      setMessage(
        feedbackType === "relevant"
          ? "Quelle als passend gespeichert."
          : "Quelle als unpassend gespeichert."
      );
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
          tarifType: selectedDocument.tarif_type,
          tariffwerk: selectedDocument.tariffwerk,
          funktionsgruppe: selectedDocument.funktionsgruppe,
          pageNumber: selectedParagraph.page_number ?? null,
          paragraphIndex: selectedParagraph.paragraph_index ?? null,
          text,
          similarity: null
        }
      });

      setMessage("Bevorzugte Quelle gespeichert.");
      resetSelectMode();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSourceSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!manualDoc.trim()) {
      setMessage("Bitte mindestens einen Dokumentnamen eingeben.");
      return;
    }

    if (!manualText.trim()) {
      setMessage("Bitte den Tariftext der eigenen Quelle eingeben.");
      return;
    }

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
          documentName: manualDoc.trim(),
          unionName: manualUnion.trim() || undefined,
          tarifType: manualTarifType.trim() || undefined,
          tariffwerk: manualTariffwerk.trim() || undefined,
          funktionsgruppe: manualFunktionsgruppe.trim() || undefined,
          pageNumber: manualPage.trim() ? Number(manualPage) : null,
          paragraphIndex: manualParagraph.trim() ? Number(manualParagraph) : null,
          text: manualText.trim(),
          comment: manualComment.trim() || undefined
        }
      });

      setMessage("Manuell eingetragene Quelle gespeichert.");
      resetManualMode();
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
        className="max-h-[92vh] w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Quelle prüfen</h3>
            <p className="text-sm text-slate-500">
              Volltext lesen, bewerten oder bessere Quelle auswählen
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Schließen
          </button>
        </div>

        <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="rounded-xl border bg-slate-50 p-4 text-sm leading-7">
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
                <strong>Paragraph / Absatz:</strong> {paragraphLabel}
              </div>
              <div>
                <strong>Similarity:</strong> {formatSimilarity(source.similarity)}
              </div>
            </div>

            {displayPreviousText ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h4 className="mb-2 font-medium text-amber-900">Vorheriger Absatz</h4>
                <div className="max-h-[180px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-800">
                  {displayPreviousText}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl border border-blue-300 bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-blue-900">Gefundener Absatz</h4>
              <div className="max-h-[220px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-900">
                {displayCurrentText || "Kein Text vorhanden."}
              </div>
            </div>

            {displayNextText ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h4 className="mb-2 font-medium text-emerald-900">
                  Nachfolgender Absatz / Fortsetzung
                </h4>
                <div className="max-h-[180px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-800">
                  {displayNextText}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl border p-4">
              <h4 className="mb-3 font-medium text-slate-900">
                Vollständiger Quellentext
              </h4>
              <div className="max-h-[380px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {displayFullText || "Kein Text vorhanden."}
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
              <h4 className="font-medium text-slate-900">Bessere Quelle auswählen</h4>
              <p className="mt-1 text-sm text-slate-500">
                Du kannst eine vorhandene Quelle auswählen oder direkt selbst eine
                Quelle eintragen.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("select");
                  setMessage(null);
                }}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm font-medium",
                  mode === "select"
                    ? "bg-slate-900 text-white"
                    : "border bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                Auswahl
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("manual");
                  setMessage(null);
                }}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm font-medium",
                  mode === "manual"
                    ? "bg-slate-900 text-white"
                    : "border bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                Eigene Quelle
              </button>
            </div>

            {mode === "select" ? (
              <form onSubmit={handlePreferredSourceSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tarifvertrag</label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    disabled={documentsLoading || loading}
                  >
                    <option value="">
                      {documentsLoading ? "Lade Dokumente ..." : "Bitte auswählen"}
                    </option>
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
                  <label className="text-sm font-medium">Kommentar / Hinweis</label>
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
                  Bevorzugte Quelle speichern
                </button>
              </form>
            ) : (
              <form onSubmit={handleManualSourceSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dokumentname</label>
                  <input
                    type="text"
                    value={manualDoc}
                    onChange={(e) => setManualDoc(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    placeholder="z. B. GDL_LfTV_..."
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gewerkschaft</label>
                    <input
                      type="text"
                      value={manualUnion}
                      onChange={(e) => setManualUnion(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      placeholder="z. B. GDL"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarifart</label>
                    <input
                      type="text"
                      value={manualTarifType}
                      onChange={(e) => setManualTarifType(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      placeholder="z. B. Tarifvertrag"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarifwerk</label>
                    <input
                      type="text"
                      value={manualTariffwerk}
                      onChange={(e) => setManualTariffwerk(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      placeholder="z. B. LfTV"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Funktionsgruppe</label>
                    <input
                      type="text"
                      value={manualFunktionsgruppe}
                      onChange={(e) => setManualFunktionsgruppe(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      placeholder="optional"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Seite</label>
                    <input
                      type="number"
                      value={manualPage}
                      onChange={(e) => setManualPage(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      placeholder="z. B. 35"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Paragraph / Absatz</label>
                    <input
                      type="number"
                      value={manualParagraph}
                      onChange={(e) => setManualParagraph(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      placeholder="z. B. 642"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tariftext</label>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    rows={6}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    placeholder="Hier den passenden Tariftext einfügen ..."
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Kommentar / Hinweis</label>
                  <textarea
                    value={manualComment}
                    onChange={(e) => setManualComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    placeholder="Optional: Warum ist diese Quelle aus deiner Sicht passend?"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !manualDoc.trim() || !manualText.trim()}
                  className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  Eigene Quelle speichern
                </button>
              </form>
            )}

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
"use client";

import { useEffect, useState } from "react";
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

  const [customText, setCustomText] = useState("");
  const [customDocument, setCustomDocument] = useState("");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !source) return null;

  // 🔹 Feedback senden
  async function handleFeedback(type: "relevant" | "not_relevant") {
    try {
      setLoading(true);
      setMessage(null);

      await sendFeedback({
        query,
        topicKey,
        sectionKey,
        feedbackType: type,
        source
      });

      setMessage(
        type === "relevant"
          ? "Danke! Quelle wurde als passend markiert."
          : "Danke! Quelle wurde als unpassend markiert."
      );
    } catch (err) {
      setMessage("Fehler beim Senden des Feedbacks.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Eigene Quelle senden
  async function handleCustomSource() {
    if (!customText.trim()) {
      setMessage("Bitte Text für eigene Quelle eingeben.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await sendFeedback({
        query,
        topicKey,
        sectionKey,
        feedbackType: "preferred",
        source: {
          ...source,
          text: customText,
          document: customDocument || "Eigene Quelle"
        }
      });

      setMessage("Eigene Quelle gespeichert.");
      setCustomText("");
      setCustomDocument("");
    } catch {
      setMessage("Fehler beim Speichern der eigenen Quelle.");
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
        className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Tarifquelle</h2>
            <p className="text-sm text-zinc-500">
              {source.document}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900"
          >
            ✕
          </button>
        </div>

        {/* Fundstelle */}
        <div className="px-6 py-3 bg-zinc-50 text-sm text-zinc-700">
          {source.paragraph && <span>§ {source.paragraph}</span>}
          {source.page && <span> · Seite {source.page}</span>}
          {source.union && <span> · {source.union}</span>}
        </div>

        {/* Text */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <p className="whitespace-pre-line text-zinc-800 leading-7">
            {source.text}
          </p>
        </div>

        {/* Aktionen */}
        <div className="border-t px-6 py-4 space-y-4">
          <div className="flex gap-3">
            <button
              disabled={loading}
              onClick={() => handleFeedback("relevant")}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              ✓ passt
            </button>

            <button
              disabled={loading}
              onClick={() => handleFeedback("not_relevant")}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
            >
              ✕ passt nicht
            </button>
          </div>

          {/* Eigene Quelle */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Eigene Quelle hinzufügen</p>

            <input
              type="text"
              placeholder="Dokument (optional)"
              value={customDocument}
              onChange={(e) => setCustomDocument(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <textarea
              placeholder="Passender Tariftext..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm h-24"
            />

            <button
              disabled={loading}
              onClick={handleCustomSource}
              className="border px-4 py-2 rounded-xl text-sm hover:bg-zinc-100"
            >
              + Quelle speichern
            </button>
          </div>

          {message && (
            <p className="text-sm text-zinc-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
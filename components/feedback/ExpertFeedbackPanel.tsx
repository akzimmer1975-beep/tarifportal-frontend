"use client";

import { useMemo, useState } from "react";
import ExpertFeedbackActions from "@/components/feedback/ExpertFeedbackActions";
import ExpertSourcePicker from "@/components/feedback/ExpertSourcePicker";
import ExpertParagraphPicker from "@/components/feedback/ExpertParagraphPicker";
import ExpertSectionPicker from "@/components/feedback/ExpertSectionPicker";
import type {
  ExpertChatResponse,
  ExpertFeedbackPayload,
  ExpertFeedbackType,
} from "@/types/expert";

type ExpertFeedbackPanelProps = {
  question: string;
  response: ExpertChatResponse;
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    ""
  );
}

export default function ExpertFeedbackPanel({
  question,
  response,
}: ExpertFeedbackPanelProps) {
  const sources = response.sources || [];
  const [feedbackType, setFeedbackType] = useState<ExpertFeedbackType | "">("");
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [documentName, setDocumentName] = useState("");
  const [tariffType, setTariffType] = useState("");
  const [paragraphLabel, setParagraphLabel] = useState("");
  const [sectionLabel, setSectionLabel] = useState("");
  const [fullText, setFullText] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSource = useMemo(() => {
    return sources[selectedSourceIndex];
  }, [sources, selectedSourceIndex]);

  async function handleSubmit() {
    if (!feedbackType) {
      setStatus("Bitte zuerst eine Bewertungsart auswählen.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    const payload: ExpertFeedbackPayload = {
      question,
      answer: response.answer,
      feedbackType,
      note: note.trim() || undefined,
    };

    if (feedbackType === "custom_source") {
      payload.customSource = {
        documentName: documentName.trim() || undefined,
        tariffType: tariffType.trim() || undefined,
        paragraphLabel: paragraphLabel.trim() || undefined,
        sectionLabel: sectionLabel.trim() || undefined,
        fullText: fullText.trim() || undefined,
      };
    } else if (selectedSource) {
      payload.source = {
        union: selectedSource.union,
        documentName: selectedSource.documentName,
        tariffType: selectedSource.tariffType,
        tariffwerk: selectedSource.tariffwerk,
        pageNumber: selectedSource.pageNumber,
        paragraphIndex: selectedSource.paragraphIndex,
        sectionLabel: selectedSource.sectionLabel,
        excerpt: selectedSource.excerpt,
        fullText: selectedSource.fullText,
      };
    }

    try {
      const baseUrl = getApiBaseUrl();

      const result = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        const text = await result.text();
        throw new Error(text || "Feedback konnte nicht gespeichert werden.");
      }

      setStatus("Feedback wurde gespeichert.");
      setNote("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Feedback konnte nicht gespeichert werden.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Experten-Feedback</h3>
        <p className="text-sm text-neutral-600">
          Hier bewertest du die verwendeten Quellen und markierst Antworten ohne
          brauchbare Tarifgrundlage.
        </p>
      </div>

      <div className="space-y-4">
        <ExpertFeedbackActions
          activeType={feedbackType}
          onChange={(value) => setFeedbackType(value)}
        />

        {feedbackType && feedbackType !== "custom_source" && sources.length > 0 ? (
          <ExpertSourcePicker
            sources={sources}
            selectedIndex={selectedSourceIndex}
            onChange={setSelectedSourceIndex}
          />
        ) : null}

        {feedbackType === "custom_source" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-neutral-800">Tarifvertrag</span>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="z. B. EVG_FGr1_TV_AGV_MOVE_Stand_2025-10-01.pdf"
                className="rounded-xl border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-800"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-800">Tariftyp</span>
              <input
                type="text"
                value={tariffType}
                onChange={(e) => setTariffType(e.target.value)}
                placeholder="z. B. Mantel / Haustarif"
                className="rounded-xl border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-800"
              />
            </label>

            <ExpertParagraphPicker
              value={paragraphLabel}
              onChange={setParagraphLabel}
            />

            <ExpertSectionPicker
              value={sectionLabel}
              onChange={setSectionLabel}
            />

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-neutral-800">Volltext</span>
              <textarea
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
                rows={7}
                placeholder="Tariftext oder vollständiger Absatz"
                className="rounded-xl border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-800"
              />
            </label>
          </div>
        ) : null}

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-800">Notiz</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Kurze Begründung oder Hinweis"
            className="rounded-xl border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-800"
          />
        </label>

        {status ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            {status}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Feedback speichern
        </button>
      </div>
    </div>
  );
}
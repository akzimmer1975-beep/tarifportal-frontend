"use client";

import type { ExpertFeedbackType } from "@/types/expert";

type ExpertFeedbackActionsProps = {
  activeType: ExpertFeedbackType | "";
  onChange: (value: ExpertFeedbackType) => void;
};

const ACTIONS: Array<{ value: ExpertFeedbackType; label: string }> = [
  { value: "relevant", label: "Quelle passt" },
  { value: "preferred", label: "Bessere Quelle" },
  { value: "not_relevant", label: "Quelle unpassend" },
  { value: "missing_source", label: "Keine passende Quelle" },
  { value: "custom_source", label: "Eigene Quelle" },
];

export default function ExpertFeedbackActions({
  activeType,
  onChange,
}: ExpertFeedbackActionsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      {ACTIONS.map((action) => {
        const active = activeType === action.value;

        return (
          <button
            key={action.value}
            type="button"
            onClick={() => onChange(action.value)}
            className={[
              "rounded-xl border px-3 py-2 text-sm font-medium transition",
              active
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500",
            ].join(" ")}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
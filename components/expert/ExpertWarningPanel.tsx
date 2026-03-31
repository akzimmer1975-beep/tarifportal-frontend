"use client";

type ExpertWarningPanelProps = {
  warning?: string | null;
  insufficientSources?: boolean;
};

export default function ExpertWarningPanel({
  warning,
  insufficientSources,
}: ExpertWarningPanelProps) {
  if (!warning && !insufficientSources) return null;

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="font-semibold">Hinweis zur Quellenlage</div>
      <p className="mt-1">
        {warning ||
          "Für diese Frage wurden keine ausreichend belastbaren Tarifquellen gefunden. Diese Antwort sollte im Expertenbereich geprüft und nachbewertet werden."}
      </p>
    </div>
  );
}
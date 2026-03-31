"use client";

import type { ExpertChatSource } from "@/types/expert";

type ExpertSourcePickerProps = {
  sources: ExpertChatSource[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export default function ExpertSourcePicker({
  sources,
  selectedIndex,
  onChange,
}: ExpertSourcePickerProps) {
  if (!sources.length) return null;

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-800">Vorhandene Quelle</span>
      <select
        value={selectedIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-xl border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-800"
      >
        {sources.map((source, index) => (
          <option key={`${source.documentName}-${index}`} value={index}>
            {source.documentName}
            {source.pageNumber ? ` | Seite ${source.pageNumber}` : ""}
            {source.sectionLabel ? ` | ${source.sectionLabel}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
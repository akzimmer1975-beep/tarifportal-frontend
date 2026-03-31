"use client";

type ExpertSectionPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ExpertSectionPicker({
  value,
  onChange,
}: ExpertSectionPickerProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-800">Abschnitt / Unterpunkt</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="z. B. (1), a), aa)"
        className="rounded-xl border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-800"
      />
    </label>
  );
}
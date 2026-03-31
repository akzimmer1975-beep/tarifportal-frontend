"use client";

type ExpertParagraphPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ExpertParagraphPicker({
  value,
  onChange,
}: ExpertParagraphPickerProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-800">Paragraph / Kennung</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="z. B. § 7 oder Absatz 3"
        className="rounded-xl border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-800"
      />
    </label>
  );
}
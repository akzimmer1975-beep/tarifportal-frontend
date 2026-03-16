import Link from "next/link";

export function BackHomeButton() {
  return (
    <Link
      href="/"
      className="inline-flex rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      ← Zurück zum Hauptbildschirm
    </Link>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    router.push(`/compare?query=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">Deine Tariffrage</span>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z. B. Welche Ruhezeiten gelten auswärts?"
          className="min-h-[140px] w-full rounded-2xl border border-gray-300 px-4 py-4 text-base outline-none transition focus:border-gray-900"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Lade..." : "Frage stellen"}
        </button>

        <p className="text-sm text-gray-500">
          Beispiel: „Welche Entgeltregelung gilt für Lokführer?“
        </p>
      </div>
    </form>
  );
}
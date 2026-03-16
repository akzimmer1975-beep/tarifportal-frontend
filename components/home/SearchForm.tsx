"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/vergleichen?query=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-zinc-300 bg-white p-2 shadow-sm">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z. B. Welche Regelungen gelten für Ruhezeiten am Dienstort?"
          className="min-h-[130px] w-full resize-none rounded-xl border-0 bg-transparent p-4 text-base text-zinc-900 outline-none placeholder:text-zinc-400"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
      >
        Tariffrage vergleichen
      </button>
    </form>
  );
}
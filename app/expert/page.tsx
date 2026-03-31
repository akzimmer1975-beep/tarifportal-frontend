"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExpertGate from "@/components/auth/ExpertGate";
import { disableExpertMode } from "@/lib/expert-auth";

export default function ExpertPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = question.trim();
    if (!trimmed) return;

    router.push(`/expert/compare?q=${encodeURIComponent(trimmed)}`);
  }

  function handleLogout() {
    disableExpertMode();
    router.push("/expert/login");
    router.refresh();
  }

  return (
    <ExpertGate>
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              Tarifportal-KI
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Expertenbereich
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
              Hier werden Antworten mit Quellen geprüft, markiert und zur späteren
              Ranking-Verbesserung bewertet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium hover:border-neutral-500"
            >
              Öffentlicher Bereich
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Abmelden
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="expert-question"
                className="mb-2 block text-sm font-medium text-neutral-800"
              >
                Expertenfrage
              </label>
              <textarea
                id="expert-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                placeholder="z. B. Welche Unterschiede gibt es bei Ruhezeiten zwischen GDL und EVG?"
                className="w-full rounded-2xl border border-neutral-300 px-4 py-4 outline-none focus:border-neutral-800"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Im Expertenmodus auswerten
              </button>

              <Link
                href="/compare"
                className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium hover:border-neutral-500"
              >
                Zum normalen Vergleich
              </Link>
            </div>
          </form>
        </section>
      </main>
    </ExpertGate>
  );
}
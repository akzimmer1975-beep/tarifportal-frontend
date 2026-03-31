"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ExpertGate from "@/components/auth/ExpertGate";
import ExpertAnswerView from "@/components/expert/ExpertAnswerView";
import type { ExpertChatResponse } from "@/types/expert";

type ExpertComparePageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    ""
  );
}

export default async function ExpertComparePage({
  searchParams,
}: ExpertComparePageProps) {
  const params = await searchParams;
  const question = params.q?.trim() || "";

  return <ExpertCompareClient question={question} />;
}

function ExpertCompareClient({ question }: { question: string }) {
  const [data, setData] = useState<ExpertChatResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function run() {
      if (!question) return;

      setIsLoading(true);
      setError("");
      setData(null);

      try {
        const baseUrl = getApiBaseUrl();

        const response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: question,
            compareUnions: true,
            mode: "expert",
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Die Expertenauswertung ist fehlgeschlagen.");
        }

        const json = (await response.json()) as ExpertChatResponse;
        setData(json);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Die Expertenauswertung ist fehlgeschlagen.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    run();
  }, [question]);

  return (
    <ExpertGate>
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-wide text-neutral-500">
              Expertenauswertung
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Vergleich mit Bewertungsbereich
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/expert"
              className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium hover:border-neutral-500"
            >
              Zurück zum Expertenbereich
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium hover:border-neutral-500"
            >
              Startseite
            </Link>
          </div>
        </div>

        {!question ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
            Es wurde keine Frage übergeben.
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600 shadow-sm">
            Expertenauswertung läuft…
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {data && question ? (
          <ExpertAnswerView question={question} response={data} />
        ) : null}
      </main>
    </ExpertGate>
  );
}
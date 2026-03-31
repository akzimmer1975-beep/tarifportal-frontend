"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { enableExpertMode, validateExpertPin } from "@/lib/expert-auth";

export default function ExpertPinForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const ok = validateExpertPin(pin);

    if (!ok) {
      setError("PIN ist nicht korrekt.");
      setIsSubmitting(false);
      return;
    }

    enableExpertMode();
    router.push("/expert");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Expertenbereich</h1>
        <p className="text-sm text-neutral-600">
          Zugang für tarifkundige Nutzer zur Quellenbewertung und Ranking-Verbesserung.
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-800">PIN</span>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN eingeben"
          className="rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-800"
        />
      </label>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Zugang öffnen
      </button>
    </form>
  );
}
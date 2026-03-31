import Link from "next/link";
import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl pt-12">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500">Tarifvergleichsportal</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Tarifverträge mit KI durchsuchen und vergleichen
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Stelle eine Frage zu Ruhezeiten, Entgelt, Eingruppierung, Arbeitszeit oder
              tariflichen Unterschieden zwischen GDL und EVG.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <Link
              href="/expert/login"
              className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium hover:border-neutral-500"
            >
              Expertenbereich
            </Link>
          </div>

          <SearchForm />
        </div>
      </div>
    </main>
  );
}
import SearchForm from "@/components/home/SearchForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex max-w-5xl flex-col px-6 py-20">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700">
            Tarifvergleich mit KI
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
            Tariffragen strukturiert vergleichen
          </h1>

          <p className="text-lg leading-8 text-zinc-600">
            Stelle eine Frage zu Tarifverträgen und erhalte eine strukturierte
            Gegenüberstellung von GDL und EVG mit Kurzfazit, Unterschieden,
            Gemeinsamkeiten und Quellen.
          </p>
        </div>

        <div className="mt-10 max-w-3xl">
          <SearchForm />
        </div>
      </div>
    </main>
  );
}
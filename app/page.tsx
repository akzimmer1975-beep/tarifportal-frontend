export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-bold">
          Tarifvergleich mit KI
        </h1>

        <p className="text-gray-600">
          Stelle eine Frage zu Tarifverträgen und vergleiche
          die Regelungen von GDL und EVG.
        </p>

        <form
          action="/vergleichen"
          className="flex flex-col gap-4"
        >
          <textarea
            name="query"
            placeholder="z. B. Welche Regelungen gelten für Ruhezeiten am Dienstort?"
            className="rounded-lg border p-4"
          />

          <button
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Tariffrage vergleichen
          </button>
        </form>
      </div>
    </main>
  )
}
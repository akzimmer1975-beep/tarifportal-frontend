import { ChatApiResponse } from "@/types/tarif";
  const allSources = result.sources ?? [];

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Tarifvergleichsportal</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Antwort auf deine Tariffrage</h1>
          </div>
          <BackHomeButton />
        </header>

        <SectionCard title="Tariffrage">
          <p className="text-3xl font-bold leading-tight">{query}</p>
        </SectionCard>

        <SectionCard title="Kurzfazit">
          <div className="rounded-2xl bg-gray-50 p-4 text-base leading-7 text-gray-800">
            {structured?.kurzfazit || result.answer || "Keine Antwort verfügbar."}
          </div>
        </SectionCard>

        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard title="GDL">
            <p className="text-base leading-7 text-gray-800">
              {structured?.gdl || "Keine explizite tarifliche Regelung gefunden."}
            </p>
          </SectionCard>

          <SectionCard title="EVG">
            <p className="text-base leading-7 text-gray-800">
              {structured?.evg || "Keine explizite tarifliche Regelung gefunden."}
            </p>
          </SectionCard>
        </div>

        <SectionCard title="Unterschiede">
          {unterschiede.length ? (
            <div className="space-y-3">
              {unterschiede.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl bg-gray-50 p-4 text-base leading-7 text-gray-800">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-4 text-gray-500">
              Keine erkannten Unterschiede vorhanden.
            </div>
          )}
        </SectionCard>

        <SectionCard title="Gemeinsamkeiten">
          {gemeinsamkeiten.length ? (
            <div className="space-y-3">
              {gemeinsamkeiten.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl bg-gray-50 p-4 text-base leading-7 text-gray-800">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-4 text-gray-500">
              Keine gemeinsamen Regelungen gefunden.
            </div>
          )}
        </SectionCard>

        <SectionCard title="Quellen">
          <div className="grid gap-6 lg:grid-cols-2">
            <SourcesList title="GDL-Quellen" items={gdlSources} />
            <SourcesList title="EVG-Quellen" items={evgSources} />
          </div>

          {allSources.length ? (
            <div className="mt-6">
              <SourcesList title="Alle Fundstellen" items={allSources} />
            </div>
          ) : null}
        </SectionCard>
      </div>
    </main>
  );
}
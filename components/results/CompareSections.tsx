"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import SourcesSection from "./SourcesSection";
import type { SourceItem } from "@/types/chat";

export type CompareSubsection = {
  key: string;
  title: string;
  summary?: string;
  gdlText: string;
  evgText: string;
  gdlDifferences?: string[];
  evgDifferences?: string[];
  gdlSources?: SourceItem[];
  evgSources?: SourceItem[];
};

type CompareSectionsProps = {
  query: string;
  topicKey?: string;
  sections: CompareSubsection[];
};

function DifferenceBlock({
  title,
  items
}: {
  title: string;
  items?: string[];
}) {
  return (
    <div className="rounded-xl bg-zinc-50 p-4">
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>

      {!items || items.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Keine Besonderheiten gefunden.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="rounded-lg bg-white px-3 py-2 text-sm leading-6 text-zinc-700 ring-1 ring-zinc-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AccordionSection({
  query,
  topicKey,
  section,
  index
}: {
  query: string;
  topicKey?: string;
  section: CompareSubsection;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <section className="space-y-4">
      <Card className="overflow-hidden border-2 border-zinc-200">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-zinc-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Unterrubrik</p>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                {section.title}
              </h2>
            </div>
          </div>

          <span className="text-sm font-medium text-zinc-600">
            {open ? "Einklappen" : "Aufklappen"}
          </span>
        </button>

        {open ? (
          <div className="space-y-4 border-t border-zinc-200 p-5">
            {section.summary ? (
              <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
                <p className="text-sm font-medium text-amber-800">
                  Kurzfazit zur Unterrubrik
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-950">
                  {section.summary}
                </p>
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="space-y-4">
                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="text-xl font-semibold text-zinc-950">GDL</h3>
                </div>

                <p className="whitespace-pre-line leading-7 text-zinc-700">
                  {section.gdlText}
                </p>

                <DifferenceBlock
                  title="Besonderheiten / Unterschiede GDL"
                  items={section.gdlDifferences}
                />
              </Card>

              <Card className="space-y-4">
                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="text-xl font-semibold text-zinc-950">EVG</h3>
                </div>

                <p className="whitespace-pre-line leading-7 text-zinc-700">
                  {section.evgText}
                </p>

                <DifferenceBlock
                  title="Besonderheiten / Unterschiede EVG"
                  items={section.evgDifferences}
                />
              </Card>
            </div>

            <SourcesSection
              query={query}
              topicKey={topicKey}
              sectionKey={section.key}
              title={`Tarifquellen – ${section.title}`}
              gdlSources={section.gdlSources ?? []}
              evgSources={section.evgSources ?? []}
            />
          </div>
        ) : null}
      </Card>
    </section>
  );
}

export default function CompareSections({
  query,
  topicKey,
  sections
}: CompareSectionsProps) {
  if (!sections || sections.length === 0) {
    return (
      <Card>
        <p className="text-zinc-500">Keine Unterrubriken vorhanden.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <AccordionSection
          key={section.key}
          query={query}
          topicKey={topicKey}
          section={section}
          index={index}
        />
      ))}
    </div>
  );
}
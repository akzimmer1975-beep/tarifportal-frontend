import { ReactNode } from "react";

export function SectionCard({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
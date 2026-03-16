import { ReactNode } from "react";

type SectionProps = {
  title: string;
  children: ReactNode;
};

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h2>
      {children}
    </section>
  );
}
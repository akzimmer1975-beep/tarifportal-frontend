import { SourceItem } from "@/types/tarif";

export function formatSourceLabel(source: SourceItem): string {
  const parts = [
    source.union_name,
    source.document_name,
    source.section_title,
    source.paragraph_number ? `§ ${source.paragraph_number}` : undefined
  ].filter(Boolean);

  return parts.join(" · ");
}

export function hasText(value?: string): boolean {
  return Boolean(value && value.trim().length > 0);
}
export type UnionName = "GDL" | "EVG";

export interface SourceItem {
  document: string;
  union: string | null;
  tarif?: string | null;
  tarifType?: string | null;
  funktionsgruppe?: string | null;
  page?: number | null;
  paragraph?: number | null;
  text: string;
  similarity?: number | null;
}

export interface StructuredCompareSection {
  key: string;
  title: string;
  summary?: string;
  gdlText: string;
  evgText: string;
  gdlDifferences: string[];
  evgDifferences: string[];
  gdlSources: SourceItem[];
  evgSources: SourceItem[];
}

export interface StructuredCompareAnswer {
  kurzfazit: string;
  topicKey?: string;
  gdl?: string;
  evg?: string;
  unterschiede?: string[];
  gemeinsamkeiten?: string[];
  sections?: StructuredCompareSection[];
}

export interface ChatResponseBody {
  ok?: boolean;
  answer: string;
  sources: SourceItem[];
  mode?: "single" | "compare";
  structured?: StructuredCompareAnswer;
  sections?: StructuredCompareSection[];
  sourcesByUnion?: {
    GDL: SourceItem[];
    EVG: SourceItem[];
  };
}
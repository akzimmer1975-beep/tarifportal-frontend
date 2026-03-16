export type SourceItem = {
  document_name: string;
  paragraph_id?: string | number;
  snippet?: string;
};

export type SourcesByUnion = {
  GDL: SourceItem[];
  EVG: SourceItem[];
};

export type ChatStructuredResponse = {
  kurzfazit: string;
  gdl: string;
  evg: string;
  unterschiede: string[];
  gemeinsamkeiten: string[];
};

export type ChatApiResponse = {
  ok: boolean;
  mode: "compare" | "answer";
  answer: string;
  structured: ChatStructuredResponse;
  sources: SourceItem[];
  sourcesByUnion: SourcesByUnion;
};
export type StructuredAnswer = {
  kurzfazit?: string;
  gdl?: string;
  evg?: string;
  unterschiede?: string[];
  gemeinsamkeiten?: string[];
};

export type SourceItem = {
  document_name?: string;
  union_name?: string;
  chunk_text?: string;
  similarity?: number;
  section_title?: string;
  paragraph_number?: string;
};

export type ChatApiResponse = {
  ok: boolean;
  mode?: string;
  answer?: string;
  structured?: StructuredAnswer;
  sources?: SourceItem[];
  sourcesByUnion?: {
    GDL?: SourceItem[];
    EVG?: SourceItem[];
  };
  error?: string;
};
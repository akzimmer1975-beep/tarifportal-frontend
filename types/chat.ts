export type SourceItem = {
  document_name: string;
  paragraph_id?: string | number;
  snippet?: string;
};

export type ChatResponse = {
  ok: boolean;
  mode: string;
  answer: string;
  structured: {
    kurzfazit: string;
    gdl: string;
    evg: string;
    unterschiede: string[];
    gemeinsamkeiten: string[];
  };
  sources: SourceItem[];
  sourcesByUnion: {
    GDL: SourceItem[];
    EVG: SourceItem[];
  };
};
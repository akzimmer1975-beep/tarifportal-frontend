export type ExpertMode = "public" | "expert";
export type AnswerConfidence = "high" | "medium" | "low" | "none";

export interface ExpertChatSource {
  id?: string;
  union?: "GDL" | "EVG" | string;
  documentName: string;
  tariffType?: string;
  tariffwerk?: string;
  pageNumber?: number;
  paragraphIndex?: number;
  sectionLabel?: string;
  excerpt: string;
  fullText?: string;
  score?: number;
}

export interface ExpertStructuredAnswer {
  kurzfazit?: string;
  gdl?: string[];
  evg?: string[];
  unterschiede?: string[];
  gemeinsamkeiten?: string[];
  rubrics?: Array<{
    key: string;
    label: string;
    items: string[];
  }>;
}

export interface ExpertChatResponse {
  ok: boolean;
  mode?: "single" | "compare";
  answer?: string;
  structured?: ExpertStructuredAnswer;
  sources?: ExpertChatSource[];
  confidence?: AnswerConfidence;
  insufficientSources?: boolean;
  warning?: string;
}

export type ExpertFeedbackType =
  | "relevant"
  | "preferred"
  | "not_relevant"
  | "missing_source"
  | "custom_source";

export interface ExpertFeedbackPayload {
  question: string;
  answer?: string;
  feedbackType: ExpertFeedbackType;
  source?: {
    union?: string;
    documentName?: string;
    tariffType?: string;
    tariffwerk?: string;
    pageNumber?: number;
    paragraphIndex?: number;
    sectionLabel?: string;
    excerpt?: string;
    fullText?: string;
  };
  customSource?: {
    documentName?: string;
    tariffType?: string;
    paragraphLabel?: string;
    paragraphIndex?: number;
    sectionLabel?: string;
    fullText?: string;
  };
  note?: string;
}
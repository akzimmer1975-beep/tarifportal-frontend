export type FeedbackTargetType = "source" | "answer" | "custom_source";

export type FeedbackType =
  | "relevant"
  | "preferred"
  | "not_relevant"
  | "answer_good"
  | "answer_bad"
  | "sources_good"
  | "sources_bad"
  | "custom_source";

export interface SourceItem {
  document?: string;
  union?: string;
  tariffType?: string;
  tariffwerk?: string;
  funktionsgruppe?: string;
  page?: number | null;
  paragraph?: number | null;
  text?: string;
  similarity?: number | null;
}

export interface CreateFeedbackPayload {
  queryText: string;
  normalizedQuery?: string;
  topicKey?: string;
  sectionKey?: string;
  targetType: FeedbackTargetType;
  feedbackType: FeedbackType;

  source?: {
    documentName?: string;
    unionName?: string;
    tariffType?: string;
    tariffwerk?: string;
    funktionsgruppe?: string;
    pageNumber?: number | null;
    paragraphIndex?: number | null;
    text?: string;
    similarity?: number | null;
  };

  customSource?: {
    documentName?: string;
    unionName?: string;
    tariffType?: string;
    tariffwerk?: string;
    funktionsgruppe?: string;
    pageNumber?: number | null;
    paragraphIndex?: number | null;
    text?: string;
    comment?: string;
  };

  answerText?: string;
  userComment?: string;
}
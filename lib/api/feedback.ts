const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005";

export type FeedbackSourcePayload = {
  documentName: string;
  unionName?: string | null;
  tariffType?: string | null;
  tariffwerk?: string | null;
  funktionsgruppe?: string | null;
  pageNumber?: number | null;
  paragraphIndex?: number | null;
  text: string;
  similarity?: number | null;
};

export type CreateFeedbackPayload = {
  queryText: string;
  topicKey?: string;
  sectionKey?: string;
  targetType: "source";
  feedbackType: "relevant" | "preferred" | "not_relevant";
  source: FeedbackSourcePayload;
};

export async function sendFeedback(payload: CreateFeedbackPayload) {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    const message =
      data?.errors?.join?.(", ") ||
      data?.error ||
      "Feedback konnte nicht gespeichert werden.";
    throw new Error(message);
  }

  return data;
}
import type { CreateFeedbackPayload } from "@/types/feedback";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005";

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
    throw new Error(data.error || "Feedback konnte nicht gespeichert werden.");
  }

  return data;
}
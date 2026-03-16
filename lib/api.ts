import { ChatApiResponse } from "@/types/tarif";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005";

export async function askTarifQuestion(query: string): Promise<ChatApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const data = (await response.json()) as ChatApiResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Fehler beim Abrufen der Antwort.");
  }

  return data;
}
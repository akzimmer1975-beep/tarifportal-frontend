import { ChatApiResponse } from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005";

export async function fetchChatCompare(query: string): Promise<ChatApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      compareUnions: true,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API-Fehler: ${response.status}`);
  }

  const data: ChatApiResponse = await response.json();

  if (!data.ok) {
    throw new Error("Backend hat keine gültige Antwort geliefert.");
  }

  return data;
}
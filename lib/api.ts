import { ChatResponse } from "@/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function askTarif(query: string): Promise<ChatResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL ist nicht gesetzt.");
  }

  const response = await fetch(`${API_URL}/api/chat`, {
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
    throw new Error(`API Fehler: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data;
}
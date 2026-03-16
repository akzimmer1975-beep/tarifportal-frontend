export async function askTarif(query: string) {
  const res = await fetch("http://localhost:3005/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      compareUnions: true,
    }),
  });

  if (!res.ok) {
    throw new Error("API Fehler");
  }

  return res.json();
}
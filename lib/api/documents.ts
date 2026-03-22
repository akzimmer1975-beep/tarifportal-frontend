const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005";

export type ApiDocument = {
  id: number;
  item_id: string;
  name: string;
  union_name: string | null;
  tarif_type: string | null;
  tariffwerk: string | null;
  funktionsgruppe: string | null;
};

export type ApiParagraph = {
  page_number: number | null;
  paragraph_index: number | null;
  chunk_text: string;
};

export async function getDocuments() {
  const res = await fetch(`${API_BASE}/api/documents`, {
    cache: "no-store"
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Dokumente konnten nicht geladen werden.");
  }

  return data as {
    ok: true;
    count: number;
    documents: ApiDocument[];
  };
}

export async function getParagraphs(itemId: string) {
  const res = await fetch(`${API_BASE}/api/documents/${itemId}/paragraphs`, {
    cache: "no-store"
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Paragraphen konnten nicht geladen werden.");
  }

  return data as {
    ok: true;
    itemId: string;
    count: number;
    paragraphs: ApiParagraph[];
  };
}
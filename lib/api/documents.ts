const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005";

export type ApiDocument = {
  id: number;
  item_id: string;
  name: string;
  path: string;
  union_name: string | null;
  tarif_type?: string | null;
  tariff_type?: string | null;
  tariffwerk: string | null;
  funktionsgruppe: string | null;
};

export type ApiParagraphSection = {
  id: string;
  label: string;
  text: string;
  level: number;
  start_offset: number;
  end_offset: number;
};

export type ApiParagraph = {
  page_number: number | null;
  paragraph_index: number | null;
  title: string | null; // ✅ WICHTIG NEU
  full_text: string;
  sections: ApiParagraphSection[];
};

export type GetDocumentsResponse = {
  ok: true;
  count: number;
  documents: ApiDocument[];
};

export type GetParagraphsResponse = {
  ok: true;
  itemId: string;
  count: number;
  paragraphs: ApiParagraph[];
};

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getDocuments(): Promise<GetDocumentsResponse> {
  const res = await fetch(`${API_BASE}/api/documents`);
  const data = await parseJsonSafe(res);

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Dokumente konnten nicht geladen werden.");
  }

  return {
    ok: true,
    count: Array.isArray(data.documents) ? data.documents.length : 0,
    documents: Array.isArray(data.documents) ? data.documents : []
  };
}

export async function getParagraphs(itemId: string): Promise<GetParagraphsResponse> {
  const res = await fetch(
    `${API_BASE}/api/documents/${encodeURIComponent(itemId)}/paragraphs`
  );

  const data = await parseJsonSafe(res);

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Paragraphen konnten nicht geladen werden.");
  }

  return {
    ok: true,
    itemId: typeof data.itemId === "string" ? data.itemId : itemId,
    count: Array.isArray(data.paragraphs) ? data.paragraphs.length : 0,
    paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs : []
  };
}
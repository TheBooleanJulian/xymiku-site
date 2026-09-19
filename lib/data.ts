import { supabase } from "./supabase";
import type { ArchiveEvent, ArchiveImage, CharacterCategory } from "./types";

type ImageRow = {
  id: string;
  event_id: string | null;
  src: string;
  alt: string;
  year: number;
  category: ArchiveImage["category"];
  character: string | null;
  cosplayer: string | null;
  event_label: string | null;
};

type EventSummaryRow = {
  id: string;
  name: string;
  event_date: string;
  status: ArchiveEvent["status"];
  cover_src: string | null;
  image_count: number;
};

type CharacterRow = {
  id: string;
  name: string;
  designation: string;
  href: string;
  cover_src: string | null;
};

function formatDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

function mapImageRow(row: ImageRow): ArchiveImage {
  return {
    id: row.id,
    src: row.src,
    alt: row.alt,
    year: row.year,
    category: row.category,
    character: row.character ?? undefined,
    cosplayer: row.cosplayer ?? undefined,
    event: row.event_label ?? undefined,
  };
}

export async function getRecentEvents(limit = 6): Promise<ArchiveEvent[]> {
  const { data, error } = await supabase
    .from("event_summary")
    .select("id,name,event_date,status,cover_src,image_count")
    .order("event_date", { ascending: false })
    .limit(limit);
  if (error) throw error;

  return ((data ?? []) as EventSummaryRow[]).map((e) => ({
    id: e.id,
    name: e.name,
    date: formatDate(e.event_date),
    imageCount: e.image_count,
    status: e.status,
    cover: e.cover_src ?? "",
  }));
}

export async function getAllEventIds(): Promise<string[]> {
  const { data, error } = await supabase.from("events").select("id");
  if (error) throw error;
  return (data ?? []).map((e) => e.id as string);
}

export async function getEvent(eventId: string): Promise<ArchiveEvent | null> {
  const { data, error } = await supabase
    .from("event_summary")
    .select("id,name,event_date,status,cover_src,image_count")
    .eq("id", eventId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const e = data as EventSummaryRow;
  return {
    id: e.id,
    name: e.name,
    date: formatDate(e.event_date),
    imageCount: e.image_count,
    status: e.status,
    cover: e.cover_src ?? "",
  };
}

export async function getEventImages(eventId: string): Promise<ArchiveImage[]> {
  const { data, error } = await supabase
    .from("images")
    .select("id,event_id,src,alt,year,category,character,cosplayer,event_label")
    .eq("event_id", eventId)
    .order("id", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as ImageRow[]).map(mapImageRow);
}

export async function getTimelineImages(): Promise<ArchiveImage[]> {
  const { data, error } = await supabase
    .from("images")
    .select("id,event_id,src,alt,year,category,character,cosplayer,event_label")
    .eq("timeline_pick", true)
    .order("year", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as ImageRow[]).map(mapImageRow);
}

export async function getFeaturedCosplay(limit = 6): Promise<ArchiveImage[]> {
  const { data, error } = await supabase
    .from("images")
    .select("id,event_id,src,alt,year,category,character,cosplayer,event_label")
    .eq("featured", true)
    .order("year", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as ImageRow[]).map(mapImageRow);
}

export async function getPortfolioWork(): Promise<
  Record<"COSPLAY" | "EVENT" | "PORTRAIT" | "CONCEPTUAL", ArchiveImage[]>
> {
  const { data, error } = await supabase
    .from("images")
    .select("id,event_id,src,alt,year,category,character,cosplayer,event_label")
    .eq("portfolio_pick", true)
    .order("year", { ascending: false });
  if (error) throw error;

  const grouped: Record<"COSPLAY" | "EVENT" | "PORTRAIT" | "CONCEPTUAL", ArchiveImage[]> = {
    COSPLAY: [],
    EVENT: [],
    PORTRAIT: [],
    CONCEPTUAL: [],
  };
  for (const row of (data ?? []) as ImageRow[]) {
    const image = mapImageRow(row);
    const key = image.category.toUpperCase() as keyof typeof grouped;
    grouped[key].push(image);
  }
  return grouped;
}

export async function getCharacterIndex(): Promise<CharacterCategory[]> {
  const [{ data: chars, error: charsError }, { data: images, error: imagesError }] = await Promise.all([
    supabase.from("characters").select("id,name,designation,href,cover_src"),
    supabase.from("images").select("character"),
  ]);
  if (charsError) throw charsError;
  if (imagesError) throw imagesError;

  const counts = new Map<string, number>();
  for (const row of images ?? []) {
    if (!row.character) continue;
    counts.set(row.character, (counts.get(row.character) ?? 0) + 1);
  }

  return ((chars ?? []) as CharacterRow[]).map((c) => ({
    id: c.id,
    name: c.name,
    designation: c.designation,
    count: counts.get(c.name) ?? 0,
    cover: c.cover_src ?? "",
    href: c.href,
  }));
}

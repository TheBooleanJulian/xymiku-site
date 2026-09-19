import { supabase } from "./supabase";
import { listDriveFolder, driveThumbUrl, driveFullUrl, driveGalleryUrl } from "./luxsync";
import type { UplinkEvent, UplinkImage, CharacterCategory } from "./types";

type EventRow = {
  id: string;
  name: string;
  event_date: string;
  status: UplinkEvent["status"];
  drive_folder_id: string;
  cover_drive_file_id: string | null;
};

type CuratedImageRow = {
  id: string;
  drive_file_id: string;
  category: UplinkImage["category"];
  year: number;
  character: string | null;
  cosplayer: string | null;
  event_label: string | null;
};

type CharacterRow = {
  id: string;
  name: string;
  designation: string;
  href: string;
  cover_drive_file_id: string | null;
};

function formatDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

function mapCuratedRow(row: CuratedImageRow): UplinkImage {
  return {
    id: row.id,
    src: driveFullUrl(row.drive_file_id),
    alt: `${row.character ?? row.event_label ?? "Uplink"} photography, ${row.year}`,
    year: row.year,
    category: row.category,
    character: row.character ?? undefined,
    cosplayer: row.cosplayer ?? undefined,
    event: row.event_label ?? undefined,
  };
}

async function eventToUplinkEvent(row: EventRow): Promise<UplinkEvent> {
  const { files } = await listDriveFolder(row.drive_folder_id);
  const sorted = [...files].sort((a, b) => a.createdTime.localeCompare(b.createdTime));
  const coverFileId = row.cover_drive_file_id ?? sorted[0]?.id;
  return {
    id: row.id,
    name: row.name,
    date: formatDate(row.event_date),
    imageCount: sorted.length,
    status: row.status,
    cover: coverFileId ? driveThumbUrl(coverFileId) : "",
    galleryUrl: driveGalleryUrl(row.drive_folder_id),
  };
}

export async function getRecentEvents(limit = 6): Promise<UplinkEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("id,name,event_date,status,drive_folder_id,cover_drive_file_id")
    .order("event_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return Promise.all(((data ?? []) as EventRow[]).map(eventToUplinkEvent));
}

export async function getTimelineImages(): Promise<UplinkImage[]> {
  const { data, error } = await supabase
    .from("curated_images")
    .select("id,drive_file_id,category,year,character,cosplayer,event_label")
    .eq("timeline_pick", true)
    .order("year", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as CuratedImageRow[]).map(mapCuratedRow);
}

export async function getFeaturedCosplay(limit = 6): Promise<UplinkImage[]> {
  const { data, error } = await supabase
    .from("curated_images")
    .select("id,drive_file_id,category,year,character,cosplayer,event_label")
    .eq("featured", true)
    .order("year", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as CuratedImageRow[]).map(mapCuratedRow);
}

export async function getPortfolioWork(): Promise<
  Record<"COSPLAY" | "EVENT" | "PORTRAIT" | "CONCEPTUAL", UplinkImage[]>
> {
  const { data, error } = await supabase
    .from("curated_images")
    .select("id,drive_file_id,category,year,character,cosplayer,event_label")
    .eq("portfolio_pick", true)
    .order("year", { ascending: false });
  if (error) throw error;

  const grouped: Record<"COSPLAY" | "EVENT" | "PORTRAIT" | "CONCEPTUAL", UplinkImage[]> = {
    COSPLAY: [],
    EVENT: [],
    PORTRAIT: [],
    CONCEPTUAL: [],
  };
  for (const row of (data ?? []) as CuratedImageRow[]) {
    const image = mapCuratedRow(row);
    const key = image.category.toUpperCase() as keyof typeof grouped;
    grouped[key].push(image);
  }
  return grouped;
}

export async function getCharacterIndex(): Promise<CharacterCategory[]> {
  const [{ data: chars, error: charsError }, { data: images, error: imagesError }] = await Promise.all([
    supabase.from("characters").select("id,name,designation,href,cover_drive_file_id"),
    supabase.from("curated_images").select("character"),
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
    cover: c.cover_drive_file_id ? driveThumbUrl(c.cover_drive_file_id) : "",
    href: c.href,
  }));
}

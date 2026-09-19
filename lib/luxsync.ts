// LuxSync (https://github.com/TheBooleanJulian/luxsync-v3) is the Drive-reading,
// image-caching layer shared across projects. This site never stores photo
// bytes itself — it calls LuxSync's public API at build time to list a Drive
// folder's images, then embeds LuxSync's own thumb/full URLs directly in the
// static HTML.

const LUXSYNC_URL = (process.env.NEXT_PUBLIC_LUXSYNC_URL ?? "https://luxsync-v3.thebooleanjulian.dev").replace(/\/$/, "");

export type DriveFile = {
  id: string;
  name: string;
  createdTime: string;
};

export async function listDriveFolder(folderId: string): Promise<{ name: string; files: DriveFile[] }> {
  const res = await fetch(`${LUXSYNC_URL}/api/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "drive", source: folderId }),
  });
  if (!res.ok) {
    throw new Error(`LuxSync /api/gallery failed for folder ${folderId}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export function driveThumbUrl(fileId: string): string {
  return `${LUXSYNC_URL}/api/thumb/drive/${fileId}`;
}

export function driveFullUrl(fileId: string): string {
  return `${LUXSYNC_URL}/api/full/drive/${fileId}`;
}

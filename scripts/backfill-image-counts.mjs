#!/usr/bin/env node
// Fills events.image_count for every event with a drive_folder_id, by
// listing each folder via LuxSync. Needed once for events registered
// before the image_count column existed (register-event.mjs now sets it
// automatically going forward), or any time you want to refresh several
// events at once after adding photos to their folders.
//
// Throttled to stay under LuxSync's /api/gallery rate limit of 20/min —
// with dozens of events this takes several minutes, that's expected.
//
// Usage: node scripts/backfill-image-counts.mjs
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY (service role, not anon — RLS blocks writes).

import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env.local") });

const LUXSYNC_URL = (process.env.NEXT_PUBLIC_LUXSYNC_URL ?? "https://luxsync-v3.thebooleanjulian.dev").replace(/\/$/, "");
const DELAY_MS = 3500; // ~17/min, safely under the 20/min limit

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function listDriveFolder(folderId) {
  const res = await fetch(`${LUXSYNC_URL}/api/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "drive", source: folderId }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey);

  const { data: events, error } = await supabase
    .from("events")
    .select("id,name,drive_folder_id")
    .not("drive_folder_id", "is", null);
  if (error) throw error;

  console.log(`${events.length} events to update. Estimated time: ${((events.length * DELAY_MS) / 1000 / 60).toFixed(1)} min`);

  let ok = 0;
  let failed = 0;
  for (const [i, event] of events.entries()) {
    try {
      const { files } = await listDriveFolder(event.drive_folder_id);
      const { error: updateError } = await supabase
        .from("events")
        .update({ image_count: files.length })
        .eq("id", event.id);
      if (updateError) throw updateError;
      ok++;
      console.log(`[${i + 1}/${events.length}] OK: ${event.name} -> ${files.length} images`);
    } catch (err) {
      failed++;
      console.error(`[${i + 1}/${events.length}] FAILED: ${event.name} -- ${err.message}`);
    }
    if (i < events.length - 1) await sleep(DELAY_MS);
  }

  console.log(`Done. ${ok} updated, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

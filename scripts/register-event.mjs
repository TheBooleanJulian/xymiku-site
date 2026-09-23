#!/usr/bin/env node
// Register an event gallery backed by a Google Drive folder LuxSync can read.
//
// Usage:
//   node scripts/register-event.mjs \
//     --event-id afa-2026 --event-name "AFA 2026" --event-date 2026-09-12 \
//     [--drive-folder-id 1Hicrzj1HwGDV_jwIBvETbR76DVwrRZwj] \
//     [--status online] [--cover-file-id <a specific Drive file id>] \
//     [--cover-position center|top|bottom] \
//     [--external-url <link to use until a Drive folder exists>] \
//     [--image-count <manual count, for events with no drive-folder-id>]
//
// There is no file upload here: the photos already live in the Drive folder
// (the usual PhotoVault workflow) and LuxSync reads/caches them directly.
// This just tells xymiku-site which folder an event's gallery maps to.
// Re-running with the same --event-id updates that event's row (upsert).
//
// --cover-file-id picks which photo shows on the homepage card. Without it,
// the site just uses whichever file Drive reports as created first in the
// folder — often not the most flattering shot. Grab a file id from the
// folder's LuxSync gallery URL or listing.
//
// --cover-position controls the crop bias when that cover doesn't match the
// card's fixed aspect ratio (default: center). Portrait covers often need
// "top" to keep a face in frame instead of it getting cropped out.
//
// --drive-folder-id can be omitted for a shoot that hasn't been organized
// into a Drive folder yet (e.g. --status processing) — the card then falls
// back to --external-url (a preview gallery hosted elsewhere) or just links
// to the homepage if neither is set. Re-run with --drive-folder-id once the
// real folder exists to switch the card over to it.
//
// --image-count only matters without --drive-folder-id (e.g. delivered via
// Pixieset/Lightroom instead of Drive) — there's no API to count those
// automatically, so the "N IMAGES" line is just hidden unless you set this.
//
// With --drive-folder-id, the count is instead fetched from LuxSync and
// cached in events.image_count automatically (one API call, so no rate-
// limit concern here — unlike /gallery listing every event's folder at
// once). Re-run with the same args any time to refresh it after adding
// more photos to the folder. If a folder already has many events needing
// a refresh, use scripts/backfill-image-counts.mjs instead (it throttles
// across LuxSync's 20/min limit).
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// (the service role key, NOT the anon key — RLS blocks writes from the anon key).

import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env.local") });

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    args[argv[i].slice(2)] = argv[i + 1];
    i++;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const required = ["event-id", "event-name", "event-date"];
  const missing = required.filter((k) => !args[k]);
  if (missing.length) {
    console.error(`Missing required args: ${missing.map((k) => `--${k}`).join(", ")}`);
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey);

  const row = {
    id: args["event-id"],
    name: args["event-name"],
    event_date: args["event-date"],
    status: args.status ?? "online",
    drive_folder_id: args["drive-folder-id"] || null,
  };
  if (args["cover-file-id"]) row.cover_drive_file_id = args["cover-file-id"];
  if (args["external-url"]) row.external_url = args["external-url"];
  if (args["cover-position"]) row.cover_position = args["cover-position"];
  if (args["image-count"]) row.image_count_override = Number(args["image-count"]);

  if (row.drive_folder_id) {
    const luxsyncUrl = (process.env.NEXT_PUBLIC_LUXSYNC_URL ?? "https://luxsync-v3.thebooleanjulian.dev").replace(/\/$/, "");
    try {
      const res = await fetch(`${luxsyncUrl}/api/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "drive", source: row.drive_folder_id }),
      });
      if (res.ok) {
        const { files } = await res.json();
        row.image_count = files.length;
      } else {
        console.warn(`Couldn't fetch image count from LuxSync (${res.status}) — leaving it unset.`);
      }
    } catch (err) {
      console.warn(`Couldn't fetch image count from LuxSync (${err.message}) — leaving it unset.`);
    }
  }

  const { error } = await supabase.from("events").upsert(row);
  if (error) throw error;

  const dest = args["drive-folder-id"]
    ? `Drive folder ${args["drive-folder-id"]}`
    : args["external-url"]
      ? `external link ${args["external-url"]}`
      : "the homepage (no folder or external link set)";
  console.log(`Registered "${args["event-name"]}" -> ${dest}.`);
  console.log(`Run "npm run build" to regenerate the static site with this gallery live.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

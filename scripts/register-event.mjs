#!/usr/bin/env node
// Register an event gallery backed by a Google Drive folder LuxSync can read.
//
// Usage:
//   node scripts/register-event.mjs \
//     --event-id afa-2026 --event-name "AFA 2026" --event-date 2026-09-12 \
//     --drive-folder-id 1Hicrzj1HwGDV_jwIBvETbR76DVwrRZwj \
//     [--status online] [--cover-file-id <a specific Drive file id>]
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
  const required = ["event-id", "event-name", "event-date", "drive-folder-id"];
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
    drive_folder_id: args["drive-folder-id"],
  };
  if (args["cover-file-id"]) row.cover_drive_file_id = args["cover-file-id"];

  const { error } = await supabase.from("events").upsert(row);
  if (error) throw error;

  console.log(`Registered "${args["event-name"]}" -> Drive folder ${args["drive-folder-id"]}.`);
  console.log(`Run "npm run build" to regenerate the static site with this gallery live.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

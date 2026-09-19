#!/usr/bin/env node
// Populate an event gallery from a local folder of photos.
//
// Usage:
//   node scripts/upload-shoot.mjs \
//     --event-id afa-2026 --event-name "AFA 2026" --event-date 2026-09-12 \
//     --folder "C:/shoots/afa-2026" \
//     [--category cosplay] [--character "Hatsune Miku"] [--cosplayer "Xymiku.39"] \
//     [--status online] [--cover <filename in folder>] \
//     [--featured <filename,filename>] [--timeline-pick <filename>] [--portfolio-pick <filename,filename>]
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// (the service role key, NOT the anon key — this script needs write access and
// bypasses RLS; never expose it in the app itself).
//
// Uploads every image in --folder to the "gallery" Storage bucket under
// <event-id>/<filename>, then upserts one `events` row and one `images` row
// per file. Re-running with the same folder is safe: files and rows are
// upserted by id (derived from event-id + filename).

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env.local") });

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const CONTENT_TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    const value = argv[i + 1];
    args[key] = value;
    i++;
  }
  return args;
}

function slugify(filename) {
  return path
    .parse(filename)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const required = ["event-id", "event-name", "event-date", "folder"];
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

  const eventId = args["event-id"];
  const category = args.category ?? "event";
  const character = args.character ?? null;
  const cosplayer = args.cosplayer ?? null;
  const status = args.status ?? "online";
  const year = new Date(args["event-date"]).getUTCFullYear();

  const featured = new Set((args.featured ?? "").split(",").filter(Boolean));
  const timelinePicks = new Set((args["timeline-pick"] ?? "").split(",").filter(Boolean));
  const portfolioPicks = new Set((args["portfolio-pick"] ?? "").split(",").filter(Boolean));

  const folder = args.folder;
  const entries = await readdir(folder);
  const files = entries.filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.error(`No image files found in ${folder}`);
    process.exit(1);
  }
  console.log(`Found ${files.length} images in ${folder}`);

  const publicUrls = [];
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const storagePath = `${eventId}/${file}`;
    const bytes = await readFile(path.join(folder, file));

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, bytes, { contentType: CONTENT_TYPES[ext], upsert: true });
    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from("gallery").getPublicUrl(storagePath);
    publicUrls.push({ file, src: pub.publicUrl });
    console.log(`  uploaded ${file}`);
  }

  const coverFile = args.cover ?? files[0];
  const cover = publicUrls.find((p) => p.file === coverFile)?.src ?? publicUrls[0].src;

  const { error: eventError } = await supabase.from("events").upsert({
    id: eventId,
    name: args["event-name"],
    event_date: args["event-date"],
    status,
    cover_src: cover,
  });
  if (eventError) throw eventError;

  const imageRows = publicUrls.map(({ file, src }) => ({
    id: `${eventId}-${slugify(file)}`,
    event_id: eventId,
    src,
    alt: `${character ?? args["event-name"]} photography, ${args["event-name"]}`,
    year,
    category,
    character,
    cosplayer,
    event_label: args["event-name"],
    featured: featured.has(file),
    timeline_pick: timelinePicks.has(file),
    portfolio_pick: portfolioPicks.has(file),
  }));

  const { error: imagesError } = await supabase.from("images").upsert(imageRows);
  if (imagesError) throw imagesError;

  console.log(`Done. Event "${args["event-name"]}" now has ${imageRows.length} images.`);
  console.log(`Run "npm run build" to regenerate the static site with this gallery live.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

-- XYMiku39 archive schema.
-- Run this in the Supabase project's SQL editor (Database -> SQL Editor -> New query).
--
-- Photos themselves are NOT stored here or in Supabase Storage. Each event
-- just points at the Google Drive folder its deliverables already live in
-- (the existing PhotoVault workflow); LuxSync (https://luxsync-v3...) is the
-- Drive-reading, image-caching layer, and lib/data.ts calls its public API
-- at build time to list/render an event's photos. This table only holds the
-- metadata + curation choices LuxSync has no concept of.

create table if not exists events (
  id text primary key,
  name text not null,
  event_date date not null,
  status text not null default 'processing' check (status in ('online', 'processing', 'archived')),
  drive_folder_id text not null,
  created_at timestamptz not null default now()
);

-- Cross-event curated picks (featured cosplay, timeline, portfolio, and
-- character-index cover art) reference a single Drive file id directly —
-- these can point at any public Drive image, not just ones inside an
-- `events` row's folder.
create table if not exists curated_images (
  id text primary key,
  drive_file_id text not null,
  category text not null check (category in ('cosplay', 'event', 'portrait', 'conceptual')),
  year int not null,
  character text,
  cosplayer text,
  event_label text,
  featured boolean not null default false,
  timeline_pick boolean not null default false,
  portfolio_pick boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists curated_images_character_idx on curated_images(character);

create table if not exists characters (
  id text primary key,
  name text not null,
  designation text not null,
  href text not null default '#',
  cover_drive_file_id text,
  created_at timestamptz not null default now()
);

-- This is a public photo archive: anyone can read, only the service role
-- (used by scripts/register-event.mjs, never shipped to the browser) can write.
alter table events enable row level security;
alter table curated_images enable row level security;
alter table characters enable row level security;

create policy "public read events" on events for select using (true);
create policy "public read curated_images" on curated_images for select using (true);
create policy "public read characters" on characters for select using (true);

-- XYMiku39 archive schema.
-- Run this in the Supabase project's SQL editor (Database -> SQL Editor -> New query).
-- Also create a public Storage bucket named "gallery" via Storage -> New bucket
-- (toggle "Public bucket" on) — this SQL only covers the two tables + character
-- roster, not the storage bucket itself.

create table if not exists events (
  id text primary key,
  name text not null,
  event_date date not null,
  status text not null default 'processing' check (status in ('online', 'processing', 'archived')),
  cover_src text,
  created_at timestamptz not null default now()
);

create table if not exists images (
  id text primary key,
  event_id text references events(id) on delete set null,
  src text not null,
  alt text not null default '',
  year int not null,
  category text not null check (category in ('cosplay', 'event', 'portrait', 'conceptual')),
  character text,
  cosplayer text,
  event_label text,
  featured boolean not null default false,
  timeline_pick boolean not null default false,
  portfolio_pick boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists characters (
  id text primary key,
  name text not null,
  designation text not null,
  href text not null default '#',
  cover_src text,
  created_at timestamptz not null default now()
);

create index if not exists images_event_id_idx on images(event_id);
create index if not exists images_character_idx on images(character);

-- Adds image_count so recent-events cards don't need a second query.
create or replace view event_summary as
select e.*, count(i.id) as image_count
from events e
left join images i on i.event_id = e.id
group by e.id;

-- This is a public photo archive: anyone can read, only the service role
-- (used by the upload script, never shipped to the browser) can write.
alter table events enable row level security;
alter table images enable row level security;
alter table characters enable row level security;

create policy "public read events" on events for select using (true);
create policy "public read images" on images for select using (true);
create policy "public read characters" on characters for select using (true);

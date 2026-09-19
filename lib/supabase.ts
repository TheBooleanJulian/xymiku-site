import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in .env.local (see .env.local.example)."
  );
}

// Read-only anon client, used at build time by Server Components to fetch
// archive data. Safe to expose: RLS policies in supabase/schema.sql only
// grant public SELECT.
export const supabase = createClient(url, anonKey);

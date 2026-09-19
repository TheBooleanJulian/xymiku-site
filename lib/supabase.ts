import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in .env.local (see .env.local.example)."
  );
}

// Shared client: used at build time by Server Components (read-only there),
// and in the browser by /admin, where a signed-in Supabase Auth session lets
// it write too. Safe to expose the anon key itself — RLS policies in
// supabase/schema.sql are what actually gate reads/writes, not this key.
export const supabase = createClient(url, anonKey);

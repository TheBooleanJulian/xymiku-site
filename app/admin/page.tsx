"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) setError(error.message);
  }

  if (session === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-technical text-sm text-mute">LOADING...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <form
          onSubmit={handleSignIn}
          className="w-full max-w-sm border border-cyan/20 bg-deep/40 p-6"
        >
          <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
            ◆ ADMIN ACCESS
          </p>
          <h1 className="mt-2 font-display text-xl font-bold text-ink">Sign in</h1>

          <label className="mt-6 block font-technical text-[10px] tracking-[0.15em] text-mute">
            EMAIL
          </label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-cyan/30 bg-black px-3 py-2 font-technical text-sm text-ink focus:border-cyan focus:outline-none"
          />

          <label className="mt-4 block font-technical text-[10px] tracking-[0.15em] text-mute">
            PASSWORD
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-cyan/30 bg-black px-3 py-2 font-technical text-sm text-ink focus:border-cyan focus:outline-none"
          />

          {error && (
            <p className="mt-4 font-technical text-xs text-signal">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full border border-cyan bg-cyan px-4 py-2 font-display text-sm font-bold tracking-[0.15em] text-black disabled:opacity-50"
          >
            {submitting ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </main>
    );
  }

  return <AdminDashboard userEmail={session.user.email ?? ""} />;
}

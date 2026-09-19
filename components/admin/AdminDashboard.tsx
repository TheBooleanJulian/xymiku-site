"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { EventsPanel } from "./EventsPanel";
import { CuratedImagesPanel } from "./CuratedImagesPanel";
import { CharactersPanel } from "./CharactersPanel";

const TABS = ["EVENTS", "CURATED IMAGES", "CHARACTERS"] as const;
type Tab = (typeof TABS)[number];

export function AdminDashboard({ userEmail }: { userEmail: string }) {
  const [tab, setTab] = useState<Tab>("EVENTS");

  return (
    <main className="min-h-screen bg-black px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan/15 pb-4">
          <div>
            <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
              ◆ ADMIN
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink">
              Gallery Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4 font-technical text-xs text-mute">
            <span>{userEmail}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="border border-cyan/30 px-3 py-1.5 text-cyan hover:border-cyan"
            >
              SIGN OUT
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b border-cyan/15">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-3 py-2 font-technical text-xs tracking-[0.1em] ${
                tab === t
                  ? "border-cyan text-cyan"
                  : "border-transparent text-mute hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "EVENTS" && <EventsPanel />}
          {tab === "CURATED IMAGES" && <CuratedImagesPanel />}
          {tab === "CHARACTERS" && <CharactersPanel />}
        </div>
      </div>
    </main>
  );
}

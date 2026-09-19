"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { UplinkEvent } from "@/lib/types";
import { UplinkPlaceholder } from "./UplinkPlaceholder";

const STATUS_LABEL: Record<string, string> = {
  online: "UPLINK ONLINE",
  processing: "⚠ NOT YET INDEXED",
  archived: "ARCHIVED",
};

export function GalleryBrowser({ events }: { events: UplinkEvent[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event) => event.name.toLowerCase().includes(q));
  }, [events, query]);

  return (
    <div>
      <div className="relative mb-10 max-w-lg">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search event"
          className="w-full border border-cyan/30 bg-black px-4 py-4 font-technical text-sm text-ink placeholder:text-mute focus:border-cyan focus:outline-none"
        />
      </div>

      <p className="mb-6 font-technical text-xs text-mute">
        {filtered.length.toLocaleString()} EVENT{filtered.length === 1 ? "" : "S"}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <a
            key={event.id}
            href={event.galleryUrl}
            target={event.galleryUrl.startsWith("http") ? "_blank" : undefined}
            rel={event.galleryUrl.startsWith("http") ? "noopener" : undefined}
            className="group border border-cyan/15 bg-deep/40 transition-colors hover:border-cyan/50"
          >
            <UplinkPlaceholder
              image={{
                id: event.id,
                src: event.cover,
                alt: event.name,
                year: Number(event.date.slice(-4)),
                category: "event",
                event: event.name,
                objectPosition: event.coverPosition,
              }}
              showMeta={false}
              className="aspect-[4/3]"
            />
            <div className="p-4">
              <p className="font-display text-base font-bold text-ink">{event.name}</p>
              <p className="mt-1 font-technical text-xs text-mute">{event.date}</p>
              {event.status === "processing" ? (
                <p className="hud-badge-alert mt-2 font-technical text-[10px] tracking-[0.15em]">
                  {STATUS_LABEL[event.status]}
                </p>
              ) : (
                <p className="mt-2 flex items-center gap-1.5 font-technical text-[10px] tracking-[0.15em] text-cyan">
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-cyan ${event.status === "online" ? "pulse-dot" : ""}`}
                  />
                  {STATUS_LABEL[event.status]}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="font-technical text-sm text-mute">No events match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}

"use client";

import type { UplinkEvent } from "@/lib/types";
import { UplinkPlaceholder } from "./UplinkPlaceholder";

const STATUS_LABEL: Record<string, string> = {
  online: "UPLINK ONLINE",
  processing: "⚠ NOT YET INDEXED",
  archived: "ARCHIVED",
};

export function PhotoDelivery({ events: recentEvents }: { events: UplinkEvent[] }) {
  return (
    <section
      id="photo-delivery"
      className="border-b border-cyan/15 px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
          ◆ PHOTO SIGNAL
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          FIND YOUR PHOTOS
        </h2>
        <p className="mt-2 max-w-md font-technical text-sm text-mute">
          Looking for photographs from an event?
        </p>

        <form action="/gallery" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            placeholder="Search event"
            className="flex-1 border border-cyan/30 bg-black px-4 py-4 font-technical text-sm text-ink placeholder:text-mute focus:border-cyan focus:outline-none"
          />
          <button
            type="submit"
            className="border border-cyan bg-cyan px-6 py-4 font-display text-sm font-bold tracking-[0.15em] text-black transition-transform hover:scale-[1.02]"
          >
            SEARCH UPLINK
          </button>
        </form>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentEvents.map((event) => (
            <a
              key={event.id}
              href={event.galleryUrl}
              target="_blank"
              rel="noopener"
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
                <p className="font-display text-base font-bold text-ink">
                  {event.name}
                </p>
                <p className="mt-1 font-technical text-xs text-mute">
                  {event.date}
                </p>
                {event.imageCount > 0 && (
                  <p className="mt-1 font-technical text-xs text-mute">
                    {event.imageCount.toLocaleString()} IMAGES
                  </p>
                )}
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

        <a
          href="/gallery"
          className="mt-8 inline-block border border-cyan/30 px-6 py-3 font-technical text-xs tracking-[0.15em] text-cyan transition-colors hover:border-cyan hover:bg-cyan/10"
        >
          VIEW ALL EVENTS →
        </a>
      </div>
    </section>
  );
}

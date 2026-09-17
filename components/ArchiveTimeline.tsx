import { timelineImages } from "@/lib/mock-data";
import { ArchivePlaceholder } from "./ArchivePlaceholder";

export function ArchiveTimeline() {
  return (
    <section id="archive" className="border-b border-cyan/15 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
            ◆ ARCHIVE 39
          </p>
          <span className="hud-badge font-technical text-[9px] tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-dot" />
            LIVE FEED
          </span>
        </div>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          FIVE YEARS OF MIKU
        </h2>
        <p className="mt-2 max-w-md font-technical text-sm text-mute">
          A chronological record — 2021 through 2026.
        </p>
        <p className="mt-1 font-technical text-[10px] tracking-[0.2em] text-cyan/50">
          ARCHIVE SPAN // 2021 {"→"} 2026
        </p>
      </div>

      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:gap-6">
        {timelineImages.map((image) => (
          <div
            key={image.id}
            className="w-[70vw] shrink-0 snap-start sm:w-[38vw] lg:w-[22vw]"
          >
            <p className="mb-2 font-display text-2xl font-bold text-cyan">
              {image.year}
            </p>
            <ArchivePlaceholder image={image} className="aspect-[3/4]" />
          </div>
        ))}
      </div>
    </section>
  );
}

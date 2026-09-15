import type { ArchiveImage } from "@/lib/types";

// Stand-in for real photography until the archive is wired up to a live
// image source. Renders a deterministic technical gradient + metadata
// card instead of an <img>, so there is never a broken image path while
// the mock data is in place. Swap this out for next/image once real
// ArchiveImage.src values point at actual files.

function hashHue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % 40; // small hue jitter around cyan
}

export function ArchivePlaceholder({
  image,
  showMeta = true,
  className = "",
}: {
  image: ArchiveImage;
  showMeta?: boolean;
  className?: string;
}) {
  const hue = 178 + hashHue(image.id);

  return (
    <div
      className={`relative overflow-hidden bg-deep ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 120% at 20% 10%, hsla(${hue}, 70%, 22%, 0.9), transparent 60%), linear-gradient(160deg, #050709 0%, #06131a 55%, #020404 100%)`,
      }}
      aria-hidden={showMeta ? undefined : true}
      role={showMeta ? "img" : undefined}
      aria-label={showMeta ? image.alt : undefined}
    >
      <div className="absolute inset-0 scan-grid opacity-40" />
      <div className="absolute inset-0 border border-cyan/10" />

      {/* corner brackets */}
      <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-cyan/50" />
      <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-cyan/50" />

      {showMeta && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 font-technical text-[10px] tracking-wider text-cyan/80">
          <span className="truncate">
            {image.character ?? image.event ?? "ARCHIVE"}
          </span>
          <span className="shrink-0 text-mute">{image.year}</span>
        </div>
      )}
    </div>
  );
}

import type { ArchiveImage } from "@/lib/types";

// Renders the real photo when ArchiveImage.src is a live URL (Supabase
// Storage). Falls back to a deterministic technical gradient card for any
// image that has no src yet, so there is never a broken image path.

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
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
  const seed = hashSeed(image.id);
  // ~1 in 5 cards reads as a magenta signal variant, keeping the cyan/magenta
  // split across the archive roughly in line with the site's accent ratio.
  const isSignal = seed % 5 === 0;
  const hue = isSignal ? 320 + (seed % 20) : 178 + (seed % 40);
  const hasRealImage = /^https?:\/\//.test(image.src);

  return (
    <div
      className={`relative overflow-hidden bg-deep ${className}`}
      style={
        hasRealImage
          ? undefined
          : {
              backgroundImage: `radial-gradient(120% 120% at 20% 10%, hsla(${hue}, 70%, 22%, 0.9), transparent 60%), linear-gradient(160deg, #050709 0%, #06131a 55%, #020404 100%)`,
            }
      }
      aria-hidden={showMeta ? undefined : true}
      role={showMeta ? "img" : undefined}
      aria-label={showMeta ? image.alt : undefined}
    >
      {hasRealImage ? (
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 scan-grid opacity-40" />
      )}
      <div
        className={`absolute inset-0 border ${isSignal ? "border-signal/10" : "border-cyan/10"}`}
      />

      {/* corner brackets */}
      <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-cyan/50" />
      <span
        className={`absolute bottom-2 right-2 h-3 w-3 border-b border-r ${isSignal ? "border-signal/60" : "border-cyan/50"}`}
      />

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

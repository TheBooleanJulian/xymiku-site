import type { UplinkImage } from "@/lib/types";

// Renders the real photo when UplinkImage.src is a live URL (Supabase
// Storage). Falls back to a deterministic technical gradient card for any
// image that has no src yet, so there is never a broken image path.

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

// The root div below hardcodes `relative`. Passing a `className` that also
// sets position (e.g. "absolute inset-0") won't override it — Tailwind's
// cascade order, not prop order, decides which wins, and `relative` wins
// here — leaving the div height-0 and its image invisible. Wrap this
// component in your own positioned div instead of trying to reposition it
// via className (see Hero.tsx for the pattern).
export function UplinkPlaceholder({
  image,
  showMeta = true,
  className = "",
}: {
  image: UplinkImage;
  showMeta?: boolean;
  className?: string;
}) {
  const seed = hashSeed(image.id);
  // ~1 in 5 cards reads as a magenta signal variant, keeping the cyan/magenta
  // split across the archive roughly in line with the site's accent ratio.
  const isSignal = seed % 5 === 0;
  const hue = isSignal ? 320 + (seed % 20) : 178 + (seed % 40);
  const hasRealImage = /^(https?:\/\/|\/[^/])/.test(image.src);
  const positionClass =
    image.objectPosition === "top"
      ? "object-top"
      : image.objectPosition === "bottom"
        ? "object-bottom"
        : "object-center";

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
          className={`absolute inset-0 h-full w-full object-cover ${positionClass}`}
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
            {image.character ?? image.event ?? "UPLINK"}
          </span>
          <span className="shrink-0 text-mute">{image.year}</span>
        </div>
      )}
    </div>
  );
}

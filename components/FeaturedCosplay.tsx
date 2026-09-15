import { featuredCosplay } from "@/lib/mock-data";
import { ArchivePlaceholder } from "./ArchivePlaceholder";

export function FeaturedCosplay() {
  return (
    <section className="border-b border-cyan/15 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
          ◆ FEATURED
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          FEATURED COSPLAY
        </h2>

        <div className="mt-10 columns-2 gap-3 sm:columns-3 lg:columns-3 [&>*]:mb-3">
          {featuredCosplay.map((image, i) => (
            <div key={image.id} className="break-inside-avoid">
              <ArchivePlaceholder
                image={image}
                className={i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}
              />
              <div className="mt-1.5 flex items-center justify-between font-technical text-[10px] tracking-wide text-mute">
                <span className="truncate">{image.cosplayer}</span>
                <span>{image.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

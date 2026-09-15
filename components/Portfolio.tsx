import { portfolioWork } from "@/lib/mock-data";
import { ArchivePlaceholder } from "./ArchivePlaceholder";

export function Portfolio() {
  return (
    <section id="portfolio" className="border-b border-cyan/15 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
          ◆ SELECTED WORK
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          PORTFOLIO
        </h2>

        <div className="mt-10 flex flex-col gap-16">
          {(Object.keys(portfolioWork) as Array<keyof typeof portfolioWork>).map(
            (category) => (
              <div key={category}>
                <h3 className="mb-4 font-technical text-xs tracking-[0.25em] text-cyan">
                  {category}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {portfolioWork[category].map((image) => (
                    <ArchivePlaceholder
                      key={image.id}
                      image={image}
                      className="aspect-[16/10]"
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

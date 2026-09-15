import { characterIndex } from "@/lib/mock-data";
import { ArchivePlaceholder } from "./ArchivePlaceholder";

export function CharacterIndex() {
  return (
    <section className="border-b border-cyan/15 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
          ◆ CHARACTER INDEX
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          CATALOGUED COSTUMES
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {characterIndex.map((c) => (
            <a
              key={c.id}
              href={c.href}
              className="group relative overflow-hidden border border-cyan/15 hover:border-cyan/50"
            >
              <ArchivePlaceholder
                image={{
                  id: c.id,
                  src: c.cover,
                  alt: c.name,
                  year: 2026,
                  category: "cosplay",
                  character: c.name,
                }}
                showMeta={false}
                className="aspect-square"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3">
                <p className="font-technical text-[9px] tracking-[0.2em] text-cyan">
                  {c.designation} · {c.count.toLocaleString()}
                </p>
                <p className="font-display text-sm font-bold leading-tight text-ink">
                  {c.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

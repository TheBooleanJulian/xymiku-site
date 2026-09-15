import { diagnostics } from "@/lib/mock-data";

export function SystemDiagnostics() {
  return (
    <section className="border-b border-cyan/15 bg-deep/60 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 font-technical text-[11px] tracking-[0.3em] text-cyan">
          ◆ SYSTEM DIAGNOSTICS
        </p>
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-cyan/15 bg-cyan/15 sm:grid-cols-3 lg:grid-cols-6">
          {diagnostics.map((stat) => (
            <div key={stat.label} className="bg-black px-4 py-5">
              <p className="font-technical text-[9px] tracking-[0.2em] text-mute">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-lg font-bold text-ink">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

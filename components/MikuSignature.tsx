const WORDS = ["CAPTURED", "PRESERVED", "ARCHIVED", "REMEMBERED"];

export function MikuSignature() {
  return (
    <section className="border-b border-cyan/15 px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 border border-cyan/30 bg-cyan-panel/20 px-8 py-12 text-center border-glow">
        <p className="font-display text-6xl font-bold text-cyan text-glow sm:text-7xl">
          39
        </p>
        <p className="font-technical text-xs tracking-[0.3em] text-mute">
          MIKU SIGNATURE
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-technical text-[11px] tracking-[0.2em] text-cyan">
          {WORDS.map((w, i) => (
            <span key={w} className="flex items-center gap-3">
              {w}
              {i < WORDS.length - 1 && <span className="text-mute">/</span>}
            </span>
          ))}
        </div>
        <p className="font-technical text-[10px] tracking-[0.2em] text-mute">
          SYNTHESIS COMPLETE // 2021 {"→"} 2026
        </p>
      </div>
    </section>
  );
}

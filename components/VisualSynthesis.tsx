import { captureMeta, visualSignal } from "@/lib/mock-data";

export function VisualSynthesis() {
  return (
    <section className="border-b border-cyan/15 bg-deep/60 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
          ◆ VISUAL SIGNAL PROCESSING
        </p>

        <div className="mt-8 grid gap-px overflow-hidden border border-cyan/15 bg-cyan/15 sm:grid-cols-2">
          <div className="bg-black p-5">
            <p className="mb-4 font-technical text-[10px] tracking-[0.2em] text-mute">
              SIGNAL
            </p>
            <dl className="flex flex-col gap-3">
              {visualSignal.map((v) => (
                <div key={v.label} className="flex items-center justify-between">
                  <dt className="font-technical text-xs tracking-wide text-mute">
                    {v.label}
                  </dt>
                  <dd
                    className={`font-technical text-xs ${v.label === "SATURATION" ? "text-signal" : "text-cyan"}`}
                  >
                    {v.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-black p-5">
            <p className="mb-4 font-technical text-[10px] tracking-[0.2em] text-mute">
              CAPTURE
            </p>
            <dl className="flex flex-col gap-3">
              {captureMeta.map((v) => (
                <div key={v.label} className="flex items-center justify-between">
                  <dt className="font-technical text-xs tracking-wide text-mute">
                    {v.label}
                  </dt>
                  <dd className="font-technical text-xs text-cyan">
                    {v.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

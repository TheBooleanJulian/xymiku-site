"use client";

import { diagnostics } from "@/lib/mock-data";
import { LiveStat, RadarPulse } from "./SignalWidgets";

export function SystemDiagnostics() {
  return (
    <section className="scan-grid border-b border-cyan/15 bg-deep/60 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 font-technical text-[11px] tracking-[0.3em] text-cyan">
          ◆ SYSTEM DIAGNOSTICS
        </p>
        <div className="grid gap-px overflow-hidden border border-cyan/15 bg-cyan/15 lg:grid-cols-[1fr_200px]">
          <div className="grid grid-cols-2 gap-px bg-cyan/15 sm:grid-cols-3">
            {diagnostics.map((stat) => (
              <div key={stat.label} className="bg-black px-4 py-5">
                <p className="font-technical text-[9px] tracking-[0.2em] text-mute">
                  {stat.label}
                </p>
                <p
                  className={`mt-2 font-display text-lg font-bold ${stat.label === "SIGNAL" ? "text-signal" : "text-ink"}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
            <div className="col-span-2 flex items-center justify-around gap-4 bg-black px-4 py-5 sm:col-span-3">
              <LiveStat label="LOAD" min={12} max={48} suffix="%" />
              <LiveStat label="TEMP" min={38.5} max={40.2} suffix="°C" decimals={1} />
              <LiveStat label="THROUGHPUT" min={2.1} max={6.4} suffix=" MB/s" decimals={1} />
            </div>
          </div>
          <div className="hidden items-center justify-center bg-black p-4 lg:flex">
            <div className="h-40 w-40">
              <RadarPulse />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

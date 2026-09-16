"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArchivePlaceholder } from "./ArchivePlaceholder";
import { visualSignal, captureMeta } from "@/lib/mock-data";
import type { ArchiveImage } from "@/lib/types";

const heroImage: ArchiveImage = {
  id: "hero-main",
  src: "/mock/hero-main",
  alt: "Hatsune Miku cosplay photography, XYMiku39 archive",
  year: 2026,
  category: "cosplay",
  character: "Hatsune Miku",
};

const MIKU_LINES = ["MOMENTOUS", "IMAGES", "KEPT", "UNFORGETTABLE"];

const WAVE_PATHS = [
  "M0 20 C 10 4, 20 4, 30 20 S 50 36, 60 20 S 80 4, 90 20 S 110 36, 120 20",
  "M0 20 L10 6 L20 32 L30 10 L40 28 L50 8 L60 30 L70 12 L80 26 L90 10 L100 24 L110 14 L120 20",
  "M0 34 C 30 34, 40 34, 55 20 C 70 6, 90 6, 120 6",
];

function Waveform({ variant = 0 }: { variant?: 0 | 1 | 2 }) {
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-full overflow-visible">
      <path
        d={WAVE_PATHS[variant]}
        fill="none"
        stroke="var(--color-cyan)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.8}
      />
    </svg>
  );
}

function Knob({ label, angle }: { label: string; angle: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-6 w-6 rounded-full border border-cyan/40">
        <span
          className="absolute left-1/2 top-1/2 h-2 w-px origin-top bg-cyan"
          style={{ transform: `translate(-50%, 0) rotate(${angle}deg)` }}
        />
      </div>
      <span className="font-technical text-[8px] tracking-[0.15em] text-mute">
        {label}
      </span>
    </div>
  );
}

function CaptureModulePanel() {
  return (
    <div className="hud-corners hidden h-full flex-col gap-6 border-r border-cyan/15 bg-black/85 px-4 py-6 backdrop-blur-sm lg:flex">
      <p className="font-technical text-[10px] tracking-[0.3em] text-cyan">
        ◆ CAPTURE MODULE 01
      </p>

      <div className="flex flex-col gap-2">
        <p className="font-technical text-[9px] tracking-[0.2em] text-mute">
          EXPOSURE CURVE
        </p>
        <Waveform variant={0} />
        <div className="flex justify-between">
          <Knob label="EV" angle={40} />
          <Knob label="WB" angle={-20} />
          <Knob label="ISO" angle={80} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-technical text-[9px] tracking-[0.2em] text-mute">
          TONE CURVE
        </p>
        <Waveform variant={1} />
        <div className="flex justify-between">
          <Knob label="FOCUS" angle={-60} />
          <Knob label="GRAIN" angle={10} />
          <Knob label="TONE" angle={55} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-technical text-[9px] tracking-[0.2em] text-mute">
          COLOR RESPONSE
        </p>
        <Waveform variant={2} />
        <div className="flex justify-between">
          <Knob label="HUE" angle={-40} />
          <Knob label="SAT" angle={30} />
          <Knob label="LUM" angle={-10} />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-cyan/15 pt-4 font-technical text-[9px] tracking-[0.15em] text-mute">
        {captureMeta.map((m) => (
          <div key={m.label} className="flex justify-between">
            <span>{m.label}</span>
            <span className="text-cyan">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bar({ index }: { index: number }) {
  const base = 30 + 22 * Math.sin(index * 0.7) + 14 * Math.sin(index * 1.9);
  const height = Math.round(Math.max(12, Math.min(92, base)) * 100) / 100;
  return (
    <motion.div
      className="w-[3px] rounded-full bg-gradient-to-t from-cyan/40 to-cyan"
      style={{ height: `${height}%` }}
      animate={{ scaleY: [1, 0.45, 1] }}
      transition={{
        duration: 1.4 + (index % 5) * 0.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: (index % 7) * 0.08,
      }}
    />
  );
}

function SignalPanel() {
  return (
    <div className="hud-corners hidden h-full flex-col gap-6 border-l border-cyan/15 bg-black/85 px-4 py-6 backdrop-blur-sm lg:flex">
      <div className="flex items-center justify-between">
        <p className="font-technical text-[10px] tracking-[0.3em] text-cyan">
          ◆ ARCHIVE SIGNAL
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-dot" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-technical text-[9px] tracking-[0.2em] text-mute">
          CHANNEL 39 // XYMIKU39
        </p>
        <div className="flex h-16 items-end gap-[3px]">
          {Array.from({ length: 26 }).map((_, i) => (
            <Bar key={i} index={i} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-technical text-[9px] tracking-[0.2em] text-mute">
          FREQUENCY ANALYSIS
        </p>
        <Waveform variant={0} />
      </div>

      <div className="flex flex-col gap-1.5 border-t border-cyan/15 pt-4 font-technical text-[9px] tracking-[0.15em] text-mute">
        <p className="mb-1 text-mute">PARAMETERS</p>
        {visualSignal.map((v) => (
          <div key={v.label} className="flex justify-between">
            <span>{v.label}</span>
            <span className="text-cyan">{v.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-cyan/15 pt-4">
        <div>
          <p className="font-display text-2xl font-bold text-cyan text-glow">
            39
          </p>
          <p className="font-technical text-[8px] tracking-[0.2em] text-mute">
            SIGNATURE
          </p>
        </div>
        <div className="w-24">
          <p className="mb-1 font-technical text-[8px] tracking-[0.15em] text-mute">
            ARCHIVE SYNC
          </p>
          <div className="h-1 w-full overflow-hidden rounded-full bg-cyan/15">
            <div className="h-full w-[39%] rounded-full bg-cyan" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BootSequence({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1100);
    const t3 = setTimeout(onDone, 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black"
    >
      <p className="font-technical text-xs tracking-[0.3em] text-cyan">
        {stage < 2 ? "INITIALIZING ARCHIVE..." : "ARCHIVE ONLINE"}
      </p>
      <div className="h-px w-48 overflow-hidden bg-cyan/15">
        <motion.div
          className="h-full bg-cyan"
          initial={{ width: "0%" }}
          animate={{ width: stage >= 1 ? "100%" : "20%" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </div>
      <p className="font-technical text-[10px] tracking-[0.3em] text-mute">
        SIGNAL 39
      </p>
    </motion.div>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [booting, setBooting] = useState(!prefersReducedMotion);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden border-b border-cyan/15">
      {!prefersReducedMotion && booting && (
        <BootSequence onDone={() => setBooting(false)} />
      )}

      <ArchivePlaceholder
        image={heroImage}
        showMeta={false}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      <div className="absolute inset-0 scanline" />

      {/* status strip */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-1 px-4 pt-24 font-technical text-[10px] tracking-[0.2em] text-cyan/80 sm:px-6">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-dot" />
          SYSTEM STATUS: ONLINE
        </span>
        <span>ARCHIVE NODE: 39</span>
        <span>PHOTOGRAPHY SYSTEM: ACTIVE</span>
      </div>

      <div className="relative z-10 grid flex-1 lg:grid-cols-[240px_1fr_240px]">
        <CaptureModulePanel />

        <div className="flex flex-col justify-end px-4 pb-12 pt-8 sm:px-6 sm:pb-20">
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-ink text-glow sm:text-7xl lg:text-8xl">
            XYMIKU<span className="text-cyan">39</span>
          </h1>
          <p className="mt-3 font-technical text-sm tracking-[0.4em] text-cyan">
            VISUAL ARCHIVE
          </p>

          <div className="mt-8 flex flex-col gap-1 border-l-2 border-cyan/50 pl-4">
            {MIKU_LINES.map((line, i) => (
              <span
                key={line}
                className="font-display text-2xl font-bold tracking-wide text-ink sm:text-3xl"
              >
                {line}
                {i === 0 && <span className="text-cyan">.</span>}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#photo-delivery"
              className="flex-1 border border-cyan bg-cyan px-6 py-4 text-center font-display text-sm font-bold tracking-[0.15em] text-black transition-transform hover:scale-[1.02] sm:flex-none"
            >
              FIND YOUR PHOTOS
            </a>
            <a
              href="#archive"
              className="flex-1 border border-cyan/50 px-6 py-4 text-center font-display text-sm font-bold tracking-[0.15em] text-cyan transition-colors hover:border-cyan hover:bg-cyan/10 sm:flex-none"
            >
              EXPLORE THE ARCHIVE
            </a>
          </div>
        </div>

        <SignalPanel />
      </div>
    </section>
  );
}

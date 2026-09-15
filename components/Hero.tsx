"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArchivePlaceholder } from "./ArchivePlaceholder";
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
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden border-b border-cyan/15">
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

      <div className="relative z-10 px-4 pb-12 pt-8 sm:px-6 sm:pb-20">
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
    </section>
  );
}

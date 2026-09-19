"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const WAVE_FRAMES: [string, string][] = [
  [
    "M0 20 C 10 4, 20 4, 30 20 S 50 36, 60 20 S 80 4, 90 20 S 110 36, 120 20",
    "M0 20 C 10 36, 20 36, 30 20 S 50 4, 60 20 S 80 36, 90 20 S 110 4, 120 20",
  ],
  [
    "M0 20 L10 6 L20 32 L30 10 L40 28 L50 8 L60 30 L70 12 L80 26 L90 10 L100 24 L110 14 L120 20",
    "M0 20 L10 32 L20 6 L30 28 L40 10 L50 30 L60 8 L70 26 L80 12 L90 24 L100 10 L110 20 L120 20",
  ],
  [
    "M0 34 C 30 34, 40 34, 55 20 C 70 6, 90 6, 120 6",
    "M0 34 C 20 20, 50 34, 55 20 C 60 6, 100 20, 120 6",
  ],
];

export function Waveform({
  variant = 0,
  accent = "cyan",
}: {
  variant?: 0 | 1 | 2;
  accent?: "cyan" | "signal";
}) {
  const prefersReducedMotion = useReducedMotion();
  const stroke =
    accent === "signal" ? "var(--color-signal)" : "var(--color-cyan-bright)";
  const [pathA, pathB] = WAVE_FRAMES[variant];
  const duration = 2.4 + variant * 0.7;
  const glowStyle = { filter: `drop-shadow(0 0 5px ${stroke})` };

  // Framer Motion can't reliably morph an SVG path's raw `d` string (it
  // needs matching numeric-token structure and can interpolate to
  // "undefined" mid-transition), so two static paths are crossfaded instead.
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-full overflow-visible">
      <motion.path
        d={pathA}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        style={glowStyle}
        initial={false}
        animate={
          prefersReducedMotion ? { opacity: 0.95 } : { opacity: [0.95, 0, 0.95] }
        }
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      />
      {!prefersReducedMotion && (
        <motion.path
          d={pathB}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          style={glowStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

export function Knob({
  label,
  angle,
  accent = "cyan",
}: {
  label: string;
  angle: number;
  accent?: "cyan" | "signal";
}) {
  const prefersReducedMotion = useReducedMotion();
  const glowColor =
    accent === "signal" ? "var(--color-signal)" : "var(--color-cyan-bright)";
  const borderClass = accent === "signal" ? "border-signal/60" : "border-cyan-bright/60";
  const needleClass = accent === "signal" ? "bg-signal" : "bg-cyan-bright";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative h-7 w-7 rounded-full border-2 ${borderClass}`}
        style={{ boxShadow: `0 0 8px ${glowColor}66` }}
      >
        <motion.span
          className={`absolute left-1/2 top-1/2 h-2.5 w-[2px] origin-top rounded-full ${needleClass}`}
          style={{ x: "-50%", boxShadow: `0 0 6px ${glowColor}` }}
          animate={
            prefersReducedMotion
              ? { rotate: angle }
              : { rotate: [angle - 18, angle + 18, angle - 18] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>
      <span className="font-technical text-[8px] tracking-[0.15em] text-mute">
        {label}
      </span>
    </div>
  );
}

export function Bar({ index }: { index: number }) {
  const base = 30 + 22 * Math.sin(index * 0.7) + 14 * Math.sin(index * 1.9);
  const height = Math.round(Math.max(12, Math.min(92, base)) * 100) / 100;
  return (
    <motion.div
      className="w-[3px] rounded-full bg-gradient-to-t from-cyan/40 via-cyan-bright to-signal"
      style={{
        height: `${height}%`,
        transformOrigin: "bottom",
        filter: "drop-shadow(0 0 3px rgba(57, 230, 242, 0.6))",
      }}
      animate={{ scaleY: [1, 0.25, 1.15, 0.5, 1] }}
      transition={{
        duration: 1.1 + (index % 5) * 0.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: (index % 7) * 0.08,
      }}
    />
  );
}

/** Staggered vertical bar chart, styled after MIKU-19's "HARMONICS" meter. */
export function HarmonicBars({ count = 24 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex h-full w-full items-end gap-[3px]">
      {Array.from({ length: count }).map((_, i) => {
        const base = 30 + 25 * Math.sin(i * 0.9) + 15 * Math.cos(i * 1.6);
        const height = Math.round(Math.max(15, Math.min(90, base)));
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan/30 via-cyan-bright to-signal"
            style={{
              height: `${height}%`,
              transformOrigin: "bottom",
              filter: "drop-shadow(0 0 3px rgba(57, 230, 242, 0.5))",
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : { scaleY: [0.3, 1.1, 0.45, 0.95, 0.3] }
            }
            transition={{
              duration: 1.4 + (i % 6) * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 8) * 0.1,
            }}
          />
        );
      })}
    </div>
  );
}

/** Pulsing radar sweep, styled after MIKU-19's SYSTEM DIAGNOSTICS radar. */
export function RadarPulse({ accent = "cyan" }: { accent?: "cyan" | "signal" }) {
  const prefersReducedMotion = useReducedMotion();
  const stroke = accent === "signal" ? "var(--color-signal)" : "var(--color-cyan-bright)";
  const gridStroke =
    accent === "signal" ? "rgba(255, 63, 164, 0.15)" : "rgba(57, 230, 242, 0.15)";

  const polyStates = [
    "50,15 75,40 65,75 35,75 25,40",
    "50,22 68,38 58,68 42,68 32,38",
    "50,15 75,40 65,75 35,75 25,40",
  ];

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="50" r="40" fill="none" stroke={gridStroke} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="27" fill="none" stroke={gridStroke} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="13" fill="none" stroke={gridStroke} strokeWidth="0.5" />
      <line x1="50" y1="10" x2="50" y2="90" stroke={gridStroke} strokeWidth="0.5" />
      <line x1="10" y1="50" x2="90" y2="50" stroke={gridStroke} strokeWidth="0.5" />
      <motion.polygon
        points={polyStates[0]}
        fill={accent === "signal" ? "rgba(255, 63, 164, 0.12)" : "rgba(57, 230, 242, 0.12)"}
        stroke={stroke}
        strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
        animate={prefersReducedMotion ? undefined : { points: polyStates }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="2"
        fill={stroke}
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
        animate={
          prefersReducedMotion
            ? undefined
            : { r: [2, 4, 2], opacity: [1, 0.5, 1] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Live-jittering readout, styled after MIKU-19's SYSTEM DIAGNOSTICS CPU/TEMP/MEM tiles. */
export function LiveStat({
  label,
  min,
  max,
  suffix = "",
  decimals = 0,
}: {
  label: string;
  min: number;
  max: number;
  suffix?: string;
  decimals?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const mid = (min + max) / 2;
  const [value, setValue] = useState(mid);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setValue(min + Math.random() * (max - min));
    }, 2200 + Math.random() * 800);
    return () => clearInterval(id);
  }, [min, max, prefersReducedMotion]);

  const display = `${value.toFixed(decimals)}${suffix}`;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-technical text-[9px] tracking-[0.2em] text-mute">
        {label}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          className="block font-display text-lg font-bold text-ink"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.25 }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

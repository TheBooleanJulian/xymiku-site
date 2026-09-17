"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SignalDivider() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="border-b border-cyan/15 bg-deep/40 px-4 py-8 sm:px-6">
      <svg
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        className="mx-auto h-10 w-full max-w-7xl"
      >
        <defs>
          <linearGradient id="signal-divider" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-cyan)" />
            <stop offset="50%" stopColor="var(--color-signal)" />
            <stop offset="100%" stopColor="var(--color-cyan)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 20 C 40 4, 70 4, 100 20 S 150 36, 180 20 S 230 4, 260 20 S 310 36, 340 20 S 380 4, 400 20"
          fill="none"
          stroke="url(#signal-divider)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          style={prefersReducedMotion ? undefined : { pathLength: 0.4 }}
          animate={
            prefersReducedMotion
              ? { pathLength: 1, pathOffset: 0 }
              : { pathOffset: [0, 1, 0] }
          }
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

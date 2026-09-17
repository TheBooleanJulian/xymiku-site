"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  signal: boolean;
};

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 12,
    signal: Math.random() > 0.75,
  }));
}

/** Slow rising cyan/signal motes drifting up the page, styled after MIKU-19's bg-particles field. */
export function AmbientParticles() {
  const prefersReducedMotion = useReducedMotion();
  const particles = useMemo(() => makeParticles(50), []);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            bottom: "-10px",
            background: p.signal ? "var(--color-signal)" : "var(--color-cyan)",
            boxShadow: p.signal
              ? "0 0 6px var(--color-signal)"
              : "0 0 6px var(--color-cyan)",
            animation: `ambient-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

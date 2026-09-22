"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "FULL ARCHIVE", href: "/gallery" },
];

const HEADER_CTAS = [
  { href: "/#photo-delivery", title: "FIND YOUR PHOTOS" },
  { href: "/#uplink", title: "EXPLORE THE UPLINK" },
  { href: "/#instagram", title: "INSTAGRAM UPLINK" },
  {
    href: "https://t.me/+Sf2gP6A4U7VkMWNl",
    title: "MEEGOO CHANNEL",
    external: true,
  },
];

const CTA_CLIP_PATH = "polygon(0 0, 100% 0, 100% 70%, calc(100% - 8px) 100%, 0 100%)";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan/15 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="/"
          className="font-display text-sm font-bold tracking-[0.3em] text-ink"
        >
          XYMIKU<span className="text-cyan">39</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-technical text-[11px] tracking-[0.15em] text-mute transition-colors hover:text-cyan"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {HEADER_CTAS.map((cta) => (
            <a
              key={cta.title}
              href={cta.href}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noopener" : undefined}
              style={{ clipPath: CTA_CLIP_PATH }}
              className="gradient-flow border border-cyan bg-gradient-to-r from-cyan via-signal to-cyan px-2.5 py-1.5 text-center text-black shadow-[0_0_8px_rgba(57,230,242,0.4)] transition-transform hover:scale-[1.03]"
            >
              <span className="block font-display text-[9px] font-bold tracking-[0.05em] whitespace-nowrap">
                {cta.title}
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center border border-cyan/30 text-cyan md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 bottom-0 h-px w-4 bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-cyan/15 bg-black md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-technical text-xs tracking-[0.15em] text-mute hover:text-cyan"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              {HEADER_CTAS.map((cta) => (
                <a
                  key={cta.title}
                  href={cta.href}
                  target={cta.external ? "_blank" : undefined}
                  rel={cta.external ? "noopener" : undefined}
                  onClick={() => setOpen(false)}
                  style={{ clipPath: CTA_CLIP_PATH }}
                  className="gradient-flow border border-cyan bg-gradient-to-r from-cyan via-signal to-cyan px-2.5 py-2 text-center text-black shadow-[0_0_8px_rgba(57,230,242,0.4)]"
                >
                  <span className="block font-display text-[9px] font-bold tracking-[0.05em]">
                    {cta.title}
                  </span>
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

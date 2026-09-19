const SOCIALS = [
  { label: "INSTAGRAM", href: "#" },
  { label: "TWITTER / X", href: "#" },
  { label: "EMAIL", href: "#" },
];

export function Footer() {
  return (
    <footer id="footer" className="px-4 py-14 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg font-bold tracking-wide text-ink">
            XYMIKU.39 <span className="text-cyan">{"//"}</span> VISUAL ARCHIVE
          </p>
          <p className="font-technical text-xs tracking-[0.2em] text-mute">
            MIKU IMAGES KAWAII UPLINK
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-technical text-[10px] tracking-[0.2em] text-cyan/80">
          <span>ARCHIVE NODE 39</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-dot" />
            SYSTEM ONLINE
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="border border-cyan/20 px-4 py-2 font-technical text-[10px] tracking-[0.15em] text-mute transition-colors hover:border-cyan hover:text-cyan"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cyan/15 pt-6 font-technical text-[10px] tracking-wide text-mute">
          <div className="flex flex-col gap-1">
            <span>© 2026 XYMIKU.39</span>
            <span>
              BUILT BY{" "}
              <a
                href="https://thebooleanjulian.dev"
                target="_blank"
                rel="noopener"
                className="text-cyan"
              >
                THEBOOLEANJULIAN
              </a>
            </span>
          </div>
          <a
            href="/admin"
            className="tracking-[0.15em] text-mute/60 transition-colors hover:text-cyan"
          >
            [{"⚙"} ADMIN]
          </a>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Script from "next/script";

const PROFILE_URL = "https://www.instagram.com/xymiku.39/";

export function InstagramFeed() {
  return (
    <section id="instagram" className="border-b border-cyan/15 px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-technical text-xs tracking-[0.3em] text-cyan">
              INSTAGRAM UPLINK //
            </p>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              LATEST FROM <span className="text-cyan">@XYMIKU.39</span>
            </h2>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener"
            className="border border-cyan/20 px-4 py-2 font-technical text-[10px] tracking-[0.15em] text-mute transition-colors hover:border-cyan hover:text-cyan"
          >
            VIEW PROFILE
          </a>
        </div>

        <rssapp-wall id="9NH3qtc3KAQCoiuj" />
        <Script src="https://widget.rss.app/v1/wall.js" strategy="lazyOnload" />
      </div>
    </section>
  );
}

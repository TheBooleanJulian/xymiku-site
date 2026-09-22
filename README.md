<div align="center">

<img src=".github/assets/hero-banner.png" alt="XYMIKU.39 hero — animated boot sequence with HUD side panels and the MIKU IMAGES KAWAII UPLINK tagline" width="100%" />

# XYMIKU.39

**MIKU IMAGES KAWAII UPLINK (M.I.K.U.)**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
![License](https://img.shields.io/badge/license-AGPLv3%20%2B%20Commercial-00D4C8.svg)

</div>

---

## What it does

A photography portfolio site for a Hatsune Miku cosplay photographer, styled as a retro-futuristic "archive console" — boot sequences, scanlines, HUD-style corner brackets, waveform decorations, and terminal/diagnostics jargon framing each gallery as a piece of retrieved signal data. "39" recurs throughout as the site's signature motif.

## Features

- **Boot-sequence hero** — an animated diagnostic startup screen gives way to the main hero, flanked by HUD side panels (capture-module dials, uplink signal waveform, live parameter readouts).
- **System diagnostics strip** — a stat grid (camera body, sensor resolution, archive size, years active) framed as machine telemetry rather than a plain "about" blurb.
- **Photo delivery search** — a "find your photos" bar for looking up a shoot by event / cosplayer / character (UI complete, backend not yet wired — see roadmap).
- **Uplink timeline** — a horizontal-scrolling history of past shoots by year.
- **Character index** — a catalogued grid of cosplayed characters with per-character shoot counts and codes.
- **Featured cosplay & portfolio** — masonry-style featured-work grid plus categorized portfolio sections.
- **Sticky HUD navigation** — animated mobile hamburger menu, in-page anchor links to every section.
- **Fully responsive HUD chrome** — scanlines, corner brackets, and waveform decorations that hold up across viewport sizes.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, static export target) |
| UI | [React 19](https://react.dev) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (`@theme` design tokens in `app/globals.css` — cyan/black HUD palette) |
| Animation | [Framer Motion](https://www.framer.com/motion/) for boot-sequence and scroll animations |
| Backend/data | [Supabase](https://supabase.com) client (`@supabase/supabase-js`) |
| Fonts | Space Grotesk (display) + JetBrains Mono (technical/HUD text) |
| Deployment target | [Zeabur](https://zeabur.com) (prebuilt static export) |

## Screenshots

|                               System diagnostics & photo search                                |                                 Uplink timeline & character index                                  |
| :----------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
| ![Stat grid framed as system diagnostics, plus the find-your-photos search bar](.github/assets/system-diagnostics.png) | ![Horizontal-scroll shoot timeline above a grid of cosplayed characters](.github/assets/timeline-and-characters.png) |

> Every panel above is real UI, rendered live — but every *image* in it (thumbnails,
> character cards) is currently a generated CSS gradient standing in for a real
> photo. See [Current State](#current-state) below.

## Current State

The homepage (`app/page.tsx`) composes these components in order:

| Component | Status | Description |
|---|---|---|
| `Header` | Done | Sticky nav with an animated mobile hamburger menu; links to real in-page anchors. |
| `Hero` | Built, mock content | Animated boot sequence, HUD side panels, waveform decorations, three CTAs (photo search, uplink timeline, Instagram). |
| `InstagramFeed` | Built, real data | Infinite-scroll marquee of the 6 most recent @xymiku.39 posts, fetched at build time (`lib/instagram.ts`). See [Maintenance](#maintenance). |
| `PhotoDelivery` | UI done, not wired up | A "find your photos" search form — currently a no-op (`preventDefault` only, no real search). |
| `UplinkTimeline` | Built, mock content | Horizontal-scroll timeline of shoot history. |
| `UplinkPlaceholder` | **Explicit placeholder** | Renders a generated gradient in place of a real photo — a documented stand-in until the archive is wired to real images. |
| `CharacterIndex` | Built, mock content | Grid of cosplayed characters. |
| `FeaturedCosplay` | Built, mock content | Masonry-style featured-work grid. |
| `Footer` | Done | Social links: Instagram and Email (`mailto:xymiku.39@xymiku39.com`) point to real destinations. |

**Every image on the site is currently a generated CSS gradient, not a real
photo** — all content (timeline entries, character list, featured work) is
sourced from a single static file, `lib/mock-data.ts`, which is explicitly
commented as mock/placeholder data.

## Setup / Quick Start

> **Note:** if your working copy lives under a synced cloud-drive folder
> (Google Drive, OneDrive, etc.), `npm install` can fail or behave
> unreliably there. Clone/copy the project to a local, non-synced path
> first (e.g. `~/dev/xymiku-site`) and develop from there.

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it. Edit
`app/page.tsx` or any file in `components/` — both hot-reload.

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server with hot reload. |
| `npm run build` | Production build (static export, per `next.config.ts`). |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

## Maintenance

**Instagram feed image staleness.** `lib/instagram.ts` fetches
`https://rss.app/feeds/v1.1/9NH3qtc3KAQCoiuj.json` at build time. That feed
returns Instagram's own CDN URLs for each photo, and those URLs are signed
and expire after roughly 4-5 days. Since this site is a static export
(built once, deployed as flat files, no server), the Instagram section's
photos will 404 once their URLs expire — until the next build re-fetches
the feed with fresh URLs.

`.github/workflows/refresh-instagram-feed.yml` covers this: it pushes an
empty commit daily, which retriggers Zeabur's git-push-based auto-deploy
and so re-runs the build. No manual action needed as long as that workflow
stays enabled and Zeabur stays connected to this repo.

**6-item cap.** The RSS.app feed only returns the 6 most recent posts —
raising that requires upgrading the RSS.app plan for this feed, not a code
change. The marquee loops those 6 seamlessly rather than showing ~30
distinct posts.

## Roadmap

Rough order, subject to change:

- [ ] **Real photography** — replace every `UplinkPlaceholder` gradient
      with actual images (via `next/image`) once a source/CDN for the real
      cosplay photos is decided.
- [ ] **Real content pipeline** — replace `lib/mock-data.ts` with a real
      data source (CMS, MDX/JSON content files, or a small backend) for
      timeline entries, characters, and featured work.
- [ ] **Working photo search** — implement the `PhotoDelivery` search form
      (currently `preventDefault`-only) against whatever the real photo
      index/backend ends up being.
- [ ] **SEO & metadata** — Open Graph/Twitter card images, page titles,
      structured data.
- [ ] **Accessibility pass** — keyboard nav through the animated menu and
      timeline, alt text once real images exist, motion-reduce handling for
      the boot-sequence/scroll animations.
- [ ] **Mobile QA** — verify the HUD layout, waveforms, and horizontal
      timeline scroll at small viewport widths.
- [ ] **Deployment** — Zeabur deploy + custom domain.
- [ ] **Analytics** (optional) — basic visit/engagement tracking once the
      site is live with real content.

## Changelog

This project follows [Semantic Versioning](https://semver.org/). All notable
changes are recorded below; dates reflect the corresponding commit.

### [Unreleased]

- HUD side panels added to the hero, evolving the cockpit aesthetic
  (capture-module dials, archive signal waveform, live parameter readouts).
- Added `InstagramFeed` between the hero and the photo search, plus a third
  hero CTA linking to it. Now an auto-scrolling marquee of the 6 most
  recent @xymiku.39 posts (photo + caption), fetched at build time from an
  RSS.app JSON feed — see [Maintenance](#maintenance) for the image-staleness
  caveat and the scheduled-rebuild workaround.
- Removed `SystemDiagnostics`, `Portfolio`, `VisualSynthesis`, and
  `MikuSignature` — trimmed the homepage down to the sections above.
- Footer: dropped the Twitter/X button; Instagram and Email now link to
  real destinations instead of `href="#"`.

### 0.1.0 — 2026-09-15

- Initial build: XYMIKU39 visual archive landing page, with all sections
  listed in [Current State](#current-state) built against mock data.
- Static export enabled for Zeabur prebuilt deployment.

## License

This project is dual licensed.

- Community Edition — [GNU Affero General Public License v3 (AGPLv3)](LICENSE). Free to use, modify, and self-host. If you distribute a modified version or run it as a network service, you must make the corresponding source available.
- Commercial License — for organisations that want to embed, modify, or distribute this software without AGPLv3's obligations. See [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

<div align="center">
<sub>Built by <a href="https://github.com/TheBooleanJulian">@TheBooleanJulian</a></sub>
</div>

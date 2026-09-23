<div align="center">

<img src=".github/assets/hero-banner.png" alt="XYMIKU.39 hero — animated boot sequence with HUD side panels and the MIKU IMAGES KAWAII UPLINK tagline" width="100%" />

# XYMIKU.39

**MIKU IMAGES KAWAII UPLINK (M.I.K.U.)**

A photography portfolio site for a Hatsune Miku cosplay photographer, styled
as a retro-futuristic "archive console" — boot sequences, scanlines,
HUD-style corner brackets, waveform decorations, and terminal/diagnostics
jargon framing each gallery as a piece of retrieved signal data. "39" recurs
throughout as the site's signature motif.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Screenshots

![Horizontal-scroll shoot timeline above a grid of cosplayed characters](.github/assets/timeline-and-characters.png)

> Every panel above is real UI, rendered live — but every *image* in it (thumbnails,
> character cards) is currently a generated CSS gradient standing in for a real
> photo. See [Current State](#current-state) below.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, static export target)
- [React 19](https://react.dev)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (`@theme` design tokens in
  `app/globals.css` — cyan/black HUD palette)
- [Framer Motion](https://www.framer.com/motion/) for boot-sequence and
  scroll animations
- Fonts: Space Grotesk (display) + JetBrains Mono (technical/HUD text)
- Deployment target: [Zeabur](https://zeabur.com) (prebuilt static export)

## Features

- **Boot-sequence hero** — an animated diagnostic startup screen gives way to
  the main hero, flanked by HUD side panels (capture-module dials, uplink
  signal waveform, live parameter readouts), with CTAs to the photo search,
  the timeline, and the Instagram feed.
- **Instagram feed** — an auto-scrolling marquee of recent @xymiku.39 posts
  (photo + caption preview), fetched at build time from an RSS.app feed, sat
  between the hero and the photo search.
- **Photo delivery search** — a "find your photos" bar for looking up a shoot
  by event / cosplayer / character (UI complete, backend not yet wired — see
  roadmap).
- **Uplink timeline** — a horizontal-scrolling history of past shoots by
  year.
- **Character index** — a catalogued grid of cosplayed characters with
  per-character shoot counts and codes.
- **Featured cosplay** — masonry-style featured-work grid.
- **Sticky HUD navigation** — animated mobile hamburger menu, in-page anchor
  links to every section.
- **Fully responsive HUD chrome** — scanlines, corner brackets, and waveform
  decorations that hold up across viewport sizes.

## Current State

The homepage (`app/page.tsx`) composes these components in order:

| Component | Status | Description |
|---|---|---|
| `Header` | Done | Sticky nav with an animated mobile hamburger menu; links to real in-page anchors. |
| `Hero` | Built, mock content | Animated boot sequence, HUD side panels, waveform decorations, three CTAs (photo search, uplink timeline, Instagram). |
| `InstagramFeed` | Built, real data | Infinite-scroll marquee of @xymiku.39 posts, fetched at build time from the Graph API (primary, once configured) or RSS.app (fallback, 6-post cap) — `lib/instagram.ts`. See [Maintenance](#maintenance). |
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

## Getting Started

> **Note:** if your working copy lives under a synced cloud-drive folder
> (Google Drive, OneDrive, etc.), `npm install` can fail or behave
> unreliably there. Clone/copy the project to a local, non-synced path
> first (e.g. `~/dev/xymiku-site`) and develop from there.

```bash
npm install
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

### Instagram feed sources

`lib/instagram.ts` tries two sources, in order, both fetched at build time
only (static export — no server to hit these per-request):

1. **Instagram Graph API** ("Instagram API with Instagram Login"), used
   when `INSTAGRAM_ACCESS_TOKEN` is set. No item cap — pulls up to 30
   posts. This is the intended primary source once set up.
2. **RSS.app JSON feed**, used automatically whenever there's no token or
   the Graph API call fails for any reason. Capped at 6 posts on this
   RSS.app plan — raising that needs an RSS.app plan upgrade, not a code
   change.

If neither source returns anything, the section falls back to a
"SIGNAL OFFLINE" card linking to the profile instead of an empty section.

#### Setting up the Graph API token (one-time)

1. xymiku.39's Instagram account must be a **Professional** account
   (Creator or Business) — Instagram app -> Settings -> Account type.
2. Create a Meta app at developers.facebook.com/apps, type **Business**.
3. In the app dashboard, add the **Instagram** product, then go to
   **Instagram -> API setup with Instagram Login**.
4. Click **Generate token**, log in as xymiku.39, authorize. This hands
   you a token valid for **60 days** (no separate long-lived exchange
   needed).
5. Set it as `INSTAGRAM_ACCESS_TOKEN` in **both**:
   - `.env.local` (local dev)
   - Zeabur's project environment variables (production build — required,
     since Zeabur runs the actual build that ships)

The token expires every ~60 days. Refreshing is a manual repeat of step 4
(regenerate, then update it in both places above) unless/until that gets
automated.

### Image staleness (either source)

Both sources return temporary, signed CDN URLs for each photo — RSS.app's
expire in roughly 4-5 days; Graph API's `media_url` also expires, on a
similar order. Since this site is a static export (built once, deployed as
flat files, no server), the Instagram section's photos will 404 once their
URLs expire, until the next build re-fetches fresh ones.

`.github/workflows/refresh-instagram-feed.yml` covers this: it pushes an
empty commit daily, which retriggers Zeabur's git-push-based auto-deploy
and so re-runs the build. No manual action needed as long as that workflow
stays enabled and Zeabur stays connected to this repo.

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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

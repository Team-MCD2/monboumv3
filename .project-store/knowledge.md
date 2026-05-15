# Project Knowledge - Mon Boum V3

> Project-scoped tips, conventions, and lessons for P-monboum-v3.
> Cross-project insight gets PROMOTED to `db.md` W04 / W06.
> Seeded 2026-05-04 from live-repo scan + monboum.fr Pass C scrape.

## Conventions

- **Brand palette is locked** : rouge `#E10600` is the sole CTA
  / accent colour. Per-enseigne accents (`jaune` chicken,
  `orange` pizz, `vert` saveurs) live in `tailwind.config.mjs`
  but are used SPARINGLY — never as a hero colour, only as a
  pill / badge / category marker.
- **Typography** : Anton (display, uppercase) + Inter (body),
  self-hosted via `@fontsource`. Anton is for headlines + huge
  CTAs only; everything reading-length is Inter. No serif. No
  third typeface.
- **Header is always white**. Sticky `top-0 z-50`, `h-60` mobile
  / `h-70` desktop. Hero `padding-top` MUST come from
  `var(--hh)` (set by Layout.astro JS to header height). Hard
  Rule #1 in README.
- **Logo never sits on a coloured container.** Use:
  - `logo-mon-boum-home.png` -> on bg-white (header)
  - `footer_logo-boum.png`   -> on bg-noir (footer)
  - `Boums.png`              -> OG image only
  Hard Rule #2 in README.
- **Order CTA always points to Deliveroo** — either the global
  `https://monboum.commande.deliveroo.fr/fr/` OR a per-restaurant
  `deliverooUrl` from `src/data/restaurants.js`. Never to
  monboum.fr (legacy WordPress, asset source only).
- **Animations gate on `prefers-reduced-motion`** at the
  primitive level (in `src/styles/globals.css`). Don't add a
  motion library. Use the existing primitives :
  - `[data-reveal]` (+ `data-d="1..5"` for staggered delay)
  - `[data-parallax="0.15"]` (JS-driven via Layout.astro)
  - `.float-anim`, `.spin-slow`, `.marquee-inner`
  - `.rise-1` ... `.rise-4` (hero stagger)
  - `.img-zoom` (hover scale 1.06)
- **Source-of-truth modules** (never hardcode) :
  - `src/data/restaurants.js` — 10 restaurants + ENSEIGNES
  - `src/data/promos.js`      — Deliveroo offers
  - `src/data/testimonials.js`— 11 celebrity quotes
  - `src/data/tiktoks.js`     — derived from generated/
  - `src/data/menus.js`       — per-enseigne menu items (Phase C)
- **Forms graceful-degrade to demo mode.** Missing any
  `PUBLIC_EMAILJS_*` env -> yellow banner + console.log submit.
  This MUST stay — it's the contract that lets dev / preview /
  branch-deploys never block on env config.
- **Build pipeline is `npm run validate:all`** : data validation
  -> astro build -> SEO validation. Run before every push.
- **Re-running `npm run sync:tiktok`** refreshes `tiktok-local.json`
  ; the build then derives `src/data/tiktoks.js` from it. Do
  not edit `tiktoks.js` by hand.
- **Re-running `npm run generate:icons`** rebuilds the PWA icon
  set (192/512/maskable/180) from the brand logo via sharp.

## Tips (T-* IDs)

- **T-monboum-derosify** — for any scraped PNG that will land on
  a dark surface (`texture-bg`, `bg-noir`, `bg-rouge`), pre-process
  it through `scripts/derosify-bg.mjs` (sharp-based alpha-out of
  near-white pixels with tolerance ~12). Backup the original to
  `public/assets/banners/_originals/` before overwriting.
  Re-run idempotently. CSS-only `mix-blend-mode: multiply` is a
  fallback ONLY — see ADR-004 + discarded.md.

- **T-monboum-mobile-drawer-close** — every fullscreen mobile
  drawer must surface its OWN close affordance INSIDE the drawer
  (top-right convention, white `×` icon, 44x44 tap target,
  `aria-label="Fermer le menu"`, focus return to the toggle on
  close). The header burger -> X transform is secondary, never
  sole. See L-2026-05-04-MB-001 + ADR-003.

- **T-monboum-hero-padding** — hero `padding-top` is ALWAYS
  `var(--hh)`. Never a hardcoded value. The CSS variable is
  computed at runtime by `Layout.astro` from the live header
  height. Hardcoded values silently break responsive headers
  + safe-area iOS.

- **T-monboum-deliveroo-cta** — primary order CTA per page :
  - home / mon-boum / contact -> `https://monboum.commande.deliveroo.fr/fr/`
  - /boum-{burger,pizzs,chicken,saveurs} -> `locations[0].deliverooUrl` (first matching restaurant)
  - per-restaurant card -> that location's `deliverooUrl`
  - per-marker popup on /nos-restaurants -> that location's `deliverooUrl`
  Always `target="_blank" rel="noopener noreferrer"`.

- **T-monboum-img-deliberate** — every `<img>` declares explicit
  `width` + `height` + `loading=` + `decoding=`. Above-fold heros
  use `loading="eager" fetchpriority="high"`. Below-fold uses
  `loading="lazy" decoding="async"`. CLS budget is <= 0.1
  (`docs/STATUS.md` section 5).

- **T-monboum-island-strategy** — React islands hydrate on
  demand :
  - `client:load`    -> HeroRotator (above the fold)
  - `client:visible` -> PromoScroller, TestimonialsSlider,
                        TikTokFacade (below the fold)
  - leaflet-based RestaurantsMap is `client:visible` and lazy-
    imports leaflet to keep it out of the global bundle.
  Never `client:only="react"` on a static-renderable component.

- **T-monboum-asset-pass** — `public/assets/README.md` documents
  the scrape passes :
  - Pass A (2026-04-23) — known-URL banners, shapes, base logos
  - Pass B (2026-04-23) — HTML-scraped from monboum.fr home,
    23/23 successful via `plan/_download_pass_b.ps1`
  - Pass C (2026-05-04) — WP-REST media scrape, 23 product +
    menu-board images via PowerShell (`plan/_wp-media-full.json`
    archived). New folders : `public/assets/menus/`,
    `public/assets/products/`.

- **T-monboum-react-pin** — React MUST stay pinned to 18.2.0 /
  react-dom 18.2.0 (NOT a caret range). Earlier upgrades caused
  the `jsxDEV` runtime mismatch in Astro 5 + @astrojs/react 4.
  See `docs/JOURNAL.md` (the journal records the original fix).

## Lessons (L-YYYY-MM-DD-NNN)

- **L-2026-05-04-MB-001** — when a fullscreen mobile drawer
  covers the viewport, users look INSIDE the drawer (top-right
  by convention) for the close button, not at a transformed
  burger icon on a separate header strip. The header
  burger -> X morph is technically correct but UX-wise weak,
  especially when the X is a thin 24x2 px black line on white.
  Surface a prominent `×` inside the dark drawer as the primary
  close affordance. Boss-flagged 2026-05-04. Promoted to db.md
  W04.15 if the pattern recurs across MdM-V2 / PAC.

- **L-2026-05-04-MB-002** — WordPress sites scraped for asset
  reuse often deliver PNGs with baked-in white backgrounds
  rather than alpha transparency. On a dark hero (`texture-bg`,
  `bg-noir`), this renders as a white block around the logo,
  making the entire section look broken. Pre-process scraped
  PNGs through a sharp-based alpha-out script BEFORE placing
  them on dark surfaces. Backup originals to
  `_originals/` so the process is reversible. CSS workarounds
  (`mix-blend-mode: multiply`) are fallbacks only — they fix
  symptom, not root cause. Promoted to db.md W04 candidate.

- **L-2026-05-04-MB-003** — `read_url_content` follows redirects
  but reports them as errors when the redirect target differs
  by hostname (e.g. `www.monboum.fr` -> `monboum.fr`). The
  workaround is to fetch the canonical hostname directly. The
  redirect resolver should be a one-line check upstream of the
  fetcher. Cross-project candidate (matches general "fetch
  redirect handling" theme).

- **L-2026-05-04-MB-004** — WordPress `wp-json/wp/v2/media`
  endpoint is a goldmine for asset migration. Returns full
  source URLs + dimensions + alt text + dates in a single call,
  paginated 100/page. Pulling pages 1-5 covered the entire
  monboum.fr media library (~250 items). Beats per-page HTML
  scraping by an order of magnitude when the source is a
  live WP install. Cross-project candidate for db.md W04.

## Open loops

- **P0** Mobile drawer close X (Phase A executing 2026-05-04).
- **P0** White-bg removal on 8 enseigne PNGs (Phase B
  executing 2026-05-04).
- **P0** Cartes / menu data seeding (Phase C executing 2026-05-04
  — assets already scraped to `public/assets/menus/`).
- **P0** Home product showcase (Phase D executing 2026-05-04 —
  assets in `public/assets/products/`).
- **P1** Deliveroo URL human verification (Cascade can't, it's
  bot-blocked).
- **P1** Vercel env var configuration (owner-led).
- **P1** Manual browser QA across React islands + map + forms.
- **P2** Per-page OG images (4 enseigne pages currently share the
  default `Boums.png`).
- **P2** Custom 404 / mentions-legales editorial review.
- **P2** Playwright CI smoke test (Backlog).
- Owner-decision : whether to migrate to `astro:assets` for
  automatic AVIF/WebP. Bundle delta significant; perf gain
  +5-7 Lighthouse points (cf. `docs/ROADMAP.md` 2.1).

## Pointers

- Original spec        : `plan/plan.md` (31 KB)
- Live-site reference  : `plan/_home.html` (152 KB scraped HTML)
- Asset inventory      : `public/assets/README.md`
- WP-REST archive      : `plan/_wp-media-full.json` (Pass C, 2026-05-04)
- Scrape map (menu)    : `plan/_menu-image-scrape.json`
- Build status         : `docs/STATUS.md`
- Pre-Cascade roadmap  : `docs/ROADMAP.md` (legacy roadmap; THIS
                         file's `roadmap.md` is the canonical
                         post-2026-05-04 plan)
- Editorial workflow   : `docs/CONTENT.md`
- Deploy runbook       : `docs/DEPLOY.md`
- EmailJS setup        : `EMAILJS-SETUP.md`
- Project journal      : `docs/JOURNAL.md`

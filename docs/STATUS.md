# Mon Boum V3 — Status Report

_Last updated: 2026-04-30_

---

## 1. Executive summary

The project is **production-ready pending three user-only steps**: a manual browser QA pass, manual Deliveroo URL verification, and configuring Vercel environment variables.

- **Build status**: `npm run build` passes.
- **Data validation**: `npm run validate:data` passes (10 restaurants, 3 tiktoks, 5 promos, 11 testimonials).
- **SEO validation**: `npm run validate:seo` passes on all 11 built pages.
- **Full pipeline**: `npm run validate:all` (data → build → SEO) passes.
- **Git working tree**: clean.
- **Pages built**: 11.
- **React islands**: stable on `react@18.2.0` / `react-dom@18.2.0`.
- **Self-hosted fonts**: Anton + Inter via `@fontsource` (no external CDN).
- **Square PWA icons**: 192 / 512 / 512-maskable / apple-touch generated from the brand logo.
- **TikTok auto-sync**: `src/data/tiktoks.js` is now derived at build time from `src/generated/tiktok-local.json` (with curated title overrides).
- **Restaurants map**: brand-colored pins, popups, two-way filter sync.
- **Deliveroo URLs**: integrated per-restaurant; still need final human sanity verification.
- **Deploy assets**: `vercel.json` (cache + security headers) and `docs/DEPLOY.md` written.
- **Editorial workflow**: documented in `docs/CONTENT.md`.

---

## 2. What works

### 2.1 Pages

- **Homepage** (`/`)
  - Hero rotator
  - Brand sections
  - Delivery CTA
  - Promo scroller (Deliveroo offers)
  - Testimonials slider
  - TikTok video section with local MP4 playback
- **Brand pages**
  - `/boum-burger`
  - `/boum-pizzs`
  - `/boum-chicken`
  - `/boum-saveurs`
- **Restaurants page** (`/nos-restaurants`)
  - Restaurant cards
  - Filter pills
  - Interactive Leaflet map
  - Brand-colored pins
  - Popups with itinerary and Deliveroo links
  - Filter sync (pills <-> cards <-> map)
  - Marker click scrolls and highlights matching card
- **Contact** (`/contact`) and **Franchise** (`/formulaire-de-candidature`)
- **Legal** (`/mentions-legales`)
- **404** (`/404`)

### 2.2 Technical stack

- **Astro 5** working
- **React islands** working after React pin:
  - `react: 18.2.0`
  - `react-dom: 18.2.0`
- **Tailwind CSS** working
- **Leaflet / react-leaflet** working with SSR-safe dynamic imports
- **Sitemap generation** working
- **Static output** working (compatible with Vercel)

### 2.3 TikTok videos

- Local MP4 playback
- Autoplay muted by default
- User sound toggle (with `aria-pressed`)
- Reduced-motion handling
- Top-viewed download pipeline reproduced from `MarcheDeMoV2`
  - Script: `scripts/tiktok-download.mjs`
  - Command: `npm run sync:tiktok`
- Downloaded MP4s present:
  - `public/assets/tiktoks/tiktok-1.mp4`
  - `public/assets/tiktoks/tiktok-2.mp4`
  - `public/assets/tiktoks/tiktok-3.mp4`
- Data file points to matching videos: `src/data/tiktoks.js`
- Generated summary: `src/generated/tiktok-local.json`

Top videos currently downloaded:

- **Rank 1** — Naan kebab Boum Saveurs — ~191,900 views
- **Rank 2** — Pizza geante Boum Pizza — ~180,200 views
- **Rank 3** — Box du peuple Boum Saveurs — ~144,500 views

### 2.4 Deliveroo integration

- `deliverooUrl` exists per restaurant in `src/data/restaurants.js`
- Restaurant cards use per-location Deliveroo URLs
- Brand pages use location-specific Deliveroo URLs in hero CTAs and location cards
- Map popups include Deliveroo + itinerary buttons

### 2.5 SEO and metadata

- Page titles and descriptions
- Sitemap generation
- `robots.txt`
- Restaurant and brand JSON-LD helpers
- **Organization JSON-LD on the homepage** (name, alternate names, logo, sameAs)
- Canonical URLs
- OpenGraph and Twitter meta tags
- **Automated SEO sanity script** — `npm run validate:seo` checks every built HTML file in `dist/` for required tags (title, description, canonical, og:*, twitter:card, viewport, html lang) plus sitemap + robots.txt presence.

### 2.6 Favicon and manifest

- Square PWA icons generated from the brand logo via `npm run generate:icons`:
  - `public/assets/icons/icon-192.png`
  - `public/assets/icons/icon-512.png`
  - `public/assets/icons/icon-512-maskable.png` (brand-red canvas, safe-zone padded)
  - `public/assets/icons/apple-touch-icon.png` (180×180)
- `manifest.webmanifest` declares all three Android-relevant icons (192 any, 512 any, 512 maskable).
- `Layout.astro` declares `apple-touch-icon` 180×180 + 192/512 favicons.
- Default Astro `favicon.ico` and `favicon.svg` removed from `public/`.

---

## 3. What does not work / risk areas

### 3.1 Deliveroo URL certainty (HIGH — still open)

The integration works technically, but the URLs themselves still need a final human check, because Deliveroo blocks automated verification.

**Risk**: a wrong restaurant link could send a customer to the wrong branch.

### 3.2 EmailJS depends on environment completeness (HIGH — still open)

The EmailJS helper is implemented and `.env` has values locally. The Vercel environment must be configured before forms work in production.

**Risk**: contact and franchise forms may show fallback errors if env vars are missing.

### 3.3 Browser QA still needed (HIGH — still open)

Build is green and all automated validators pass, but a manual browser QA pass is still needed across:

- React islands rendering
- TikTok playback and sound toggle
- Map load
- Filters
- Mobile menu
- Forms
- Console errors

### 3.4 Resolved since last status

- ~~Google Fonts removed~~ → **Resolved**: Anton + Inter now self-hosted via `@fontsource`.
- ~~Manifest icon not optimal~~ → **Resolved**: square 192 / 512 / maskable / apple-touch icons generated and wired.

---

## 4. Vercel deployability

### 4.1 Status

**Yes, technically deployable now.**

The project is a static Astro site and `npm run build` succeeds locally.

### 4.2 Recommended Vercel settings

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Install command**: `npm install`
- **Node version**: `>=18.17.1` (already declared in `package.json`)

### 4.3 Required Vercel environment variables

- `PUBLIC_EMAILJS_PUBLIC_KEY`
- `PUBLIC_EMAILJS_SERVICE_ID`
- `PUBLIC_EMAILJS_TEMPLATE_CONTACT`
- `PUBLIC_EMAILJS_TEMPLATE_FRANCHISE`
- Optional:
  - `PUBLIC_GA4_ID`

---

## 5. Readiness ratings

### 5.1 Technical deploy readiness — 95%

Why not 100%:

- Browser QA after latest fixes still needed
- Vercel env vars must be configured
- Deliveroo links must be validated

### 5.2 Content readiness — 90%

Why not 100%:

- Deliveroo URLs need confirmation
- Final legal and business data must be confirmed by owner

### 5.3 Visual / UX readiness — 95%

Why not 100%:

- Final mobile / device QA missing

---

## 6. Roadmap from here

### 6.1 Phase 1 — Required before Vercel production

1. **Final browser QA** — _open_
   - Run `npm run dev`
   - Check homepage React islands
   - Check TikTok autoplay + sound toggle
   - Check map load and reduced-motion fallback
   - Check filter sync (pills, cards, markers)
   - Check mobile nav (open, close, Escape)
   - Check forms (validation + EmailJS)
   - Confirm no major console errors

2. **Manual Deliveroo URL verification** — _open_
   - For each of the 10 restaurants:
     - Open the `deliverooUrl`
     - Confirm address
     - Confirm restaurant / brand
     - Confirm Deliveroo page is live

3. **Configure Vercel environment variables** — _open_
   - All `PUBLIC_EMAILJS_*` variables
   - Optional `PUBLIC_GA4_ID`
   - Step-by-step in `docs/DEPLOY.md`

4. **Deploy preview on Vercel** — _open_
   - `vercel.json` already committed (cache + security headers)
   - Steps in `docs/DEPLOY.md`

5. **SEO validation** — _automated parts done_
   - `npm run validate:seo` covers structural checks (titles, canonical, og:*, JSON-LD).
   - Remaining manual checks: Lighthouse audit, Google Rich Results Test, OpenGraph preview tool, Mobile-friendly test.

### 6.2 Phase 2 — Strongly recommended before final handoff

1. ~~**Self-host fonts**~~ — **Done**. `@fontsource/anton` + `@fontsource/inter` imported from `Layout.astro`.
2. ~~**Generate proper icons**~~ — **Done**. `npm run generate:icons` produces 192 / 512 / maskable / apple-touch icons; manifest + Layout updated.
3. ~~**Image performance**~~ — **Done**. Page-level in-flow images now declare explicit `width`/`height`; above-fold heroes use `loading="eager" fetchpriority="high"`; below-fold use `loading="lazy" decoding="async"`.
4. ~~**Analytics**~~ — **Done**. GA4 only loads when both `PROD` build and `PUBLIC_GA4_ID` are set; current empty env confirmed not to leak any GA script into `dist/`.

### 6.3 Phase 3 — Optional optimizations

1. ~~**Better TikTok management**~~ — **Done**. `src/data/tiktoks.js` is derived at build time from `src/generated/tiktok-local.json`; running `npm run sync:tiktok` refreshes the homepage on next build. Hand-curated titles live in `TITLE_OVERRIDES` to avoid raw emoji/ellipsis copy.
2. ~~**Restaurant data validation script**~~ — **Done**. `npm run validate:data` validates restaurants, tiktoks, promos, testimonials (required fields, formats, uniqueness, file existence, Toulouse-area bounds).
3. ~~**Editorial workflow**~~ — **Done**. `docs/CONTENT.md` documents how non-devs update restaurants, promos, TikToks, testimonials, brand info.

---

## 7. Final production checklist

### 7.1 Must-do (still open)

- [ ] Restart local dev server and confirm no `jsxDEV` errors
- [ ] Manually verify all 10 Deliveroo URLs
- [ ] Configure all required env vars on Vercel
- [ ] Deploy a Vercel preview
- [ ] Run Lighthouse on key pages (home, restaurants, brand pages)
- [ ] Test contact form end-to-end
- [ ] Test franchise form end-to-end
- [ ] Test mobile navigation
- [ ] Test on at least one iOS and one Android device

### 7.2 Strongly recommended (done)

- [x] Self-host fonts
- [x] Generate square PWA icons
- [x] Add explicit dimensions to in-flow images
- [x] Validate Organization / Restaurant JSON-LD structurally (`npm run validate:seo`)
- [ ] Validate JSON-LD with Google Rich Results (live URL only)

### 7.3 Optional (done)

- [x] Add data validation script for restaurants (`npm run validate:data`)
- [x] Improve TikTok pipeline polish (build-time auto-sync from JSON)
- [x] Document editorial workflow (`docs/CONTENT.md`)

---

## 8. Where we stand right now

- **Build**: green
- **Data validators**: green (`validate:data` + `validate:seo`)
- **Repo**: clean
- **Site**: functionally complete on all major pages
- **Blocking issues for preview deploy**: none
- **Blocking issues for production**: only the user-led steps in section 6.1 — browser QA, Deliveroo URL check, Vercel env vars, and the live preview deploy itself.

In short, the project is ready to be **deployed to a Vercel preview immediately**, and is one focused QA + verification pass away from being **declared the final production version**.

---

## 9. Available scripts (quick reference)

| Command                    | Purpose                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `npm run dev`              | Astro dev server                                                   |
| `npm run build`            | Static production build into `dist/`                               |
| `npm run preview`          | Preview the built site locally                                     |
| `npm run validate:data`    | Sanity-check `src/data/*.js` (restaurants, tiktoks, promos, testimonials) |
| `npm run validate:seo`     | After build, scan every `dist/*.html` for SEO + social essentials  |
| `npm run validate:all`     | `validate:data` → `build` → `validate:seo`                         |
| `npm run sync:tiktok`      | Download top TikTok videos and refresh `tiktok-local.json`         |
| `npm run generate:icons`   | Re-generate the PWA icon set (192/512/maskable/180)                |

## 10. New project files added in this pass

- `vercel.json` — cache + security headers, clean URLs, no trailing slash
- `docs/DEPLOY.md` — full Vercel deployment runbook
- `docs/CONTENT.md` — editorial workflow for non-devs
- `scripts/validate-data.mjs` — data layer validator
- `scripts/validate-seo.mjs` — dist HTML SEO validator
- `scripts/generate-icons.mjs` — sharp-based PWA icon generator
- `public/assets/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`

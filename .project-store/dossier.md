# Project Dossier - Mon Boum V3

> The big-picture document for P-monboum-v3. Updated in place,
> not re-written. Seeded 2026-05-04 from a live-repo + monboum.fr
> scrape. Per M08 schema.

## 1. Identity

- **name**        : Mon Boum V3
- **owner**       : Mommy Jayce (Microdidact)
- **client**      : Mon Boum (groupe Mon Boum, Toulouse)
- **positioning** : 1er drive Fast-Food halal de France, depuis 2004
- **repo path**   : `C:\Users\Mommy Jayce\Desktop\Microdidact\Monboumv3`
- **live url**    : https://mon-boum.vercel.app
- **legacy url**  : https://monboum.fr (WordPress, source of scraped assets)
- **stack**       : Astro 5.18.1, React 18.2.0 islands, Tailwind 3.4.17, EmailJS 4.4.1, Leaflet 1.9.4 / react-leaflet 4.2.1, Vercel (static), Sharp 0.34.5, @fontsource. Node >= 18.17.1.
- **status**      : in development - boss feedback 2026-05-04 triggered visual + UX overhaul (see roadmap)
- **enseignes**   : 4 sub-brands
  - Boum Burger (4 locations) — Pradettes, Aucamville, Colomiers, Mermoz
  - Boum Pizz's (4 locations) — Pradettes, Bellefontaine, Aucamville, Rangueil
  - Boum Chicken (1 location) — Vauquelin (7j/7, late-night ven/sam jusqu'a 1h45)
  - Boum Saveurs (1 location) — Mermoz (kebab + naans)
- **total restaurants** : 10
- **delivery**    : Deliveroo (per-restaurant URLs in `src/data/restaurants.js`)
- **socials**     :
  - Instagram @boumburger
  - TikTok @boumchickentoulouse
  - Facebook /boumburger

## 2. Architecture

- **Astro static output**. `output: 'static'` in `astro.config.mjs`. Vercel serves built `dist/` from edge.
- **React islands** for interactive pieces only:
  - `HeroRotator.jsx` (home hero)
  - `PromoScroller.jsx` (home promos)
  - `TestimonialsSlider.jsx` (home testimonials)
  - `TikTokFacade.jsx` (home tiktok grid + local MP4 playback)
  - `RestaurantsMap.jsx` (Leaflet map on /nos-restaurants)
  - `ContactForm.jsx`, `FranchiseForm.jsx` (EmailJS forms)
  - `_ErrorBoundary.jsx`
- **Tailwind 3.4** + design tokens in `src/styles/globals.css`. Brand palette extended in `tailwind.config.mjs`:
  - rouge `#E10600` (primary CTA + accents)
  - noir `#111111` / noir-deep `#0A0A0A` (texture-bg backgrounds)
  - jaune `#FFB800` (chicken accent)
  - orange `#FF6A00` (pizz accent)
  - vert `#2E7D32` (saveurs accent)
- **Fonts** : Anton (display) + Inter (body), self-hosted via `@fontsource` (no CDN). Migration done 2026-04-30 (see docs/STATUS.md).
- **Layout** (`src/layouts/Layout.astro`) : SEO head (title, description, canonical, og/twitter, JSON-LD), favicon set (PWA 192/512/maskable + apple-touch), GA4 stub (env-gated), Header/Footer slots, IntersectionObserver scroll-reveal, `--hh` CSS var driven by header height, parallax script. All animations gated by `prefers-reduced-motion`.
- **Header** (`src/components/Header.astro`) : ALWAYS white, sticky, h-60 mobile / h-70 desktop. Burger -> X transform on toggle. Mobile drawer is `fixed inset-0 bg-noir z-40` with `pt-[60px]` content padding. As of 2026-05-04, drawer-internal explicit close X is being added (Phase A) — boss flagged the burger-X transform as too subtle.
- **Brand pages** : 4 enseigne pages (`/boum-burger`, `/boum-pizzs`, `/boum-chicken`, `/boum-saveurs`) all share a hero -> concept -> locations -> CTA structure. Hero uses dark `texture-bg`. Carte sections being added (Phase C).
- **Source-of-truth modules** :
  - `src/data/restaurants.js` — 10 restaurants + ENSEIGNES lookup + `buildEnseigneGraph` + `buildAllRestaurantsGraph` (FastFoodRestaurant JSON-LD)
  - `src/data/promos.js` — Deliveroo offers
  - `src/data/testimonials.js` — 11 celebrity testimonials
  - `src/data/tiktoks.js` — derived at build time from `src/generated/tiktok-local.json`
  - `src/data/menus.js` — being added Phase C (per-enseigne menu items + photo refs)

## 3. Environment contract

Source : `.env.example` (UTF-8, committed). `.env` is gitignored.

All vars are PUBLIC_* (EmailJS browser-only design - safe to embed in client JS):

| Name                                | Purpose                                  |
|---|---|
| `PUBLIC_EMAILJS_PUBLIC_KEY`         | EmailJS Account public key               |
| `PUBLIC_EMAILJS_SERVICE_ID`         | EmailJS service ID                       |
| `PUBLIC_EMAILJS_TEMPLATE_CONTACT`   | Contact form template ID                 |
| `PUBLIC_EMAILJS_TEMPLATE_FRANCHISE` | Franchise application template ID        |
| `PUBLIC_GA4_ID`                     | Google Analytics 4 measurement ID (opt)  |

Hard rules :
- Forms fall back to **demo mode** (yellow banner, console-logged submit) when any EmailJS var is missing — dev never blocks on config.
- GA4 only loads when `import.meta.env.PROD` AND `PUBLIC_GA4_ID` is set. Empty env confirmed not to leak any GA script into `dist/`.
- All EmailJS vars must be configured in Vercel Production AND Preview environments before forms work in deployed builds.

## 4. Schema / Data map

File-based, no backend. `src/data/*.js` are the source of truth.

- `restaurants.js` -> 10 restaurants with `{ id, enseigne, nom, adresse, cp, ville, tel?, drive?, horaires?, note?, deliverooUrl, coords: [lat, lng] }`. Ships `buildRestaurantSchema` and `buildEnseigneGraph` for FastFoodRestaurant JSON-LD per enseigne page.
- `promos.js` -> 5 Deliveroo offers (Boum Family, Geante offerte, Milkshake offerte, Mon-boumm, Tacos offert).
- `testimonials.js` -> 11 quotes (Ninho, Dadju, Oli, Vegedream, Koba LaD, Algerino, Marwa, Tayc, Chily, Mario, Landy).
- `tiktoks.js` -> derived from `src/generated/tiktok-local.json` (built by `npm run sync:tiktok`).
- `menus.js` (Phase C) -> per-enseigne `{ id, name, description, image, price?, allergens? }[]` keyed by enseigne slug.

Asset inventory : `public/assets/README.md` documents Pass A (known URLs), Pass B (HTML scrape from monboum.fr 2026-04-23), and Pass C (menu + product scrape 2026-05-04).

## 5. Deployment runbook

Target : Vercel (git-integrated, static output).

Steps for a normal release :
1. `git status` clean on default branch.
2. `npm run validate:all` (data -> build -> SEO) passes locally.
3. Push to default branch -> Vercel auto-builds.
4. In Vercel Dashboard > Settings > Environment Variables : verify the 4 EmailJS vars in BOTH Production and Preview. Re-paste each value to purge trailing whitespace (L-2026-05-03-008 family).
5. Post-deploy smoke :
   - Open in incognito. Check canonical, sitemap.xml, robots.txt, og:image.
   - Hit /, /boum-burger, /nos-restaurants, /contact (form -> demo mode if env unset).
   - Verify Lighthouse mobile >= 90 perf / 95 a11y / 95 BP / 95 SEO.
6. Log the outcome in `log.md`.

Rollback : Vercel "Promote to Production" on previous successful build. Never re-deploy a known-bad commit; tag a fix and redeploy.

Recommended Vercel settings :
- Framework preset : Astro
- Build command   : `npm run build`
- Output directory: `dist`
- Install command : `npm install`
- Node version    : `>=18.17.1` (already in `package.json`)

`vercel.json` at repo root pins :
- `_astro/(.*)` -> 1y immutable cache
- `/(.*)`       -> X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locking camera/microphone/geolocation
- `cleanUrls: true`, `trailingSlash: false`

## 6. Role matrix

| Role        | Access                       | Expected experience            |
|---|---|---|
| anonymous   | all public pages, forms      | full public site, demo-mode forms when env unset |

No admin surface. No multi-tenancy. No auth. Marketing site only - all order flow defers to Deliveroo.

## 7. SEO baseline

- `<title>`, `<meta name="description">`, `<link rel="canonical">` per page via `Layout.astro` props.
- OpenGraph + Twitter card meta on every page (default og:image is `/assets/logos/Boums.png`).
- JSON-LD :
  - Organization on home (alternateName covers all 4 enseignes)
  - FastFoodRestaurant @graph on each `/boum-*` (one entry per location)
  - Full @graph on `/nos-restaurants` (all 10)
  - FAQPage helper available via Layout `faq` prop (not yet wired)
- `robots.txt` + auto-generated `sitemap.xml` (via `@astrojs/sitemap`).
- `lang="fr"`, `og:locale=fr_FR`.
- Canonical source of truth : `site: 'https://mon-boum.vercel.app'` in `astro.config.mjs`. ADR-001.
- Square PWA icons (192/512/maskable/apple-touch) generated from brand logo via `npm run generate:icons` (script: `scripts/generate-icons.mjs`).
- Self-hosted Anton + Inter fonts via `@fontsource` — no Google Fonts CDN dependency (resolved 2026-04-30).
- SEO sanity automated via `npm run validate:seo` (scans every built `dist/*.html` for required tags + sitemap + robots presence).

## 8. Observability

- No formal error sink wired. EmailJS errors surface in the form's `aria-live` region.
- Vercel build logs cover deploy-time issues; runtime telemetry is GA4 only (when enabled).
- TikTok auto-sync script (`scripts/tiktok-download.mjs`) logs to console; failures fail-soft and don't break the build (data file falls back to last successful generation).
- No Playwright CI. Manual browser QA per `docs/STATUS.md` section 6.1.

## 9. Open loops and risks

- **P0 - Mobile drawer close affordance** (boss-flagged 2026-05-04). Burger -> X transform exists in header but boss perceives it as missing. Phase A adds explicit drawer-internal close X (44px tap target).
- **P0 - White-background bleed on dark hero banners**. Scraped PNGs (`BOUM-BURGER-SINCE`, `Boum-Pizzs-1`, `Boum-Chicken-1-1024x576`, `Boum-Saveurs`, plus the 4 home enseigne badges) carry baked-in white backgrounds. On the dark `texture-bg` hero of each `/boum-*` page they render as white blocks. Phase B adds `scripts/derosify-bg.mjs` (sharp-driven alpha-out of near-white pixels) with originals backed up to `public/assets/banners/_originals/`.
- **P0 - No menu / "carte" content**. Boss requested "ajouter les cartes" + "photos qui donne envie". Phase C adds `src/data/menus.js` + `<MenuGrid>` component + per-enseigne carte sections. Photo source : Pass C scrape from monboum.fr (24 images saved to `public/assets/menus/` + `public/assets/products/`).
- **P0 - No product showcase on home**. Boss referenced Burger King + the 4 reference sites. Phase D adds a hero-product section between brand teasers and quality. 6 signature products selected from scraped photos.
- **P1 - Deliveroo URL verification**. URLs exist per restaurant but need final human walk-through (cf. `docs/STATUS.md` section 3.1). Cascade cannot automate this — Deliveroo blocks bots.
- **P1 - Vercel env var configuration**. The 4 EmailJS vars must be set on Vercel before forms work in prod. Owner-led step.
- **P1 - Browser QA**. Manual pass needed across React islands, TikTok playback, map load, filter sync, mobile menu, forms. Can be partly automated with Playwright (Backlog).
- **No formal error sink** (Sentry / LogTail) wired.
- **`menus/` was empty pre-2026-05-04**. Now seeded via Pass C. Long-term : the `menus.js` should be the source of truth and `menus/` images should be stable URLs.

## 10. KPIs

Provisional targets (W04.10 baselines) :
- Lighthouse mobile : Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.
- LCP <= 2.5s on 4G mid-range device.
- CLS <= 0.1.
- TBT <= 200ms.
- Main JS chunk per route <= 250 KB gzip.
- 100% form-submit success in non-demo mode (EmailJS dashboard reports).
- Map page bundle delta <= 25 KB gzip (per existing Leaflet measurement in `docs/ROADMAP.md`).

To be measured + locked once Phase E polish runs.

---

**Change log for this dossier**
- 2026-05-04 - seeded from live-repo scan + monboum.fr scrape (Pass C). 4 enseigne pages confirmed, 10 restaurants confirmed, asset folders inventoried, boss feedback recorded, roadmap drafted.

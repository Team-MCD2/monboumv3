# Mon Boum V3 — Project Journal

How we went from an empty folder to a 10-page production site with two live forms. Written as a retrospective for future contributors (and future me).

---

## 1 · The brief

Replace the existing **monboum.fr** WordPress site with a fast, accessible, agency-grade static rebuild that:

- Keeps all customer-facing content from the live site (brand voice, locations, franchise pitch, testimonials).
- Works as a **marketing funnel**, not a menu ordering system — ordering stays on Deliveroo.
- Puts the **franchise candidacy** front-and-centre — it's the primary conversion target.
- Is deployable by one person on Vercel in under 5 minutes.
- Ships with **zero tracking cookies, zero third-party widgets**, and minimal JS.

Target audience: hungry Toulousains (main traffic) + prospective franchisees (high-value conversion).

---

## 2 · Starting state (what we inherited)

- **Live site**: `monboum.fr` — WordPress with a dated theme, slow LCP, 15-second hero video load, coloured-container logo (anti-pattern).
- **Asset inventory**: scraped 40+ images, 4 hero banners per enseigne, a 44 MB franchise video, TikTok facade requirements — all dumped into `plan/asset-inventory.md` during pass A.
- **Design references**: the live `monboum.fr` for copy/structure; more modern Astro marketing templates (e.g. Vercel demos) for layout rhythm.
- **Data references**: the live site's footer SIRET, the 10 restaurants with street addresses (no coordinates), the franchise pricing grid.

No codebase to port — this was a green-field rebuild that had to *match the existing brand* without being a pixel-for-pixel port.

---

## 3 · Core architectural decisions

### 3.1 Astro over Next.js

Next would have worked, but overshoots for a 10-page marketing site. Astro's **islands architecture** means every page ships ~0 JS by default; React only hydrates where it's actually interactive (hero rotator, forms, carousels). Measured impact: every non-form page loads with **< 2 kB of JS** (just the parallax / reveal script in the Layout).

### 3.2 Tailwind + CSS vars, not a UI kit

shadcn or Radix were tempting, but the brand needed a **specific editorial feel** (Anton display font, red-on-dark grunge texture, irregular marquee). Tailwind gives us speed without hiding the design. Brand colours live in `globals.css` under `:root` as CSS vars, so a future rebrand is a 3-line diff.

### 3.3 No CMS

The site has ≤ 2 updates / quarter. A CMS would be overhead. Content lives in:

- **`src/data/restaurants.js`** — 10-restaurant source of truth (one file, typed via JSDoc)
- **`src/data/testimonials.js`** — customer quotes
- Page-level content is inline French copy in `.astro` files

Trade-off: non-technical owners can't edit copy. Accepted — it's cheaper to hire a freelancer for a one-line change than to host a CMS.

### 3.4 EmailJS over a serverless function

The two forms don't need a database. A serverless function would require a backend (Vercel functions / Netlify funcs / anything with secrets). EmailJS pushes the sending into the browser with a **rate-limited public key**; our template config + honeypot keeps it safe for the 2 forms' traffic.

Trade-off: the public key is visible in client JS. Mitigated by EmailJS's per-template rate limits (200 emails/month on free tier is *more* than enough) and the template's **fixed `To Email`** — the key can't be weaponised to spam someone else.

### 3.5 No image optimisation yet

Astro's `<Image>` component with `astro:assets` would cut image weight ~40% via AVIF/WebP. Deferred — all the raw PNGs are under 200 kB each, and Vercel's edge caches them. Flagged in `docs/ROADMAP.md` as a high-ROI polish item.

---

## 4 · How we built it — phase by phase

The build ran in **5 phases** over the course of the engagement. Each phase ended with a production build (`npm run build`) going green before moving on.

### Phase A — Foundation (Astro, Tailwind, layout scaffold)

- Bootstrapped Astro 5 with the React integration and `@astrojs/sitemap`.
- Set up `tailwind.config.mjs` with brand tokens (`rouge`, `noir`, `noir-deep`, `blanc`, `gris`).
- Built `src/layouts/Layout.astro` with:
  - `<head>` (SEO: title, description, OG, favicon)
  - Skip-to-main link (a11y)
  - Header-height measurement via JS → `--hh` CSS var (the hero-padding-top pattern we used everywhere)
  - Parallax + reveal script (IntersectionObserver + `data-*` attributes)
- Built `Header.astro` with sticky white bar, mobile drawer, burger→X animation.
- Built `Footer.astro` with 3 nav columns + SIRET disclosure + Microdidact credit.
- Built `GrungeSeparator.astro` — a decorative SVG wave used between dark and light sections.
- Wrote `src/styles/globals.css` with: design tokens, texture backgrounds, `prefers-reduced-motion`-guarded animations, focus-visible styling.

**What worked**: CSS vars for the brand palette made theme sweeps trivial. The `--hh` pattern for dynamic header offset was used by 7 pages with no per-page tweaking.

### Phase B — Home page (7 sections, 4 React islands)

The home is the most complex page: hero rotator, 4-brand grid, traçabilité split, Deliveroo CTA, promo marquee, testimonials carousel, TikTok façade.

Four islands hydrated on demand:

| Island | When hydrated | Why |
|---|---|---|
| `HeroRotator` | `client:load` | Above the fold, must be interactive on first paint |
| `PromoScroller` | `client:visible` | Below fold, lazy-loads when scrolled into view |
| `TestimonialsSlider` | `client:visible` | Same — carousel JS only downloaded when needed |
| `TikTokFacade` | `client:visible` | Uses a placeholder image + click-to-embed (no heavy TikTok iframe until user opts in) |

All islands wrapped in an `ErrorBoundary` so a React crash doesn't blank the page.

**What worked**: `client:visible` paired with Astro islands kept the home's initial JS at ~3 kB. The TikTok façade pattern (click-to-embed) avoided the 300 kB+ weight of the official TikTok embed library.

### Phase C — Enseigne pages (mon-boum + 4 brand pages)

Five near-identical pages from a shared visual template: hero, concept split, location(s) list, CTA strip. Each brand has its own colour (`#E10600` red for burger, `#FF6A00` orange for pizz's, `#FFB800` yellow for chicken, `#2E7D32` green for saveurs) — used as an accent stripe on restaurant cards and as `<span class="text-rouge">` equivalent via inline style.

**What worked**: building one page, then using find-and-replace rather than abstracting a `<EnseigneLayout>` component. The abstraction would have forced every page into the same shape; inline duplication let each brand feel slightly different.

### Phase D — Utility pages (4 more pages + forms)

Four pages shipped in one pass:

1. **`/mentions-legales`** — French legal disclosure (SIRET `500 373 311 00017`), RGPD, cookies.
2. **`/nos-restaurants`** — 10 locations with vanilla-JS filter pills (5 filters: All + 4 brands). No React island — `querySelectorAll` + `style.display` was enough.
3. **`/contact`** — 5-field form with subject dropdown, honeypot, aria-* error plumbing.
4. **`/formulaire-de-candidature`** — 10-field franchise form with identité / projet / à propos sections, apport + échéance dropdowns, RGPD consent checkbox.

Built in parallel:

- **`src/lib/emailjs.js`** — thin wrapper around `@emailjs/browser` with an `isEmailJSConfigured()` guard. If any env var is missing, the form shows a yellow "démonstration" banner and logs submissions to console. This means local dev never breaks on missing `.env`.
- **React form islands** (`ContactForm.jsx`, `FranchiseForm.jsx`) — controlled-input forms, field-level error state, `aria-live="polite"` feedback region, submit-button disabled during send.

Also in D — a **nav audit** caught two stale links in Header and Footer: `/franchise` (didn't exist) and `/gallery` (never built). Both were redirected to real pages.

**What worked**: the demo-mode pattern in the EmailJS helper. Users could preview the finished form flow and visual states with zero configuration.

### Phase E — Polish sweep

After all 10 pages were shipping, we ran a deliberate polish pass:

- Smooth anchor scroll on `<html>`, guarded by `prefers-reduced-motion`.
- `scroll-mt-24` on 4 enseigne pages' location sections so sticky-Header didn't hide the heading when "Nos adresses" was clicked.
- Mobile menu refactor: extracted `setMenuOpen()`, added auto-close on link click, added Escape-key handler with focus return to the toggle button.
- Removed a dead `prose-legal` class from the legal page.
- Removed two stale Footer links.

The audit was deliberately conservative — inconsistencies within tolerance (e.g., `py-20 md:py-28` vs `py-16 md:py-24` differing by 16 px) were left alone to avoid invasive churn that would risk introducing bugs.

---

## 5 · What worked

- **Plan-first**: `plan/plan.md` was drafted before touching code. It listed every page, every section, every asset. Kept the build on-rail.
- **Astro islands**: genuine bundle wins. No page exceeds 12 kB of hydrated JS, and most pages are 0 JS.
- **CSS-only animations**: zero motion libraries. `data-reveal` + `data-d="n"` stagger delays cover 90% of what GSAP would do.
- **Demo-mode forms**: shippable visuals with no backend config. Made the handoff to the client seamless.
- **Single data source (`restaurants.js`)**: used by 6 pages + the footer count. One edit propagates everywhere.
- **`--hh` CSS var for dynamic header padding**: 70 px sticky header, measured once at load, consumed by every hero section. No per-page tweaking.
- **Build smoke test after every phase**: caught a broken import in Phase C (within 30s) instead of at deploy time.

---

## 6 · What we'd do differently

- **Image pipeline upfront**: Astro's `<Image>` component would save ~40% on total bytes. Adding it now means touching every asset reference. Cheaper to have set up from Phase A.
- **A typed data model**: JSDoc `@typedef` in `restaurants.js` gets autocomplete but no compile-time errors. A TypeScript `.ts` data file would have caught the missing `deliveroo_url` per location earlier.
- **A component-level snapshot test**: zero tests currently. For a site this static, Playwright visual regression on 10 pages would be a safety net worth ~2 hours to wire up.

---

## 7 · Pending / handoff items

All tracked in `docs/ROADMAP.md`:

- **Live map** on `/nos-restaurants` (library choice analysed, data-gap identified: per-location Deliveroo URLs).
- **Image optimisation** via `astro:assets`.
- **JSON-LD LocalBusiness schema** per restaurant (SEO).
- **Per-restaurant Deliveroo deep links** (requires manual gathering from Deliveroo storefront).
- **GA4 wiring** when the measurement ID is provided.

---

## 8 · One-line summary

*Plan thoroughly, ship in phases, build tests for the phases, let the CSS do the work, keep the JS where it earns its weight.*

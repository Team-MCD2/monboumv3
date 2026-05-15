# Roadmap - Mon Boum V3

> Phased plan. Each phase has status, definition-of-done, and
> verification record. Per M05, once the roadmap is validated
> by the owner Cascade works autonomously through phases;
> check-in at phase boundary or unresolvable ambiguity.

Last updated : 2026-05-04 (Phase 0 done, A-F queued for execution this session)

> Ordering rationale (validated by owner 2026-05-04) :
> Phase 0 (bootstrap) is M01-mandated, must run first.
> Phase A (mobile drawer X) is the smallest fix with the biggest
> perceived-quality jump — boss explicitly flagged it as critical.
> Phase B (white-bg removal) is a visible bug on every enseigne
> page, solvable with a sharp script, no design dependency.
> Phase D (home product showcase) before C because D is a
> 1-section addition that builds the visual pattern C reuses
> across 4 pages.
> Phase C (full carte + menus.js) is the largest content-modeling
> phase.
> Phase F (decisions ADR) is a 30-min codification step.
> Phase E (polish) ships last after A-D land.

## Phase 0 - .project-store bootstrap                              [STATUS: DONE]
- **dod**      :
  - `Monboumv3\.project-store\` exists with all 9 M08 canonical
    files seeded.
  - Boss feedback 2026-05-04 captured verbatim in
    `boss-feedback.md` and translated to actionable phases.
  - Owner authorization recorded in `owner-feedback.md`.
  - Project store registered as a stub in `db.md` W07.
  - `db.md` M09 log updated with a D-2026-05-04 entry pointing
    to this store.
- **verified** : 2026-05-04 — 9 files written by Cascade,
  cross-verified against M08 templates and MdM-V2 reference
  store. M09 log + W07 stub still pending end-of-session.

## Phase A - Mobile drawer-internal close X                        [STATUS: in-progress]
- **dod**      :
  - Explicit `×` close button rendered top-right INSIDE the
    `#mobile-menu` drawer in `src/components/Header.astro`.
  - Visual : white SVG `×` icon, 44x44 px tap target, no fill,
    `safe-area-inset-top` padding to clear notches.
  - A11y : `aria-label="Fermer le menu"`, `type="button"`,
    `tabindex` follows DOM order, focus returns to the
    `#mobile-menu-toggle` on close.
  - Behaviour : click closes the drawer (calls `setMenuOpen(false)`).
    Existing Escape-to-close + auto-close-on-link parity preserved.
  - Header burger -> X transform STAYS as the secondary close
    path (no regression).
  - `T-monboum-mobile-drawer-close` tip recorded in
    `knowledge.md` (already done in Phase 0).
- **approach** :
  1. Add a `<button>` inside `#mobile-menu`, absolutely positioned
     `top-4 right-4` (with safe-area inset), with the SVG `×`.
  2. Wire it to `setMenuOpen(false)` via the same script
     block — no extra JS needed.
  3. Smoke : open dev server, mobile viewport, open drawer,
     click X -> closes; Escape -> closes; tab from inside ->
     focus stays trapped inside the drawer (existing behaviour).
- **verified** :

## Phase B - White-bg removal on dark-hero PNGs                    [STATUS: in-progress]
- **dod**      :
  - `scripts/derosify-bg.mjs` exists (sharp-based, alpha-out
    of near-white pixels with tolerance ~12 by default).
  - Originals backed up to `public/assets/banners/_originals/`
    before overwriting.
  - Script applied to the 8 PNGs that land on dark surfaces :
    - `Boum-Burgers.png`           (home grid badge)
    - `BOUM-Pizzs.png`             (home grid badge)
    - `Boum-Chicken.png`           (home grid badge)
    - `Boum-Saveurs.png`           (home grid badge + boum-saveurs hero)
    - `BOUM-BURGER-SINCE.png`      (boum-burger hero)
    - `Boum-Pizzs-1.png`           (boum-pizzs hero)
    - `Boum-Chicken-1-1024x576.png`(boum-chicken hero)
    - `welcome_image.png`          (home welcome section, on bg-white but white halo regardless)
  - Visual smoke : open the dev server, walk the 4 enseigne
    pages, confirm no white block around any logo on the hero.
  - `package.json` gains a `derosify:bg` script for future
    re-runs.
- **approach** :
  1. Write `scripts/derosify-bg.mjs` :
     - Loads PNG via sharp `.raw()`.
     - For each pixel, if `R+G+B/3 > threshold (243)` AND alpha
       not already < 255, set alpha to 0 with a fade band
       (alpha = (255 - brightness)*8 to preserve anti-alias).
     - Writes back to original path.
     - First-run copies originals to `_originals/`.
  2. Run via `node scripts/derosify-bg.mjs` (no args = process
     the locked list above; `--all` flag processes every PNG
     in `banners/`).
- **verified** :

## Phase D - Home product showcase                                 [STATUS: in-progress]
- **dod**      :
  - New `<section>` on `src/pages/index.astro`, between section 3
    (FAITES VOTRE CHOIX brand teasers) and section 4 (QUALITE).
  - Heading : `Nos produits stars` / `Faites <span text-rouge>chauffer</span> l'envie.`
    (BK-style hero header).
  - Grid : 6 product cards on desktop (3-col), 2-col tablet,
    1-col mobile. Each card carries:
    - Hero photo (1 of the 6 products from
      `public/assets/products/`)
    - Product name + enseigne label
    - 1-line teaser (Cascade-curated French copy)
    - Per-card CTA -> Deliveroo
  - Reuses existing primitives :
    `data-reveal data-d="1..6"` for stagger,
    `img-zoom` on the photo,
    `font-display` for product name.
  - Mobile a11y : touch target >= 44px on the card (the whole
    card is a link).
- **approach** :
  1. Pick the 6 products :
     - Burger Wall Street (signature) -> /boum-burger
     - Burger Brooklyn (vegetarian)   -> /boum-burger
     - Burger 5eme Avenue             -> /boum-burger
     - Pizza BB (Boum Burger pizza)   -> /boum-pizzs
     - Chicken Bucket                  -> /boum-chicken
     - Tacos Boum Burger               -> /boum-burger
  2. Add `src/components/ProductShowcase.astro` (Astro static,
     no JS needed) with the markup pattern.
  3. Insert into `index.astro` after section 3.
  4. Verify visually + on mobile viewport.
- **verified** :

## Phase C - Carte sections + menus.js + MenuGrid                  [STATUS: planned]
- **dod**      :
  - `src/data/menus.js` exists with
    `{ 'boum-burger': [{ id, name, description, image, price?, category? }, ...], 'boum-pizzs': [...], ... }`
    seeded for 4 enseignes.
  - `src/components/MenuGrid.astro` renders a grid of menu
    items from a passed-in array.
  - `src/components/MenuBoardLightbox.astro` renders a
    full-screen-zoom-on-click image (the menu BOARD itself).
  - Each `/boum-*` page gains a "LA CARTE" section between
    Concept and Locations :
    - boum-burger : 4 menu boards (Burgers, Tacos, Assiettes,
      Desserts) + MenuGrid of 6-8 hand-curated items
    - boum-pizzs  : 1 fresh 2024 menu board + MenuGrid of 6-8
      pizzas (Soso, Tunisienne, Margherita, etc. — boards
      transcribed)
    - boum-chicken : 5 menu boards (Burgers, Buckets, Bowls,
      Desserts, Menu Enfant) + MenuGrid of 6-8 items
    - boum-saveurs : MenuGrid only (no scraped board for this
      enseigne — no WP page existed) + a placeholder note for
      owner to upload a board photo
  - Lightbox opens menu boards at full resolution
    (1810x2560 px source where available).
  - All images use `loading="lazy"` and explicit width/height.
- **approach** :
  1. Hand-curate `menus.js` from the menu-board images.
     Cascade transcribes 6-8 items per enseigne; owner reviews
     prices in next session.
  2. Build `MenuGrid.astro` (Astro template, prop-driven).
  3. Build `MenuBoardLightbox.astro` (Astro + tiny inline
     `<script>` for click-to-open + Escape-to-close).
  4. Splice the new section into the 4 `boum-*.astro` pages.
- **verified** :

## Phase F - ADR codification of reference-site contextualisation [STATUS: planned]
- **dod**      :
  - ADR-008 (already drafted in `decisions.md`) confirmed as the
    canonical "what we steal vs skip" record per reference site.
  - Cross-link from `dossier.md` section 9 (open loops) to
    ADR-008 so future visual decisions reference it.
  - 1-line contributor note added to README's "Brand rules"
    referencing ADR-008.
- **approach** :
  1. ADR-008 already written in `decisions.md` during Phase 0.
     No further code change.
  2. Edit `README.md` line ~123 to add the cross-link.
- **verified** :

## Phase E - Mobile / Lighthouse polish pass                       [STATUS: planned]
- **dod**      :
  - `npm run validate:all` clean.
  - Lighthouse mobile :
    Performance >= 90, A11y >= 95, BP >= 95, SEO >= 95.
  - Screenshot smoke captured for the 4 enseigne pages
    (desktop 1440 + mobile 390) showing :
    - drawer-internal X visible top-right when drawer open
    - no white blocks around enseigne logos
    - product showcase grid renders cleanly
    - menu boards lightbox-zoom works
  - `docs/STATUS.md` section 6.1 updated to reflect what shipped
    in this session.
  - End-of-session : append distilled lessons to db.md
    (`L-2026-05-04-MB-001..004`), append a D-2026-05-04 entry
    to `log.md`, update db.md M09 log.
- **approach** :
  1. Run validate:all.
  2. Run Lighthouse via `npx lighthouse <localhost-url> --view`
     for each key page.
  3. Capture screenshots via `scripts/capture-mobile-home.mjs`
     pattern (port from MdM-V2 if not present here).
  4. Edit STATUS.md.
  5. Append to db.md.
- **verified** :

## Backlog / unscheduled

- Per-page OG images (4 enseigne pages currently share `Boums.png`).
- Custom 404 page brand-styled.
- Auto-reply EmailJS template for contact form.
- `astro:assets` migration for automatic AVIF/WebP + srcset.
- Playwright CI smoke test for the 5 critical routes.
- Cookie consent banner (W04.15 T-must-consent) — only needed if
  GA4 is ever enabled.
- Mentions-legales editorial review by owner / counsel.
- Restaurant data validation script tightening (currently passes;
  could add bounds + url-shape checks).
- Secondary CTA on each enseigne hero — currently only "Commander"
  + "Nos adresses". Could add "Voir la carte" jump-link.
- Move `tailwind.config.mjs` palette into a JSON token file
  shareable with future native-app builds (over-engineering for
  current state but cheap to do).

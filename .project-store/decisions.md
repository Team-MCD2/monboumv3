# Architecture Decision Records - Mon Boum V3

> Each decision is small, numbered, and dated. Record context,
> decision, consequences. Never rewrite a decision - if it is
> superseded, add a new ADR that references the old.
> Seeded 2026-05-04 from live-repo scan + boss feedback.

## ADR-001  Canonical site URL is `mon-boum.vercel.app`           [STATUS: active]
- context      : production deploys to Vercel; legacy WordPress
                 lives at `monboum.fr` (asset source, NOT
                 customer destination).
- decision     : canonical source of truth is `site:` in
                 `astro.config.mjs` set to
                 `https://mon-boum.vercel.app`. All canonical /
                 og:url / sitemap / RSS references derive from
                 this. Customer-facing copy + CTAs never link
                 to monboum.fr.
- consequences : any future domain swap (e.g. mon-boum.fr) is a
                 single-file change + sitemap regen + Vercel env
                 update. The legacy monboum.fr stays alive only
                 as an asset host until WP-REST scrape is fully
                 archived to local files.

## ADR-002  Stack lock - Astro 5 + React 18.2.0 + Tailwind 3      [STATUS: active]
- context      : the project was rebuilt from a WP origin, then
                 stabilised on Astro 5.18.1 + @astrojs/react
                 4.3.0 + react@18.2.0 (pinned, NOT caret) +
                 tailwind 3.4.17. React was downgraded from 18.3
                 to 18.2.0 to fix `jsxDEV` runtime mismatch in
                 Astro 5 islands.
- decision     : keep React pinned exactly to 18.2.0. Same for
                 react-dom. Astro stays on `^5.18.1` (current
                 caret). Tailwind on `^3.4.17` until v4 stable
                 + @astrojs/tailwind compat is confirmed.
- consequences : `npm install` always resolves to a deterministic
                 React. Major upgrades go through a separate ADR.
                 If Astro 6 ships, re-evaluate.

## ADR-003  Mobile drawer requires drawer-internal close X       [STATUS: active]
- context      : 2026-05-04 boss feedback : "in mobile mode,
                 when the burger menu appears, there isn't any
                 corss to close it". Header burger -> X transform
                 IS implemented but is a thin 24x2 px black line
                 on the white header strip — visually subtle and
                 outside the dark drawer where users instinctively
                 look for the close button.
- decision     : every fullscreen mobile drawer surfaces its OWN
                 explicit close affordance INSIDE the drawer
                 (top-right by convention). Implementation :
                 white `×` SVG icon, 44x44 px tap target,
                 `aria-label="Fermer le menu"`, focus returns
                 to the toggle on close, Escape parity preserved.
                 Header burger -> X transform stays as a
                 secondary close path (it's harmless and helps
                 users who notice it).
- consequences : every drawer + sheet UI in this project must
                 follow this pattern. The reference implementation
                 lives in `src/components/Header.astro` post-Phase A.
                 Adding a drawer without an internal close is now
                 banned (see `.project-store\blacklisted.md`).

## ADR-004  White-background removal is a data fix, not a CSS    [STATUS: active]
- context      : 2026-05-04 boss feedback flagged white blocks
                 around enseigne logos on the dark `texture-bg`
                 hero of /boum-* pages. Root cause : scraped
                 WordPress PNGs (`BOUM-BURGER-SINCE`,
                 `Boum-Pizzs-1`, `Boum-Chicken-1-1024x576`,
                 `Boum-Saveurs`, plus the 4 home enseigne badges)
                 carry baked-in white backgrounds rather than
                 alpha transparency.
- decision     : process the affected PNGs ONCE through
                 `scripts/derosify-bg.mjs` (sharp-driven, alpha-out
                 of near-white pixels with tolerance ~12 to
                 preserve anti-aliased logo edges). Backup
                 originals to `public/assets/banners/_originals/`
                 so the process is reversible. CSS-only
                 `mix-blend-mode: multiply` is rejected as the
                 sole fix — see discarded.md.
- consequences : every future scraped PNG that may land on a
                 dark surface gets the same treatment up-front.
                 Rule recorded in
                 `.project-store\blacklisted.md` and tipped as
                 T-monboum-derosify in `knowledge.md`. The
                 alpha-out approach generalises across MdM-V2
                 + PAC if either ever scrapes WP assets — promotion
                 candidate to db.md W04.

## ADR-005  Menu data source = monboum.fr Pass C scrape          [STATUS: active]
- context      : 2026-05-04 boss feedback : "ajouter les cartes
                 (menu) et les photos qui donne envie". The
                 V3 site has no `menus.js` yet and
                 `public/assets/menus/` was empty. Reference
                 sites (newschooltacos / g-ladalle / pointb)
                 lead with named product cards + photos. Owner
                 authorized scraping monboum.fr / Deliveroo /
                 Google / IG / TikTok / FB.
- decision     : primary source = monboum.fr WP-REST media
                 endpoint
                 (`/wp-json/wp/v2/media?per_page=100&page=N`).
                 Pass C executed 2026-05-04 pulled ~250 media
                 items, archived to `plan/_wp-media-full.json`.
                 Curated 23 photos saved to
                 `public/assets/{menus,products}/`. Item-level
                 menu data (`src/data/menus.js`) hand-curated
                 from the menu-board images by Cascade
                 transcription, owner reviews on next pass.
- consequences : Deliveroo + IG + TikTok + FB scrape attempts
                 deferred (rejected in discarded.md — bot-blocked
                 / OG-only). Future asset refresh is a manual
                 drop into the relevant `public/assets/<bucket>/`
                 + a hand-edit of `menus.js`. No automated
                 sync — Pass C is a one-off seed.

## ADR-006  Product photo source = same Pass C scrape            [STATUS: active]
- context      : 2026-05-04 boss feedback : "Vraiement mettre
                 en avant les produits - regarder burgerking".
                 Home page needs a hero-product showcase
                 (Phase D). 14 individual product photos found
                 in WP-REST archive (`burger-wallstreet`,
                 `burger-brooklyn`, `burger-5eme-avenue`,
                 `burger-peppertoast`, `new-jersey`,
                 `boum-chicken-{burger,bucket,bowl}`,
                 `pizza-bb`, `boum-assiettes`,
                 `boum-burger-tacos-product`,
                 `boum-drive-lifestyle`, plus the full pizz's
                 + chicken kids carte).
- decision     : 6 hero products on home in Phase D, drawn
                 from `public/assets/products/`. Burger
                 picks lean on the New York theme (Wall Street,
                 Brooklyn, 5eme Avenue, Peppertoast, New Jersey)
                 — the original Boum Burger naming convention,
                 confirmed by the WP scrape.
- consequences : home page bundle adds ~6 hero images at
                 ~1MB each (above-fold compression caps). Below-
                 fold images stay `loading="lazy"`. If perf
                 budget bites, Phase E migrates these specific
                 images to `astro:assets` for AVIF/WebP +
                 srcset (cf. `docs/ROADMAP.md` 2.1).

## ADR-007  Carte = clickable full-menu image, not full ecom    [STATUS: active]
- context      : reference contextualisation (Phase F) :
                 g-ladalle.com has WooCommerce-style per-product
                 detail pages (`/product/<slug>/`). Mon Boum
                 cannot replicate this — orders go through
                 Deliveroo, not internal cart. The Pass C scrape
                 yielded full-menu BOARD images (1024x576 to
                 1810x2560) that ARE the in-restaurant menus.
- decision     : per-enseigne `/boum-*` pages get a "LA CARTE"
                 section. Each subsection (e.g. NOS BURGERS,
                 NOS BUCKETS, NOS DESSERTS) renders the
                 corresponding menu-board image with a
                 zoom-on-click lightbox. Below the boards, a
                 hand-curated `<MenuGrid>` of 6-8 named items
                 from `src/data/menus.js` with individual photos.
                 NO internal cart. Order CTA still routes to
                 Deliveroo.
- consequences : per-enseigne pages get longer (extra section)
                 but information density jumps. Lightbox opens
                 the menu board at full resolution for in-store
                 customers who want to see the full carte.

## ADR-008  Reference contextualisation = explicit pick list    [STATUS: active]
- context      : 2026-05-04 boss feedback : "look at all of
                 them, all their sections and everything. DON'T
                 JUST LOOK BLINDLY, CONTEXTUALISE !" — the four
                 reference sites (newschooltacos, bnwburger,
                 g-ladalle, pointb) each carry patterns we
                 should and shouldn't borrow.
- decision     : Phase F documents per-reference what we
                 deliberately steal vs. skip :
                 - **newschooltacos** : steal big-name product
                   cards + voice tone ("C'est la taille qui
                   compte"). Skip custom builder (size /
                   sauce / garniture) — overkill for a Deliveroo-
                   routed shop.
                 - **bnwburger** : steal brand-personality hero
                   + Insta integration. Skip founder-personality
                   leverage (Mon Boum's brand is the chain, not
                   a face).
                 - **g-ladalle** : steal product grid + Carte
                   entry + 80+ store-locator pattern. Skip
                   per-product detail pages (no internal cart).
                 - **pointb** : steal "à la carte!" CTA pattern
                   + named product lines (B-CHICK'N FIVE). Skip
                   app download (Mon Boum has no app).
                 Cross-cutting : all 4 lead with food
                 photography + named products. Mon Boum currently
                 leads with brand badges. Phase D fixes that.
- consequences : future design discussions about Mon Boum's
                 visual direction must reference this ADR's
                 pick list. New patterns added MUST be either
                 in the steal column of one reference or
                 explicitly net-new with a fresh ADR.

## ADR-009  Asset folder layout                                  [STATUS: active]
- context      : `public/assets/` had 8 empty subfolders
                 pre-2026-04-23 + Pass A/B filled most of them.
                 Pass C 2026-05-04 introduces `menus/` and
                 `products/`. Need a stable contract for future
                 photo drops.
- decision     :
                 - `banners/`       — section heros, brand
                   slogans, anything that is layout chrome
                 - `logos/`         — brand identity files only
                 - `icons/`         — PWA + favicon set
                 - `shapes/`        — decorative grunge / blob
                 - `promos/`        — Deliveroo promo offers
                 - `testimonials/`  — celebrity headshots
                 - `tiktoks/`       — local MP4 + .info.json
                   (managed by `npm run sync:tiktok`)
                 - `videos/`        — long-form (franchise pitch)
                 - `menus/`         — per-enseigne menu BOARD
                   images (full-screen captures of the in-store
                   menu screens)  [NEW]
                 - `products/`      — individual product photos
                   (one dish per file)  [NEW]
                 - `_originals/` (under banners/ and similar)
                   — pre-derosify backups, never linked from
                   user-facing code  [NEW]
- consequences : `public/assets/README.md` updated to match.
                 Adding a 12th bucket needs an ADR-010 to extend
                 this list.

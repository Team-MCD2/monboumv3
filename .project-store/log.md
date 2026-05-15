# Project Log - Mon Boum V3

> Append-only. One entry per working session. Full detail.
> Project-store seeded 2026-05-04.

## D-2026-05-04  Project store bootstrap + boss feedback + visual overhaul start

- **context**     : owner directed cross-project db_store rewrite
                    in prior session (2026-05-03). This session,
                    owner pivoted to Mon Boum V3 ("just monboum
                    v3") and relayed boss feedback flagging four
                    issues : (1) missing carte (menu) + photos
                    that "donne envie" with reference to
                    newschooltacos / bnwburger / g-ladalle /
                    pointb-officiel ; (2) lack of product
                    showcase (Burger King benchmark) ; (3) white
                    backgrounds on enseigne logos visible on
                    dark hero sections ; (4) "no cross to close"
                    the mobile drawer (boss called it "very low
                    quality from you").

                    Per M01 PROTOCOL, `Monboumv3\.project-store\`
                    did not exist and had to be bootstrapped as
                    the first action of the session. Done before
                    any other code edits.

                    Owner green-lit "proceed with defaults" on
                    five questions Cascade raised + authorized
                    scraping monboum.fr / Deliveroo / Google /
                    Instagram / TikTok / Facebook for menu data
                    and photos.
- **actions**     :
  - **Bootstrap (Phase 0)**
    - Read `db_store\db.md` M08 schema + the freshest sibling
      project store (MarcheDeMoV2) as a template reference.
    - Created `Monboumv3\.project-store\` with all 9 M08 files :
      `dossier.md`, `roadmap.md`, `knowledge.md`, `decisions.md`
      (ADR-001..009), `log.md`, `boss-feedback.md`,
      `owner-feedback.md`, `blacklisted.md`, `discarded.md`.
    - Recorded boss feedback verbatim and translated each line
      to a phase entry + ADR + tip + lesson + ban / discard.
  - **Reference site contextualisation**
    - Fetched the 4 boss-named reference sites via
      `read_url_content`. Captured per-site "steal" + "skip"
      lists in ADR-008. Cross-cutting pattern : all 4 lead
      with food photography + named products at fold-1 or
      fold-2 ; Mon Boum's home leads with brand badges, which
      is what the boss flagged.
  - **Pass C scrape (assets for Phase C + D)**
    - Probed `https://monboum.fr/wp-json/wp/v2/media` (WP-REST).
      Returned ~250 items in 5 pages. Archived full payload to
      `plan/_wp-media-full.json`.
    - Downloaded 9 menu BOARD images to `public/assets/menus/`
      (4 burger sections, 4 chicken sections, 1 fresh 2024
      Pizz's). Boum Saveurs has no WP page (404 on
      `/boum-saveurs/`) — placeholder for owner upload.
    - Downloaded 14 individual product photos to
      `public/assets/products/` (5 NYC-themed burgers
      `wallstreet`, `brooklyn`, `5eme-avenue`, `peppertoast`,
      `new-jersey` ; 3 chicken : `bucket`, `burger`, `bowl` ;
      `pizza-bb` ; `assiettes` ; `tacos-product` ;
      `drive-lifestyle` ; full pizz's carte 1810x2560 ;
      chicken kids menu 1752x2560).
    - Deliveroo + Instagram + TikTok + Facebook scrape paths
      probed and rejected (bot-blocked / OG-only) — recorded
      in `discarded.md`.
  - **Repo scan (pre-Phase A/B/D/C)**
    - Confirmed Header.astro DOES have a burger -> X transform
      + Escape-to-close (the README's claim was accurate). The
      boss's "no cross" perception is UX, not a missing feature
      — phase A adds the drawer-internal X as the primary
      close path.
    - Confirmed asset folder state matches `public/assets/README.md`
      Pass A + B inventory. `menus/` was empty pre-Pass-C.
    - Read all 4 `boum-*.astro` pages — each lands its hero
      banner inside `texture-bg` (dark) which exposes the white
      bg on every scraped PNG. Phase B fixes the data, not the
      surface.
- **learnings**   :
  - **L-2026-05-04-MB-001** — fullscreen mobile drawers must
    surface their own internal close affordance ; relying on a
    header burger -> X transform is insufficient UX. Promotion
    candidate to db.md W04.
  - **L-2026-05-04-MB-002** — scraped WP PNGs often carry baked
    white backgrounds rather than alpha. Pre-process with
    sharp before placing on dark surfaces. Promotion candidate
    to db.md W04.
  - **L-2026-05-04-MB-003** — `read_url_content` reports
    `www.host -> host` redirects as errors. Workaround : fetch
    canonical hostname directly. Cross-project candidate.
  - **L-2026-05-04-MB-004** — WordPress `wp-json/wp/v2/media`
    is a goldmine for asset-migration scrapes. Returns full
    URLs + dimensions + alt + dates in a single paginated call.
    Beats per-page HTML scraping by an order of magnitude.
    Cross-project candidate.
- **next session**:
  - resume execution at Phase A (mobile drawer X) since Phase 0
    is done and the asset scrape covers Phases C/D's content
    needs.
  - end-of-session todo list (must complete before close) :
    1. Phase A : drawer-internal X.
    2. Phase B : `scripts/derosify-bg.mjs` + apply to 8 PNGs.
    3. Phase D : home product showcase.
    4. Phase C : `menus.js` + MenuGrid + per-enseigne carte
       sections.
    5. Phase F : confirm ADR-008 + cross-link from README.
    6. Phase E : Lighthouse / mobile QA + screenshot smoke.
    7. db.md updates : M09 D-2026-05-04 line, W07 P-monboum-v3
       stub, candidate L promotions.
    8. README.md note that `.project-store\` is canonical and
       legacy `docs/ROADMAP.md` is superseded.

## D-2026-05-04 (close)  Phases A/B/C/D/F shipped + build green

- **context**     : continuation of the same calendar day under the
                    autonomy grant relayed at session open. All
                    queued phases except E (manual QA) closed.
- **actions**     :
  - **Phase A — drawer-internal close X**
    - `src/components/Header.astro` : added `<button data-close-menu>`
      inside `#mobile-menu` with absolute positioning
      (`top: max(1rem, env(safe-area-inset-top))`, same for right),
      44x44 tap target, white SVG `×`, `aria-label="Fermer le menu"`,
      focus-visible ring in rouge.
    - Updated event delegation : `menu.querySelectorAll('a, [data-close-menu]')`
      now closes the drawer on click ; close-menu specifically returns
      focus to `#mobile-menu-toggle`. Existing Escape + auto-close-on-link
      behaviour preserved.
  - **Phase B — derosify-bg script**
    - `scripts/derosify-bg.mjs` : sharp-based alpha-out with
      `--threshold 243 --feather 12` defaults. Loads RGBA, ramps
      alpha to 0 above threshold over a 12-unit feather band,
      writes back via `sharp.png({ compressionLevel: 9 })`.
    - Backups : first run copies the source to a sibling
      `_originals/` directory.
    - Run output : 8 ok, 0 skipped, 0 warned. The 5 hero banners
      had 90 %+ pixels modified (`BOUM-BURGER-SINCE`, `Boum-Pizzs-1`,
      `Boum-Chicken-1-1024x576`, plus `welcome_image` at 1.2 %
      because it was already mostly transparent). The 4 small
      300x300 home badges had 0 % modified — they already shipped
      with full alpha pre-2026-05-04.
    - `package.json` : added `"derosify:bg": "node scripts/derosify-bg.mjs"`.
  - **Phase D — home product showcase**
    - `src/components/ProductShowcase.astro` : 6-card grid on
      `bg-noir-deep` with 4:3 photo, Anton uppercase product name,
      rouge enseigne label, Inter tagline, hover scale + border-rouge
      accent + "Voir →" badge. Decorative shape1+shape3 + parallax.
    - Inserted into `src/pages/index.astro` between section 3
      (FAITES VOTRE CHOIX) and section 4 (QUALITE) — rhythm goes
      gris → noir → white → dark → gris → dark → white.
  - **Phase C — per-enseigne carte**
    - `src/data/menus.js` : MENUS object keyed by enseigne slug.
      `boum-burger` → 4 boards + 6 items. `boum-pizzs` → 1 board
      + 1 item + note (Soso/Tunisienne availability caveat).
      `boum-chicken` → 4 boards + 3 items. `boum-saveurs` → no
      boards / no items + placeholder note.
    - `src/components/CarteSection.astro` : self-contained block.
      Renders the board grid (1/2/4 col responsive, click-to-zoom
      via `<dialog>` lightbox), the items grid (3-col responsive,
      same hover pattern as ProductShowcase), the optional note,
      and a tail Deliveroo CTA. Lightbox dialog is namespaced via
      `dialogId` so multiple instances don't collide. Backdrop
      click closes ; X button closes ; Escape closes (native
      `<dialog>` behavior). Body scroll locked while open.
    - Wired into all 4 `/boum-*.astro` pages between CONCEPT and
      LOCATION/LOCATIONS sections.
  - **Phase F — README cross-link**
    - `README.md` Brand rules section now points at
      `.project-store/decisions.md` (ADR-001..009), adds Hard
      Rule #3 (mobile drawer X — ADR-003), Hard Rule #4
      (`npm run derosify:bg` for scraped PNGs — ADR-004), and a
      blockquote highlighting ADR-008 (reference-site
      contextualisation).
  - **STATUS.md**
    - Section 8 ("Where we stand") refreshed to acknowledge the
      visual overhaul + the new `.project-store/` knowledge base.
    - New section 11 ("2026-05-04 — Visual overhaul session")
      lists what shipped, the new/changed files, and the Phase E
      manual QA queue.
- **verification**:
  - `npm run validate:all` : data validation OK, build 17.84 s,
    11 pages built, vite 113 modules transformed, no errors,
    SEO validator OK on every page.
  - Dev server : `npm run dev` boots clean on port 4326 (4321-4325
    busy from prior sessions).
  - Visual smoke : pending owner browser preview at
    http://localhost:4326/ (browser_preview pinned).
- **learnings**   :
  - **L-2026-05-04-MB-005** — Astro 5 native `<dialog>` lightbox
    is enough for menu-board zoom. No modal library needed.
    `define:vars` keeps multi-instance dialog-id namespacing
    DRY across CarteSection invocations. Cross-project candidate.
  - **L-2026-05-04-MB-006** — sharp `.raw().toBuffer({resolveWithObject:true})`
    + per-pixel alpha ramp is fast enough on 1366x768 PNGs (sub-second
    each, 8 files in ~3 seconds). For larger asset counts a worker
    pool would help ; for any Mon Boum-style site this is overkill.
- **next session**:
  - **Phase E manual QA** (pre-prod) : owner walks the 4 enseigne
    pages on a real mobile device, opens / closes the drawer,
    opens / closes a board lightbox, confirms no white halos on
    derosify'd banners. Lighthouse mobile numbers logged in this
    file.
  - **db.md updates** : M09 D-2026-05-04 (continued) line for
    P-monboum-v3 + W07 stub registration. Both queued for the
    same close-out batch as this entry.
  - **Vercel preview** : push to preview-branch, owner does the
    Deliveroo URL audit per `docs/STATUS.md` section 6.1 step 2,
    and the EmailJS env-var configuration per step 3.

## D-2026-05-05  Phase G - Liveliness pass + carte visibility + logo trim

- **context**     : boss feedback 2026-05-05 from screenshots :
                    (1) "menu isn't very visible" - the boum-pizzs
                    portrait menu-board was rendered at lg:grid-cols-4
                    + aspect-[16/9] + object-cover, which cropped the
                    board and shrank it to ~240 px wide ;
                    (2) "take out the useless white background at the
                    bottom of the logo" - welcome_image.png had baked
                    whitespace padding after the Phase B alpha-out ;
                    (3) "website still isn't lively enough, add
                    animations" - site had data-reveal + parallax but
                    no hover sweeps / entrance animations / arrow
                    slides that the reference sites (newschooltacos,
                    bnwburger, g-ladalle, pointb-officiel) use.
- **actions**     :
  - **G1 - Trim logo whitespace**
    - `scripts/derosify-bg.mjs` : added `--trim` flag that calls
      sharp's `.trim({ threshold: 10 })` AFTER the alpha-out pass.
      Default off for backwards compat. Added `--trim-threshold`
      for tuning.
    - `package.json` : new `npm run trim:logos` script targeting
      welcome_image + 4 hero banners.
    - Run output (5 files, all ok) :
      welcome_image        523x502 -> **428x493**   (-18 % width)
      BOUM-BURGER-SINCE    1366x768 -> **635x376**   (-54 % w, -51 % h)
      Boum-Pizzs-1         1366x768 -> **468x471**   (-66 % w)
      Boum-Chicken-1-1024  1024x576 -> **499x298**   (-51 % w)
      Commandez            4112x3438 -> **1263x2578** (-69 % w)
    - Updated explicit `width`/`height` attrs in 6 `<img>` sites
      across 5 pages (index.astro x3, mon-boum.astro, boum-burger,
      boum-pizzs, boum-chicken) so aspect-ratio hints match the new
      file dimensions (no CLS regression).
  - **G2 - CarteSection board visibility rework**
    - Board grid : `lg:grid-cols-4` dropped. Max 2 columns now,
      capped at max-w-6xl. Each board is ~3x larger on desktop.
    - `aspect-[16/9]` + `object-cover` -> `aspect-[4/3]` +
      `object-contain` + padded bg-noir frame. Tall portrait boards
      (e.g. boum-pizzs-carte.png) now render fully instead of being
      cropped and unreadable.
    - Hover affordance : small "Zoom" corner badge replaced with
      full-card red overlay featuring a 56 px magnifier SVG +
      "Cliquez pour agrandir" caption. `cursor: zoom-in` +
      `shadow-rouge/20` hover shadow.
    - Always-visible category badge (top-left, bg-rouge).
    - Explicit italic caption under each board :
      `<board alt> - cliquez pour zoomer`.
    - Lightbox : larger close X (w-12 h-12 bg-rouge),
      bottom-centre zoom-hint bubble that fades after 3 s
      ("Pincez pour zoomer" on mobile / "Ctrl + molette pour
      zoomer" on desktop), scrollable container so large boards
      are fully explorable without browser zoom.
  - **G3 - Liveliness animations**
    - **CSS** (`src/styles/globals.css`) : 9 new utility classes
      inside the existing `prefers-reduced-motion: no-preference`
      guard :
      `.hover-lift`        (translateY(-6px))
      `.shine-card`        (diagonal 105-deg sweep via ::after)
      `.arrow-cta` + `[data-arrow]` (arrow slides 6 px on hover)
      `.pulse-rouge`       (2.4 s box-shadow ring, pauses on hover)
      `.logo-entrance`     (scale+fade intro on page load)
      `.tilt-hover`        (perspective rotateX 2deg / rotateY -2deg)
      `.link-underline`    (nav underline scales 0->1 on hover)
      `.marquee-inner-slow` (45 s variant of the existing marquee)
      `.text-glow-rouge`   (24 px red glow on hover)
      `.halo-pulse`        (decorative opacity + scale oscillation)
      All short-circuited in a second reduced-motion block that
      kills `animation` + `transition` to none for these keys.
    - **Applied** :
      Header : logo img gets `logo-entrance` + `group-hover:scale-105`,
               desktop nav links get `link-underline`, desktop
               "Commander" CTA becomes `inline-flex` + `arrow-cta`
               + `pulse-rouge` with a `<span data-arrow>` for the
               trailing arrow slide.
      ProductShowcase : each card gets `shine-card hover-lift
               arrow-cta`, the "Voir" badge is now always visible
               (scales 1.1 on hover), tail CTA gets
               `arrow-cta pulse-rouge`.
      CarteSection : tail Deliveroo CTA gets `arrow-cta pulse-rouge`.
      index.astro : "En savoir plus" + "Commander" hero CTAs get
               `arrow-cta` + `pulse-rouge` respectively ;
               welcome_image gets `float-anim` ;
               4 enseigne brand teasers get `shine-card hover-lift`
               + `text-glow-rouge` on the enseigne name.
  - **G4 - Top announcement marquee**
    - New `<div>` above `<Header />` in `Layout.astro` : black bar,
      `marquee-inner-slow`, rotating chips
      `Ouvert 7/7 - Livraison Deliveroo - 10 restaurants a Toulouse -
      Halal depuis 2004` with rouge bullet separators. Respects
      prefers-reduced-motion (falls back to flex-wrap justified
      via existing global rule).
  - **TS polish** : moved `imgMap` (home 4-enseigne grid) from a
    JSX-expression-block `const` declaration to the frontmatter
    script as `enseigneImg: Record<string, string>`. Astro parses
    the JSX expression block with JSX rules, so `<string, string>`
    inside was read as a malformed JSX element. Frontmatter parses
    as TS properly.
- **verification**:
  - `npm run validate:all` : data OK, Astro build 13.53 s,
    11 pages, 0 errors, SEO validator clean on all pages.
  - Pre-existing `PUBLIC_GA4_ID` / `PROD` TS env-type lints on
    `Layout.astro:34,95` are runtime-safe (Astro uses Vite's
    injected `import.meta.env`), not introduced by this pass.
- **learnings**   :
  - **L-2026-05-05-MB-007** - sharp `.trim({ threshold })` AFTER
    `.ensureAlpha()` + manual alpha-out is the correct sequence to
    remove baked whitespace from logos. Without the prior alpha
    pass, trim falls back to colour-delta against the top-left
    pixel which misses pure-white regions surrounded by
    anti-aliased edges.
  - **L-2026-05-05-MB-008** - Astro JSX expression blocks
    `{ ... }` parse their contents with JSX rules, which reject
    TS generics like `Record<string, string>` (read as malformed
    elements). Move typed declarations to the frontmatter script.
    Cross-project candidate (same gotcha applies to .mdx and
    .astro consumers everywhere).
  - **L-2026-05-05-MB-009** - `object-contain` + padded bg-noir
    frame beats `object-cover` for menu boards of unknown aspect
    ratio. Portrait boards (the boum-pizzs-carte.png case) get
    fully visible instead of cropped. Cross-project candidate for
    any PDF-like preview surface.
- **next session**:
  - Owner smoke tests the new Phase G changes on the browser
    preview (still pinned at localhost:4326) : logo no longer
    has a tail of whitespace, menu boards render large + readable
    with an obvious click affordance, site reads as more alive
    with the top marquee + shine sweeps + arrow-slides + pulse
    CTAs.
  - Phase E manual QA (mobile drawer X, Lighthouse on Vercel
    preview) remains owed as before.
  - db.md : append `D-2026-05-05` line to M09 covering Phase G.

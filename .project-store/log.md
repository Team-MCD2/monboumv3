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

## D-2026-05-18  Editorial densification pass (home 1-8 + 4 brand pages)

- **context**     : owner asked for an "expert / world-class refurbish"
                    of every section. Workflow agreed : home sections 1
                    through 8 first, then the 4 enseigne pages, then the
                    rest of the site, with build verification at every
                    step. No layout overhaul — only editorial + data
                    cohesion + cross-section visual rhythm. Single
                    constraint : no fabricated stats; every number must
                    trace back to `restaurants.js`, `menus.js`,
                    `promos.js`, `testimonials.js`, or
                    `generated/tiktok-local.json`.
- **actions**     :
  - **Home section 1 — Hero**
    - `HeroRotator.jsx` : per-slide eyebrow, per-slide `wrapperClass`
      (slide 2 phone capped + rotate 4deg to stop hero stretch),
      `boum-drive-lifestyle.jpg` for slide 3 with the new "1er drive
      halal de France" claim, 7-second rotation cadence, image column
      capped `max-h-[55vh] lg:max-h-[60vh]`, CTAs gain `pulse-rouge`
      + `arrow-cta`.
    - `index.astro` hero wrapper : `min-height: calc(100dvh - 40px)`
      with `100vh` fallback for iOS-Safari url-bar safety. Marquee
      content varied (4 distinct phrases vs the previous mono-string).
  - **Home section 2 — Bienvenue**
    - 1 sentence body → 3 paragraphs (origine 2004 + 4 enseignes +
      promesse halal/livré). Inline 3-stat band (2004 · 10 · 1er).
      Dual-CTA (Mon Boum c'est quoi + Voir nos 10 restos).
  - **Home section 3 — Faites votre choix**
    - Eyebrow "Nos enseignes" → "4 enseignes · 1 famille".
    - Cards consume new `enseigneCards` derivation (count + drives
      meta line) and `SIGNATURES` constant (top-3 named dishes per
      enseigne, sourced from `menus.js` + TikTok top-views). Each
      card now shows meta + signatures + "Voir la carte →" affordance.
  - **Home section 3.5 — ProductShowcase**
    - `Tacos XXL` (BB-heavy weight) → `L'Assiette` Boum Saveurs so
      all 4 enseignes are represented. `Pizza BB` renamed to
      `Pizza Signature` to align with `menus.js` (single source of
      truth). Subtitle tightened (Six produits · quatre enseignes ·
      une famille).
  - **Home section 4 — Qualité**
    - Eyebrow "Notre engagement" → "Halal · Frais · Maison" (echo
      of the Section 1 marquee). 4 bullets transformed from generic
      strings into {Anton title + 1-line spec} pairs. Intro
      paragraph added before the list ("Depuis 2004 une seule
      règle…"). Code comment flags the cross-brand
      `BOUM-BURGER-SINCE.png` reuse with `banner-2.png` as a swap
      candidate pending visual approval.
  - **Home section 5 — Livraison**
    - Intro paragraph + 3 info-pills (Livré 7j/7 · 30 min en moyenne
      · Toulouse + agglo). Single-CTA → dual-CTA (Deliveroo primary
      + "Drive ou sur place" secondary to `/nos-restaurants`).
  - **Home section 6 — Promos**
    - H2 "Nos promos." (8 chars, lonely) → 2-line "Les deals / qui
      régalent." Body realigned to actual data (mentioned "burger
      offert" which doesn't exist in `promos.js`). Count derived
      from `PROMOS.length` so adding/removing a promo updates the
      copy automatically.
  - **Home section 7 — Témoignages**
    - H2 "Validé." → "Validé. / Et pas qu'un peu." Body realigned
      to real data : the 11 testimonials are scraped celebrity
      quotes from monboum.fr (Ninho, Dadju, Big Flo & Oli, Vegedream,
      Koba LaD, L'Algerino, Marwa Loud, Tayc, Chily, Mario, Landy),
      NOT "milliers d'avis Boum Team" as the previous copy
      implied. `TestimonialsSlider.jsx` duplicate eyebrow removed
      (section header already says "Ils nous ont / Validé").
      `TESTIMONIALS.length` consumed for the "11 artistes" count.
  - **Home section 8 — TikToks**
    - H2 "Réseaux sociaux." (plural, drift — only TikTok is shown)
      → "On poste. / Vous likez." Body anchors on the real stat :
      sum of `view_count` from `tiktok-local.json` rounded down to
      the nearest 100K bucket ("500K+ vues" today, auto-updates
      after next `npm run sync:tiktok`). Added `view_count`
      passthrough and `TOTAL_TIKTOK_VIEWS` export in `tiktoks.js`.
  - **Brand pages — 4 enseigne refurbs**
    - `/boum-burger` : hero body adds NYC theme + count derived from
      `byEnseigne('boum-burger').length`. Concept 2 → 3 paragraphs
      (origine 2004 / 5 NYC burgers / qualité+modes). Stats grid
      reorganised into a 2×2 with derived counts (2004 · 4 · 3 · 5
      burgers NYC). Title + description updated.
    - `/boum-chicken` : hero body adds "Buckets, burgers, bowls" +
      drive mention. Eyebrow concept "Notre concept" → "Vauquelin
      · 7j/7" (factuel). Concept 2 → 3 paragraphs (anchor late-
      night / carte items from `menus.js` / drive+halal).
      `id="concept"` + `scroll-mt-24` added for anchor parity with
      the other brand pages.
    - `/boum-pizzs` : hero body anchors on the Pizza Géante's
      TikTok 180K views + Krousty Rangueil mention. Concept 2 → 3
      paragraphs (Géante / variantes Soso/Tunisienne with their
      restriction note from `restaurants.js` / Krousty as Rangueil
      specialty). Stats grid 2×2 (adresses · 180K vues TikTok ·
      Pizza variants · Krousty Rangueil). Title + description rich.
    - `/boum-saveurs` : the strongest content angle (Naan Kebab
      TikTok #1 191K + Box du peuple TikTok #3 144K). Hero body
      lean on the Naan Kebab claim. Concept eyebrow "Notre concept"
      → "Mermoz · Naan Kebab". H2 "L'authenticité / du Street-Food."
      (generic) → "Le naan kebab / qui défonce TikTok." 3 paragraphs
      grounded on the actual TikTok descriptions. Stats grid : 191K
      Naan Kebab #1 · 144K Box du peuple #3 · 100% halal.
  - **Meta cleanups**
    - `index.astro` top comment "7 sections" → "8 sections" (Phase D
      ProductShowcase added 2026-05-04 but comment never refreshed).
    - `docs/ROADMAP.md` gains a LEGACY banner pointing to
      `.project-store/roadmap.md` as the canonical source (M08).
  - **Image audit — critical findings (session 2, 2026-05-18 PM)**
    - **L'Assiette / Le Bucket / Pizza Signature** in
      `ProductShowcase` referenced scanned menu boards whose images
      had baked-in consumer prices (19,90€, 8,50€, 6,90€, etc.).
      Direct violation of boss feedback 2026-05-04 "ne pas avoir le
      prix sur les photos". `ProductShowcase` reduced from a 6-card
      cross-enseigne grid to a 5-card "NYC burger collection"
      (Wall Street, Brooklyn, 5e Avenue, Peppertoast, New Jersey
      — all clean food photography). Grid split into 3+2 centered
      rows to avoid orphan-row asymmetry. Subtitle changed from
      "Six produits, quatre enseignes, une famille" to "Cinq
      burgers signés New York — la collection signature Boum
      Burger. Pizz's, Chicken, Saveurs : voir leurs cartes
      dédiées." PHOTO_TODO comment flags the need for clean hero
      photography of the other three enseignes before expanding
      back to a 6-card cross-enseigne grid.
    - **Hero slide 3** previously used
      `public/assets/products/boum-drive-lifestyle.jpg` whose
      filename suggests a lifestyle photo but whose content is a
      scanned Boum Burger menu board with PRICES visible (7,50€ →
      10€). Swapped to `burger-new-jersey.jpg` (cinematic
      double-burger close-up, bokeh gold lighting, newspaper
      backdrop). The `heroImages` array gains an explanatory
      comment.
    - **Section 4 Qualité** previously used
      `BOUM-BURGER-SINCE.png`. The logo says "Depuis 2008" — but
      the surrounding section claimed "Qualité Mon Boum depuis
      2004". Year contradiction AND brand-scope contradiction
      (Boum Burger logo on a transversal Mon Boum section).
      Swapped to `burger-wallstreet.jpg` (the flagship hero
      close-up). Alt changed to "Wall Street — burger signature
      halal Mon Boum". Image gets `rounded-sm shadow-2xl` so it
      reads as a photo card (vs the prior framed-illustration
      treatment).
    - **Year discrepancy discovered** : the four enseigne logos
      bear different launch years — Boum Burger 2008, Boum
      Pizz's 2015, Boum Chicken 2019, Boum Saveurs (no year on
      logo). The site copy uniformly says "Mon Boum depuis
      2004" (in `index.astro` Section 2, `mon-boum.astro`,
      `boum-burger.astro`, `contact.astro`,
      `formulaire-de-candidature.astro`, and a JSON-LD
      `foundingDate`). Most plausible interpretation : "Mon Boum"
      is the holding-company / group founded 2004, with each
      enseigne launching as a sub-brand later. Flagged for boss
      confirmation. No change made to the 2004 claim pending
      confirmation.
  - **Deliveroo URL audit (session 2)**
    - User asked to cross-check the 10 per-restaurant Deliveroo
      URLs against the legacy V2 codebase. V2 (`Monboumv2`) only
      defined two URLs : a global redirect
      (`https://monboum.commande.deliveroo.fr/fr/`) and a single
      per-restaurant override for Rangueil. The V3 ten-URL set
      therefore appears to have been added later (probably
      hand-curated or scraped by Cascade in a previous session).
      Action : keep the V3 URLs intact (they pre-date this
      session), document them in the QA copy-paste table for
      human verification on the live Deliveroo (Deliveroo blocks
      automated checks). The
      `boum-burger-mermoz → new-york-story` slug is the most
      suspicious entry and should be checked first.
  - **Remaining-pages refurbish (session 2)**
    - `/mon-boum`, `/formulaire-de-candidature`,
      `/mentions-legales`, `/404`, `/nos-restaurants` all
      reviewed. The first four were already in good shape
      (`TOTAL_RESTAURANTS` derived where applicable, voice OK,
      legal copy intact, 404 has the brand-voice "Cette page a
      fait boum") — no structural changes needed.
    - `/contact.astro` had two hardcoded "10 adresses" strings.
      Both replaced with `${TOTAL_RESTAURANTS}` via a new import
      from `restaurants.js`, matching the pattern used everywhere
      else in the codebase.
    - `/nos-restaurants.astro` hero body listed "Toulouse,
      Colomiers, Aucamville et Mermoz" as if all four were
      cities. Mermoz is a Toulouse quartier and Aucamville is
      borderline (postal code 31200 Toulouse but historically a
      separate commune). Rewritten to "{TOTAL_RESTAURANTS}
      adresses, de Toulouse à Colomiers. Filtrez par enseigne
      ci-dessous, ou cliquez sur la carte." — derives the count,
      drops the misleading quartier list, signposts the filter
      affordance.
- **learnings**   :
  - **L-2026-05-18-MB-010** — when the consumer-facing copy and the
    data file disagree (e.g. Section 6 body said "burger offert"
    while `promos.js` has none), the copy is the bug, not the data.
    Always cite from the single source of truth and let the count
    auto-derive. Cross-project candidate.
  - **L-2026-05-18-MB-011** — TikTok `view_count` is sticky stat
    gold for the marketing surface. Surfacing it via a derived
    constant + nearest-100K marketing rounding lets the headline
    self-maintain across re-syncs without ever showing a number that
    rolled backwards. Pattern : `Math.floor(total / 100000) * 100`
    + `"{n}K+"` suffix. Cross-project candidate.
  - **L-2026-05-18-MB-012** — `H2 ≤ 8 chars` at `text-5xl/6xl` reads
    visually solitary against a hero band. Either pad with a
    `<br/><span class="text-rouge">…</span>` continuation, or drop
    to `text-4xl/5xl`. Both Section 6 ("Nos promos.") and
    Section 7 ("Validé.") hit this; both fixed by line-2 expansion.
  - **L-2026-05-18-MB-013** — never trust an asset filename. The
    file `boum-drive-lifestyle.jpg` shipped as the home hero
    slide 3 with the title "1er drive halal de France" — the
    filename matched the intent — but the image contents were a
    Boum Burger menu board with every price baked in (7,50€ →
    10€). Always inspect an image visually before relying on its
    semantic intent. Cross-project candidate (file-naming drift
    is a universal anti-pattern in scrape-sourced asset libraries).
  - **L-2026-05-18-MB-014** — boss-supplied logos can encode
    structural facts. The four Mon Boum enseigne logos each bear
    a different "Depuis YYYY" stamp (Boum Burger 2008, Boum Pizz's
    2015, Boum Chicken 2019, Boum Saveurs none) which doesn't
    match the marketing claim "Mon Boum depuis 2004". The
    discrepancy is reconcilable (holding-company 2004 vs enseigne
    launches later), but flags a category of bug that's invisible
    until you look at the image content. Always cross-check
    consumer-facing year/age claims against the logo files.
    Cross-project candidate for any brand-system migration.
- **next session**:
  - **(boss)** Confirm the "Mon Boum depuis 2004" claim. The four
    enseigne logos bear 2008/2015/2019 — likely the group was
    founded 2004 and the first enseigne (Boum Burger) launched
    2008. If 2004 is wrong, the JSON-LD `foundingDate`, every
    page hero, and three brand pages will need a sweep.
  - **(boss)** Commission clean hero food photography for the
    three other enseignes (Boum Chicken, Boum Pizz's, Boum
    Saveurs). All current "product" photos for these three are
    scanned menu boards with prices baked in — unusable on the
    marketing surface. Once shot, restore `ProductShowcase` to
    its 6-card cross-enseigne grid (the PHOTO_TODO marker is
    inside `src/components/ProductShowcase.astro`).
  - **(human)** Verify the 10 Deliveroo URLs against live
    Deliveroo. Priority entry : `boum-burger-mermoz` which
    points at `.../patte-doie-la-cepiere/new-york-story` (slug
    suggests legacy naming). Table provided in the session
    recap.
  - **(human)** Manual QA browser pass on the new copy (8 home
    sections + 4 brand concepts + 5 other pages). Confirm no
    broken layout, no stat regression, no copy overflow on
    mobile. Watch the new ProductShowcase 3+2 row layout
    specifically at the sm and lg breakpoints.
  - **(human)** Run Lighthouse on `/`, `/boum-burger`,
    `/boum-saveurs`, `/nos-restaurants` (commands ready in the
    session recap).
  - **(optional)** Decide if the now-orphan `banner-2.png` and
    `BOUM-BURGER-SINCE.png` should be moved to
    `public/assets/banners/_originals/` to avoid future
    accidental reuse. The other "menu-board-as-product" files
    (`boum-chicken-bucket.jpg` et al.) should stay where they
    are — they're still consumed by `CarteSection` where the
    price-board context is legitimate.

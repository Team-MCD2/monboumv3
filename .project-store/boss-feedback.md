# Boss feedback register - Mon Boum V3

> Raw feedback from the boss (and anyone in an approver role for
> this project). Each entry must translate into at least one
> concrete rule, code change, lesson, or blacklisted/discarded
> entry. Owner-filled; Cascade does not pre-seed this file from
> chat transcripts (cross-project `discarded.md`:
> "Blanket pre-seeding of boss-feedback.md / owner-feedback.md").

## Entry template

    ## YYYY-MM-DD  <feedback summary>
    - verbatim       : "..."
    - translated to  : rule in db.md / project knowledge /
                       blacklisted / discarded / ADR
    - status         : addressed / in-progress / deferred

## Entries

## 2026-05-04  Visual elevation + missing carte + missing mobile X

- **verbatim**       :
  > "ajouter les cartes (menu) et les photos qui donne envie -
  > check out all these links to understand how much you LACK in
  > visuals and the image you send to the user:
  > https://www.newschooltacos.fr/ https://bnwburger.com/
  > https://g-ladalle.com/ https://pointb-officiel.com/ (look at
  > all of them, all their sections and everything. DON'T JUST
  > LOOK BLINDLY, CONTEXTUALISE !) -
  >
  > Vraiement mettre en avant les produits - regarder burgerking
  >
  > effacer les font blanc sur les images ( in the various
  > restaurant sections, the images - boum burger, pizz, etc.. -
  > have a white background, that background should be taken
  > out, while keeping the logo visible - given that it is mainly
  > in black, find a way to navigate that -)
  >
  > also, in mobile mode, when the burger menu appears, there
  > isn't any corss to close it (it is very low quality from
  > you!!)"
- **translated to**  :
  - **roadmap.md Phase A** (drawer-internal close X) — covers the
    "no cross to close" complaint. Adds an explicit `×` close
    button at top-right inside the dark drawer, 44px tap target,
    with focus return + Escape parity. Keeps the existing
    burger -> X transform on the header for users who notice it.
  - **roadmap.md Phase B** (white-bg removal) — `scripts/derosify-bg.mjs`
    runs sharp to alpha-out near-white pixels on the 8 enseigne
    PNGs that land on dark hero backgrounds. Originals backed up
    to `public/assets/banners/_originals/`.
  - **roadmap.md Phase C** (cartes + menu data) — `src/data/menus.js`
    + `<MenuGrid>` component + per-enseigne carte sections. Photo
    source : Pass C scrape from monboum.fr (24 images saved to
    `public/assets/menus/` + `public/assets/products/`).
  - **roadmap.md Phase D** (BK-style product showcase on home) —
    new section between brand teasers and quality, 6 signature
    products from the Pass C product scrape.
  - **roadmap.md Phase F** (decisions ADR codifying reference-site
    contextualisation) — explicit "what we steal from each /
    what we skip" so future edits stay aligned with the boss's
    reference frame.
  - **decisions.md ADR-003** (mobile drawer close X pattern) :
    drawer-internal `×` IS REQUIRED when the drawer fills the
    viewport on mobile. Header burger -> X transform is
    secondary, never sole.
  - **decisions.md ADR-004** (white-bg removal strategy) : data
    fix beats CSS workaround. Process the asset once, ship a
    clean PNG with alpha. `mix-blend-mode: multiply` is a
    fallback only.
  - **decisions.md ADR-005** (menu data source = monboum.fr WP-REST)
    + **ADR-006** (product photo source same).
  - **knowledge.md** : new tip `T-monboum-deroshify` (alpha-out
    near-white in scraped PNGs before placing on dark surfaces)
    + lesson `L-2026-05-04-MB-001` (mobile drawer must surface
    its OWN close affordance ; relying on header transform alone
    is insufficient UX). The lesson is a candidate for promotion
    to db.md W04 if it generalises.
  - **blacklisted.md** : `mobile-drawer-without-internal-close-X`
    + `hero-banner-with-baked-white-bg-on-dark-section`.
  - **discarded.md** : `mix-blend-mode: multiply as the sole
    white-bg fix` (rejected — fragile across surfaces, fixes
    symptom not root cause).
- **status**         : in-progress
  - Phase A : queued, executing 2026-05-04
  - Phase B : queued, executing 2026-05-04
  - Phase C : queued, executing 2026-05-04 (assets already scraped)
  - Phase D : queued, executing 2026-05-04 (assets already scraped)
  - Phase F : queued
  - Phase E (polish) : after A-D ship

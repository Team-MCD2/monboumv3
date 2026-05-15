# Blacklisted for Mon Boum V3

> Patterns, libraries, idioms, or outputs that we do NOT want
> here - typically because they make the work look AI-generated,
> they have been rejected by the boss/owner, or they conflict
> with project constraints.
> Sibling to global `db_store\blacklisted.md`. Project-specific
> bans live here.

## Banned libraries

(none yet — project is small enough that the global db.md
recommendations cover all needs.)

## Banned patterns

- **Mobile drawer without an internal `×` close affordance.**
  When a drawer fills the viewport on mobile, users instinctively
  look INSIDE the drawer (top-right, by convention) for the
  close button, not at a transformed burger icon on a separate
  header strip. Header burger -> X morph is a SECONDARY close
  path; never the sole one. Boss-flagged 2026-05-04 ("there
  isn't any corss to close it ... very low quality from you").
  See L-2026-05-04-MB-001.

- **Hero banner with baked-in white background on a dark
  section.** All scraped WordPress PNGs (`BOUM-BURGER-SINCE`,
  `Boum-Pizzs-1`, `Boum-Chicken-1-1024x576`, `Boum-Saveurs`,
  `Boum-Burgers`, `BOUM-Pizzs`, `Boum-Chicken`, plus future
  Pass C/D additions) must be run through `scripts/derosify-bg.mjs`
  (sharp alpha-out of near-white pixels, tolerance ~12) BEFORE
  being placed on a `texture-bg`, `bg-noir`, or `bg-rouge`
  surface. Originals backed up to `public/assets/banners/_originals/`
  so the process is reversible. Boss-flagged 2026-05-04 ("effacer
  les fonts blanc sur les images"). See ADR-004 + T-monboum-derosify.

- **Hard-coding a header height anywhere except `--hh` CSS
  variable.** Header is dynamic (h-60 mobile, h-70 desktop, plus
  potential safe-area additions). Hero `padding-top` MUST come
  from `var(--hh)`. Cascading hero overlap bugs from hardcoded
  values are a frequent regression source on this codebase
  (called out in README "Brand rules" section as Hard Rule #1).

- **Logo placed on a coloured container.** The footer-only
  variant `footer_logo-boum.png` is the SINGLE allowed logo on
  dark backgrounds. Other logo variants (`logo-mon-boum-home.png`,
  `Boums.png`, `logo-boum-2.png`) belong on white surfaces only.
  See README "Brand rules" Hard Rule #2.

- **Plain `monboum.fr` link without source-of-truth check.** The
  legacy WordPress site is the asset source, NOT a destination
  to link visitors to. Every customer-facing CTA must point to
  the V3 site (mon-boum.vercel.app), Deliveroo, or a phone /
  itinerary deep-link. Internal scraping references stay in
  `plan/` and never leak into customer-facing copy.

- **Adding a 4th DA (cultural or otherwise) without owner
  sign-off.** Brand currently has 4 enseignes each with one
  accent colour (rouge/orange/jaune/vert) on top of the
  white/noir/rouge global. Adding more colour facets dilutes
  the brand. Reference-site contextualisation pass (Phase F)
  records what we deliberately steal from newschooltacos /
  bnwburger / g-ladalle / pointb and what we deliberately do
  not.

## AI-tells to remove on sight

> Inherits everything from global `db_store\blacklisted.md` AI-tells
> section. Project-specific additions :

- **English content on a French-locale page.** This site is
  fr_FR-only. Every customer-facing string must be French. Code
  comments stay in either language consistently (mostly French
  in this codebase). The README and docs/ are bilingual-friendly.
  Mixed-language UI ("Order now" alongside "Commander") is an
  immediate boss-grade red flag.

- **"Découvrez nos burgers savoureux" / generic restaurant copy.**
  The Mon Boum voice is short, punchy, slightly irreverent
  ("Bon appétit.", "Faites votre choix.", "Validé.", "Le
  meilleur du street food"). Avoid "savoureux", "exceptionnel",
  "unique en son genre" filler. Look at newschooltacos.fr's
  voice ("C'est la taille qui compte", "FAIS TOI PLAISIR")
  for tone calibration.

- **Decorative emojis in technical strings.** Existing copy uses
  one or two emojis as PUNCTUATION (`Nous arrivons chez vous 🙂`,
  `Une envie de pizza ?`). Adding more (especially in section
  headings, button labels, error messages) ages the design.

## Why each is banned (one-line justification)

- mobile-drawer-no-internal-X     : boss said so + UX convention
- hero-banner-baked-white-bg      : boss said so + visual quality
- hardcoded-header-height         : breaks responsive contract
- logo-on-coloured-container      : brand rule, README Hard Rule #2
- monboum.fr-customer-link        : legacy site, V3 is canonical
- 5th-DA-without-signoff          : dilutes brand identity
- mixed-locale-content            : fr_FR-only site
- generic-restaurant-copy         : kills brand voice
- decorative-emojis-in-tech       : ages the design

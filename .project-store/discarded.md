# Discarded ideas for Mon Boum V3

> Things tried and rejected, with the reason. Keeps the team
> from re-proposing the same dead ends. If the boss pushed back
> on an idea and the owner confirms "never again", it goes
> here.
> Sibling to global `db_store\discarded.md`. Project-specific
> rejects live here.

## CSS-only `mix-blend-mode: multiply` as the sole white-bg fix

- tried on      : 2026-05-04
- why rejected  : Symptom-only fix. Works for pure black-on-pure-white
                  on dark surfaces but breaks on mid-tone bgs (orange
                  CTAs, gris cards) where multiply isn't a no-op. Also
                  doesn't survive logo placement on bg-white where it
                  produces no change but the white block IS already
                  invisible there — so mode toggling per surface is
                  needed. Data fix (sharp alpha-out, ADR-004) wins
                  on durability + universality.
- alternative   : `scripts/derosify-bg.mjs` (sharp-driven alpha-out
                  of near-white pixels with anti-alias tolerance ~12).
                  See ADR-004 + T-monboum-derosify.

## Build-time WP-REST scrape as a continuous data source

- tried on      : 2026-05-04 (Pass C)
- why rejected  : monboum.fr is a frozen WordPress site whose owner
                  may eventually take it down. Wiring a build-time
                  fetch from `https://monboum.fr/wp-json/wp/v2/media`
                  into the deploy pipeline introduces a runtime
                  dependency on a site Cascade does not control.
                  One-off Pass C scrape (25 images) committed to
                  `public/assets/{menus,products}/` is durable.
- alternative   : One-off scrape archived in `plan/_wp-media-full.json`.
                  When the owner replaces a photo, drop it into the
                  matching folder and update `src/data/menus.js`.
                  No automated sync.

## Deliveroo storefront scrape for menu / pricing data

- tried on      : 2026-05-04 (probe planned, deferred)
- why rejected  : Deliveroo aggressively blocks bots (per
                  `docs/STATUS.md` section 3.1 and L-2026-05-03-018
                  family). Even with a real UA + cookies, JS-rendered
                  menu data isn't in the raw HTML response. Selenium /
                  Playwright would be needed and is overkill for a
                  one-off menu seed.
- alternative   : Hand-curate menu items from the Pass C menu-board
                  images (each board lists 6-12 items with prices).
                  Owner can correct prices in `src/data/menus.js`
                  per session as needed.

## Instagram / TikTok / Facebook scrape for hero product photos

- tried on      : 2026-05-04 (probe planned, deferred)
- why rejected  : All three actively block unauthenticated scraping
                  and serve OG-only meta on profile URLs (no media
                  in raw HTML). Real ingestion requires a Graph API
                  token (Instagram Basic Display) + per-page
                  approval flow + token refresh — way out of scope
                  for a static marketing site. The TikTok download
                  pipeline already in place (`scripts/tiktok-download.mjs`,
                  via yt-dlp under the hood) handles videos but not
                  static product shots, which are typically not on
                  TikTok anyway.
- alternative   : monboum.fr WP-REST media library (already covered
                  the 14 product photos needed). Future product
                  refresh is a manual drop into `public/assets/products/`.

## Animated mascot / character on every page

- tried on      : never (pre-emptive ban)
- why rejected  : The reference sites (bnwburger.com, pointb-officiel.com)
                  use brand identity (founder, logo, photography) as
                  the recurring visual anchor — not a mascot. Mon Boum's
                  brand is the chain, not a character. Adding a mascot
                  would be net-new IP and dilute the existing brand
                  recognition.
- alternative   : Lean on the 4 enseigne badges (Boum Burger, Pizz's,
                  Chicken, Saveurs) + curated product photography +
                  the celebrity testimonial wall (Ninho, Dadju, Oli,
                  etc.) as the visual anchors.

## SPA / hash-route navigation between enseigne sections

- tried on      : never (pre-emptive ban)
- why rejected  : Mirrors MdM-V2's ADR-009 stance and the broader
                  "pas de SPA avec ancres `#`" principle. Each
                  enseigne deserves its own URL + title + canonical +
                  og — for SEO and for shareability. The current
                  multi-page Astro routing already does this; an
                  SPA refactor would lose all that.
- alternative   : Multi-page routing per enseigne. In-page anchors
                  (e.g. `#locations`) are allowed for jumping within
                  a single page, but never as primary navigation.

## OCR'ing the menu board images to auto-populate `menus.js`

- tried on      : 2026-05-04 (considered, deferred)
- why rejected  : The 9 menu boards are mid-quality JPGs with mixed
                  fonts + product photos overlaying text. OCR
                  accuracy on this layout is ~70-80% based on past
                  experiments — every misread becomes a customer-
                  facing typo OR a price error (the worst kind).
                  Hand-curation by the owner (or by Cascade reading
                  the boards visually as part of Phase C) is more
                  reliable.
- alternative   : Hand-curated `src/data/menus.js`. Cascade reads the
                  menu board image, transcribes 6-12 items + prices
                  per enseigne, owner corrects in a single review
                  pass.

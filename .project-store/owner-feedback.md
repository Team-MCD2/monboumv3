# Owner feedback register - Mon Boum V3

> Raw feedback from owner Jayce. Same structure as boss-feedback.md.
> Each entry must translate into at least one concrete rule, code
> change, lesson, or blacklisted/discarded entry.

## Entry template

    ## YYYY-MM-DD  <feedback summary>
    - verbatim       : "..."
    - translated to  : rule in db.md / project knowledge /
                       blacklisted / discarded / ADR
    - status         : addressed / in-progress / deferred

## Entries

## 2026-05-04  Active project lock-in + scrape authorization

- **verbatim**       :
  > "okk, proceed with defualts and scrape use any other social
  > media platforms of theirs to egt the actual menu (even google
  > and deliveroo - and all that you mentionned in defualt)"
- **translated to**  :
  - **autonomy grant** : Phase 0 + A-F executed in sequence
    without per-step check-in (M05 post-roadmap autonomy).
    Check-in only at phase boundary or unresolvable ambiguity.
  - **scrape scope** : authorized for monboum.fr (WP-REST + page
    scrape), Deliveroo per-restaurant storefronts, Google,
    Instagram @boumburger, TikTok @boumchickentoulouse, Facebook
    /boumburger. ToS / robots.txt respected per-source ; failed
    fetches logged but don't block the phase.
  - **photo defaults** : confirmed - Pass C scrape from monboum.fr
    is the primary source. Successful: 24 images via WP-REST
    media endpoint. (See `plan/_wp-media-full.json` archive.)
  - **menu defaults** : confirmed - menu boards from monboum.fr
    are the canonical first pass. Item-level data (name + price)
    extracted by hand-curation from the menu board images, since
    OCR adds error and Deliveroo blocks bot scraping.
  - **white-bg defaults** : confirmed - apply derosify-bg.mjs
    to ALL 8 PNGs landing on dark surfaces, not just the 4 hero
    banners.
  - **mobile X defaults** : confirmed - white `×`, 44x44 tap
    target, top-right with safe-area-inset padding, no fill.
  - **ordering defaults** : confirmed - Phase 0 -> A -> B -> D ->
    C -> F -> E.
- **status**         : addressed (autonomy grant in effect)

## 2026-05-04  Active project = Monboum V3

- **verbatim**       :
  > "just monboum v3."
- **translated to**  : focused all session work on Monboum V3.
  Bootstrap of `.project-store\` per M01 confirmed as Phase 0.
  Other projects (MarcheDeMoV2, Pieces Auto Colomiers,
  decoshop-livreur) untouched this session.
- **status**         : addressed

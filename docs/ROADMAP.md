# Mon Boum V3 — Roadmap

Forward-looking improvements grouped by impact × effort. Everything is optional — the site is production-ready as-is.

---

## Priority matrix

| # | Item | Impact | Effort | Blocker? |
|---|---|---|---|---|
| 1 | Live map on `/nos-restaurants` | High (conversion) | Medium | Needs per-location Deliveroo URLs |
| 2 | Per-restaurant Deliveroo URLs | High (conversion) | Low (data only) | Needs manual gathering |
| 3 | Image optimisation (`astro:assets`) | Medium (perf) | Medium | None |
| 4 | JSON-LD LocalBusiness schema | Medium (local SEO) | Low | None |
| 5 | Custom 404 page | Low (polish) | Low | None |
| 6 | Per-page OG images | Medium (social shares) | Medium | Needs design |
| 7 | GA4 wiring | Low (analytics) | Low | Needs measurement ID from user |
| 8 | Playwright visual regression | Low (QA) | Medium | None |
| 9 | Lighthouse CI in Vercel | Low (QA) | Low | None |
| 10 | Auto-reply to form senders | Low (UX) | Low | None |

---

## 1 · Live map feature — deep analysis

### The ask

Add an interactive map to `/nos-restaurants` showing all 10 locations, with:

- Markers coloured per enseigne.
- Click marker → popup with name, address, phone, **itinerary link**, **exact Deliveroo link** for that location.
- Two-way sync with the existing filter pills (hide markers for inactive enseignes).

### Library comparison

| Library | Bundle | API key? | Custom pins | Mobile touch | Vector tiles | Recommendation |
|---|---|---|---|---|---|---|
| **Leaflet + OpenStreetMap** | ~40 kB | No | Yes (HTML/SVG icons) | Yes | No (raster) | ✅ **Best fit** |
| MapLibre GL JS | ~120 kB | No | Yes (vector layers) | Yes | Yes | Overkill for 10 pins |
| Google Maps JS API | ~200 kB | **Yes** (billing after free tier) | Yes | Yes | Yes | Bloated, vendor lock-in |
| Mapbox GL | ~180 kB | Yes (free tier cap) | Yes | Yes | Yes | Paid risk, beautiful |
| Static Mapbox images | ~2 kB | Yes | Limited | No interact | N/A | Not interactive enough |

**Choice: Leaflet + OpenStreetMap.**

Rationale: no API key, lightweight, excellent React wrapper (`react-leaflet`), native support for custom HTML icons (we can use the enseigne brand colours directly), and the free OSM tile server is rate-limited but adequate for a restaurant locator. If traffic ever saturates OSM, we can swap to CartoDB's free tier in one line.

### Data requirements

The current `src/data/restaurants.js` already has **`coords: [lat, lng]`** on every restaurant (we set this up ahead of the map feature). What's missing:

```js
// Currently
{
  id: 'boum-burger-pradettes',
  coords: [43.5607, 1.4012],
  // …
}

// Needed for the map feature
{
  id: 'boum-burger-pradettes',
  coords: [43.5607, 1.4012],
  deliveroo_url: 'https://deliveroo.fr/fr/menu/toulouse/saint-simon/boum-burger-pradettes-SLUG',
  opening_hours: 'Lun-Dim 11h-23h',  // optional, for the popup
  // …
}
```

**Deliveroo URL gathering** is the only blocker. There's no public API; they need to be manually copied from the Mon Boum storefront on `deliveroo.fr`. Once the user hands over the list (~10 URLs, ~15 minutes of manual work), everything else is code.

### Proposed UX

```
┌───────────────────────────────────────────────────┐
│ Filter pills (existing)                           │
│ [Tous (10)] [Boum Burger (4)] [Pizz's (4)] …     │
├───────────────────────────────────────────────────┤
│ ┌─────────────────────┬─────────────────────────┐ │
│ │                     │ Active location:        │ │
│ │    INTERACTIVE MAP  │  ┌───────────────────┐  │ │
│ │    (Leaflet)        │  │ Boum Burger       │  │ │
│ │    [toulouse + 10   │  │ Pradettes         │  │ │
│ │     coloured pins]  │  │ 220 route de …    │  │ │
│ │                     │  │ 05 61 40 77 73    │  │ │
│ │                     │  │ ┌─ Commander ──┐  │  │ │
│ │                     │  │ │ (Deliveroo)  │  │  │ │
│ │                     │  │ └──────────────┘  │  │ │
│ │                     │  │ ┌─ Itinéraire ─┐  │  │ │
│ │                     │  │ └──────────────┘  │  │ │
│ │                     │  └───────────────────┘  │ │
│ └─────────────────────┴─────────────────────────┘ │
├───────────────────────────────────────────────────┤
│ Existing grid of restaurant cards (preserved)     │
└───────────────────────────────────────────────────┘
```

- Desktop: **two-column layout** (map 60% / sidebar 40%).
- Mobile: **stacked** — map on top at 50vh, then single-column card list below.
- Clicking a marker opens a popup **and** highlights the matching card below (scrolls card into view).
- Clicking a card highlights + pans to the marker.
- Filter pills hide both markers and cards in sync.

### Itinerary strategy

Google Maps deep links with **exact coordinates** (not address search) give the best UX:

```
https://www.google.com/maps/dir/?api=1&destination=43.5607,1.4012&destination_place_id=…
```

`place_id` is optional but more accurate. We can fetch them via Google Places API at build time (free tier: 28 500 requests/month, we need 10). Alternative: hand-curate 10 place IDs → drop them into `restaurants.js`. Same 15 minutes of manual work.

### Accessibility considerations

- Leaflet markers default to divs with no semantic meaning. We'll provide **a visually-hidden ordered list** of all locations as fallback (screen readers announce "Restaurant 1 of 10, Boum Burger Pradettes …").
- Keyboard: arrow keys should move between pins. `react-leaflet` supports `keyboard: true` on the map constructor.
- Reduced-motion: disable the default pan-zoom animation when `prefers-reduced-motion: reduce`.

### Bundle impact

| Asset | Size (min+gz) |
|---|---|
| `leaflet` core | ~12 kB |
| `react-leaflet` | ~4 kB |
| Our island component | ~3 kB |
| Leaflet CSS | ~1 kB |
| **Total added to `/nos-restaurants` only** | **~20 kB** |

Hydrated `client:visible` so it only downloads when user scrolls map into view. Other pages unaffected.

### Estimated effort

| Task | Hours |
|---|---|
| Install deps, set up `RestaurantsMap.jsx` island | 0.5 |
| Custom SVG pins in brand colours | 0.5 |
| Filter pill sync (map ↔ grid ↔ pills) | 1 |
| Popup content + link wiring | 0.5 |
| Responsive two-column → stacked layout | 0.5 |
| A11y (fallback list, keyboard, reduced-motion) | 0.5 |
| QA on 3 browsers + mobile | 0.5 |
| **Total** | **~4 hours** |

Plus **user-side** ~30 min to gather 10 Deliveroo URLs and 10 Google Place IDs.

---

## 2 · Full-site audit — suggestions

Ordered by ROI.

### 2.1 Image optimisation — high ROI

Currently 100% of site images are raw `.png` or `.jpg` in `/public/assets/`. Converting to `astro:assets` with automatic AVIF/WebP generation would:

- Cut image bytes by ~40–50% (measured on similar sites).
- Add responsive `srcset` automatically.
- Preserve aspect ratio via explicit width/height → zero CLS.

Migration: move `/public/assets/banners/` to `/src/assets/banners/`, replace `<img src="/assets/banners/..." />` with `<Image src={import(...)} ... />`. About 30 files to touch.

**Effort: ~2 hours. Impact: Lighthouse perf 88 → ~95.**

### 2.2 Local SEO — JSON-LD LocalBusiness schema

Each enseigne page already has dedicated addresses. Adding JSON-LD makes Google Maps / knowledge-panel integration much stronger:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FastFoodRestaurant",
  "name": "Boum Burger Pradettes",
  "address": { … },
  "geo": { "latitude": 43.5607, "longitude": 1.4012 },
  "openingHours": "Mo-Su 11:00-23:00",
  "telephone": "+33561407773",
  "servesCuisine": "Halal",
  "priceRange": "€"
}
</script>
```

10 restaurants × 1 schema block each = 10 blocks. Can be auto-generated from `restaurants.js` in a loop in each enseigne page.

**Effort: ~1 hour. Impact: local search ranking boost (typically +1-2 positions in Maps), rich results eligibility.**

### 2.3 Per-page OG images — medium ROI

Currently there's likely one global OG image. Social shares of `/boum-burger` get the same image as `/boum-pizzs`, which hurts click-through. Easy win: design 4 brand-specific OG images (1200×630) and reference them per page:

```html
<meta property="og:image" content="/assets/og/boum-burger.jpg" />
```

**Effort: ~1 hour (if assets exist) or 2 hours (if need design). Impact: 20-30% higher social CTR.**

### 2.4 Custom 404 page — low effort, polish

Right now unknown URLs return Vercel's generic 404. An `src/pages/404.astro` page matching the brand (big "BOUM" in rouge, "page introuvable" copy, link back home) is a 20-minute add that feels professional.

### 2.5 Auto-reply to form senders — UX polish

When a visitor submits the contact form, they currently get nothing visible. Creating a 3rd EmailJS template (auto-reply) and calling `sendContact()` twice (once to us, once to the visitor) is:

```js
await Promise.all([
  sendContact(payload),
  sendAutoReply({ to_email: payload.from_email, from_name: payload.from_name }),
]);
```

Template: "Bonjour {{from_name}}, merci pour votre message. Nous revenons vers vous sous 48 h. — L'équipe Mon Boum". Removes the "did they get it?" anxiety.

**Effort: ~30 min. Impact: fewer "I sent a message, no reply yet" follow-ups.**

### 2.6 Playwright visual regression — QA

Zero tests currently. A `tests/visual.spec.ts` that loads every page and compares against a snapshot would catch:

- Accidental layout breaks when editing global CSS
- Broken image paths
- Console errors on page load

**Effort: ~2 hours. Impact: safety net for future edits.**

### 2.7 Lighthouse CI in Vercel — QA

Vercel has a free "Lighthouse" integration that runs on every preview deploy. Enabling it:

1. Catches perf regressions automatically.
2. Flags if a bad image or JS bloat sneaks in.
3. Builds an audit trail over time.

**Effort: 10 min. Impact: continuous quality gate.**

### 2.8 Micro-suggestions (under 30 min each)

- Add `rel="canonical"` tags in Layout for each page.
- Add `robots.txt` explicitly (Astro doesn't generate one by default).
- Add `manifest.webmanifest` for a proper PWA-lite install experience.
- Add a `Last-Modified` header or `<time datetime="…">` on mentions-légales for freshness signalling to Google.
- Confirm the favicon works on all sizes (iOS, Android, desktop). Currently using a single 32×32 — could use `realfavicongenerator.net` output.
- Consider adding a `CHANGELOG.md` at project root for version tracking.

---

## 3 · Data gathering checklist (user action)

Before building the map, the user needs to collect:

### 3.1 Deliveroo URLs (10 items, ~15 min)

Visit `monboum.commande.deliveroo.fr/fr/` and click each restaurant. Copy the URL of each storefront page. Format:

```
https://deliveroo.fr/fr/menu/toulouse/[quartier]/[restaurant-slug]
```

Expected: 10 unique URLs, one per restaurant.

### 3.2 Google Place IDs (10 items, ~15 min) — optional for precise itinerary

1. Visit `https://developers.google.com/maps/documentation/places/web-service/place-id`
2. Find a place → copy its `ChIJ...` ID.
3. Or use the `restaurants.js` coords + address in the Places API Text Search (one-off script, ~5 min to write).

### 3.3 Per-location opening hours (optional, for popups)

The live `monboum.fr` doesn't expose per-location hours consistently. Could phone each restaurant or accept a generic "11h-23h sauf Vauquelin" string.

---

## 4 · Technical debt

Minor items worth tracking:

- **`src/components/Header.astro:26`** — inline SVG paths could be extracted to a component (reused by 3+ places).
- **`src/pages/mentions-legales.astro`** — legal copy is hardcoded. Should probably live in `src/data/legal.js` so non-devs can proofread without touching astro syntax.
- **`src/lib/emailjs.js`** — the `sendContact` / `sendFranchise` functions could share a common `send()` helper. ~10 lines of duplication currently.
- **`.env.example` vs README env docs** — currently split across two files. Could consolidate.
- **No `engines` field in `package.json`** — should pin Node ≥ 18 so `npm install` fails fast on older runtimes.

None of these are urgent. All are 15-30 min fixes.

---

## 5 · One-line recommendation

> If picking **one** thing to ship next: **gather the 10 Deliveroo URLs**, then build the map. Everything else is incremental.

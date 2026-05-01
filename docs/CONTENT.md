# Mon Boum V3 — editorial workflow

How to update site content without touching layout / code.

All editorial data lives in plain JS files under `src/data/` and is validated
by `npm run validate:data`. **Always run that command after editing.**

---

## 1. Update a restaurant

File: `src/data/restaurants.js`

Each entry must include:

| Field           | Required | Notes                                      |
| --------------- | -------- | ------------------------------------------ |
| `id`            | yes      | kebab-case, must be unique                  |
| `enseigne`      | yes      | one of `boum-burger`, `boum-pizzs`, `boum-chicken`, `boum-saveurs` |
| `nom`           | yes      | quartier / neighbourhood label              |
| `adresse`       | yes      | street address                              |
| `cp`            | yes      | 5-digit postal code                         |
| `ville`         | yes      | city                                        |
| `tel`           | optional | format `0X XX XX XX XX`                     |
| `drive`         | optional | `true` / `false`                            |
| `horaires`      | optional | free-text opening hours                     |
| `note`          | optional | small disambiguation note                   |
| `deliverooUrl`  | yes      | `https://deliveroo.fr/fr/menu/...` link     |
| `coords`        | yes      | `[latitude, longitude]` (Toulouse area)     |

After editing:

```bash
npm run validate:data
npm run build
```

---

## 2. Update Deliveroo links

Each restaurant has its own `deliverooUrl`.
Update the value in `src/data/restaurants.js` and rerun:

```bash
npm run validate:data
```

The validator checks the URL pattern but cannot verify the page is live —
always click each link manually before deploy.

---

## 3. Update promos (Deliveroo offers on home)

File: `src/data/promos.js`

Each entry must include:

- `id` — unique slug
- `title` — display label (no price per brand rule)
- `image` — filename relative to `public/assets/promos/`
- `url` — Deliveroo URL
- `alt` — accessible alt text

To add a new promo:

1. Drop the image file into `public/assets/promos/`.
2. Add an entry to `PROMOS` in `src/data/promos.js`.
3. Run `npm run validate:data` (it checks the image file actually exists).

---

## 4. Update TikTok videos

The home page TikTok strip is **auto-synced** from
`src/generated/tiktok-local.json`, which is produced by:

```bash
npm run sync:tiktok
```

That script downloads the top-viewed videos from
`@boumchickentoulouse` as MP4s into `public/assets/tiktoks/` and writes the
JSON summary.

### Override a title

Raw TikTok titles often have emojis and ellipses. To curate clean copy without
losing the auto-sync benefit, edit `TITLE_OVERRIDES` in
`src/data/tiktoks.js`:

```js
const TITLE_OVERRIDES = {
  '7498011452289092886': 'Les naans kebab à tester absolument à Toulouse !',
  // add more video-id → clean-title pairs here
};
```

### Manual fallback

If `tiktok-local.json` is empty (rare), the homepage uses
`FALLBACK_TIKTOKS` from `src/data/tiktoks.js`. Edit that array to control
the fallback.

### Requirements for `sync:tiktok`

- Python on `PATH`
- `yt-dlp`: `python -m pip install -U yt-dlp`

---

## 5. Update testimonials

File: `src/data/testimonials.js`

Each entry must include:

- `id` — unique number
- `name` — display name
- `designation` — role label (e.g. `Artiste/Rappeur`)
- `quote` — French quote (verbatim, emojis allowed)
- `photo` — path under `public/assets/testimonials/`

To add a testimonial:

1. Drop the photo into `public/assets/testimonials/`.
2. Add the entry, increment ids.
3. `npm run validate:data` (checks the photo actually exists).

---

## 6. Update brand info

File: `src/data/restaurants.js` → `ENSEIGNES`

Per-brand metadata used by:

- the homepage card grid,
- map pin colors,
- per-brand pages.

Fields:

- `slug` — must match the `enseigne` field of restaurants
- `nom` — display name
- `label` — short tagline
- `path` — page route (`/boum-*`)
- `color` — hex string used as the map pin color

---

## 7. Update images and assets

- Logos: `public/assets/logos/`
- Brand banners: `public/assets/banners/`
- Decorative shapes: `public/assets/shapes/`
- Promos: `public/assets/promos/`
- Testimonials: `public/assets/testimonials/`
- TikTok MP4s: `public/assets/tiktoks/` (managed by `sync:tiktok`)

When adding images that appear in-flow on a page, set explicit
`width` and `height` attributes matching the file's intrinsic pixel size to
prevent layout shift. Decorative absolute-positioned shapes don't need them.

---

## 8. After every edit

```bash
npm run validate:data
npm run build
```

If both succeed, commit and push. Vercel auto-deploys.

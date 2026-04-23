# Mon Boum V3 — Asset Inventory

All assets mirrored from monboum.fr for offline rendering.
Two-pass scrape methodology (issue 2.21).

## Pass A — Known URLs (2026-04-23, pre-restart)

Shapes, banners, base logos (already in place).

### `shapes/`
- `shape1-min.png` · `shape2-min.png` · `shape3-min.png`
- `welcome_grunge_shape-min-1024x15.png` (used by GrungeSeparator.astro)

### `banners/` (hero + enseigne)
- `welcome_image.png` — auxiliary badge
- `slider_image2.png` — **burger pile** for hero slide 0 (STREET-FOOD)
- `Commandez.png` — **scooter** illustration for hero slide 1 (LIVRAISON)
- `banner-2.png` · `BOUM-BURGER-SINCE.png` · `Boum-Pizzs-1.png` · `Boum-Chicken-1-1024x576.png`

### `logos/`
- `logo-mon-boum-home.png` (header)
- `footer_logo-boum.png` (footer)
- `Boums.png` (OG image)

## Pass B — HTML-scraped from home page (2026-04-23)

Scrape script: `plan/_download_pass_b.ps1` — 23/23 successful.

### `testimonials/` — 11 photos (plan said 12, actual site has 11)

| Local file | Source URL | Used by |
|---|---|---|
| `Ninho.jpg`      | `…/2021/02/Ninho.jpg`              | testimonials.js id=1 |
| `Dadju.jpg`      | `…/2021/02/Dadju.jpg`              | id=2 |
| `Oli.jpg`        | `…/2021/02/Oli.jpg`                | id=3 |
| `Vegedream.jpg`  | `…/2021/02/vegedream.jpg`          | id=4 |
| `Koba-LaD.jpg`   | `…/2021/02/Koba-la-d.jpg`          | id=5 |
| `Algerino.jpg`   | `…/2021/02/Algerino.jpg`           | id=6 |
| `Marwa.jpg`      | `…/2021/02/Marwa.jpg`              | id=7 |
| `Tayc.jpg`       | `…/2021/02/Tayc.jpg`               | id=8 |
| `Chily.jpg`      | `…/2021/02/CHILY©FIFOU1350.jpg`    | id=9 (renamed to drop © char) |
| `Mario.jpg`      | `…/2021/02/Mario.jpg`              | id=10 |
| `Landy.png`      | `…/2021/02/LANDY.png`              | id=11 |

### `promos/` — 5 Deliveroo offer images
- `Boum-Family-offre-1.jpg` · `Geante-offert.jpg` · `Milkshake-offert.jpg`
- `Mon-boumm.jpg` · `TACOS-offert-1.jpg`

### `banners/` additions — enseigne round badges
- `Boum-Burgers.png` · `BOUM-Pizzs.png` · `Boum-Chicken.png` · `Boum-Saveurs.png`

### `logos/` additions
- `logo-boum-2.png` · `footer_bg.png`

### `videos/`
- `Boum-Franchise.mp4` — 44.6 MB, from `/2022/03/`, used on franchise page

## Still TODO — Pass C (future)
- Menu photos per enseigne (`/boum-burger-2/`, `/boum-pizzs/`, `/boum-chicken/`, `/boum-saveurs/` pages need HTML scrape)
- Hi-res hero banner variants if needed for retina
- TikTok thumbnails (oEmbed handles this at runtime, not static)

## How to re-run Pass B

```powershell
powershell -ExecutionPolicy Bypass -File plan\_download_pass_b.ps1
```

Script is idempotent (skips existing files).

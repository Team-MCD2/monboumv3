# Mon Boum V3

Marketing site for **Mon Boum** — the 1st halal drive fast-food network in France, operating 10 restaurants across the Toulouse metropolitan area since 2004.

Live: <https://mon-boum.vercel.app>

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Static framework | **Astro 5** | Zero-JS by default, islands only where needed, excellent Lighthouse out of the box |
| UI framework | **React 18** | Only used inside hydrated islands (`client:load` / `client:visible`) |
| Styling | **Tailwind CSS 3** + design tokens in `src/styles/globals.css` | Utility-first, brand palette locked via CSS vars |
| Fonts | **Anton** (display, uppercase punches) + **Inter** (body) | Free, self-hostable via Google Fonts |
| Forms | **EmailJS** (browser-only, no backend) | Good fit for a static site; spam-guarded with honeypot |
| Animations | CSS-only, guarded by `prefers-reduced-motion` | Accessible, no motion library needed |
| Analytics | **Google Analytics 4** *(optional, env-gated)* | Standard, privacy-respecting mode via env var |
| Deploy | **Vercel** (static output) | Git-linked auto-deploy, edge-cached |

---

## Project structure

```
src/
├── components/
│   ├── Header.astro          # Sticky header + mobile drawer + burger→X
│   ├── Footer.astro          # Footer with 3 nav cols + SIRET block
│   ├── GrungeSeparator.astro # Decorative torn-paper transition
│   └── islands/              # React components (hydrated on demand)
│       ├── HeroRotator.jsx
│       ├── PromoScroller.jsx
│       ├── TestimonialsSlider.jsx
│       ├── TikTokFacade.jsx
│       ├── ContactForm.jsx
│       └── FranchiseForm.jsx
├── data/
│   ├── restaurants.js        # Single source of truth — 10 locations with coords
│   └── testimonials.js
├── layouts/
│   └── Layout.astro          # <head>, skip-link, header/footer slots, --hh CSS var
├── lib/
│   └── emailjs.js            # Thin wrapper + demo-mode detector
├── pages/
│   ├── index.astro               # Home (7 sections)
│   ├── mon-boum.astro            # Franchise pitch
│   ├── boum-{burger,pizzs,chicken,saveurs}.astro
│   ├── nos-restaurants.astro     # All 10 with filter
│   ├── contact.astro
│   ├── formulaire-de-candidature.astro
│   └── mentions-legales.astro
└── styles/
    └── globals.css           # Design tokens, animations, a11y
public/assets/                # Logos, banners, shapes, videos (local, no CDN)
plan/                         # Planning docs (brief, inventory)
docs/                         # Project journal + roadmap
```

---

## Getting started

Requires **Node ≥ 18**.

```powershell
npm install              # one-time
npm run dev              # http://localhost:4321
npm run build            # generates ./dist
npm run preview          # serve ./dist locally
```

---

## Environment variables

Copy `.env.example` to `.env` and fill in.

| Variable | Required | Source |
|---|---|---|
| `PUBLIC_EMAILJS_PUBLIC_KEY` | Contact + franchise forms | EmailJS dashboard → Account |
| `PUBLIC_EMAILJS_SERVICE_ID` | " | EmailJS → Email Services |
| `PUBLIC_EMAILJS_TEMPLATE_CONTACT` | " | EmailJS → Email Templates |
| `PUBLIC_EMAILJS_TEMPLATE_FRANCHISE` | " | EmailJS → Email Templates |
| `PUBLIC_GA4_ID` | Analytics (optional) | Google Analytics → Admin → Data Streams |

Full EmailJS setup walkthrough (with ready-to-paste branded templates): see `EMAILJS-SETUP.md`.

Forms fall back to **demo mode** (yellow banner, logged-to-console submit) when any EmailJS var is missing — so dev never blocks on config.

For production, mirror the same vars in **Vercel → Project → Settings → Environment Variables** and redeploy.

---

## Deploy

This project is deployed via Vercel's Git integration. Pushing to the default branch triggers a build.

Manual redeploy:

```powershell
vercel --prod
```

Build output is static HTML (`output: 'static'` in `astro.config.mjs`), served from Vercel's global edge.

---

## Accessibility & motion

- Skip-to-main link on first tab
- Global `*:focus-visible` outline in brand red
- All animations wrapped in `@media (prefers-reduced-motion: no-preference)` — reduced-motion users get a static site
- Explicit `prefers-reduced-motion: reduce` no-op block for any residual motion
- Form labels + `aria-invalid` + `aria-describedby` + `aria-live` error regions
- Mobile menu closes on Escape with focus return to the toggle button

---

## Brand rules

Documented in `plan/plan.md` (frozen brief) and codified in `.project-store/decisions.md` (ADR-001..009). The hard rules worth flagging for contributors:

1. **Header height is dynamic** — use `padding-top: var(--hh)` on hero sections, never a hardcoded value. The value is set by Layout JS to match the Header's measured height.
2. **Logo never sits on a coloured container.** The dedicated footer variant (`footer_logo-boum.png`) is the only one allowed on dark backgrounds.
3. **Mobile drawer requires an explicit internal close X** — header burger→X transform alone is too subtle on mobile. See `.project-store/decisions.md` ADR-003.
4. **Scraped PNGs that land on dark surfaces get pre-processed by `npm run derosify:bg`** — bake alpha-transparency in once instead of fighting it with CSS. See ADR-004.

> Reference-site contextualisation (newschooltacos, bnwburger, g-ladalle, pointb-officiel) lives in **ADR-008** — a deliberate pick list of "what we steal vs what we skip". Consult it before introducing a net-new visual pattern.

---

## Docs

- **`EMAILJS-SETUP.md`** — dashboard walkthrough + 2 copy-paste templates
- **`docs/JOURNAL.md`** — project thought process, decisions, what worked
- **`docs/ROADMAP.md`** — pending improvements + map feature analysis
- **`plan/plan.md`** — original build spec

---

Made by [Microdidact](https://microdidact.com).

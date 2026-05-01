# Mon Boum V3 — Vercel deployment guide

This document is the single source of truth for deploying Mon Boum V3 to Vercel.
Run through it sequentially the first time. After that, every push to `main`
auto-deploys.

---

## 1. Pre-flight checklist

Run locally before each first deploy:

```bash
npm install
npm run validate:data
npm run build
```

All three must succeed. If `validate:data` reports errors, fix them before
deploying — they indicate broken restaurant / TikTok / promo / testimonial data.

---

## 2. Vercel project creation

### Option A — Vercel dashboard (simplest)

1. Go to <https://vercel.com/new>
2. Import this Git repository.
3. Vercel auto-detects **Astro** as the framework.
4. Confirm the build settings (Vercel pre-fills these correctly):
   - **Framework Preset**: Astro
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Set the environment variables (see section 3).
6. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link        # link this folder to a Vercel project
vercel env pull    # pull env vars locally if already set on Vercel
vercel             # deploy a preview
vercel --prod      # deploy to production
```

---

## 3. Required environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for both
**Production** and **Preview** environments.

| Name                                | Required | Purpose                              |
| ----------------------------------- | -------- | ------------------------------------ |
| `PUBLIC_EMAILJS_PUBLIC_KEY`         | yes      | EmailJS public key (frontend init).  |
| `PUBLIC_EMAILJS_SERVICE_ID`         | yes      | EmailJS service id.                  |
| `PUBLIC_EMAILJS_TEMPLATE_CONTACT`   | yes      | Template id for `/contact`.          |
| `PUBLIC_EMAILJS_TEMPLATE_FRANCHISE` | yes      | Template id for franchise form.      |
| `PUBLIC_GA4_ID`                     | optional | Google Analytics 4 measurement id.   |

Notes:

- All `PUBLIC_*` vars are exposed to the browser by Astro/Vite. Never put
  secrets here.
- `PUBLIC_GA4_ID` only loads GA in **production** builds, so leaving it empty
  on Preview is safe and recommended.

---

## 4. `vercel.json`

A committed `vercel.json` configures:

- Long-cache `Cache-Control` for hashed assets in `/_astro/*` (1 year, immutable).
- Baseline security headers on all routes:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `cleanUrls: true` and `trailingSlash: false`.

You normally do not need to edit this file.

---

## 5. Custom domain

When the client provides a domain (e.g. `monboum.fr`):

1. Vercel → Project → Settings → **Domains** → add the domain.
2. Follow the DNS instructions Vercel shows (usually a `CNAME` to
   `cname.vercel-dns.com` or `A`/`AAAA` records on apex).
3. Update `astro.config.mjs`:
   ```js
   site: 'https://monboum.fr',
   ```
4. Update `public/robots.txt` sitemap line to match the new origin.
5. Redeploy (`vercel --prod` or push to `main`).

---

## 6. Post-deploy validation

Run all of these on the **live Vercel URL** (preview or prod) at least once:

- [ ] Homepage renders, hero rotates, all React islands hydrate (no white sections).
- [ ] TikTok videos autoplay muted; the sound toggle works.
- [ ] `/nos-restaurants` map loads, pins are brand-colored, popups open.
- [ ] Filter pills and map stay in sync; clicking a pin scrolls to its card.
- [ ] All four `/boum-*` pages render with hero images.
- [ ] Mobile menu opens, closes, and Escape closes it.
- [ ] `/contact` form submits successfully (test address: yourself).
- [ ] `/formulaire-de-candidature` form submits successfully.
- [ ] `/mentions-legales` and `/404` render.
- [ ] **No console errors** in DevTools.
- [ ] Lighthouse scores (mobile, prod build):
  - Performance ≥ 85
  - Accessibility ≥ 95
  - Best Practices ≥ 95
  - SEO ≥ 95
- [ ] Google Rich Results Test passes for `/nos-restaurants` and one `/boum-*` page.
- [ ] OpenGraph preview is correct on
      [opengraph.xyz](https://www.opengraph.xyz/) for the homepage.

---

## 7. Rollback

If a deploy ships a regression:

- Vercel → Deployments → click the previous green deployment → **Promote to
  Production**.
- Or revert the offending commit on `main` — Vercel re-deploys automatically.

---

## 8. Useful commands

```bash
npm run dev               # local dev server
npm run build             # production build into dist/
npm run preview           # preview the built site at localhost
npm run validate:data     # sanity-check all src/data/*.js files
npm run sync:tiktok       # download top TikTok videos + refresh JSON
```

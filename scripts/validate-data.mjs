// ═══════════════════════════════════════════════════════════════
// validate-data.mjs — sanity-check all `src/data/*.js` files before deploy
//
// Run via:  npm run validate:data
//
// Checks:
//   • RESTAURANTS — required fields, id/cp/coords/tel/url formats,
//                   unique ids, Toulouse-area bounds, ENSEIGNES coverage
//   • TIKTOKS     — local mp4 path + actual file existence, URL format
//   • PROMOS      — required fields, image file existence, Deliveroo URL
//   • TESTIMONIALS — required fields, photo file existence, unique ids
//
// Exit code 0 if no errors (warnings are OK), 1 otherwise.
// ═══════════════════════════════════════════════════════════════

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

// ── Tiny terminal-color helpers (no chalk dep) ─────────────────
const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

const errors = [];
const warnings = [];
const fail = (where, msg) => errors.push(`${c.red('✗')} [${where}] ${msg}`);
const warn = (where, msg) => warnings.push(`${c.yellow('!')} [${where}] ${msg}`);

// ── Helpers ────────────────────────────────────────────────────
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const publicFileExists = (publicPath) => {
  if (!isNonEmptyString(publicPath) || !publicPath.startsWith('/')) return false;
  return existsSync(path.join(PUBLIC_DIR, publicPath.slice(1)));
};

// French postal code: 5 digits
const RE_CP = /^\d{5}$/;
// French phone "05 61 40 77 73" style (10 digits, 5 pairs separated by space)
const RE_TEL = /^0\d(\s?\d{2}){4}$/;
// Restaurant id: kebab-case, starts with letter
const RE_ID = /^[a-z][a-z0-9-]*$/;
// Deliveroo URL
const RE_DELIVEROO = /^https:\/\/(?:www\.)?deliveroo\.fr\/fr\/menu\//;
// TikTok video URL
const RE_TIKTOK = /^https:\/\/www\.tiktok\.com\/@[a-z0-9._]+\/video\/\d+/i;

// Toulouse metro bounding box (loose):
const LAT_MIN = 43.40, LAT_MAX = 43.80;
const LNG_MIN = 1.20,  LNG_MAX = 1.70;

// ── Importer (data files are ESM) ──────────────────────────────
const importData = async (rel) => {
  const url = pathToFileURL(path.join(ROOT, rel)).href;
  return await import(url);
};

// ═══════════════════════════════════════════════════════════════
// 1) RESTAURANTS
// ═══════════════════════════════════════════════════════════════
const validateRestaurants = async () => {
  const { RESTAURANTS, ENSEIGNES } = await importData('src/data/restaurants.js');
  const where = 'restaurants.js';
  console.log(c.bold(c.cyan(`\n→ ${where}  (${RESTAURANTS.length} entries)`)));

  const validEnseignes = new Set(Object.keys(ENSEIGNES));
  const seenIds = new Set();
  const enseigneCounts = Object.fromEntries(
    Object.keys(ENSEIGNES).map((k) => [k, 0])
  );

  for (const r of RESTAURANTS) {
    const tag = r.id || `(no-id)`;

    // Required fields
    for (const f of ['id', 'enseigne', 'nom', 'adresse', 'cp', 'ville', 'coords', 'deliverooUrl']) {
      if (r[f] === undefined || r[f] === null || r[f] === '') {
        fail(where, `${tag}: missing required field "${f}"`);
      }
    }

    // id
    if (r.id) {
      if (!RE_ID.test(r.id)) fail(where, `${tag}: id is not kebab-case`);
      if (seenIds.has(r.id)) fail(where, `${tag}: duplicate id`);
      seenIds.add(r.id);
    }

    // enseigne
    if (r.enseigne && !validEnseignes.has(r.enseigne)) {
      fail(where, `${tag}: unknown enseigne "${r.enseigne}"`);
    } else if (r.enseigne) {
      enseigneCounts[r.enseigne]++;
    }

    // cp
    if (r.cp && !RE_CP.test(r.cp)) {
      fail(where, `${tag}: invalid postal code "${r.cp}"`);
    }

    // tel (optional)
    if (r.tel !== undefined && !RE_TEL.test(r.tel)) {
      warn(where, `${tag}: phone "${r.tel}" doesn't match "0X XX XX XX XX" format`);
    }

    // coords
    if (Array.isArray(r.coords)) {
      const [lat, lng] = r.coords;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        fail(where, `${tag}: coords must be [number, number]`);
      } else {
        if (lat < LAT_MIN || lat > LAT_MAX) {
          warn(where, `${tag}: latitude ${lat} outside Toulouse bounds (${LAT_MIN}–${LAT_MAX})`);
        }
        if (lng < LNG_MIN || lng > LNG_MAX) {
          warn(where, `${tag}: longitude ${lng} outside Toulouse bounds (${LNG_MIN}–${LNG_MAX})`);
        }
      }
    } else if (r.coords !== undefined) {
      fail(where, `${tag}: coords must be an array of two numbers`);
    }

    // deliverooUrl
    if (r.deliverooUrl && !RE_DELIVEROO.test(r.deliverooUrl)) {
      fail(where, `${tag}: deliverooUrl "${r.deliverooUrl}" doesn't match Deliveroo menu pattern`);
    }
  }

  // ENSEIGNES coverage
  for (const [slug, count] of Object.entries(enseigneCounts)) {
    if (count === 0) warn(where, `enseigne "${slug}" has 0 locations`);
  }

  console.log(
    c.dim(
      `  Counts per enseigne: ${Object.entries(enseigneCounts)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}`
    )
  );
};

// ═══════════════════════════════════════════════════════════════
// 2) TIKTOKS
// ═══════════════════════════════════════════════════════════════
const validateTiktoks = async () => {
  const { TIKTOKS, TIKTOK_ACCOUNT } = await importData('src/data/tiktoks.js');
  const where = 'tiktoks.js';
  console.log(c.bold(c.cyan(`\n→ ${where}  (${TIKTOKS.length} entries)`)));

  for (const [i, t] of TIKTOKS.entries()) {
    const tag = `#${i + 1}`;
    for (const f of ['src', 'title', 'account']) {
      if (!isNonEmptyString(t[f])) fail(where, `${tag}: missing "${f}"`);
    }
    if (t.account && t.account !== TIKTOK_ACCOUNT) {
      warn(where, `${tag}: account "${t.account}" differs from TIKTOK_ACCOUNT "${TIKTOK_ACCOUNT}"`);
    }
    if (t.src) {
      if (!t.src.startsWith('/assets/tiktoks/') || !t.src.endsWith('.mp4')) {
        fail(where, `${tag}: src "${t.src}" should be /assets/tiktoks/*.mp4`);
      } else if (!publicFileExists(t.src)) {
        fail(where, `${tag}: local file "${t.src}" not found in public/`);
      }
    }
    if (t.url !== undefined && !RE_TIKTOK.test(t.url)) {
      warn(where, `${tag}: url "${t.url}" doesn't look like a TikTok video URL`);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// 3) PROMOS
// ═══════════════════════════════════════════════════════════════
const validatePromos = async () => {
  const { PROMOS } = await importData('src/data/promos.js');
  const where = 'promos.js';
  console.log(c.bold(c.cyan(`\n→ ${where}  (${PROMOS.length} entries)`)));

  const seenIds = new Set();
  for (const p of PROMOS) {
    const tag = p.id || `(no-id)`;
    for (const f of ['id', 'title', 'image', 'url', 'alt']) {
      if (!isNonEmptyString(p[f])) fail(where, `${tag}: missing "${f}"`);
    }
    if (p.id) {
      if (seenIds.has(p.id)) fail(where, `${tag}: duplicate id`);
      seenIds.add(p.id);
    }
    if (p.image) {
      const rel = `/assets/promos/${p.image}`;
      if (!publicFileExists(rel)) {
        fail(where, `${tag}: image file "${rel}" not found in public/`);
      }
    }
    if (p.url && !/^https?:\/\//.test(p.url)) {
      fail(where, `${tag}: url "${p.url}" is not http(s)`);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// 4) TESTIMONIALS
// ═══════════════════════════════════════════════════════════════
const validateTestimonials = async () => {
  const { TESTIMONIALS } = await importData('src/data/testimonials.js');
  const where = 'testimonials.js';
  console.log(c.bold(c.cyan(`\n→ ${where}  (${TESTIMONIALS.length} entries)`)));

  const seenIds = new Set();
  for (const t of TESTIMONIALS) {
    const tag = t.name || `#${t.id || '?'}`;
    for (const f of ['id', 'name', 'designation', 'quote', 'photo']) {
      if (t[f] === undefined || t[f] === null || t[f] === '') {
        fail(where, `${tag}: missing "${f}"`);
      }
    }
    if (typeof t.id === 'number') {
      if (seenIds.has(t.id)) fail(where, `${tag}: duplicate id ${t.id}`);
      seenIds.add(t.id);
    }
    if (t.photo && !publicFileExists(t.photo)) {
      fail(where, `${tag}: photo "${t.photo}" not found in public/`);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// Run
// ═══════════════════════════════════════════════════════════════
const main = async () => {
  console.log(c.bold('\nMon Boum V3 — data validator'));
  console.log(c.dim(`root: ${ROOT}`));

  try {
    await validateRestaurants();
    await validateTiktoks();
    await validatePromos();
    await validateTestimonials();
  } catch (err) {
    console.error(c.red('\n[validator] crashed:'), err);
    process.exit(2);
  }

  console.log('');
  if (warnings.length) {
    console.log(c.bold(c.yellow(`Warnings (${warnings.length}):`)));
    for (const w of warnings) console.log('  ' + w);
  }
  if (errors.length) {
    console.log(c.bold(c.red(`\nErrors (${errors.length}):`)));
    for (const e of errors) console.log('  ' + e);
    console.log('');
    console.log(c.red(c.bold('FAILED — fix errors above before deploying.')));
    process.exit(1);
  } else {
    console.log(c.green(c.bold('OK — all data files passed validation.')));
    process.exit(0);
  }
};

main();

// ═══════════════════════════════════════════════════════════════
// validate-seo.mjs — sanity-check every built HTML in dist/ for
// the SEO / social essentials required for a deployable production site.
//
// Run via:  npm run validate:seo
// (run AFTER `npm run build`)
//
// Per-page checks:
//   • <title> non-empty
//   • <meta name="description" content="…"> non-empty
//   • <link rel="canonical" href="…">
//   • <meta property="og:title">
//   • <meta property="og:description">
//   • <meta property="og:image">
//   • <meta name="twitter:card">
//   • <meta name="viewport">
//   • <html lang="…">
// Page-set checks:
//   • dist/sitemap-index.xml exists
//   • dist/robots.txt exists and references the sitemap
//
// Exit 0 if no errors (warnings are OK), 1 otherwise.
// ═══════════════════════════════════════════════════════════════

import { existsSync, readFileSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

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

// Walk dist/ and collect every .html file
async function collectHtml(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await collectHtml(full, acc);
    else if (e.isFile() && e.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

// Tiny attribute extractor — good enough for built static HTML.
function findTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

const RX = {
  title:        /<title>([^<]*)<\/title>/i,
  description:  /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
  canonical:    /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i,
  ogTitle:      /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i,
  ogDesc:       /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i,
  ogImage:      /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i,
  twitterCard:  /<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i,
  viewport:     /<meta\s+name=["']viewport["']\s+content=["']([^"']*)["']/i,
  htmlLang:     /<html[^>]*\slang=["']([^"']+)["']/i,
};

function relPath(abs) {
  return path.relative(DIST, abs).split(path.sep).join('/');
}

function validateHtml(file) {
  const html = readFileSync(file, 'utf8');
  const where = relPath(file);

  const title = findTag(html, RX.title);
  if (!title || !title.trim()) fail(where, 'missing or empty <title>');

  const desc = findTag(html, RX.description);
  if (!desc || !desc.trim()) fail(where, 'missing or empty meta description');

  const canon = findTag(html, RX.canonical);
  if (!canon) fail(where, 'missing <link rel="canonical">');
  else if (!/^https?:\/\//.test(canon)) fail(where, `canonical "${canon}" is not absolute`);

  if (!findTag(html, RX.ogTitle))   fail(where, 'missing og:title');
  if (!findTag(html, RX.ogDesc))    fail(where, 'missing og:description');
  if (!findTag(html, RX.ogImage))   fail(where, 'missing og:image');
  if (!findTag(html, RX.twitterCard)) warn(where, 'missing twitter:card');

  if (!findTag(html, RX.viewport))  fail(where, 'missing meta viewport');
  const lang = findTag(html, RX.htmlLang);
  if (!lang) fail(where, 'missing <html lang="…">');
  else if (lang.toLowerCase() !== 'fr') warn(where, `<html lang="${lang}"> — expected "fr"`);

  // JSON-LD presence (optional but recommended on key pages)
  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
  const isKeyPage = where === 'index.html'
    || /^boum-[^/]+\/index\.html$/.test(where)
    || where === 'nos-restaurants/index.html';
  if (isKeyPage && !hasJsonLd) {
    warn(where, 'no JSON-LD block found on a key page');
  }
}

function validateSitemap() {
  const sm = path.join(DIST, 'sitemap-index.xml');
  if (!existsSync(sm)) {
    fail('sitemap', 'dist/sitemap-index.xml missing — sitemap integration not generating output');
    return;
  }
  const stats = statSync(sm);
  if (stats.size < 50) warn('sitemap', `sitemap-index.xml is suspiciously small (${stats.size}B)`);
}

function validateRobots() {
  const rb = path.join(DIST, 'robots.txt');
  if (!existsSync(rb)) {
    fail('robots', 'dist/robots.txt missing');
    return;
  }
  const txt = readFileSync(rb, 'utf8');
  if (!/sitemap/i.test(txt)) warn('robots', 'robots.txt does not reference a sitemap');
}

async function main() {
  console.log(c.bold('\nMon Boum V3 — SEO validator'));
  console.log(c.dim(`dist: ${DIST}`));

  if (!existsSync(DIST)) {
    console.error(c.red(`\n✗ dist/ not found — run "npm run build" first.`));
    process.exit(2);
  }

  const files = await collectHtml(DIST);
  console.log(c.bold(c.cyan(`\n→ scanning ${files.length} HTML pages`)));
  for (const f of files) validateHtml(f);

  console.log(c.bold(c.cyan(`\n→ scanning sitemap + robots.txt`)));
  validateSitemap();
  validateRobots();

  console.log('');
  if (warnings.length) {
    console.log(c.bold(c.yellow(`Warnings (${warnings.length}):`)));
    for (const w of warnings) console.log('  ' + w);
  }
  if (errors.length) {
    console.log(c.bold(c.red(`\nErrors (${errors.length}):`)));
    for (const e of errors) console.log('  ' + e);
    console.log('');
    console.log(c.red(c.bold('FAILED — fix SEO errors above before deploying.')));
    process.exit(1);
  } else {
    console.log(c.green(c.bold('OK — every page has the required SEO + social tags.')));
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(c.red('\n[seo-validator] crashed:'), err);
  process.exit(2);
});

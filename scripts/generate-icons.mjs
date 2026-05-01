// ═══════════════════════════════════════════════════════════════
// generate-icons.mjs — produce square PWA icons from the brand logo.
//
// Run via:  npm run generate:icons
//
// Outputs (all into public/assets/icons/):
//   • icon-192.png            — Android home-screen, "any" purpose
//   • icon-512.png            — Android splash, "any" purpose
//   • icon-512-maskable.png   — Android adaptive (red bg, safe-zone padded)
//   • apple-touch-icon.png    — iOS home-screen (180x180)
//
// Source: public/assets/logos/logo-boum-2.png (the black "Mon Boum
// SINCE 2004" badge — already self-contained, near-square aspect).
//
// Strategy:
//   • "any" icons: pad the logo to square with the logo's own black bg.
//   • Maskable icon: composite the logo centered on a brand-red canvas,
//     scaled to ~60% so it fits inside the maskable safe zone (80% center).
// ═══════════════════════════════════════════════════════════════

import sharp from 'sharp';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'assets', 'logos', 'logo-boum-2.png');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'icons');

// Brand colors
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };
const BRAND_RED = { r: 225, g: 6, b: 0, alpha: 1 }; // #E10600

const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

/**
 * Generate a square icon by padding the source logo to a square
 * with the chosen background color.
 */
async function generateAny(size, name, background) {
  const out = path.join(OUT_DIR, name);
  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  ${c.green('✓')} ${name}  ${c.dim(`(${size}x${size})`)}`);
}

/**
 * Generate a maskable icon: brand-red square canvas with the logo
 * scaled to ~60% and centered, leaving a safe zone around it.
 */
async function generateMaskable(size, name) {
  const innerSize = Math.round(size * 0.60); // safe-zone interior
  const logo = await sharp(SRC)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }, // transparent so canvas red shows through edges
    })
    .png()
    .toBuffer();

  const out = path.join(OUT_DIR, name);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_RED,
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  ${c.green('✓')} ${name}  ${c.dim(`(${size}x${size}, maskable, brand-red bg)`)}`);
}

async function main() {
  console.log(c.bold(c.cyan('\nMon Boum V3 — PWA icon generator')));
  console.log(c.dim(`source: ${path.relative(ROOT, SRC)}`));
  console.log(c.dim(`out:    ${path.relative(ROOT, OUT_DIR)}\n`));

  await mkdir(OUT_DIR, { recursive: true });

  await generateAny(192, 'icon-192.png', BLACK);
  await generateAny(512, 'icon-512.png', BLACK);
  await generateMaskable(512, 'icon-512-maskable.png');
  await generateAny(180, 'apple-touch-icon.png', BLACK);

  console.log(c.green(c.bold('\nDone.')));
}

main().catch((err) => {
  console.error('[generate-icons] failed:', err);
  process.exit(1);
});

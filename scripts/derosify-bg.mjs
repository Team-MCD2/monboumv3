// ═══════════════════════════════════════════════════════════════
// derosify-bg.mjs — alpha-out near-white pixels on scraped PNGs.
//
// Phase B / boss feedback 2026-05-04 (see .project-store/decisions.md
// ADR-004). Scraped WordPress assets land on dark hero surfaces with
// baked-in white backgrounds — this script bakes alpha-transparency
// in their place, with an anti-alias fade band so logo edges stay
// crisp.
//
// Usage:
//   node scripts/derosify-bg.mjs
//     -> processes the locked TARGETS list (8 PNGs) using defaults
//   node scripts/derosify-bg.mjs --threshold 240 --feather 12
//     -> override defaults
//   node scripts/derosify-bg.mjs --trim welcome_image.png
//     -> alpha-out + crop transparent bounding box (removes baked
//        whitespace padding after alpha-out so CSS box-size matches
//        the visible content)
//   node scripts/derosify-bg.mjs path/to/file.png [more.png]
//     -> process arbitrary files
//
// Behaviour:
// - Backs up originals to public/assets/banners/_originals/<file>.png
//   (and other matching _originals/ siblings) BEFORE first overwrite.
// - Idempotent: re-running on an already-derosify'd file is a no-op
//   shape-wise (the alpha is already applied; pure-white pixels
//   become more transparent on each run, which converges to 0).
// - Preserves dimensions, channel count, and original color profile
//   beyond the alpha channel.
// ═══════════════════════════════════════════════════════════════
import { argv } from 'node:process';
import { mkdir, copyFile, access } from 'node:fs/promises';
import { dirname, basename, resolve, relative } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const BANNERS = resolve(ROOT, 'public/assets/banners');
const LOGOS = resolve(ROOT, 'public/assets/logos');

// Default target list (8 PNGs flagged by boss feedback 2026-05-04).
// Each entry is an absolute path. Originals are backed up to a sibling
// _originals/ folder under the same parent.
const TARGETS = [
  resolve(BANNERS, 'Boum-Burgers.png'),
  resolve(BANNERS, 'BOUM-Pizzs.png'),
  resolve(BANNERS, 'Boum-Chicken.png'),
  resolve(BANNERS, 'Boum-Saveurs.png'),
  resolve(BANNERS, 'BOUM-BURGER-SINCE.png'),
  resolve(BANNERS, 'Boum-Pizzs-1.png'),
  resolve(BANNERS, 'Boum-Chicken-1-1024x576.png'),
  resolve(BANNERS, 'welcome_image.png'),
];

// ─── arg parse ────────────────────────────────────────────────
const args = argv.slice(2);
const opts = { threshold: 243, feather: 12, all: false, trim: false, trimThreshold: 10 };
const filesFromCli = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--threshold') opts.threshold = Number(args[++i]);
  else if (a === '--feather') opts.feather = Number(args[++i]);
  else if (a === '--all') opts.all = true;
  else if (a === '--trim') opts.trim = true;
  else if (a === '--trim-threshold') opts.trimThreshold = Number(args[++i]);
  else if (a === '--help' || a === '-h') {
    console.log(`Usage: node scripts/derosify-bg.mjs [options] [files...]

Options:
  --threshold <n>       Brightness above which pixels begin fading out
                        (0-255, default 243).
  --feather <n>         Width of the anti-alias band in brightness units
                        (default 12). Larger = softer edge.
  --trim                After alpha-out, crop the output to its opaque
                        bounding box (sharp.trim()). Removes baked
                        whitespace padding so CSS box-size matches
                        the visible content. Default off.
  --trim-threshold <n>  Pixel-comparison tolerance for trim (0-255,
                        default 10). Lower = tighter crop.
  --all                 Process every PNG under public/assets/banners/
                        instead of the locked TARGETS list.
  -h, --help            Show this help.

Files: any number of explicit PNG paths (absolute or repo-relative).`);
    process.exit(0);
  } else filesFromCli.push(resolve(process.cwd(), a));
}

// ─── target resolution ────────────────────────────────────────
async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

let targets;
if (filesFromCli.length > 0) {
  targets = filesFromCli;
} else if (opts.all) {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(BANNERS);
  targets = entries
    .filter((n) => /\.png$/i.test(n))
    .map((n) => resolve(BANNERS, n));
} else {
  targets = TARGETS;
}

console.log(`derosify-bg: threshold=${opts.threshold} feather=${opts.feather} trim=${opts.trim} files=${targets.length}`);
console.log('');

// ─── core processor ───────────────────────────────────────────
async function processFile(filePath) {
  const rel = relative(ROOT, filePath);
  if (!(await exists(filePath))) {
    console.log(`  skip   ${rel} (not found)`);
    return { rel, status: 'skip-missing' };
  }

  // Backup original if we haven't yet.
  const backupDir = resolve(dirname(filePath), '_originals');
  const backupPath = resolve(backupDir, basename(filePath));
  if (!(await exists(backupPath))) {
    await mkdir(backupDir, { recursive: true });
    await copyFile(filePath, backupPath);
    console.log(`  backup ${relative(ROOT, backupPath)}`);
  }

  // Read raw RGBA pixels.
  const img = sharp(filePath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) {
    console.log(`  warn   ${rel} channels=${channels} (expected 4)`);
    return { rel, status: 'warn-channels' };
  }

  // For each pixel, compute average brightness. If above threshold,
  // fade alpha proportional to how far above threshold (0..feather)
  // until alpha hits 0 at threshold+feather brightness. This preserves
  // anti-aliased edges where text / logo strokes meet white space.
  const out = Buffer.from(data);
  let modified = 0;
  const upper = Math.min(255, opts.threshold + opts.feather);
  const span = Math.max(1, upper - opts.threshold);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const a = out[i + 3];
    if (a === 0) continue;
    const bright = (r + g + b) / 3;
    if (bright >= upper) {
      out[i + 3] = 0;
      modified++;
    } else if (bright > opts.threshold) {
      const fade = (bright - opts.threshold) / span; // 0..1
      out[i + 3] = Math.max(0, Math.round(a * (1 - fade)));
      modified++;
    }
  }

  let pipeline = sharp(out, { raw: { width, height, channels } });
  if (opts.trim) {
    // Trim to opaque bounding box. The threshold here is the RGBA
    // delta vs the top-left pixel (for fully-transparent bg, that's
    // 0,0,0,0 — so we pass the user's --trim-threshold directly).
    pipeline = pipeline.trim({ threshold: opts.trimThreshold });
  }
  const { data: outData, info: outInfo } = await pipeline
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer({ resolveWithObject: true });
  await (await import('node:fs/promises')).writeFile(filePath, outData);

  const pct = ((modified / (width * height)) * 100).toFixed(1);
  if (opts.trim && (outInfo.width !== width || outInfo.height !== height)) {
    console.log(
      `  ok     ${rel} ${width}x${height} -> ${outInfo.width}x${outInfo.height} (trim) · ${modified} px alpha-out (${pct}%)`
    );
  } else {
    console.log(`  ok     ${rel} ${width}x${height} -> ${modified} px alpha-out (${pct}%)`);
  }
  return { rel, status: 'ok', modified, pct };
}

// ─── run ──────────────────────────────────────────────────────
const summary = { ok: 0, skip: 0, warn: 0 };
for (const t of targets) {
  try {
    const r = await processFile(t);
    if (r.status === 'ok') summary.ok++;
    else if (r.status.startsWith('skip')) summary.skip++;
    else summary.warn++;
  } catch (err) {
    console.error(`  fail   ${relative(ROOT, t)}: ${err.message}`);
    summary.warn++;
  }
}

console.log('');
console.log(`derosify-bg: ${summary.ok} ok, ${summary.skip} skipped, ${summary.warn} warned/failed`);
if (summary.warn > 0) process.exit(1);

#!/usr/bin/env node
/**
 * scripts/tiktok-download.mjs
 *
 * Pipeline (ported from MarcheDeMoV2):
 * - Enumerate every video posted by @boumchickentoulouse
 * - Sort by view_count
 * - Download TOP_N most-viewed as MP4 to `public/assets/tiktoks/tiktok-<rank>.mp4`
 * - Write a summary JSON to `src/generated/tiktok-local.json`
 *
 * Usage:
 *   node scripts/tiktok-download.mjs            # default TOP_N=3
 *   node scripts/tiktok-download.mjs --top 5    # top 5 instead
 *   node scripts/tiktok-download.mjs --force    # re-download even if file exists
 *
 * Requirements:
 * - Python available on PATH
 * - yt-dlp installed (recommended: `python -m pip install -U yt-dlp`)
 *
 * Notes:
 * - This script is intended to download videos owned by/authorized by the client.
 */

import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'tiktoks');
const SUMMARY_FILE = path.join(ROOT, 'src', 'generated', 'tiktok-local.json');

const PROFILE_URL = 'https://www.tiktok.com/@boumchickentoulouse';

const args = process.argv.slice(2);
const topIdx = args.findIndex((a) => a === '--top');
const TOP_N = topIdx >= 0 ? Math.max(1, parseInt(args[topIdx + 1] ?? '3', 10)) : 3;
const FORCE = args.includes('--force');

function runCapture(cmd, cliArgs, { cwd = ROOT } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cliArgs, { cwd, shell: false });
    let stdout = '';
    let stderr = '';
    p.stdout.on('data', (d) => (stdout += d.toString()));
    p.stderr.on('data', (d) => (stderr += d.toString()));
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`${cmd} exited ${code}: ${stderr.slice(0, 400)}`));
    });
  });
}

function runTTY(cmd, cliArgs, { cwd = ROOT } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cliArgs, { cwd, shell: false, stdio: 'inherit' });
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function listProfile() {
  const stdout = await runCapture('python', [
    '-m',
    'yt_dlp',
    '--flat-playlist',
    '--dump-json',
    '--no-warnings',
    PROFILE_URL,
  ]);

  return stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((e) => e && e.id && e.url);
}

function pickTop(entries, n) {
  return entries
    .filter((e) => typeof e.view_count === 'number')
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, n);
}

async function downloadOne(entry, rank) {
  const out = path.join(OUT_DIR, `tiktok-${rank}.mp4`);
  const meta = path.join(OUT_DIR, `tiktok-${rank}.info.json`);

  if (!FORCE && (await fileExists(out))) {
    return { ok: true, out, meta, skipped: true };
  }

  await runTTY('python', [
    '-m',
    'yt_dlp',
    '--quiet',
    '--no-warnings',
    '--no-progress',
    '--format',
    'mp4',
    '--write-info-json',
    '--output',
    path.join(OUT_DIR, `tiktok-${rank}.%(ext)s`),
    entry.url,
  ]);

  return { ok: true, out, meta, skipped: false };
}

async function buildSummary(entries, results) {
  const items = [];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const r = results[i];
    if (!r?.ok) continue;

    let info = {};
    try {
      info = JSON.parse(await readFile(r.meta, 'utf8'));
    } catch {
      // ignore
    }

    items.push({
      rank: i + 1,
      id: e.id,
      url: e.url,
      view_count: e.view_count ?? null,
      title: (info.title ?? e.title ?? '').slice(0, 240),
      description: (info.description ?? '').slice(0, 400),
      duration: info.duration ?? null,
      width: info.width ?? null,
      height: info.height ?? null,
      src_local: `/assets/tiktoks/tiktok-${i + 1}.mp4`,
      fetched_at: new Date().toISOString(),
    });
  }

  const summary = { source: PROFILE_URL, top_n: TOP_N, items };
  await mkdir(path.dirname(SUMMARY_FILE), { recursive: true });
  await writeFile(SUMMARY_FILE, JSON.stringify(summary, null, 2) + '\n', 'utf8');
  return summary;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const all = await listProfile();
  const top = pickTop(all, TOP_N);

  const results = [];
  for (let i = 0; i < top.length; i++) {
    results.push(await downloadOne(top[i], i + 1));
  }

  const summary = await buildSummary(top, results);
  console.log(`[tiktok] done: ${summary.items.length}/${TOP_N} videos ready in public/assets/tiktoks`);
}

main().catch((err) => {
  console.error('[tiktok] failed:', err?.stack ?? err?.message ?? err);
  process.exit(1);
});

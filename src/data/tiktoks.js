// ═══════════════════════════════════════════════════════════════
// tiktoks.js — TikTok videos shown via TikTokFacade on home + /gallery
// Spec: plan/plan.md lines 431-434
// Account: @boumchickentoulouse
//
// Source of truth: src/generated/tiktok-local.json
//   • Auto-refreshed by `npm run sync:tiktok` (downloads top videos + writes JSON).
//   • Build-time JSON import via Vite — no runtime fetch.
//   • Manual `TITLE_OVERRIDES` lets the team curate clean copy without losing
//     the auto-sync benefit (raw TikTok titles often have emojis + ellipses).
//   • If JSON is empty/missing, FALLBACK_TIKTOKS keeps the home page from
//     breaking until the next sync.
// ═══════════════════════════════════════════════════════════════

import generated from '../generated/tiktok-local.json' with { type: 'json' };

/**
 * @typedef {Object} TikTok
 * @property {string} src - Local mp4 path under /public
 * @property {string} title - French caption / display label
 * @property {string} account - TikTok handle (without @)
 * @property {string} [url] - Optional public TikTok URL
 */

export const TIKTOK_ACCOUNT = 'boumchickentoulouse';

/** Hand-curated titles — keys are TikTok video ids. */
const TITLE_OVERRIDES = {
  '7498011452289092886': 'Les naans kebab à tester absolument à Toulouse !',
  '7493925705890270486': 'La pizza géante qui régale Toulouse !',
  '7489473159838698774': "BOUM SAVEURS — La box du peuple à moins de 10€",
};

/** Strip leading emoji clusters and trailing ellipses/whitespace. */
const cleanTitle = (raw) => {
  if (!raw) return '';
  return raw
    .replace(/^[\p{Extended_Pictographic}\s]+/u, '')
    .replace(/[…\.\s]+$/u, '')
    .trim();
};

/** Used only if the generated JSON is empty (e.g. first clone before sync). */
const FALLBACK_TIKTOKS = [
  {
    src: '/assets/tiktoks/tiktok-1.mp4',
    title: 'Les naans kebab à tester absolument à Toulouse !',
    account: TIKTOK_ACCOUNT,
  },
  {
    src: '/assets/tiktoks/tiktok-2.mp4',
    title: 'La pizza géante qui régale Toulouse !',
    account: TIKTOK_ACCOUNT,
  },
  {
    src: '/assets/tiktoks/tiktok-3.mp4',
    title: "BOUM SAVEURS — La box du peuple à moins de 10€",
    account: TIKTOK_ACCOUNT,
  },
];

const fromGenerated = (generated?.items || [])
  .filter((item) => item && item.src_local)
  .map((item) => ({
    src: item.src_local,
    title: TITLE_OVERRIDES[item.id] || cleanTitle(item.title),
    account: TIKTOK_ACCOUNT,
    url: item.url,
  }));

/** @type {TikTok[]} */
export const TIKTOKS = fromGenerated.length > 0 ? fromGenerated : FALLBACK_TIKTOKS;

/** Optional external TikTok URL for attribution / fallback */
export const tiktokUrl = (entry) => entry.url || `https://www.tiktok.com/@${entry.account}`;

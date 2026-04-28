// ═══════════════════════════════════════════════════════════════
// tiktoks.js — TikTok videos shown via TikTokFacade on home + /gallery
// Spec: plan/plan.md lines 431-434
// Account: @boumchickentoulouse
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} TikTok
 * @property {string} src - Local mp4 path under /public
 * @property {string} title - French caption / display label
 * @property {string} account - TikTok handle (without @)
 * @property {string} [url] - Optional public TikTok URL
 */

export const TIKTOK_ACCOUNT = 'boumchickentoulouse';

/** @type {TikTok[]} */
export const TIKTOKS = [
  {
    src: '/assets/tiktoks/tiktok-1.mp4',
    title: 'Les naans kebab à tester absolument à Toulouse !',
    account: TIKTOK_ACCOUNT,
    url: 'https://www.tiktok.com/@boumchickentoulouse/video/7498011452289092886',
  },
  {
    src: '/assets/tiktoks/tiktok-2.mp4',
    title: 'La pizza géante qui régale Toulouse !',
    account: TIKTOK_ACCOUNT,
    url: 'https://www.tiktok.com/@boumchickentoulouse/video/7493925705890270486',
  },
  {
    src: '/assets/tiktoks/tiktok-3.mp4',
    title: 'BOUM SAVEURS — La box du peuple à moins de 10€',
    account: TIKTOK_ACCOUNT,
    url: 'https://www.tiktok.com/@boumchickentoulouse/video/7489473159838698774',
  },
];

/** Optional external TikTok URL for attribution / fallback */
export const tiktokUrl = (entry) => entry.url || `https://www.tiktok.com/@${entry.account}`;

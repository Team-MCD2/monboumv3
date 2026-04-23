// ═══════════════════════════════════════════════════════════════
// tiktoks.js — TikTok videos shown via TikTokFacade on home + /gallery
// Spec: plan/plan.md lines 431-434
// Account: @boumchickentoulouse
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} TikTok
 * @property {string} id - TikTok video numeric ID
 * @property {string} title - French caption / display label
 * @property {string} account - TikTok handle (without @)
 */

export const TIKTOK_ACCOUNT = 'boumchickentoulouse';

/** @type {TikTok[]} */
export const TIKTOKS = [
  {
    id: '7486895339417554198',
    title: '2 menus pour 10€',
    account: TIKTOK_ACCOUNT,
  },
  {
    id: '7499871229025750294',
    title: 'Boum Saveurs — box gourmande',
    account: TIKTOK_ACCOUNT,
  },
  {
    id: '7486151470081903894',
    title: 'Boum Saveurs — kebab maison',
    account: TIKTOK_ACCOUNT,
  },
];

/** Build the public TikTok URL for an entry (used for oEmbed + accessibility) */
export const tiktokUrl = (entry) =>
  `https://www.tiktok.com/@${entry.account}/video/${entry.id}`;

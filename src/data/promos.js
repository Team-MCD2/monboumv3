// ═══════════════════════════════════════════════════════════════
// promos.js — Deliveroo offer images for the home PromoScroller
// Spec: plan/plan.md lines 383-390
// Pass B TODO: download the 5 promo images into /public/assets/promos/
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} Promo
 * @property {string} id
 * @property {string} title - French display label (no price per rule #08)
 * @property {string} image - Filename under /assets/promos/
 * @property {string} url - External order link (Deliveroo)
 * @property {string} alt - Alt text for a11y
 */

const DELIVEROO = 'https://monboum.commande.deliveroo.fr/fr/';

/** @type {Promo[]} */
export const PROMOS = [
  {
    id: 'boum-family',
    title: 'Boum Family',
    image: 'Boum-Family-offre-1.jpg',
    url: DELIVEROO,
    alt: "Offre Boum Family — livraison Deliveroo",
  },
  {
    id: 'geante-offert',
    title: 'Géante offerte',
    image: 'Geante-offert.jpg',
    url: DELIVEROO,
    alt: "Offre Géante offerte — livraison Deliveroo",
  },
  {
    id: 'milkshake-offert',
    title: 'Milkshake offert',
    image: 'Milkshake-offert.jpg',
    url: DELIVEROO,
    alt: "Offre Milkshake offert — livraison Deliveroo",
  },
  {
    id: 'mon-boum',
    title: 'Mon Boum',
    image: 'Mon-boumm.jpg',
    url: DELIVEROO,
    alt: "Offre Mon Boum — livraison Deliveroo",
  },
  {
    id: 'tacos-offert',
    title: 'Tacos offert',
    image: 'TACOS-offert-1.jpg',
    url: DELIVEROO,
    alt: "Offre Tacos offert — livraison Deliveroo",
  },
];

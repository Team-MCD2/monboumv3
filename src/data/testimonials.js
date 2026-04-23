// ═══════════════════════════════════════════════════════════════
// testimonials.js — celebrity testimonials scraped from monboum.fr home
// Spec: plan/plan.md lines 353-368
//
// GROUND TRUTH established 2026-04-23 (Pass B raw HTML scrape):
// - plan.md and synthesis.md both said "12 testimonials". REALITY is 11.
// - All 11 slides have both a photo AND a quote (NO empty quotes).
// - Designations from monboum.fr ("Artiste/Rappeur", "Chanteur", etc.) —
//   kept verbatim in French, using slash as original site does.
// - All 11 photos downloaded to /public/assets/testimonials/ via Pass B.
// - Every quote, name, and designation below is VERBATIM from the live site.
//
// Used by: home `<TestimonialsSlider client:visible />`
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} Testimonial
 * @property {number} id
 * @property {string} name - Display name (verbatim from monboum.fr)
 * @property {string} designation - Role label as on monboum.fr ("Artiste/Rappeur" etc.)
 * @property {string} quote - Direct French quote (verbatim, with emoji)
 * @property {string} photo - Local path under /assets/testimonials/
 */

/** @type {Testimonial[]} */
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ninho',
    designation: 'Artiste/Rappeur',
    quote: "Boum Burger, c'était lourd !!! Je recommande, Toulouse. On est ensemble 😉",
    photo: '/assets/testimonials/Ninho.jpg',
  },
  {
    id: 2,
    name: 'Dadju',
    designation: 'Artiste/Chanteur',
    quote: "Un accueil et un repas au top. Merci Boum Burger 🙂",
    photo: '/assets/testimonials/Dadju.jpg',
  },
  {
    id: 3,
    name: 'Oli (Big Flo & Oli)',
    designation: 'Artiste/Chanteur',
    quote: "Boum Burger, on est ensemble la famille 😉",
    photo: '/assets/testimonials/Oli.jpg',
  },
  {
    id: 4,
    name: 'Vegedream',
    designation: 'Artiste/Chanteur',
    quote: "Merci pour l'accueil, la graille était formidable, on est ensemble comme jamais !",
    photo: '/assets/testimonials/Vegedream.jpg',
  },
  {
    id: 5,
    name: 'Koba LaD',
    designation: 'Chanteur',
    quote: "En direct de Toulouse. Grosse CE-FOR à Boum Burger !!! Que de la patate, des supers pizza, c'est eux qui me nourrissent mon reuf !!!",
    photo: '/assets/testimonials/Koba-LaD.jpg',
  },
  {
    id: 6,
    name: "L'Algerino",
    designation: 'Artiste/Chanteur',
    quote: "Une équipe au top et des burgers de malade ! On est ensemble ;",
    photo: '/assets/testimonials/Algerino.jpg',
  },
  {
    id: 7,
    name: 'Marwa Loud',
    designation: 'Artiste/Chanteuse',
    quote: "C'était super, gros big up à la Boum Team 🙂",
    photo: '/assets/testimonials/Marwa.jpg',
  },
  {
    id: 8,
    name: 'Tayc',
    designation: 'Artiste/Chanteur',
    quote: "Merci la famille, on est ensemble !",
    photo: '/assets/testimonials/Tayc.jpg',
  },
  {
    id: 9,
    name: 'Chily',
    designation: 'Chanteur',
    quote: "Maximum de force à la team Boum 🙂",
    photo: '/assets/testimonials/Chily.jpg',
  },
  {
    id: 10,
    name: 'Mario (Emile et Image)',
    designation: 'Chanteur/Musicien',
    quote: "Un super moment, un délice ! Merci Boum 😉",
    photo: '/assets/testimonials/Mario.jpg',
  },
  {
    id: 11,
    name: 'Landy',
    designation: 'Artiste/Rappeur',
    quote: "En direct de Toulouse, j'ai mangé franchement c'était lourd !!! N'hésitez pas à venir ici, c'est un beau resto 😉",
    photo: '/assets/testimonials/Landy.png',
  },
];

export const TOTAL_TESTIMONIALS = TESTIMONIALS.length; // 11

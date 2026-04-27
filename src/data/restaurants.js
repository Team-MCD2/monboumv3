// ═══════════════════════════════════════════════════════════════
// restaurants.js — single source of truth for all 10 Mon Boum locations
// Spec: plan/plan.md lines 569-581
// Used by: /nos-restaurants, /boum-{burger,pizzs,chicken,saveurs}, Leaflet map
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} Restaurant
 * @property {string} id - Unique slug (enseigne-quartier)
 * @property {'boum-burger'|'boum-pizzs'|'boum-chicken'|'boum-saveurs'} enseigne
 * @property {string} nom - Quartier / neighbourhood name
 * @property {string} adresse - Street address
 * @property {string} cp - Postal code
 * @property {string} ville - City
 * @property {string} [tel] - Phone (formatted)
 * @property {boolean} [drive] - Whether drive-through is available
 * @property {string} [horaires] - Opening hours if specified
 * @property {string} [note] - Disambiguation note (e.g., limited menu)
 * @property {[number, number]} coords - [latitude, longitude]
 */

/** @type {Restaurant[]} */
export const RESTAURANTS = [
  // ── Boum Burger — 4 adresses ─────────────────────────────────
  {
    id: 'boum-burger-pradettes',
    enseigne: 'boum-burger',
    nom: 'Pradettes',
    adresse: '220 route de Saint Simon',
    cp: '31100',
    ville: 'Toulouse',
    tel: '05 61 40 77 73',
    drive: true,
    coords: [43.5607, 1.4012],
  },
  {
    id: 'boum-burger-aucamville',
    enseigne: 'boum-burger',
    nom: 'Aucamville',
    adresse: '327 Avenue des Etats-Unis',
    cp: '31200',
    ville: 'Toulouse',
    tel: '05 61 41 74 17',
    drive: true,
    coords: [43.6602, 1.4339],
  },
  {
    id: 'boum-burger-colomiers',
    enseigne: 'boum-burger',
    nom: 'Colomiers',
    adresse: '4 Avenue Edouard Serres',
    cp: '31770',
    ville: 'Colomiers',
    tel: '05 34 64 04 04',
    drive: true,
    coords: [43.6115, 1.3364],
  },
  {
    id: 'boum-burger-mermoz',
    enseigne: 'boum-burger',
    nom: 'Mermoz',
    adresse: '168 rue Henri Desbals',
    cp: '31100',
    ville: 'Toulouse',
    tel: '05 61 51 25 12',
    drive: false,
    coords: [43.5772, 1.4095],
  },

  // ── Boum Pizz's — 4 adresses ─────────────────────────────────
  {
    id: 'boum-pizzs-pradettes',
    enseigne: 'boum-pizzs',
    nom: 'Pradettes',
    adresse: '220 route de Saint Simon',
    cp: '31100',
    ville: 'Toulouse',
    tel: '05 61 41 81 18',
    note: "La Soso et la Tunisienne ne sont pas disponibles ici.",
    coords: [43.5607, 1.4012],
  },
  {
    id: 'boum-pizzs-bellefontaine',
    enseigne: 'boum-pizzs',
    nom: 'Bellefontaine',
    adresse: '69 allée de Bellefontaine',
    cp: '31100',
    ville: 'Toulouse',
    tel: '05 61 41 61 61',
    note: 'Pizzas & Tacos disponibles.',
    coords: [43.5630, 1.3970],
  },
  {
    id: 'boum-pizzs-aucamville',
    enseigne: 'boum-pizzs',
    nom: 'Aucamville',
    adresse: '327 Avenue des Etats-Unis',
    cp: '31200',
    ville: 'Toulouse',
    tel: '05 61 41 74 17',
    coords: [43.6602, 1.4339],
  },
  {
    id: 'boum-pizzs-rangueil',
    enseigne: 'boum-pizzs',
    nom: 'Rangueil',
    adresse: '235 route de Narbonne',
    cp: '31400',
    ville: 'Toulouse',
    note: 'Pizzas & Tacos — Krousty',
    coords: [43.5539, 1.4704],
  },

  // ── Boum Chicken — 1 adresse ─────────────────────────────────
  {
    id: 'boum-chicken-vauquelin',
    enseigne: 'boum-chicken',
    nom: 'Vauquelin',
    adresse: '152 rue Nicolas Louis Vauquelin',
    cp: '31100',
    ville: 'Toulouse',
    tel: '05 34 46 18 38',
    drive: true,
    horaires: "7j/7 · 11h–23h · ven/sam jusqu'à 1h45",
    coords: [43.5898, 1.4421],
  },

  // ── Boum Saveurs — 1 adresse ─────────────────────────────────
  {
    id: 'boum-saveurs-mermoz',
    enseigne: 'boum-saveurs',
    nom: 'Mermoz',
    adresse: '191 rue Henri Desbals',
    cp: '31100',
    ville: 'Toulouse',
    coords: [43.5768, 1.4098],
  },
];

// ── Lookups ─────────────────────────────────────────────────────
export const ENSEIGNES = {
  'boum-burger': {
    slug: 'boum-burger',
    nom: 'Boum Burger',
    label: 'Burger Halal',
    path: '/boum-burger',
    color: '#E10600',
  },
  'boum-pizzs': {
    slug: 'boum-pizzs',
    nom: "Boum Pizz's",
    label: 'Pizza & Tacos',
    path: '/boum-pizzs',
    color: '#FF6A00',
  },
  'boum-chicken': {
    slug: 'boum-chicken',
    nom: 'Boum Chicken',
    label: 'Poulet Halal · 7j/7',
    path: '/boum-chicken',
    color: '#FFB800',
  },
  'boum-saveurs': {
    slug: 'boum-saveurs',
    nom: 'Boum Saveurs',
    label: 'Kebab & Naans',
    path: '/boum-saveurs',
    color: '#2E7D32',
  },
};

/** Filter helpers */
export const byEnseigne = (slug) => RESTAURANTS.filter((r) => r.enseigne === slug);
export const getRestaurant = (id) => RESTAURANTS.find((r) => r.id === id);

/** Total count for copy harmonization (issue 2.15) */
export const TOTAL_RESTAURANTS = RESTAURANTS.length; // 10

// ═══════════════════════════════════════════════════════════════
// JSON-LD SCHEMA HELPERS (for local SEO rich-results eligibility)
// ═══════════════════════════════════════════════════════════════

/** Convert '05 61 40 77 73' → '+33561407773' for schema.org compliance */
const toE164 = (tel) => (tel ? `+33${tel.replace(/\s/g, '').replace(/^0/, '')}` : undefined);

/**
 * Build a FastFoodRestaurant schema entry for one location.
 * Reference: https://schema.org/FastFoodRestaurant
 */
export const buildRestaurantSchema = (r, siteUrl = 'https://mon-boum.vercel.app') => {
  const enseigne = ENSEIGNES[r.enseigne];
  return {
    '@type': 'FastFoodRestaurant',
    '@id': `${siteUrl}${enseigne.path}#${r.id}`,
    name: `${enseigne.nom} ${r.nom}`,
    image: `${siteUrl}/assets/logos/Boums.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.adresse,
      postalCode: r.cp,
      addressLocality: r.ville,
      addressRegion: 'Occitanie',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: r.coords[0],
      longitude: r.coords[1],
    },
    ...(r.tel && { telephone: toE164(r.tel) }),
    url: `${siteUrl}${enseigne.path}`,
    priceRange: '€',
    servesCuisine: 'Halal',
    acceptsReservations: false,
    ...(r.horaires && { openingHours: r.horaires }),
  };
};

/**
 * Build a full @graph schema block for a given enseigne's locations.
 * Use this as the `schema` prop on each /boum-* page.
 */
export const buildEnseigneGraph = (enseigneSlug, siteUrl) => ({
  '@context': 'https://schema.org',
  '@graph': byEnseigne(enseigneSlug).map((r) => buildRestaurantSchema(r, siteUrl)),
});

/**
 * Build a full @graph schema block for ALL 10 locations (used on /nos-restaurants).
 */
export const buildAllRestaurantsGraph = (siteUrl) => ({
  '@context': 'https://schema.org',
  '@graph': RESTAURANTS.map((r) => buildRestaurantSchema(r, siteUrl)),
});

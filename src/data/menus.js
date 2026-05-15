// ═══════════════════════════════════════════════════════════════
// menus.js — per-enseigne carte data (Phase C, boss feedback 2026-05-04)
//
// Each entry has:
//   - boards : full menu-screen images (1024x576 source, captured
//              from the in-restaurant menu boards). Clickable
//              lightbox in CarteSection.astro.
//   - items  : curated highlight cards (named product + photo +
//              short tagline). Subset of the full carte.
//   - note   : optional caption rendered below the grid.
//
// Seeded 2026-05-04 from monboum.fr WP-REST Pass C scrape. See
// .project-store/decisions.md ADR-005 (menu source) + ADR-006
// (product photo source) + ADR-007 (carte = clickable image, not
// full e-com).
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} MenuBoard
 * @property {string} src       — public path (`/assets/menus/...`)
 * @property {string} alt       — alt text for a11y + lightbox caption
 * @property {string} category  — section label shown above the board
 */

/**
 * @typedef {Object} MenuItem
 * @property {string} id          — kebab-case stable id
 * @property {string} name        — display name (FR)
 * @property {string} description — 1-line tagline (FR)
 * @property {string} image       — public path to the dish photo
 * @property {string} category    — same vocabulary as boards[]
 */

/**
 * @typedef {Object} MenuData
 * @property {string}      enseigne — display name
 * @property {MenuBoard[]} boards
 * @property {MenuItem[]}  items
 * @property {string=}     note     — optional caption / placeholder
 */

/** @type {Record<string, MenuData>} */
export const MENUS = {
  'boum-burger': {
    enseigne: 'Boum Burger',
    boards: [
      {
        src: '/assets/menus/boum-burger-burgers.jpg',
        alt: 'Carte Boum Burger — Burgers',
        category: 'Burgers',
      },
      {
        src: '/assets/menus/boum-burger-tacos.jpg',
        alt: 'Carte Boum Burger — Tacos & Bucket',
        category: 'Tacos & Bucket',
      },
      {
        src: '/assets/menus/boum-burger-assiettes.jpg',
        alt: 'Carte Boum Burger — Assiettes & Boissons',
        category: 'Assiettes',
      },
      {
        src: '/assets/menus/boum-burger-desserts.jpg',
        alt: 'Carte Boum Burger — Desserts',
        category: 'Desserts',
      },
    ],
    items: [
      {
        id: 'wall-street',
        name: 'Wall Street',
        description: 'Le burger signature qui a tout déclenché.',
        image: '/assets/products/burger-wallstreet.jpg',
        category: 'Burgers',
      },
      {
        id: 'brooklyn',
        name: 'Brooklyn',
        description: "L'option veggie qui fait l'unanimité.",
        image: '/assets/products/burger-brooklyn.jpg',
        category: 'Burgers',
      },
      {
        id: '5eme-avenue',
        name: '5ème Avenue',
        description: 'Avenue gourmande direct dans ton sandwich.',
        image: '/assets/products/burger-5eme-avenue.jpg',
        category: 'Burgers',
      },
      {
        id: 'peppertoast',
        name: 'Peppertoast',
        description: 'Du poivre, du fondant, du caractère.',
        image: '/assets/products/burger-peppertoast.jpg',
        category: 'Burgers',
      },
      {
        id: 'new-jersey',
        name: 'New Jersey',
        description: 'Le double-galette qui en redemande.',
        image: '/assets/products/burger-new-jersey.jpg',
        category: 'Burgers',
      },
      {
        id: 'tacos-xxl',
        name: 'Tacos XXL',
        description: 'Le tacos qui te cale jusqu’à demain.',
        image: '/assets/products/boum-burger-tacos-product.jpg',
        category: 'Tacos',
      },
    ],
  },

  'boum-pizzs': {
    enseigne: "Boum Pizz's",
    boards: [
      {
        src: '/assets/menus/boum-pizzs-carte.png',
        alt: "Carte Boum Pizz's — édition 2024",
        category: 'Carte 2024',
      },
    ],
    items: [
      {
        id: 'pizza-signature',
        name: 'Pizza Signature',
        description: 'Pâte artisanale, garniture généreuse, mozzarella fil-fil.',
        image: '/assets/products/boum-pizza-bb.jpg',
        category: 'Pizzas',
      },
    ],
    note: 'Voir la carte ci-dessus pour la sélection complète : pizzas Senior, Junior, Soso et Tunisienne. La Soso et la Tunisienne ne sont pas disponibles à la Pradette.',
  },

  'boum-chicken': {
    enseigne: 'Boum Chicken',
    boards: [
      {
        src: '/assets/menus/boum-chicken-burgers.jpg',
        alt: 'Carte Boum Chicken — Burgers',
        category: 'Burgers',
      },
      {
        src: '/assets/menus/boum-chicken-buckets.jpg',
        alt: 'Carte Boum Chicken — Buckets',
        category: 'Buckets',
      },
      {
        src: '/assets/menus/boum-chicken-bowls.jpg',
        alt: 'Carte Boum Chicken — Bowls',
        category: 'Bowls',
      },
      {
        src: '/assets/menus/boum-chicken-menu-enfant.jpg',
        alt: 'Carte Boum Chicken — Menu Enfant',
        category: 'Menu Enfant',
      },
    ],
    items: [
      {
        id: 'bucket',
        name: 'Le Bucket',
        description: 'Le poulet à partager — partage non garanti.',
        image: '/assets/products/boum-chicken-bucket.jpg',
        category: 'Buckets',
      },
      {
        id: 'chicken-burger',
        name: 'Chicken Burger',
        description: 'Galette de poulet croustillante, sauce maison.',
        image: '/assets/products/boum-chicken-burger.jpg',
        category: 'Burgers',
      },
      {
        id: 'rice-bowl',
        name: 'Rice Bowl',
        description: 'Riz sauté, poulet mariné, légumes croquants.',
        image: '/assets/products/boum-chicken-bowl.jpg',
        category: 'Bowls',
      },
    ],
  },

  'boum-saveurs': {
    enseigne: 'Boum Saveurs',
    boards: [],
    items: [],
    note: 'La carte Boum Saveurs (kebab et naans halal) sera bientôt disponible en ligne. En attendant, retrouvez-nous sur Deliveroo pour passer commande directement.',
  },
};

/**
 * Return the menu entry for a given enseigne slug, or null if absent.
 * @param {string} slug
 * @returns {MenuData|null}
 */
export function getMenu(slug) {
  return MENUS[slug] ?? null;
}

// ═══════════════════════════════════════════════════════════════
// HeroRotator — slide-aware 3-slide rotation (issue 2.20)
// Spec: plan/plan.md lines 263-304 + cascade-plan.md issue 2.20
//
// Each rotation cross-fades BOTH lines of the H1 AND the product image.
// Respects prefers-reduced-motion: if reduce, shows slide 0 only, static.
// ═══════════════════════════════════════════════════════════════
import { useEffect, useState, useRef } from 'react';
import ErrorBoundary from './_ErrorBoundary.jsx';

// wrapperClass : per-slide size + rotation overrides.
// Commandez.png is a 1263×2578 portrait phone mockup — left at its natural
// scale it dominates the layout. We size it down + tilt it slightly so it
// reads as a decorative side element, not a billboard.
const SLIDES = [
  {
    eyebrow: 'Mon Boum · Toulouse · Halal',
    line1: 'LE MEILLEUR DU STREET-FOOD',
    line2: 'HALAL.',
    image: '/assets/banners/slider_image2.png',
    imageAlt: 'Pile de burgers Mon Boum',
    wrapperClass: 'max-w-md lg:max-w-lg',
  },
  {
    eyebrow: 'Livré 7j/7 · Toulouse + agglo',
    line1: 'LIVRAISON EN 30 MIN',
    line2: 'À TOULOUSE.',
    image: '/assets/banners/Commandez.png',
    imageAlt: 'Livraison Mon Boum — scooter',
    wrapperClass:
      'max-w-[240px] md:max-w-[280px] lg:max-w-[320px] rotate-[4deg]',
  },
  {
    eyebrow: 'Depuis 2004 · 10 restaurants',
    line1: '1er DRIVE HALAL',
    line2: 'DE FRANCE.',
    image: '/assets/products/boum-drive-lifestyle.jpg',
    imageAlt: 'Drive Mon Boum — 1er drive halal de France depuis 2004',
    wrapperClass: 'max-w-md lg:max-w-xl',
  },
];

const ROTATION_MS = 7000;

// ── Fallback shown if the rotator throws at runtime ────────────
function HeroFallback() {
  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      <p className="font-body text-xs text-rouge uppercase tracking-[0.3em] mb-4">
        Mon Boum · Toulouse · Halal
      </p>
      <h1 className="font-display text-white uppercase leading-[0.9] text-5xl md:text-7xl lg:text-8xl">
        LE MEILLEUR DU STREET-FOOD
        <br />
        <span className="text-rouge">HALAL.</span>
      </h1>
      <div className="mt-8">
        <a
          href="https://monboum.commande.deliveroo.fr/fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-rouge text-white font-display uppercase text-base px-8 py-4 arrow-cta pulse-rouge"
        >
          Commander
          <span data-arrow aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

function HeroRotatorImpl() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef(null);

  // Detect reduced-motion preference on mount and listen for changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Auto-rotate (only if motion allowed)
  useEffect(() => {
    if (reduced) return; // pin to slide 0

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, ROTATION_MS);

    return () => clearInterval(timerRef.current);
  }, [reduced]);

  const current = reduced ? SLIDES[0] : SLIDES[index];
  const transitionStyle = reduced
    ? {}
    : { transition: 'opacity 0.6s ease-in-out' };

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 lg:gap-0">
      {/* ─── Text column ────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {/* Eyebrow cross-fades with the slide */}
        <div key={`eyebrow-${index}`} style={transitionStyle}>
          <p className="rise-1 font-body text-xs md:text-sm text-rouge uppercase tracking-[0.3em] mb-4">
            {current.eyebrow}
          </p>
        </div>

        {/* Key triggers React to re-mount → cross-fade */}
        <div key={`text-${index}`} style={transitionStyle}>
          <h1
            className="rise-2 font-display text-white uppercase leading-[0.9] text-5xl md:text-7xl lg:text-8xl"
            aria-live="polite"
          >
            {current.line1}
            <br />
            <span className="text-rouge">{current.line2}</span>
          </h1>
        </div>

        <div className="rise-3 mt-8 flex flex-wrap gap-4">
          <a
            href="https://monboum.commande.deliveroo.fr/fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-rouge text-white font-display uppercase text-base px-8 py-4 hover:bg-white hover:text-noir transition-colors arrow-cta pulse-rouge"
          >
            Commander
            <span data-arrow aria-hidden="true">→</span>
          </a>
          <a
            href="/nos-restaurants"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-display uppercase text-base px-8 py-4 hover:bg-white hover:text-noir transition-colors arrow-cta"
          >
            Nos Restaurants
            <span data-arrow aria-hidden="true">→</span>
          </a>
        </div>

        {/* Pagination dots (hidden if reduced-motion) */}
        {!reduced && (
          <div className="rise-4 mt-12 flex gap-2" role="tablist" aria-label="Slides">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 transition-all ${
                  i === index ? 'w-12 bg-rouge' : 'w-6 bg-white/30 hover:bg-white/60'
                }`}
                role="tab"
                aria-selected={i === index}
                aria-label={`Aller à la slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Image column — fixed track height; per-slide wrapper sizes ─── */}
      {/* Wrapper is keyed by index → cross-fade + per-slide max-w + rotate. */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full lg:w-auto h-64 md:h-96 lg:h-full max-h-[55vh] lg:max-h-[60vh]">
        <div
          key={`img-${index}`}
          className={`${current.wrapperClass} float-anim`}
          style={transitionStyle}
        >
          <img
            src={current.image}
            alt={current.imageAlt}
            className="w-full h-auto max-h-[55vh] lg:max-h-[60vh] object-contain"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}

export default function HeroRotator() {
  const fallback = <HeroFallback />;
  return (
    <ErrorBoundary fallback={fallback}>
      <HeroRotatorImpl />
    </ErrorBoundary>
  );
}

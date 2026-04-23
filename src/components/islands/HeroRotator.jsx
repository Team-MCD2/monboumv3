// ═══════════════════════════════════════════════════════════════
// HeroRotator — slide-aware 3-slide rotation (issue 2.20)
// Spec: plan/plan.md lines 263-304 + cascade-plan.md issue 2.20
//
// Each rotation cross-fades BOTH lines of the H1 AND the product image.
// Respects prefers-reduced-motion: if reduce, shows slide 0 only, static.
// ═══════════════════════════════════════════════════════════════
import { useEffect, useState, useRef } from 'react';

const SLIDES = [
  {
    line1: 'LE MEILLEUR DU STREET-FOOD',
    line2: 'HALAL.',
    image: '/assets/banners/slider_image2.png',
    imageAlt: 'Pile de burgers Mon Boum',
  },
  {
    line1: 'LIVRAISON EN 30 MIN',
    line2: 'À TOULOUSE.',
    image: '/assets/banners/Commandez.png',
    imageAlt: 'Livraison Mon Boum — scooter',
  },
  {
    line1: '10 RESTAURANTS',
    line2: 'DEPUIS 2004.',
    image: null, // no product image — shapes only
    imageAlt: '',
  },
];

const ROTATION_MS = 5000;

export default function HeroRotator() {
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
      {/* ─── Text column ───────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <p className="rise-1 font-body text-xs md:text-sm text-rouge uppercase tracking-[0.3em] mb-4">
          Mon Boum · Toulouse · Halal
        </p>

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
            className="bg-rouge text-white font-display uppercase text-base px-8 py-4 hover:bg-white hover:text-noir transition-colors"
          >
            Commander
          </a>
          <a
            href="/nos-restaurants"
            className="border border-white/30 text-white font-display uppercase text-base px-8 py-4 hover:bg-white hover:text-noir transition-colors"
          >
            Nos Restaurants
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

      {/* ─── Image column ──────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full lg:w-auto h-64 md:h-96 lg:h-auto">
        {current.image ? (
          <img
            key={`img-${index}`}
            src={current.image}
            alt={current.imageAlt}
            className="max-h-full w-auto object-contain float-anim"
            style={transitionStyle}
            loading="eager"
            decoding="async"
          />
        ) : (
          // Slide 3 — no product image, render decorative shapes only
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <img
              src="/assets/shapes/shape1-min.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain spin-slow opacity-30"
            />
            <img
              src="/assets/shapes/shape2-min.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain float-anim opacity-40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

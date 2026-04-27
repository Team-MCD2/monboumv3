// ═══════════════════════════════════════════════════════════════
// PromoScroller — infinite horizontal scroll of 5 Deliveroo offer cards
// Spec: plan/plan.md lines 383-390; rule #08: NO price display
// Reduced-motion: static grid instead of scroll
// ═══════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import ErrorBoundary from './_ErrorBoundary.jsx';
import { PROMOS } from '../../data/promos.js';

const SPEED_PX_PER_FRAME = 0.5; // ~30px/s at 60fps

// ── Fallback: static responsive grid (same as reduced-motion) ───
function PromosFallback() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {PROMOS.map((promo) => (
        <a
          key={promo.id}
          href={promo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-lg"
          aria-label={promo.alt}
        >
          <img
            src={`/assets/promos/${promo.image}`}
            alt={promo.alt}
            className="w-full h-32 sm:h-36 md:h-40 object-cover"
            loading="lazy"
            decoding="async"
          />
        </a>
      ))}
    </div>
  );
}

function PromoScrollerImpl() {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const offsetRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced || paused) return;

    const track = trackRef.current;
    if (!track) return;

    // Track's child content is duplicated — scroll width / 2 is one loop
    const loopWidth = track.scrollWidth / 2;

    const tick = () => {
      offsetRef.current += SPEED_PX_PER_FRAME;
      if (offsetRef.current >= loopWidth) offsetRef.current = 0;
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, paused]);

  // ── Reduced-motion fallback: static responsive grid ─────────
  if (reduced) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {PROMOS.map((promo) => (
          <a
            key={promo.id}
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg"
            aria-label={promo.alt}
          >
            <img
              src={`/assets/promos/${promo.image}`}
              alt={promo.alt}
              className="w-full h-32 sm:h-36 md:h-40 object-cover"
              loading="lazy"
              decoding="async"
            />
          </a>
        ))}
      </div>
    );
  }

  // ── Full scroller: 2× duplicated track for seamless loop ────
  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Défilement des offres Deliveroo"
    >
      <div ref={trackRef} className="flex gap-6 w-max will-change-transform">
        {[...PROMOS, ...PROMOS].map((promo, i) => (
          <a
            key={`${promo.id}-${i}`}
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 md:w-80 block img-zoom rounded-lg overflow-hidden"
            aria-label={promo.alt}
          >
            <img
              src={`/assets/promos/${promo.image}`}
              alt={promo.alt}
              className="w-full h-36 md:h-44 object-cover"
              loading="lazy"
              decoding="async"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function PromoScroller() {
  const fallback = <PromosFallback />;
  return (
    <ErrorBoundary fallback={fallback}>
      <PromoScrollerImpl />
    </ErrorBoundary>
  );
}

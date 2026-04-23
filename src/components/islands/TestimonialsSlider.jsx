// ═══════════════════════════════════════════════════════════════
// TestimonialsSlider — 11 celebrity testimonials, one at a time
// Data: src/data/testimonials.js (ground-truthed from monboum.fr)
// Spec: plan/plan.md lines 353-368
// Reduced-motion: disable auto-rotate, pagination only
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';
import { TESTIMONIALS } from '../../data/testimonials.js';

const ROTATION_MS = 6500;

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, ROTATION_MS);
    return () => clearInterval(timerRef.current);
  }, [reduced, paused]);

  const go = (i) => setIndex(((i % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  const entry = TESTIMONIALS[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* ── Photo column ──────────────────────────────────── */}
        <div className="relative">
          <div
            key={`img-${entry.id}`}
            className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg"
            style={{ transition: 'opacity 0.5s ease' }}
          >
            <img
              src={entry.photo}
              alt={entry.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {/* Decorative accent shape */}
            <img
              src="/assets/shapes/shape3-min.png"
              alt=""
              aria-hidden="true"
              className="absolute -top-6 -right-6 w-24 h-24 opacity-70 z-10 float-anim"
            />
          </div>
        </div>

        {/* ── Quote column ──────────────────────────────────── */}
        <div
          key={`txt-${entry.id}`}
          className="relative"
          style={{ transition: 'opacity 0.5s ease' }}
        >
          <p className="font-body text-xs text-rouge uppercase tracking-[0.3em] mb-4">
            Ils nous ont validé
          </p>
          <blockquote className="font-display text-3xl md:text-4xl text-white uppercase leading-tight mb-6">
            <span className="text-rouge">"</span>
            {entry.quote}
            <span className="text-rouge">"</span>
          </blockquote>
          <div>
            <p className="font-display text-2xl text-white uppercase">{entry.name}</p>
            <p className="font-body text-sm text-white/60">{entry.designation}</p>
          </div>

          {/* Controls + pagination */}
          <div className="flex items-center gap-6 mt-10">
            <button
              onClick={prev}
              aria-label="Témoignage précédent"
              className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-rouge hover:border-rouge transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Témoignage suivant"
              className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-rouge hover:border-rouge transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <span className="font-body text-sm text-white/40 tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

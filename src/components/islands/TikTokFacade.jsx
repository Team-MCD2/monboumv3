// ═══════════════════════════════════════════════════════════════
// TikTokFacade — 3 TikTok videos with click-to-play iframe pattern
// Spec: plan/plan.md lines 431-434
// Uses TikTok oEmbed for thumbnail; falls back to generic placeholder
// if CORS blocks or API returns null.
// ═══════════════════════════════════════════════════════════════
import { useRef, useState } from 'react';
import ErrorBoundary from './_ErrorBoundary.jsx';
import { TIKTOKS, tiktokUrl } from '../../data/tiktoks.js';

function TikTokCard({ entry }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    const el = videoRef.current;
    if (el) el.muted = next;
  };

  return (
    <div className="group block relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black text-left">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={entry.src}
        muted={muted}
        playsInline
        autoPlay
        loop
        preload="metadata"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <button
        type="button"
        onClick={toggleSound}
        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/75 text-white flex items-center justify-center transition-colors"
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
      >
        {muted ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            <path d="M19 12c0 2.5-1.5 4.67-3.5 5.66v-1.73c1.18-.82 2-2.18 2-3.93s-.82-3.11-2-3.93V6.34C17.5 7.33 19 9.5 19 12z" />
            <path d="M3 10v4h3l4 4V6L6 10H3z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 10v4h3l4 4V6L6 10H3z" />
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        )}
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-body text-xs text-white/70 mb-1">@{entry.account}</p>
        <p className="font-display text-lg text-white uppercase leading-tight">{entry.title}</p>
      </div>
    </div>
  );
}

// ── Fallback: plain text links to each TikTok ───────────────
function TikTokFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {TIKTOKS.map((entry) => (
        <a
          key={entry.src}
          href={tiktokUrl(entry)}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 border border-noir/20 hover:border-rouge hover:bg-rouge/5 transition-colors"
        >
          <p className="font-body text-xs text-rouge uppercase tracking-[0.3em] mb-2">TikTok</p>
          <p className="font-display text-lg text-noir uppercase">{entry.title}</p>
          <p className="font-body text-xs text-noir/50 mt-2">@{entry.account}</p>
        </a>
      ))}
    </div>
  );
}

function TikTokFacadeImpl() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {TIKTOKS.map((entry) => (
        <TikTokCard key={entry.src} entry={entry} />
      ))}
    </div>
  );
}

export default function TikTokFacade() {
  const fallback = <TikTokFallback />;
  return (
    <ErrorBoundary fallback={fallback}>
      <TikTokFacadeImpl />
    </ErrorBoundary>
  );
}

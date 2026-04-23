// ═══════════════════════════════════════════════════════════════
// TikTokFacade — 3 TikTok videos with click-to-play iframe pattern
// Spec: plan/plan.md lines 431-434
// Uses TikTok oEmbed for thumbnail; falls back to generic placeholder
// if CORS blocks or API returns null.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { TIKTOKS, tiktokUrl } from '../../data/tiktoks.js';

function TikTokCard({ entry }) {
  const [loaded, setLoaded] = useState(false);
  const [thumb, setThumb] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch oEmbed thumbnail — TikTok allows this cross-origin for oembed JSON
    const url = `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl(entry))}`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (data && data.thumbnail_url) {
          setThumb(data.thumbnail_url);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [entry.id]);

  if (loaded) {
    return (
      <div className="aspect-[9/16] w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={`https://www.tiktok.com/embed/v2/${entry.id}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={entry.title}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      className="group block relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-noir-deep text-left"
      aria-label={`Lire la vidéo TikTok : ${entry.title}`}
    >
      {/* Thumbnail or fallback texture */}
      {thumb && !error ? (
        <img
          src={thumb}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full texture-bg flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="font-display text-4xl text-white/20 uppercase">TikTok</span>
        </div>
      )}

      {/* Gradient overlay + play icon */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-rouge/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-body text-xs text-white/70 mb-1">@{entry.account}</p>
        <p className="font-display text-lg text-white uppercase leading-tight">
          {entry.title}
        </p>
      </div>
    </button>
  );
}

export default function TikTokFacade() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {TIKTOKS.map((entry) => (
        <TikTokCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

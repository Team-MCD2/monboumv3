import { useEffect, useMemo, useState } from 'react';
import ErrorBoundary from './_ErrorBoundary.jsx';

const iconCache = new Map();

function MapImpl({ restaurants, activeEnseigne: activeEnseigneProp = 'all' }) {
  const [leaflet, setLeaflet] = useState(null);
  const [rl, setRl] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeEnseigne, setActiveEnseigne] = useState(activeEnseigneProp);

  useEffect(() => {
    let mounted = true;
    if (typeof window === 'undefined') return;

    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css'),
    ])
      .then(([L, reactLeaflet]) => {
        if (!mounted) return;
        setLeaflet(L);
        setRl(reactLeaflet);
      })
      .catch((err) => {
        if (typeof console !== 'undefined') {
          console.error('[RestaurantsMap] failed to load Leaflet', err);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setActiveEnseigne(activeEnseigneProp);
  }, [activeEnseigneProp]);

  useEffect(() => {
    const onFilter = (e) => {
      const next = e?.detail?.filter;
      if (typeof next === 'string') setActiveEnseigne(next);
    };
    window.addEventListener('mb:restaurants-filter', onFilter);
    return () => window.removeEventListener('mb:restaurants-filter', onFilter);
  }, []);

  const visible = useMemo(() => {
    if (!Array.isArray(restaurants)) return [];
    if (!activeEnseigne || activeEnseigne === 'all') return restaurants;
    return restaurants.filter((r) => r.enseigne === activeEnseigne);
  }, [restaurants, activeEnseigne]);

  const center = useMemo(() => {
    if (!visible.length) return [43.6047, 1.4442]; // Toulouse
    return [visible[0].coords[0], visible[0].coords[1]];
  }, [visible]);

  const FitBounds = useMemo(() => {
    if (!leaflet || !rl) return null;
    const L = leaflet;
    const useMap = rl.useMap;

    return function FitBoundsImpl({ points }) {
      const map = useMap();

      useEffect(() => {
        if (!map) return;
        if (!points || points.length === 0) return;

        const bounds = L.latLngBounds(points.map((p) => [p.coords[0], p.coords[1]]));
        map.fitBounds(bounds, { padding: [24, 24] });
      }, [map, points]);

      return null;
    };
  }, [leaflet, rl]);

  const pinIcon = useMemo(() => {
    if (!leaflet) return null;
    const L = leaflet;
    return (color) => {
      const key = color || '#E10600';
      if (iconCache.has(key)) return iconCache.get(key);

      const svg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
  <path d="M18 34s11-10.1 11-19A11 11 0 0 0 7 15c0 8.9 11 19 11 19z" fill="${key}" />
  <circle cx="18" cy="15" r="4.5" fill="#fff" fill-opacity="0.95" />
</svg>`);

      const icon = new L.Icon({
        iconUrl: `data:image/svg+xml,${svg}`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      iconCache.set(key, icon);
      return icon;
    };
  }, [leaflet]);

  if (!leaflet || !rl || !FitBounds || !pinIcon) {
    return <Fallback restaurants={restaurants} />;
  }

  const { MapContainer, TileLayer, Marker, Popup } = rl;

  return (
    <div className="w-full h-[420px] md:h-[520px] rounded-xl overflow-hidden border-2 border-noir/10">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        dragging={!reducedMotion}
        zoomControl={!reducedMotion}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={visible} />

        {visible.map((r) => (
          <Marker
            key={r.id}
            position={[r.coords[0], r.coords[1]]}
            icon={pinIcon(r.enseigneColor || '#E10600')}
            eventHandlers={{
              click: () => {
                window.dispatchEvent(
                  new CustomEvent('mb:restaurant-focus', { detail: { id: r.id } })
                );
              },
            }}
          >
            <Popup>
              <div className="min-w-[220px]">
                <div className="font-display uppercase text-noir text-base leading-tight">
                  {r.enseigneName} {r.nom}
                </div>
                <div className="font-body text-xs text-noir/70 mt-1">
                  {r.adresse}
                  <br />
                  {r.cp} {r.ville}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <a
                    href={r.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[0.7rem] bg-noir text-white px-2.5 py-2 uppercase tracking-wider"
                  >
                    Itinéraire
                  </a>
                  {r.deliverooUrl && (
                    <a
                      href={r.deliverooUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[0.7rem] bg-rouge text-white px-2.5 py-2 uppercase tracking-wider"
                    >
                      Commander
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function Fallback({ restaurants }) {
  return (
    <div className="border-2 border-noir/10 rounded-xl p-6 bg-white">
      <p className="font-body text-sm text-noir/70">
        La carte interactive n’est pas disponible sur votre appareil.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        {(restaurants || []).map((r) => (
          <a
            key={r.id}
            href={r.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-noir/15 hover:border-rouge hover:bg-rouge/5 transition-colors p-4"
          >
            <p className="font-display uppercase text-noir">
              {r.enseigneName} {r.nom}
            </p>
            <p className="font-body text-xs text-noir/60 mt-1">
              {r.adresse} — {r.cp} {r.ville}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function RestaurantsMap(props) {
  return (
    <ErrorBoundary fallback={<Fallback restaurants={props.restaurants} />}>
      <MapImpl {...props} />
    </ErrorBoundary>
  );
}

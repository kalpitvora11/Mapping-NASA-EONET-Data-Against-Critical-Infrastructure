'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Crosshair, ZoomIn, ZoomOut, Layers, Map,
  AlertTriangle, Loader2, ExternalLink, Key,
  Zap, Hospital, Truck, Wrench,
} from 'lucide-react';
import { EonetEvent, AssetType } from '@/types';

interface GoogleEarth3DMapProps {
  event: EonetEvent;
}

type MapStatus = 'no-key' | 'loading' | 'ready' | 'error';

// Extended element type for the gmp-map-3d web component
interface GmpMap3DElement extends HTMLElement {
  center: { lat: number; lng: number; altitude: number };
  tilt: number;
  range: number;
  heading: number;
  flyCameraTo?: (opts: {
    endCamera: {
      center: { lat: number; lng: number; altitude: number };
      tilt: number;
      range: number;
      heading: number;
    };
    durationMilliseconds: number;
  }) => void;
}

interface GmpPolygon3DElement extends HTMLElement {
  outerCoordinates: { lat: number; lng: number; altitude: number }[];
}


function circlePolygon(
  lat: number,
  lng: number,
  radiusKm: number,
  n = 72
): { lat: number; lng: number; altitude: number }[] {
  const R = 6371;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    const dLat = ((radiusKm / R) * Math.cos(angle) * 180) / Math.PI;
    const dLng =
      ((radiusKm / R) * Math.sin(angle) * 180) /
      (Math.PI * Math.cos((lat * Math.PI) / 180));
    pts.push({ lat: lat + dLat, lng: lng + dLng, altitude: 0 });
  }
  return pts;
}

const SEVERITY_STYLE: Record<
  string,
  { fill: string; stroke: string; innerFill: string; innerStroke: string }
> = {
  CRITICAL: {
    fill: 'rgba(255,42,109,0.12)',
    stroke: '#FF2A6D',
    innerFill: 'rgba(255,42,109,0.20)',
    innerStroke: '#ff6b8a',
  },
  HIGH: {
    fill: 'rgba(255,184,0,0.10)',
    stroke: '#FFB800',
    innerFill: 'rgba(255,184,0,0.18)',
    innerStroke: '#ffd44d',
  },
  MEDIUM: {
    fill: 'rgba(0,229,255,0.08)',
    stroke: '#00E5FF',
    innerFill: 'rgba(0,229,255,0.15)',
    innerStroke: '#40efff',
  },
  LOW: {
    fill: 'rgba(100,116,139,0.08)',
    stroke: '#64748b',
    innerFill: 'rgba(100,116,139,0.14)',
    innerStroke: '#94a3b8',
  },
};

function AssetChipIcon({ type }: { type: AssetType }) {
  switch (type) {
    case 'Power': return <Zap className="w-3 h-3 shrink-0" />;
    case 'Health': return <Hospital className="w-3 h-3 shrink-0" />;
    case 'Transport': return <Truck className="w-3 h-3 shrink-0" />;
    default: return <Wrench className="w-3 h-3 shrink-0" />;
  }
}

const ASSET_CHIP_COLOURS: Record<AssetType, string> = {
  Power: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
  Health: 'bg-rose-950/80  border-rose-500/40  text-rose-300',
  Transport: 'bg-cyan-950/80  border-cyan-500/40  text-cyan-300',
  Utility: 'bg-slate-900/80 border-slate-500/40 text-slate-300',
};


function NoKeyScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050608] px-8 text-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-[#0B0C10] border border-slate-800 flex items-center justify-center">
        <Key className="w-7 h-7 text-cyan-400" />
      </div>

      <div>
        <h3 className="font-mono text-sm font-bold text-slate-200 mb-2">
          Google Maps API Key Required
        </h3>
        <p className="text-[12px] text-slate-500 max-w-sm leading-relaxed">
          Photorealistic 3D Maps requires a Google Maps Platform API key with the{' '}
          <span className="text-cyan-400">Maps JavaScript API</span> and{' '}
          <span className="text-cyan-400">Maps 3D API (alpha)</span> enabled.
        </p>
      </div>

      <div className="w-full max-w-xs text-left space-y-3">
        {[
          { step: '01', text: 'Open Google Cloud Console → APIs & Services' },
          { step: '02', text: 'Enable Maps JavaScript API + 3D Maps alpha' },
          { step: '03', text: 'Create an API Key under Credentials' },
          {
            step: '04',
            text: 'Add to Frontend/.env.local as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=…',
          },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-start gap-3">
            <span className="font-mono text-[10px] text-cyan-500 mt-0.5 shrink-0">{step}</span>
            <span className="text-[11px] text-slate-400 leading-snug">{text}</span>
          </div>
        ))}
      </div>

      <a
        href="https://console.cloud.google.com/apis/credentials"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 px-4 py-2 rounded-lg transition-all"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open Google Cloud Console
      </a>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050608]/95 z-30 gap-3 pointer-events-none">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="font-mono text-xs text-slate-400">Loading Google Earth 3D…</p>
    </div>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050608] px-8 text-center gap-4">
      <AlertTriangle className="w-10 h-10 text-rose-500" />
      <div>
        <p className="font-mono text-sm font-bold text-slate-200 mb-1">Map Failed to Load</p>
        <p className="font-mono text-[11px] text-slate-500 max-w-xs">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="font-mono text-xs text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg hover:border-cyan-400/60 transition-all"
      >
        Retry
      </button>
    </div>
  );
}

export default function GoogleEarth3DMap({ event }: GoogleEarth3DMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<GmpMap3DElement | null>(null);
  const outerPolyRef = useRef<GmpPolygon3DElement | null>(null);
  const innerPolyRef = useRef<GmpPolygon3DElement | null>(null);
  const overlaysRef = useRef<HTMLElement[]>([]);
  const scriptLoadAttempted = useRef(false);
  const retryCountRef = useRef(0);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const [status, setStatus] = useState<MapStatus>(API_KEY ? 'loading' : 'no-key');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeLayer, setActiveLayer] = useState<'3D' | 'OSM'>('3D');

  const flyToEvent = useCallback((ev: EonetEvent) => {
    const el = mapElRef.current;
    if (!el) return;

    const range = Math.max(ev.radius_km * 1000 * 2.8, 30_000);

    try {
      if (typeof el.flyCameraTo === 'function') {
        el.flyCameraTo({
          endCamera: {
            center: { lat: ev.latitude, lng: ev.longitude, altitude: 0 },
            tilt: 62,
            range,
            heading: 0,
          },
          durationMilliseconds: 2200,
        });
      } else {
        el.center = { lat: ev.latitude, lng: ev.longitude, altitude: 0 };
        el.tilt = 62;
        el.range = range;
        el.heading = 0;
      }
    } catch (err) {
      console.warn('[Aegis Map] flyTo error:', err);
    }
  }, []);

  const updateOverlays = useCallback((ev: EonetEvent) => {
    const mapEl = mapElRef.current;
    if (!mapEl) return;

    const style = SEVERITY_STYLE[ev.severity] ?? SEVERITY_STYLE.LOW;

    [outerPolyRef.current, innerPolyRef.current].forEach((el) => {
      if (el) try { mapEl.removeChild(el); } catch { }
    });
    overlaysRef.current.forEach((el) => {
      try { mapEl.removeChild(el); } catch { }
    });
    overlaysRef.current = [];
    outerPolyRef.current = null;
    innerPolyRef.current = null;

    if (customElements.get('gmp-polygon-3d')) {
      const outerPoly = document.createElement('gmp-polygon-3d') as GmpPolygon3DElement;
      outerPoly.setAttribute('altitude-mode', 'clamp-to-ground');
      outerPoly.setAttribute('fill-color', style.fill);
      outerPoly.setAttribute('stroke-color', style.stroke);
      outerPoly.setAttribute('stroke-width', '2');
      outerPoly.outerCoordinates = circlePolygon(ev.latitude, ev.longitude, ev.radius_km);
      mapEl.appendChild(outerPoly);
      outerPolyRef.current = outerPoly;

      const innerPoly = document.createElement('gmp-polygon-3d') as GmpPolygon3DElement;
      innerPoly.setAttribute('altitude-mode', 'clamp-to-ground');
      innerPoly.setAttribute('fill-color', style.innerFill);
      innerPoly.setAttribute('stroke-color', style.innerStroke);
      innerPoly.setAttribute('stroke-width', '1.5');
      innerPoly.outerCoordinates = circlePolygon(
        ev.latitude,
        ev.longitude,
        ev.radius_km * 0.25
      );
      mapEl.appendChild(innerPoly);
      innerPolyRef.current = innerPoly;
    }

    if (customElements.get('gmp-marker-3d')) {
      ev.exposed_assets.slice(0, 8).forEach((asset) => {
        const marker = document.createElement('gmp-marker-3d');
        marker.setAttribute(
          'position',
          JSON.stringify({ lat: asset.lat, lng: asset.lng, altitude: 0 })
        );
        marker.setAttribute('altitude-mode', 'relative-to-ground');
        marker.setAttribute('extends-to-ground', 'true');
        mapEl.appendChild(marker);
        overlaysRef.current.push(marker);
      });
    }
  }, []);

  const initMap = useCallback(async () => {
    if (!API_KEY || !containerRef.current) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const SCRIPT_ID = 'aegis-gmp-3d-api';

      if (!document.getElementById(SCRIPT_ID)) {
        await new Promise<void>((resolve, reject) => {
          const callbackName = '__aegisGmpReady';
          (window as unknown as Record<string, unknown>)[callbackName] = resolve;


          const script = document.createElement('script');
          script.id = SCRIPT_ID;
          script.src =
            `https://maps.googleapis.com/maps/api/js` +
            `?key=${API_KEY}` +
            `&v=alpha` +
            `&libraries=maps3d` +
            `&callback=${callbackName}`;
          script.async = true;
          script.defer = true;
          script.onerror = () =>
            reject(
              new Error(
                'Google Maps API failed to load. Verify your API key, billing, and that Maps JavaScript API + Maps 3D alpha are enabled.'
              )
            );
          document.head.appendChild(script);
        });
      }

      await customElements.whenDefined('gmp-map-3d');

      if (!containerRef.current) return;

      if (mapElRef.current) {
        try { containerRef.current.removeChild(mapElRef.current); } catch { }
        mapElRef.current = null;
      }

      // registered as a web component before React renders it)
      const mapEl = document.createElement('gmp-map-3d') as GmpMap3DElement;
      mapEl.style.cssText = 'width:100%;height:100%;display:block;';
      mapEl.center = { lat: event.latitude, lng: event.longitude, altitude: 0 };
      mapEl.tilt = 62;
      mapEl.range = Math.max(event.radius_km * 1000 * 2.8, 30_000);
      mapEl.heading = 0;

      containerRef.current.appendChild(mapEl);
      mapElRef.current = mapEl;

      const onLoad = () => {
        setStatus('ready');
        updateOverlays(event);
      };
      mapEl.addEventListener('gmp-load', onLoad, { once: true });

      const safetyTimer = setTimeout(() => {
        setStatus((s) => (s === 'loading' ? 'ready' : s));
        updateOverlays(event);
      }, 6000);

      mapEl.addEventListener('gmp-load', () => clearTimeout(safetyTimer), { once: true });

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error initialising map');
      setStatus('error');
    }
  }, [API_KEY, event, updateOverlays]);

  useEffect(() => {
    if (!API_KEY) return;
    if (!scriptLoadAttempted.current) {
      scriptLoadAttempted.current = true;
      initMap();
    }

    const container = containerRef.current;

    return () => {
      if (mapElRef.current && container) {
        try { container.removeChild(mapElRef.current); } catch { }
      }
      mapElRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_KEY]);

  useEffect(() => {
    if (status !== 'ready') return;
    flyToEvent(event);
    // Small delay so fly-to starts before polygon re-renders
    const t = setTimeout(() => updateOverlays(event), 400);
    return () => clearTimeout(t);
  }, [event, status, flyToEvent, updateOverlays]);

  const handleRecenter = useCallback(() => {
    if (status === 'ready') flyToEvent(event);
  }, [status, flyToEvent, event]);

  const handleRetry = useCallback(() => {
    retryCountRef.current += 1;
    scriptLoadAttempted.current = false;
    initMap();
  }, [initMap]);

  if (status === 'no-key') {
    return (
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <NoKeyScreen />
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <ErrorScreen message={errorMsg} onRetry={handleRetry} />
      </main>
    );
  }

  return (
    <main className="flex-1 relative flex flex-col overflow-hidden bg-[#050608]">

      {status === 'loading' && <LoadingScreen />}

      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="glass-panel border border-slate-800 px-4 py-1.5 rounded-full font-mono text-[10px] text-slate-400 whitespace-nowrap shadow-lg">
          <span className="text-cyan-400">◉</span>{' '}
          {event.id} — {event.title}
        </div>
      </div>

      <div className="absolute top-4 left-4 z-20 flex items-center space-x-1 glass-panel border border-slate-800 p-1 rounded-lg shadow-lg">
        <Map className="w-3.5 h-3.5 text-slate-600 ml-1.5 mr-1 shrink-0" />
        {(['3D', 'OSM'] as const).map((layer) => (
          <button
            key={layer}
            id={`map-layer-${layer.toLowerCase()}`}
            onClick={() => setActiveLayer(layer)}
            className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${activeLayer === layer
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            {layer === '3D' ? 'Google Earth 3D' : 'OSM Vector'}
          </button>
        ))}
        <div className="w-px h-4 bg-slate-800 mx-1" />
        <Layers className="w-3.5 h-3.5 text-slate-600 mr-1.5 shrink-0" />
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1">
        <button
          id="map-zoom-in"
          aria-label="Zoom in"
          className="w-8 h-8 glass-panel border border-slate-800 rounded flex items-center justify-center transition-all text-slate-600 cursor-default"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          id="map-zoom-out"
          aria-label="Zoom out"
          className="w-8 h-8 glass-panel border border-slate-800 rounded flex items-center justify-center transition-all text-slate-600 cursor-default"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          id="map-recenter"
          aria-label="Re-center"
          onClick={handleRecenter}
          className="w-8 h-8 glass-panel border border-slate-800 rounded flex items-center justify-center transition-all text-slate-500 hover:text-cyan-400 hover:border-cyan-500/40 cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-20 glass-panel border border-slate-800 px-3 py-2 rounded font-mono text-[10px] text-slate-400 pointer-events-none">
        <span className="text-cyan-400">LAT</span>{' '}
        {event.latitude.toFixed(4)}°{' '}
        <span className="text-cyan-400 ml-2">LNG</span>{' '}
        {event.longitude.toFixed(4)}°
        <span className="mx-2 text-slate-700">|</span>
        <span className="text-cyan-400">R</span> {event.radius_km} km
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
        {event.exposed_assets.slice(0, 4).map((asset) => (
          <div
            key={asset.id}
            className={`flex items-center gap-1.5 ${ASSET_CHIP_COLOURS[asset.type]} border px-2 py-1.5 rounded text-[10px] font-mono backdrop-blur-sm whitespace-nowrap shadow`}
          >
            <AssetChipIcon type={asset.type} />
            <div>
              <div className="font-bold leading-none">
                {asset.name.length > 22 ? asset.name.slice(0, 22) + '…' : asset.name}
              </div>
              <div className="opacity-60 text-[9px] mt-0.5">{asset.distance_km.toFixed(1)} km</div>
            </div>
          </div>
        ))}
      </div>

      {status === 'ready' && (
        <div className="absolute top-16 left-4 z-20 flex items-center gap-1.5 glass-panel border border-emerald-500/25 px-2.5 py-1 rounded font-mono text-[9px] text-emerald-400 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          GOOGLE EARTH 3D · LIVE
        </div>
      )}
    </main>
  );
}

import { EonetEvent, SystemStatus } from '@/types';
import { MOCK_EVENTS } from './mockData';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? 'http://localhost:8000';

const defaultOpts: RequestInit = {
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  signal: AbortSignal.timeout(8_000), 
};


export async function fetchActiveEvents(): Promise<EonetEvent[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/events`, {
      ...defaultOpts,
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[Aegis API] Empty events array from backend, using mock data.');
      return MOCK_EVENTS;
    }
    return data as EonetEvent[];
  } catch (err) {
    console.warn(
      '[Aegis API] Backend unreachable — hydrating with local mock stream.',
      err instanceof Error ? err.message : err
    );
    return MOCK_EVENTS;
  }
}

export async function fetchSystemStatus(): Promise<SystemStatus> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/status`, {
      ...defaultOpts,
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as SystemStatus;
  } catch {
    return {
      eonet_status: false,
      overpass_status: false,
      ollama_status: false,
      geopandas_status: false,
    };
  }
}


export async function downloadExecutiveBriefing(eventId: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/generate-briefing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_id: eventId }),
    signal: AbortSignal.timeout(60_000), // PDF gen can take up to 60s
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Briefing generation failed (${res.status}): ${errText}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/pdf')) {
    throw new Error('Backend returned unexpected content type: ' + contentType);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const ts = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.download = `AEGIS_BRIEFING_${eventId}_${ts}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
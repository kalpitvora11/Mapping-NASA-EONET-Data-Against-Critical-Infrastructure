'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, Clock, ChevronLeft } from 'lucide-react';
import { EonetEvent } from '@/types';

interface HeaderProps {
  events: EonetEvent[];
}

export default function Header({ events }: HeaderProps) {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      const yyyy = now.getUTCFullYear();
      const mo = String(now.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(now.getUTCDate()).padStart(2, '0');
      setUtcTime(`${yyyy}-${mo}-${dd} ${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tickerContent = events
    .map((e) => `${e.id} — ${e.title} [THREAT: ${e.threat_score.toFixed(1)}]`)
    .join('    ▸    ');
  const doubled = `${tickerContent}    ▸    ${tickerContent}`;

  const criticalCount = events.filter((e) => e.severity === 'CRITICAL').length;

  return (
    <header className="shrink-0 border-b border-slate-800/80 bg-[#0D0E14]">
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center text-slate-600 border border-cyan-500/40 bg-slate-800 hover:text-slate-200 transition-colors p-1.5 rounded-md"
            aria-label="Back to landing"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/40 rounded">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="font-mono font-bold tracking-wider text-sm text-slate-100">
                PROJECT <span className="text-cyan-400">AEGIS</span>
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-slate-500 ml-2 tracking-widest">
                GEOSPATIAL INTELLIGENCE MATRIX
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-5 text-xs font-mono">
          {criticalCount > 0 && (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-rose-950/60 border border-rose-500/30 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-400 font-bold">{criticalCount} CRITICAL</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 hidden sm:inline">EONET STREAM: LIVE</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-400 border-l border-slate-800 pl-5">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span className="tabular-nums">{utcTime || 'INITIALIZING...'}</span>
          </div>
        </div>
      </div>

      <div className="h-7 border-t border-slate-800/50 bg-[#09090D] overflow-hidden flex items-center">
        <div className="shrink-0 px-3 h-full flex items-center border-r border-slate-800 bg-rose-950/30">
          <span className="font-mono text-[10px] font-bold text-rose-400 tracking-widest whitespace-nowrap">
            ⚡ ACTIVE
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex whitespace-nowrap ticker-track"
            style={{ willChange: 'transform' }}
          >
            <span className="font-mono text-[10px] text-slate-500 px-4 tracking-wide">
              {doubled}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
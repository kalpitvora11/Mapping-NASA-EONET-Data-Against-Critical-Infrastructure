'use client';

import React from 'react';
import { CheckCircle2, XCircle, Minus } from 'lucide-react';
import { SystemStatus } from '@/types';

interface StatusBarProps {
  status: SystemStatus;
}

const ENGINES: {
  key: keyof SystemStatus;
  label: string;
}[] = [
    { key: 'eonet_status', label: 'NASA EONET v3' },
    { key: 'overpass_status', label: 'OSM Overpass' },
    { key: 'ollama_status', label: 'Ollama Engine' },
    { key: 'geopandas_status', label: 'GeoPandas' },
  ];

function EngineIndicator({ online, label }: { online: boolean; label: string }) {
  return (
    <span className="flex items-center space-x-1.5">
      {online ? (
        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
      )}
      <span className={online ? 'text-slate-500' : 'text-rose-600'}>
        {label}:{' '}
        <span className={`font-bold ${online ? 'text-emerald-500' : 'text-rose-500'}`}>
          {online ? 'ONLINE' : 'OFFLINE'}
        </span>
      </span>
    </span>
  );
}

export default function StatusBar({ status }: StatusBarProps) {
  const allOnline = Object.values(status).every(Boolean);
  const someOffline = !allOnline;

  return (
    <footer className="h-7 shrink-0 border-t border-slate-800/80 bg-[#060709] px-4 flex items-center justify-between text-[10px] font-mono text-slate-500">

      <div className="flex items-center space-x-5">
        {ENGINES.map(({ key, label }) => (
          <EngineIndicator key={key} online={status[key]} label={label} />
        ))}
      </div>

      <div className="flex items-center space-x-3">
        {someOffline && (
          <span className="flex items-center space-x-1 text-amber-600">
            <Minus className="w-3 h-3" />
            <span>DEGRADED MODE</span>
          </span>
        )}
        <span className="text-slate-700">|</span>
        <span className="text-slate-600">Aegis Matrix v1.0.0</span>
      </div>
    </footer>
  );
}
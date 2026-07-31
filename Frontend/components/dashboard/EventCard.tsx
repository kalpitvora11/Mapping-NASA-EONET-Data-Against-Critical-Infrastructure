'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Wind, Mountain, Waves, CloudFog, AlertTriangle } from 'lucide-react';
import { EonetEvent, EventSeverity } from '@/types';

interface EventCardProps {
  event: EonetEvent;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const SEVERITY_CONFIG: Record<EventSeverity, { label: string; bg: string; text: string; border: string; dot: string }> = {
  CRITICAL: {
    label: 'CRITICAL',
    bg: 'bg-rose-950/80',
    text: 'text-rose-400',
    border: 'border-rose-700/60',
    dot: 'bg-rose-500',
  },
  HIGH: {
    label: 'HIGH',
    bg: 'bg-amber-950/80',
    text: 'text-amber-400',
    border: 'border-amber-700/60',
    dot: 'bg-amber-500',
  },
  MEDIUM: {
    label: 'MEDIUM',
    bg: 'bg-cyan-950/50',
    text: 'text-cyan-400',
    border: 'border-cyan-700/40',
    dot: 'bg-cyan-500',
  },
  LOW: {
    label: 'LOW',
    bg: 'bg-slate-800/60',
    text: 'text-slate-400',
    border: 'border-slate-700/50',
    dot: 'bg-slate-500',
  },
};

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'Wildfires': return <Flame className="w-4 h-4 text-rose-500" />;
    case 'Severe Storms': return <Wind className="w-4 h-4 text-cyan-400" />;
    case 'Volcanoes': return <Mountain className="w-4 h-4 text-amber-500" />;
    case 'Floods': return <Waves className="w-4 h-4 text-blue-400" />;
    case 'Dust and Haze': return <CloudFog className="w-4 h-4 text-slate-400" />;
    default: return <AlertTriangle className="w-4 h-4 text-slate-400" />;
  }
}

function ThreatBar({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const colour =
    score >= 8 ? '#FF2A6D' :
      score >= 6 ? '#FFB800' :
        score >= 4 ? '#00E5FF' :
          '#64748b';
  return (
    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: colour, boxShadow: `0 0 6px ${colour}80` }}
      />
    </div>
  );
}

export default function EventCard({ event, isSelected, onClick, index }: EventCardProps) {
  const sev = SEVERITY_CONFIG[event.severity];

  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    const compute = () => {
      const diff = (Date.now() - new Date(event.timestamp).getTime()) / 1000;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    };

    const initTimer = setTimeout(() => setRelativeTime(compute()), 0);
    const intervalTimer = setInterval(() => setRelativeTime(compute()), 60_000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(intervalTimer);
    };
  }, [event.timestamp]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-pressed={isSelected}
      aria-label={`Select event ${event.id}: ${event.title}`}
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 outline-none animate-fade-in-up ${isSelected
        ? 'bg-cyan-950/25 border-cyan-500/50 shadow-[0_0_18px_rgba(0,229,255,0.1)]'
        : 'bg-[#12141C]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#12141C]'
        }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2">
          <CategoryIcon category={event.category} />
          <span className="text-[11px] font-mono font-bold text-slate-300">{event.id}</span>
        </div>
        <span
          className={`shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${sev.bg} ${sev.text} ${sev.border}`}
        >
          {sev.label}
        </span>
      </div>

      <h3 className="text-[11px] font-medium text-slate-300 mt-2 leading-tight line-clamp-2">
        {event.title}
      </h3>

      <ThreatBar score={event.threat_score} />

      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>{event.radius_km} km zone</span>
        <div className="flex items-center space-x-2">
          <span className="text-slate-600">{relativeTime}</span>
          <span className="text-cyan-400 font-bold">⚡ {event.threat_score.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-2">
        <span className="text-[9px] font-mono bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded-full">
          {event.exposed_assets.length} asset{event.exposed_assets.length !== 1 ? 's' : ''} at risk
        </span>
      </div>
    </div>
  );
}
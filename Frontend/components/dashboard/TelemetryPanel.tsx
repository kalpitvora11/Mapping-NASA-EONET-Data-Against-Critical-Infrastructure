'use client';

import React, { useState } from 'react';
import {
  Download, Terminal, Zap, Hospital, Truck, Wrench,
  AlertCircle, CheckCircle2, Loader2, MapPin, Clock,
  BarChart3, Target, ChevronRight,
} from 'lucide-react';
import { EonetEvent, ExposedAsset, EventSeverity, AssetType } from '@/types';
import { downloadExecutiveBriefing } from '@/lib/api';

interface TelemetryPanelProps {
  event: EonetEvent;
}

const RISK_CONFIG: Record<EventSeverity, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: 'bg-rose-950/80', text: 'text-rose-400', border: 'border-rose-700/50' },
  HIGH: { bg: 'bg-amber-950/70', text: 'text-amber-400', border: 'border-amber-700/50' },
  MEDIUM: { bg: 'bg-cyan-950/50', text: 'text-cyan-400', border: 'border-cyan-700/40' },
  LOW: { bg: 'bg-slate-800/60', text: 'text-slate-400', border: 'border-slate-700/40' },
};

function AssetIcon({ type }: { type: AssetType }) {
  switch (type) {
    case 'Power': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    case 'Health': return <Hospital className="w-3.5 h-3.5 text-rose-400" />;
    case 'Transport': return <Truck className="w-3.5 h-3.5 text-cyan-400" />;
    default: return <Wrench className="w-3.5 h-3.5 text-slate-400" />;
  }
}

function ThreatGauge({ score }: { score: number }) {
  const RADIUS = 52;
  const CIRCUMFERENCE = Math.PI * RADIUS; // half-circle arc
  const pct = Math.min(score / 10, 1);
  const offset = CIRCUMFERENCE * (1 - pct);

  const colour =
    score >= 8 ? '#FF2A6D' :
      score >= 6 ? '#FFB800' :
        score >= 4 ? '#00E5FF' :
          '#64748b';

  const label =
    score >= 8 ? 'CRITICAL THREAT' :
      score >= 6 ? 'HIGH THREAT' :
        score >= 4 ? 'MODERATE THREAT' :
          'LOW THREAT';

  return (
    <div className="flex flex-col items-center py-2">
      <svg width="130" height="72" viewBox="0 0 130 72" fill="none" aria-label={`Threat gauge: ${score} out of 10`}>
        <path
          d="M 13 65 A 52 52 0 0 1 117 65"
          stroke="#1e293b"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 13 65 A 52 52 0 0 1 117 65"
          stroke={colour}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          fill="none"
          style={{
            filter: `drop-shadow(0 0 8px ${colour}80)`,
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease',
          }}
        />
        <text x="65" y="56" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="monospace">
          {score.toFixed(1)}
        </text>
        <text x="65" y="70" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
          /&nbsp;10.0
        </text>
      </svg>
      <span className="font-mono text-[10px] font-bold tracking-wider" style={{ color: colour }}>
        {label}
      </span>
    </div>
  );
}

function AssetRow({ asset }: { asset: ExposedAsset }) {
  const risk = RISK_CONFIG[asset.risk_level];
  return (
    <div className="flex items-center gap-2.5 bg-[#12141C]/80 border border-slate-800/70 p-2.5 rounded-lg hover:border-slate-700 transition-colors">
      <div className="p-1.5 bg-slate-800/80 rounded shrink-0">
        <AssetIcon type={asset.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium text-slate-200 truncate">{asset.name}</div>
        <div className="text-[10px] font-mono text-slate-500">
          <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
          {asset.distance_km.toFixed(1)} km · {asset.type}
        </div>
      </div>
      <span className={`shrink-0 text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${risk.bg} ${risk.text} ${risk.border}`}>
        {asset.risk_level}
      </span>
    </div>
  );
}

// MAIN
export default function TelemetryPanel({ event }: TelemetryPanelProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  
  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);
    try {
      await downloadExecutiveBriefing(event.id);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'PDF generation failed');
    } finally {
      setDownloading(false);
    }
  };

  const formattedDate = new Date(event.timestamp).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'UTC', timeZoneName: 'short',
  });

  return (
    <aside className="w-85 shrink-0 border-l border-slate-800/80 bg-[#0B0C10] flex flex-col overflow-hidden">

      <div className="px-4 pt-3 pb-2 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            Target Telemetry
          </span>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${RISK_CONFIG[event.severity].bg} ${RISK_CONFIG[event.severity].text} ${RISK_CONFIG[event.severity].border}`}>
            {event.severity}
          </span>
        </div>
        <h2 className="text-xs font-bold text-slate-100 leading-snug">{event.title}</h2>
        <p className="font-mono text-[10px] text-slate-600 mt-0.5">{event.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

        <div className="bg-[#12141C] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center space-x-1.5 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Threat Index</span>
          </div>
          <ThreatGauge score={event.threat_score} />
        </div>

        <div className="bg-[#12141C]/60 border border-slate-800/70 rounded-xl p-3.5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              { icon: Target, label: 'Category', value: event.category },
              { icon: MapPin, label: 'Radius', value: `${event.radius_km} km` },
              { icon: Clock, label: 'Detected', value: formattedDate },
              { icon: MapPin, label: 'Coords', value: `${event.latitude.toFixed(3)}°, ${event.longitude.toFixed(3)}°` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center space-x-1 mb-0.5">
                  <Icon className="w-2.5 h-2.5 text-slate-600" />
                  <span className="font-mono text-[9px] text-slate-600 uppercase tracking-wider">{label}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-300 leading-tight">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-1.5 mb-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              LLM Analysis
            </span>
          </div>
          <div className="bg-[#12141C]/60 border border-slate-800/70 rounded-xl p-3.5">
            <p className="text-[11px] text-slate-400 leading-relaxed">{event.summary}</p>
            <div className="mt-3 flex items-center space-x-1.5 text-[10px] font-mono text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Ollama · Llama-3-8B · Local</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                Exposed Assets
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-600">
              {event.exposed_assets.length} identified
            </span>
          </div>
          <div className="space-y-2">
            {event.exposed_assets.map((asset) => (
              <AssetRow key={asset.id} asset={asset} />
            ))}
            {event.exposed_assets.length === 0 && (
              <p className="font-mono text-[11px] text-slate-600 text-center py-4">
                No assets within buffer radius.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-800/70 bg-[#0D0E14] shrink-0 space-y-2">
        {downloadError && (
          <div className="flex items-start space-x-2 bg-rose-950/50 border border-rose-800/50 rounded px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <p className="font-mono text-[10px] text-rose-400 leading-relaxed">{downloadError}</p>
          </div>
        )}

        <button
          id="download-briefing-btn"
          onClick={handleDownload}
          disabled={downloading}
          className={`w-full py-2.5 px-4 font-mono text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${downloadSuccess
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
              : downloading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_30px_rgba(0,229,255,0.45)]'
            }`}
        >
          {downloading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>COMPILING TELEMETRY...</span></>
          ) : downloadSuccess ? (
            <><CheckCircle2 className="w-4 h-4" /><span>BRIEFING DOWNLOADED</span></>
          ) : (
            <><Download className="w-4 h-4" /><span>EXPORT EXECUTIVE BRIEFING (PDF)</span></>
          )}
        </button>
      </div>
    </aside>
  );
}
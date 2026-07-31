'use client';

import Link from 'next/link';
import { Shield, Activity } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function useCounter(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.floor(t * target));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

const STATS = [
  { label: 'Events Monitored', value: 2847, suffix: '+' },
  { label: 'Assets Indexed', value: 14200, suffix: '+' },
  { label: 'Threat Analyses', value: 1093, suffix: '' },
];

export default function HeroSection() {
  const c0 = useCounter(STATS[0].value);
  const c1 = useCounter(STATS[1].value);
  const c2 = useCounter(STATS[2].value);
  const counts = [c0, c1, c2];

  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 px-6 max-w-6xl mx-auto overflow-hidden">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,229,255,0.10) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
        aria-hidden
      />

      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative inline-flex items-center space-x-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/25 rounded-full text-cyan-400 font-mono text-[11px] mb-6 sm:mb-8 tracking-widest">
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span>GEOSPATIAL INTELLIGENCE</span>
      </div>

      <h1 className="relative text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-center max-w-4xl leading-[1.2] sm:leading-[1.1]">
        Real-Time Hazard Telemetry
        <br />
        Meets{' '}
        <span className="text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(90deg, #00E5FF 0%, #FF2A6D 100%)' }}>
          Critical Infrastructure
        </span>
      </h1>

      <p className="relative mt-6 text-slate-400 text-base max-w-2xl text-center leading-relaxed">
        Project Aegis ingests live disaster vectors from{' '}
        <span className="text-cyan-400 font-mono text-sm">NASA EONET</span>, computes
        spatial proximity buffers around critical OSM infrastructure via{' '}
        <span className="text-amber-400 font-mono text-sm">GeoPandas</span>, and
        generates executive briefings through a{' '}
        <span className="text-rose-400 font-mono text-sm">local LLM</span>.
      </p>

      <div className="relative mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold px-8 py-3.5 rounded text-xs transition-all shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] hover:-translate-y-0.5"
        >
          <Shield className="w-4 h-4" />
          OPEN MATRIX DASHBOARD
        </Link>
      </div>

      <div className="relative mt-10 sm:mt-6 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="text-center">
            <div className="font-mono text-2xl font-bold text-slate-100">
              {counts[i].toLocaleString()}{stat.suffix}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1 tracking-wider uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
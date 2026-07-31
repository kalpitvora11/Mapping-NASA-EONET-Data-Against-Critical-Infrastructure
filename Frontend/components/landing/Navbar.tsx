'use client';

import Link from 'next/link';
import { ShieldAlert, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`h-16 fixed top-0 left-0 right-0 z-50 px-6 flex items-center justify-between transition-all duration-300 ${scrolled
          ? 'bg-[#08090C]/95 border-b border-slate-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
        }`}
      style={{ backdropFilter: scrolled ? 'blur(16px)' : 'none' }}
    >
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
        </div>
        <span className="font-mono font-bold tracking-wider text-sm text-slate-100">
          PROJECT <span className="text-cyan-400">AEGIS</span>
        </span>
      </div>

      <div className="flex items-center space-x-6 text-xs font-mono">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 tracking-wide">LIVE FEED ACTIVE</span>
        </div>

        <Link
          href="/dashboard"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded text-xs transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_30px_rgba(0,229,255,0.45)]"
        >
          LAUNCH MATRIX →
        </Link>
      </div>
    </nav>
  );
}
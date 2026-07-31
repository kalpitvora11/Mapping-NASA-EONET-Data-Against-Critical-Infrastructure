import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col" style={{ overflow: 'auto' }}>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
      <footer className="border-t border-slate-800/60 py-6 px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-600 gap-2">
        <span>Project Aegis — Mapping NASA EONET Data Against Critical Infrastructure · 2026</span>
        <span className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>EONET STREAM ACTIVE</span>
        </span>
      </footer>
    </div>
  );
}
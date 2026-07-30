// import Link from 'next/link';
// import { Shield, Cpu, MapPin, FileCheck } from 'lucide-react';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between p-8 font-mono">
//       <header className="flex justify-between items-center border-b border-slate-800 pb-4">
//         <div className="flex items-center space-x-2">
//           <Shield className="w-6 h-6 text-cyan-400" />
//           <span className="font-bold text-lg">AEGIS</span>
//         </div>
//         <Link 
//           href="/dashboard" 
//           className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-all"
//         >
//           LAUNCH MATRIX PLATFORM →
//         </Link>
//       </header>

//       <main className="max-w-4xl mx-auto my-16 text-center space-y-6">
//         <span className="text-cyan-400 text-xs tracking-widest border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 rounded">
//           GEOSPATIAL INTELLIGENCE PLATFORM
//         </span>
//         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sans">
//           Real-Time Disaster Telemetry vs. Critical Human Infrastructure
//         </h1>
//         <p className="text-slate-400 text-sm max-w-2xl mx-auto font-sans leading-relaxed">
//           Project Aegis dynamically ingests the NASA EONET API, renders impact polygons over vector maps, cross-references OpenStreetMap infrastructure data via GeoPandas, and leverages local LLMs to generate automated executive briefings.
//         </p>

//         <div className="pt-6">
//           <Link 
//             href="/dashboard" 
//             className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-3 rounded text-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
//           >
//             ENTER COMMAND CENTER
//           </Link>
//         </div>
//       </main>

//       <footer className="border-t border-slate-800 pt-4 text-center text-xs text-slate-600">
//         Project Aegis — Final Year Engineering Capstone | SAKEC
//       </footer>
//     </div>
//   );
// }
import Link from 'next/link';
import { Shield, Cpu, MapPin, FileCheck, Activity, Terminal, Zap, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between p-6 md:p-8 font-mono selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background Decorative Grid and Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center border-b border-slate-800/80 pb-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider text-white">AEGIS</span>
            <span className="text-[10px] block text-cyan-400/80 tracking-widest">DEFENSE MATRIX</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 border border-slate-800 px-3 py-1.5 rounded bg-slate-900/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYSTEM ONLINE: EONET v3</span>
          </div>
          <Link 
            href="/dashboard" 
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center space-x-2"
          >
            <span>LAUNCH MATRIX</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto my-12 text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs tracking-widest border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 rounded-full shadow-inner">
          <Globe className="w-3.5 h-3.5 animate-spin duration-3000" />
          <span>GEOSPATIAL INTELLIGENCE & DISASTER TELEMETRY</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-sans max-w-4xl mx-auto leading-tight">
          Real-Time Disaster Telemetry vs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Critical Infrastructure</span>
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          Project Aegis dynamically ingests the <strong className="text-slate-200">NASA EONET API</strong>, renders impact polygons over vector maps, cross-references <strong className="text-slate-200">OpenStreetMap</strong> infrastructure via GeoPandas, and leverages local LLMs for automated executive briefings.
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center space-x-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded text-sm transition-all shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            <span>ENTER COMMAND CENTER</span>
            <span>→</span>
          </Link>
        </div>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur">
            <div className="p-2 w-fit rounded bg-cyan-500/10 text-cyan-400 mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white tracking-wider mb-1">NASA EONET FEED</h3>
            <p className="text-xs text-slate-400 font-sans">Live tracking of active natural events globally in real time.</p>
          </div>

          <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur">
            <div className="p-2 w-fit rounded bg-cyan-500/10 text-cyan-400 mb-3">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white tracking-wider mb-1">GEOPANDAS & OSM</h3>
            <p className="text-xs text-slate-400 font-sans">Cross-referencing impact zones against critical community assets.</p>
          </div>

          <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur">
            <div className="p-2 w-fit rounded bg-cyan-500/10 text-cyan-400 mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white tracking-wider mb-1">LOCAL LLM INTEL</h3>
            <p className="text-xs text-slate-400 font-sans">Automated generation of tactical executive briefings.</p>
          </div>
        </div>

      </main>

      {/* Spacer to balance the layout */}
      <div />

    </div>
  );
}
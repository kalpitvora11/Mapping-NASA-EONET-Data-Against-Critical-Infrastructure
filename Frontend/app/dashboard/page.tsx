import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchActiveEvents, fetchSystemStatus } from '@/lib/api';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aegis Matrix | Command Center',
  description: 'Real-time geospatial hazard intelligence dashboard — Project Aegis.',
};

function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-[#08090C] text-slate-200 overflow-hidden">
      <div className="h-14 border-b border-slate-800/80 bg-[#0D0E14] flex items-center px-4 gap-4">
        <div className="w-6 h-6 rounded bg-slate-800 animate-pulse" />
        <div className="w-48 h-4 rounded bg-slate-800 animate-pulse" />
        <div className="ml-auto flex gap-4">
          <div className="w-24 h-4 rounded bg-slate-800 animate-pulse" />
          <div className="w-36 h-4 rounded bg-slate-800 animate-pulse" />
        </div>
      </div>
      <div className="h-7 border-b border-slate-800/50 bg-[#09090D]" />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-75 border-r border-slate-800/80 bg-[#0B0C10] flex flex-col gap-2 p-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-slate-900/60 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
        <div className="flex-1 bg-[#050608] animate-pulse" />
        <div className="w-85 border-l border-slate-800/80 bg-[#0B0C10]" />
      </div>
      <div className="h-7 border-t border-slate-800/80 bg-[#060709]" />
    </div>
  );
}

export default async function DashboardPage() {
  const [events, status] = await Promise.all([
    fetchActiveEvents(),
    fetchSystemStatus(),
  ]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient initialEvents={events} initialStatus={status} />
    </Suspense>
  );
}
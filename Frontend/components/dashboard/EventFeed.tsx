'use client';

import React, { useState, useMemo } from 'react';
import { Search, Flame, Wind, Mountain, Waves, CloudFog, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { EonetEvent, EventCategory } from '@/types';
import EventCard from './EventCard';

interface EventFeedProps {
  events: EonetEvent[];
  selectedEvent: EonetEvent;
  onSelectEvent: (event: EonetEvent) => void;
}

type FilterTab = 'All' | EventCategory;

const FILTER_TABS: { label: string; value: FilterTab; icon: React.ReactNode }[] = [
  { label: 'All', value: 'All', icon: <SlidersHorizontal className="w-3 h-3" /> },
  { label: 'Fire', value: 'Wildfires', icon: <Flame className="w-3 h-3 text-rose-400" /> },
  { label: 'Storm', value: 'Severe Storms', icon: <Wind className="w-3 h-3 text-cyan-400" /> },
  { label: 'Volcano', value: 'Volcanoes', icon: <Mountain className="w-3 h-3 text-amber-400" /> },
  { label: 'Flood', value: 'Floods', icon: <Waves className="w-3 h-3 text-blue-400" /> },
  { label: 'Haze', value: 'Dust and Haze', icon: <CloudFog className="w-3 h-3 text-slate-400" /> },
];

export default function EventFeed({ events, selectedEvent, onSelectEvent }: EventFeedProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesTab = activeTab === 'All' || e.category === activeTab;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [events, search, activeTab]);

  const criticalCount = filtered.filter((e) => e.severity === 'CRITICAL').length;

  return (
    <aside className="w-75 shrink-0 border-r border-slate-800/80 bg-[#0B0C10] flex flex-col overflow-hidden">

      <div className="px-3 pt-3 pb-2 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Hazard Feed
          </span>
          <div className="flex items-center space-x-1">
            <span className="font-mono text-[10px] text-slate-600">{filtered.length} events</span>
            {criticalCount > 0 && (
              <span className="font-mono text-[9px] bg-rose-950/80 text-rose-400 border border-rose-800/50 px-1.5 py-0.5 rounded-full ml-1">
                {criticalCount} CRIT
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            id="hazard-search"
            type="text"
            placeholder="Search events, IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12141C] border border-slate-800 hover:border-slate-700 focus:border-cyan-500/50 text-[11px] text-slate-200 placeholder:text-slate-600 pl-8 pr-3 py-2 rounded-lg focus:outline-none font-mono transition-colors"
          />
        </div>
      </div>

      <div className="px-2 pt-2 pb-1 flex flex-wrap gap-1 shrink-0 border-b border-slate-800/40">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === 'All'
            ? events.length
            : events.filter((e) => e.category === tab.value).length;
          if (count === 0 && tab.value !== 'All') return null;
          return (
            <button
              key={tab.value}
              id={`filter-tab-${tab.value.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all ${activeTab === tab.value
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {count > 0 && (
                <span className="text-[9px] opacity-60">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
            <AlertCircle className="w-8 h-8 text-slate-700 mb-3" />
            <p className="font-mono text-xs text-slate-500">No events match your filter.</p>
            <button
              onClick={() => { setSearch(''); setActiveTab('All'); }}
              className="mt-3 text-[10px] font-mono text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              index={idx}
              isSelected={selectedEvent.id === event.id}
              onClick={() => onSelectEvent(event)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
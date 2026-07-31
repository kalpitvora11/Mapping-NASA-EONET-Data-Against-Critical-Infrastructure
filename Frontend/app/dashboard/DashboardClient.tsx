'use client';

import React, { useState } from 'react';
import { EonetEvent, SystemStatus } from '@/types';
import Header from '@/components/dashboard/Header';
import EventFeed from '@/components/dashboard/EventFeed';
import GoogleEarth3DMap from '@/components/dashboard/GoogleEarth3DMap';
import TelemetryPanel from '@/components/dashboard/TelemetryPanel';
import StatusBar from '@/components/dashboard/StatusBar';

interface DashboardClientProps {
  initialEvents: EonetEvent[];
  initialStatus: SystemStatus;
}

export default function DashboardClient({ initialEvents, initialStatus }: DashboardClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<EonetEvent>(
    initialEvents.find((e) => e.severity === 'CRITICAL') ?? initialEvents[0]
  );

  if (!selectedEvent) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#08090C] text-slate-500 font-mono text-sm">
        No active hazard events to display.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#08090C] text-slate-200 font-sans overflow-hidden select-none">
      <Header events={initialEvents} />

      <div className="flex flex-1 overflow-hidden">
        <EventFeed
          events={initialEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />

        <GoogleEarth3DMap event={selectedEvent} />

        <TelemetryPanel event={selectedEvent} />
      </div>

      <StatusBar status={initialStatus} />
    </div>
  );
}

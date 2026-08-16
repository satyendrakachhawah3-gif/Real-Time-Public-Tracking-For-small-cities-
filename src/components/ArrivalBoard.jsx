import React, { useState, useEffect } from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  Clock, 
  MapPin, 
  Bus, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Wifi, 
  Accessibility, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ArrivalBoard() {
  const { 
    stops, 
    routes, 
    vehicles, 
    selectedStop, 
    setSelectedStop,
    setActiveRouteId,
    setActiveTab,
    simulationTickCount
  } = useTransit();

  const [activeStopId, setActiveStopId] = useState(selectedStop?.id || stops[0]?.id || '');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lastAudioAnnouncement, setLastAudioAnnouncement] = useState('');

  const currentStop = stops.find(s => s.id === activeStopId) || stops[0];

  // Calculate live countdowns for buses approaching this stop
  const servingBuses = vehicles.filter(v => currentStop.routes.includes(v.routeId));

  const upcomingArrivals = servingBuses.map((v, idx) => {
    const route = routes.find(r => r.id === v.routeId);
    
    // Dynamic countdown logic derived from vehicle segment progress and speed
    const distanceMeters = Math.max(100, Math.floor((1 - v.segmentProgress) * 1200 + (idx * 400)));
    const minutesLeft = Math.max(0, Math.floor(distanceMeters / (v.speed * 25)));
    const secondsLeft = Math.floor((distanceMeters % 300) / 5);

    let statusText = 'ON TIME';
    let statusClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

    if (minutesLeft === 0) {
      statusText = 'BOARDING NOW';
      statusClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse font-extrabold';
    } else if (v.status === 'DELAYED') {
      statusText = `DELAYED +${v.delayMinutes}m`;
      statusClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }

    return {
      vehicleId: v.id,
      unitNumber: v.unitNumber,
      route,
      destination: route ? route.name.split('&')[0] : 'Downtown',
      minutesLeft,
      secondsLeft,
      statusText,
      statusClass,
      passengers: v.passengers,
      capacity: v.capacity
    };
  }).sort((a, b) => a.minutesLeft - b.minutesLeft);

  const playAudioChime = () => {
    if (upcomingArrivals.length > 0) {
      const top = upcomingArrivals[0];
      const msg = `Attention passengers at ${currentStop.name}. Line ${top.route?.code} to ${top.destination} will arrive in ${top.minutesLeft} minutes.`;
      setLastAudioAnnouncement(msg);
      
      // Use Web Speech API if supported
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/90 text-slate-100 p-4 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" /> Live Station Arrival Board
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live digital departure countdown for Grandview Springs transit stations.
          </p>
        </div>

        {/* Audio Announcement Button */}
        <button
          onClick={() => {
            setAudioEnabled(!audioEnabled);
            playAudioChime();
          }}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            audioEnabled 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Play Audio Departure Announcement"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">Chime</span>
        </button>
      </div>

      {/* Station Selector Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/90 mb-4">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Select Transit Station
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-3 text-blue-400" />
          <select
            value={activeStopId}
            onChange={(e) => setActiveStopId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500 transition-all"
          >
            {stops.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.zone})
              </option>
            ))}
          </select>
        </div>

        {/* Station Amenities Badge Pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex-wrap">
          <span className="font-bold text-slate-300">Station Amenities:</span>
          {currentStop.amenities.map((am, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {am}
            </span>
          ))}
        </div>
      </div>

      {/* Audio Announcement Alert Banner */}
      {lastAudioAnnouncement && (
        <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-spin" />
          <span>{lastAudioAnnouncement}</span>
        </div>
      )}

      {/* Flight Board Style Timetable Matrix */}
      <div className="glass-card rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="w-16">Line</span>
          <span className="flex-1">Destination</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-24 text-right">ETA</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {upcomingArrivals.length > 0 ? (
            upcomingArrivals.map((arr, index) => (
              <div 
                key={arr.vehicleId + index}
                className="px-4 py-3.5 flex items-center justify-between gap-2 hover:bg-slate-900/60 transition-all font-mono-code"
              >
                {/* Route Pill */}
                <div className="w-16 flex-shrink-0">
                  <span 
                    className="px-2.5 py-1 rounded-lg text-xs font-black text-white inline-block shadow-sm"
                    style={{ backgroundColor: arr.route?.color || '#3b82f6' }}
                  >
                    {arr.route?.code}
                  </span>
                </div>

                {/* Destination & Vehicle Unit */}
                <div className="flex-1">
                  <span className="font-heading font-bold text-sm text-slate-100 block tracking-tight">
                    {arr.destination}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    {arr.unitNumber} • Load: {arr.passengers}/{arr.capacity}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="w-24 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] border ${arr.statusClass}`}>
                    {arr.statusText}
                  </span>
                </div>

                {/* Live ETA Countdown */}
                <div className="w-24 text-right">
                  {arr.minutesLeft === 0 ? (
                    <span className="text-xs font-extrabold text-blue-400 animate-pulse">
                      ARRIVING NOW
                    </span>
                  ) : (
                    <span className="font-extrabold text-base text-emerald-400">
                      {arr.minutesLeft} <span className="text-xs font-normal text-slate-400">min</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No active buses scheduled for this station right now.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

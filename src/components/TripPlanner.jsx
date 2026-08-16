import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  Compass, 
  MapPin, 
  ArrowRightLeft, 
  Clock, 
  DollarSign, 
  Leaf, 
  Bus, 
  ChevronRight, 
  CheckCircle,
  AlertCircle,
  Navigation
} from 'lucide-react';

export default function TripPlanner() {
  const { 
    stops, 
    routes, 
    vehicles, 
    cityConfig,
    setActiveRouteId,
    setSelectedStop,
    setActiveTab 
  } = useTransit();

  const [fromStopId, setFromStopId] = useState(stops[0]?.id || '');
  const [toStopId, setToStopId] = useState(stops[4]?.id || '');
  const [isCalculated, setIsCalculated] = useState(true);

  const swapStops = () => {
    setFromStopId(toStopId);
    setToStopId(fromStopId);
  };

  const originStop = stops.find(s => s.id === fromStopId);
  const destStop = stops.find(s => s.id === toStopId);

  // Find connecting routes
  const connectingRoutes = routes.filter(r => 
    originStop?.routes.includes(r.id) && destStop?.routes.includes(r.id)
  );

  // If no direct route, fallback to any line serving origin
  const primaryRoute = connectingRoutes[0] || routes.find(r => originStop?.routes.includes(r.id)) || routes[0];

  // Calculate estimated distance & duration
  const estDistanceKm = originStop && destStop 
    ? (Math.hypot(originStop.lat - destStop.lat, originStop.lng - destStop.lng) * 111).toFixed(1)
    : "3.4";

  const estTravelMins = Math.max(4, Math.round(parseFloat(estDistanceKm) * 2.8 + 3));
  const estNextBusMins = Math.floor(Math.random() * 5) + 2;

  // Environmental impact savings calculation
  const co2SavedKg = (parseFloat(estDistanceKm) * 0.18).toFixed(2);

  return (
    <div className="flex flex-col h-full bg-slate-950/90 text-slate-100 p-4 overflow-y-auto custom-scrollbar">
      
      {/* Title */}
      <div className="mb-4">
        <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" /> Small City Trip Planner
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Plan your route across Grandview Springs. Instant ETAs, transfer points, and fare calculation.
        </p>
      </div>

      {/* Origin / Destination Form Box */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/90 shadow-xl mb-4 relative">
        <div className="flex flex-col gap-3">
          
          {/* FROM STOP */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Origin Station (From)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
              <select
                value={fromStopId}
                onChange={(e) => setFromStopId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-indigo-500 transition-all"
              >
                {stops.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="flex justify-center -my-1 z-10">
            <button
              onClick={swapStops}
              className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 shadow-md transition-all hover:rotate-180"
              title="Swap Origin and Destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TO STOP */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Destination Station (To)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></div>
              <select
                value={toStopId}
                onChange={(e) => setToStopId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-indigo-500 transition-all"
              >
                {stops.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* TRIP RESULT CARD */}
      {originStop && destStop && (
        <div className="flex flex-col gap-4">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2">
            
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" /> Duration
              </span>
              <span className="font-heading font-extrabold text-base text-white">
                {estTravelMins} <span className="text-xs font-normal text-slate-400">mins</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1 flex items-center justify-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Standard Flat Fare
              </span>
              <span className="font-heading font-extrabold text-base text-emerald-400">
                ${cityConfig.flatFare.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1 flex items-center justify-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-400" /> CO₂ Saved
              </span>
              <span className="font-heading font-extrabold text-base text-emerald-300">
                {co2SavedKg} <span className="text-xs font-normal text-slate-400">kg</span>
              </span>
            </div>

          </div>

          {/* Recommended Option Card */}
          <div className="glass-card rounded-2xl p-4 border border-indigo-500/40 bg-gradient-to-b from-indigo-950/30 to-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-black text-white" style={{ backgroundColor: primaryRoute.color }}>
                  Line {primaryRoute.code}
                </span>
                <h3 className="font-heading font-bold text-sm text-white">{primaryRoute.name}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {connectingRoutes.length > 0 ? 'Direct Route' : '1 Transfer'}
              </span>
            </div>

            {/* Step by step timeline */}
            <div className="space-y-4 relative pl-4 border-l-2 border-slate-800 ml-2 my-4">
              
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></div>
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 font-mono-code block">DEPART AT {originStop.name}</span>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    Board <span className="text-blue-400 font-bold">{primaryRoute.shortName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> Next arrival in <strong className="text-amber-400">{estNextBusMins} mins</strong>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950"></div>
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 font-mono-code block">RIDE ({estTravelMins} MINS)</span>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    Travel along {primaryRoute.name} ({estDistanceKm} km)
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-950"></div>
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 font-mono-code block">ARRIVE AT DESTINATION</span>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    Disembark at <span className="text-indigo-400 font-bold">{destStop.name}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Action button to show on map */}
            <button
              onClick={() => {
                setActiveRouteId(primaryRoute.id);
                setSelectedStop(originStop);
                setActiveTab('map');
              }}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4" /> View Route & Buses on Live Map
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  Bus, 
  MapPin, 
  Search, 
  Clock, 
  ChevronRight, 
  Users, 
  Battery, 
  AlertCircle,
  Filter,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function RouteExplorer() {
  const { 
    routes, 
    stops, 
    vehicles, 
    activeRouteId, 
    setActiveRouteId, 
    setSelectedVehicle,
    setSelectedStop,
    setActiveTab
  } = useTransit();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filteredRoutes = routes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.code.includes(search) || 
                          r.description.toLowerCase().includes(search.toLowerCase());
    
    if (selectedFilter === 'ALL') return matchesSearch;
    return matchesSearch && r.type.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-slate-950/90 text-slate-100 p-4 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
          <Bus className="w-5 h-5 text-blue-400" /> Route Explorer
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore all active transit lines, bus frequencies, stop sequences, and live vehicle locations.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search route name, number, or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'Express', 'University', 'Medical', 'Local'].map(f => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                selectedFilter === f 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Route Cards */}
      <div className="flex flex-col gap-3">
        {filteredRoutes.map(route => {
          const isSelected = activeRouteId === route.id;
          const routeVehicles = vehicles.filter(v => v.routeId === route.id);
          const routeStops = stops.filter(s => s.routes.includes(route.id));

          return (
            <div
              key={route.id}
              className={`glass-card rounded-2xl p-4 border transition-all cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-blue-500/80 bg-slate-900/90 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
              onClick={() => {
                setActiveRouteId(isSelected ? null : route.id);
              }}
            >
              {/* Card Top Banner */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl font-heading font-black text-sm flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: route.color }}
                  >
                    {route.code}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
                      {route.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-code text-[10px]">
                        {route.type}
                      </span>
                      • Every {route.frequency}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRouteId(route.id);
                    setActiveTab('map');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all"
                >
                  Focus Map <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 my-3 line-clamp-2">
                {route.description}
              </p>

              {/* Route Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-800/80 text-xs my-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Active Buses</span>
                  <span className="font-mono-code font-bold text-slate-200 flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-blue-400" /> {routeVehicles.length} Vehicles
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Total Stops</span>
                  <span className="font-mono-code font-bold text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {routeStops.length} Stations
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">On-Time Rate</span>
                  <span className="font-mono-code font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 98.4%
                  </span>
                </div>
              </div>

              {/* Expandable Active Vehicles Roster */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Live Vehicles on Route ({routeVehicles.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {routeVehicles.map(v => (
                      <div 
                        key={v.id} 
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-blue-500/50 transition-all cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicle(v);
                          setActiveTab('map');
                        }}
                      >
                        <div>
                          <span className="font-bold text-xs text-white block">{v.unitNumber}</span>
                          <span className="text-[10px] text-slate-400 block">{v.driver}</span>
                        </div>
                        <div className="text-right font-mono-code text-[11px]">
                          <span className="text-slate-200 font-bold block">{Math.round(v.speed)} mph</span>
                          <span className="text-emerald-400 text-[10px]">{v.passengers}/{v.capacity} riders</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stop Sequence preview */}
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-3">
                    Station Sequence & Timetable ({routeStops.length})
                  </h4>
                  <div className="space-y-1.5">
                    {routeStops.map((st, idx) => (
                      <div 
                        key={st.id} 
                        className="flex items-center gap-2 text-xs p-1.5 rounded-lg hover:bg-slate-800/60 transition-all cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStop(st);
                          setActiveTab('map');
                        }}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono-code text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-slate-200 font-medium flex-1">{st.name}</span>
                        <span className="text-[10px] text-slate-400">{st.zone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

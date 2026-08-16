import React, { useState, useEffect } from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  Bus, 
  Navigation, 
  Clock, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  Activity, 
  Sun, 
  Moon, 
  Search,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { 
    cityConfig, 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    searchQuery, 
    setSearchQuery,
    vehicles,
    alerts,
    trafficIncident
  } = useTransit();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalActiveBuses = vehicles.length;
  const severeAlertCount = alerts.length;

  const navTabs = [
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'routes', label: 'Route Explorer', icon: Bus, badge: '5 Lines' },
    { id: 'planner', label: 'Trip Planner', icon: Compass },
    { id: 'board', label: 'Arrival Board', icon: Clock },
    { id: 'dispatch', label: 'Dispatch Hub', icon: Activity, badge: `${totalActiveBuses} Live` },
    { id: 'alerts', label: 'Service Alerts', icon: AlertTriangle, badge: severeAlertCount > 0 ? `${severeAlertCount}` : null }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand & City Status */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bus className="w-5 h-5 text-blue-400 animate-pulse text-blue-400 font-bold" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
                  CityPulse<span className="text-blue-500">Transit</span>
                </h1>
                <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {cityConfig.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Real-Time Telemetry Feed Active
              </p>
            </div>
          </div>

          {/* Quick Stats on Mobile Header */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>

        {/* Center: Search & Navigation Tabs */}
        <div className="flex flex-1 items-center justify-center max-w-2xl w-full">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto max-w-full scrollbar-none">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Clock & Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono-code text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          {/* Traffic Status Indicator */}
          {trafficIncident ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium animate-pulse text-blue-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Traffic Delay Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Network Optimal</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="Toggle Light/Dark Theme (Hotkey: Alt+T)"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

      </div>
    </header>
  );
}

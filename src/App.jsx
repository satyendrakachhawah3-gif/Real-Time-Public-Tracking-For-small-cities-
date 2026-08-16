import React from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import RouteExplorer from './components/RouteExplorer';
import TripPlanner from './components/TripPlanner';
import ArrivalBoard from './components/ArrivalBoard';
import DispatchAdmin from './components/DispatchAdmin';
import ServiceAlerts from './components/ServiceAlerts';
import MobileBottomSheet from './components/MobileBottomSheet';
import { Bus, AlertTriangle, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { activeTab, alerts, cityConfig } = useTransit();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'routes': return <RouteExplorer />;
      case 'planner': return <TripPlanner />;
      case 'board': return <ArrivalBoard />;
      case 'dispatch': return <DispatchAdmin />;
      case 'alerts': return <ServiceAlerts />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Body */}
      <main className="flex-1 relative flex overflow-hidden">
        
        {/* Left Side Floating Panel for Desktop (When a tab other than pure map is active or side-by-side) */}
        {activeTab !== 'map' && (
          <aside className="hidden md:block w-[420px] lg:w-[460px] h-full border-r border-slate-800/80 z-20 shadow-2xl transition-all">
            {renderActiveTabContent()}
          </aside>
        )}

        {/* Center / Right: Interactive Map */}
        <section className="flex-1 h-full relative">
          <MapView />
        </section>

        {/* Mobile Bottom Sheet Drawer */}
        <MobileBottomSheet />

      </main>

      {/* Bottom Live Service Ticker Bar */}
      <footer className="z-30 w-full bg-slate-950/95 border-t border-slate-800/80 py-1.5 px-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 whitespace-nowrap">
            <Bus className="w-3 h-3" /> Live Bulletin
          </span>
          <div className="whitespace-nowrap overflow-hidden text-ellipsis text-[11px] text-slate-300">
            {alerts.length > 0 ? (
              <span><strong>{alerts[0].title}:</strong> {alerts[0].message}</span>
            ) : (
              <span>Grandview Springs Transit operating normally across all 5 municipal routes.</span>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-[10px] text-slate-500 font-mono-code flex-shrink-0">
          <span>Operating: {cityConfig.operatingHours}</span>
          <span>Flat Fare: ${cityConfig.flatFare.toFixed(2)}</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> GTFS-RT Compliant
          </span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <TransitProvider>
      <AppContent />
    </TransitProvider>
  );
}

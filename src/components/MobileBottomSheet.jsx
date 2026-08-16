import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import RouteExplorer from './RouteExplorer';
import TripPlanner from './TripPlanner';
import ArrivalBoard from './ArrivalBoard';
import DispatchAdmin from './DispatchAdmin';
import ServiceAlerts from './ServiceAlerts';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function MobileBottomSheet() {
  const { activeTab } = useTransit();
  const [isOpen, setIsOpen] = useState(false);

  if (activeTab === 'map' && !isOpen) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 rounded-full bg-slate-900/90 text-white font-semibold text-xs border border-slate-700 shadow-2xl flex items-center gap-2 backdrop-blur-md"
        >
          <ChevronUp className="w-4 h-4 text-blue-400" /> Open Transit Controls
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
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
    <div className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-300 ${
      isOpen || activeTab !== 'map' ? 'h-[75vh]' : 'h-0 overflow-hidden'
    }`}>
      <div className="w-full h-full bg-slate-950 border-t border-slate-800 rounded-t-3xl shadow-2xl flex flex-col">
        
        {/* Handle Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2.5 flex items-center justify-center cursor-pointer border-b border-slate-900"
        >
          <div className="w-12 h-1.5 rounded-full bg-slate-700"></div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
}

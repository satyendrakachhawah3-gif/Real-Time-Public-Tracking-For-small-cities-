import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  Activity, 
  Play, 
  Pause, 
  FastForward, 
  AlertTriangle, 
  Bus, 
  Gauge, 
  BatteryCharging, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Zap,
  PlusCircle
} from 'lucide-react';

export default function DispatchAdmin() {
  const { 
    vehicles, 
    routes, 
    simSpeed, 
    setSimSpeed, 
    trafficIncident, 
    setTrafficIncident,
    addAlert,
    alerts 
  } = useTransit();

  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertMsg, setNewAlertMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  const totalPassengers = vehicles.reduce((sum, v) => sum + v.passengers, 0);
  const avgBattery = Math.round(vehicles.reduce((sum, v) => sum + v.batteryLevel, 0) / vehicles.length);
  const avgSpeed = Math.round(vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length);

  const handleBroadcastAlert = (e) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertMsg) return;

    addAlert({
      id: `alert-${Date.now()}`,
      severity: 'warning',
      title: newAlertTitle,
      affectedRoutes: ['All'],
      message: newAlertMsg,
      timestamp: 'Just now'
    });

    setNewAlertTitle('');
    setNewAlertMsg('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/90 text-slate-100 p-4 overflow-y-auto custom-scrollbar">
      
      {/* Header & Simulation Control Center */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Dispatch & Fleet Operations Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, driver monitoring, live simulation controls, and emergency alerts.
          </p>
        </div>

        {/* Simulation Speed Controller Bar */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase px-2">Sim Speed:</span>
          
          <button
            onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              simSpeed === 0 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Pause/Play Simulation"
          >
            {simSpeed === 0 ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {[1, 2, 5].map(speed => (
            <button
              key={speed}
              onClick={() => setSimSpeed(speed)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold transition-all ${
                simSpeed === speed 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        
        <div className="glass-card rounded-2xl p-3 border border-slate-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-blue-400" /> Active Fleet
          </span>
          <span className="font-heading font-extrabold text-xl text-white block mt-1">
            {vehicles.length} <span className="text-xs font-normal text-slate-400">units</span>
          </span>
        </div>

        <div className="glass-card rounded-2xl p-3 border border-slate-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Rider Load
          </span>
          <span className="font-heading font-extrabold text-xl text-emerald-400 block mt-1">
            {totalPassengers} <span className="text-xs font-normal text-slate-400">riders</span>
          </span>
        </div>

        <div className="glass-card rounded-2xl p-3 border border-slate-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <BatteryCharging className="w-3.5 h-3.5 text-indigo-400" /> Avg Fleet Battery
          </span>
          <span className="font-heading font-extrabold text-xl text-indigo-300 block mt-1">
            {avgBattery}%
          </span>
        </div>

        <div className="glass-card rounded-2xl p-3 border border-slate-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-amber-400" /> Network Speed
          </span>
          <span className="font-heading font-extrabold text-xl text-amber-300 block mt-1">
            {avgSpeed} <span className="text-xs font-normal text-slate-400">mph</span>
          </span>
        </div>

      </div>

      {/* Quick Action Simulator Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTrafficIncident(!trafficIncident)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
              trafficIncident 
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 animate-pulse' 
                : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {trafficIncident ? 'Traffic Delay Simulated (Active)' : 'Simulate Traffic Delay'}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
          >
            <Radio className="w-4 h-4" /> Broadcast Advisory
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono-code">
          System Latency: <strong className="text-emerald-400">12ms</strong>
        </span>
      </div>

      {/* Broadcast Advisory Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl">
            <h3 className="font-heading font-bold text-lg text-white mb-2">Broadcast Service Alert</h3>
            <form onSubmit={handleBroadcastAlert} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Advisory Title</label>
                <input
                  type="text"
                  placeholder="e.g. Main St Parade Detour"
                  value={newAlertTitle}
                  onChange={e => setNewAlertTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Detailed Message</label>
                <textarea
                  placeholder="Enter bulletin text for riders..."
                  value={newAlertMsg}
                  onChange={e => setNewAlertMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white h-20"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Publish Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fleet Telemetry Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Fleet Telemetry & Performance Roster ({vehicles.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase text-slate-400">
              <tr>
                <th className="p-3">Vehicle ID</th>
                <th className="p-3">Line</th>
                <th className="p-3">Driver</th>
                <th className="p-3">Speed</th>
                <th className="p-3">Battery</th>
                <th className="p-3">Occupancy</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map(v => {
                const route = routes.find(r => r.id === v.routeId);
                return (
                  <tr key={v.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono-code font-bold text-white">
                      {v.unitNumber}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: route?.color }}>
                        {route?.code}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-200">{v.driver}</td>
                    <td className="p-3 font-mono-code">{Math.round(v.speed)} mph</td>
                    <td className="p-3 font-mono-code text-emerald-400">{v.batteryLevel}%</td>
                    <td className="p-3 font-mono-code">
                      {v.passengers}/{v.capacity} ({Math.round((v.passengers / v.capacity) * 100)}%)
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'ON_TIME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

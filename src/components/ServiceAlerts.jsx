import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Clock, 
  Send, 
  CheckCircle,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function ServiceAlerts() {
  const { alerts, addAlert } = useTransit();
  const [reportText, setReportText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setReportText('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/90 text-slate-100 p-4 overflow-y-auto custom-scrollbar">
      
      {/* Title */}
      <div className="mb-4">
        <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Live Service Advisories & Bulletins
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Live transit advisories, severe weather updates, road construction detours, and rider reporting.
        </p>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 mb-6">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`glass-card rounded-2xl p-4 border transition-all ${
              alert.severity === 'severe' 
                ? 'border-red-500/50 bg-red-950/20' 
                : alert.severity === 'warning'
                ? 'border-amber-500/50 bg-amber-950/20'
                : 'border-blue-500/50 bg-blue-950/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${
                alert.severity === 'severe' ? 'bg-red-500/20 text-red-400' :
                alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {alert.severity === 'severe' ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-sm text-white">{alert.title}</h3>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono-code">
                    <Clock className="w-3 h-3 text-slate-500" /> {alert.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {alert.message}
                </p>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-slate-400">Affected Lines:</span>
                  {alert.affectedRoutes.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono-code font-bold">
                      Route {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rider Feedback / Issue Reporting Box */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/90 shadow-xl">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-blue-400" /> Report a Rider Issue or Delay
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Spotted a delay, dirty shelter, or overcrowded bus? Send instant feedback to Grandview Springs Dispatch.
        </p>

        {submitted ? (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Thank you! Your report has been submitted to dispatch.
          </div>
        ) : (
          <form onSubmit={handleSubmitReport} className="space-y-3">
            <textarea
              placeholder="Describe the location, bus number, or incident..."
              value={reportText}
              onChange={e => setReportText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all h-20"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Submit Rider Report
            </button>
          </form>
        )}
      </div>

    </div>
  );
}

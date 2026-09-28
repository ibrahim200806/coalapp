import React from 'react';
import { MineSite, InspectionRecord, CAPAAction, StatutoryDocument, UserRole } from '../types';
import { AIRiskEngine } from '../services/aiRiskEngine';
import {
  AlertTriangle,
  ShieldCheck,
  ClipboardList,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Camera,
  FileCheck2,
  MapPin,
} from 'lucide-react';

interface DashboardTabProps {
  currentMine: MineSite;
  currentRole: UserRole;
  inspections: InspectionRecord[];
  capaActions: CAPAAction[];
  documents: StatutoryDocument[];
  onNavigate: (tab: 'inspect' | 'capa' | 'ocr' | 'map') => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  currentMine,
  currentRole,
  inspections,
  capaActions,
  documents,
  onNavigate,
}) => {
  const riskResult = AIRiskEngine.evaluateMineRisk(inspections, capaActions, documents);

  const openCapas = capaActions.filter(
    (c) => c.status === 'OPEN' || c.status === 'IN_PROGRESS' || c.status === 'PENDING_VERIFICATION'
  );
  const criticalIssues = inspections.reduce((acc, i) => acc + i.criticalIssuesFound, 0);
  const expiredDocs = documents.filter((d) => d.status === 'EXPIRED');

  // Risk color mapping
  const getRiskColor = (cat: string) => {
    switch (cat) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/80 border-rose-800';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/80 border-amber-800';
      case 'MEDIUM':
        return 'text-yellow-300 bg-yellow-950/80 border-yellow-800';
      default:
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    }
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Top Banner: Mine Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5" />
              {currentMine.subsidiary}
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {currentMine.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{currentMine.location}</p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border flex flex-col items-center justify-center font-mono ${getRiskColor(
              riskResult.category
            )}`}
          >
            <span className="text-[10px] font-bold tracking-wider uppercase">RISK INDEX</span>
            <span className="text-2xl font-black">{riskResult.score}</span>
            <span className="text-[9px] font-bold">{riskResult.category}</span>
          </div>
        </div>

        {/* Risk meter bar */}
        <div className="mt-3.5">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
            <span>Safety Risk Index</span>
            <span className="text-amber-400 font-mono">Tolerance limit: 50</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-700 ${
                riskResult.score > 70
                  ? 'bg-rose-500'
                  : riskResult.score > 40
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${riskResult.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('inspect')}
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/10 border border-amber-500/30 text-left hover:border-amber-500/60 active:scale-98 transition"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Start Inspection</div>
            <div className="text-[10px] text-amber-300">Geo-tag & watermark</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ocr')}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-slate-700 active:scale-98 transition"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Scan Permits</div>
            <div className="text-[10px] text-slate-400">OCR expiry check</div>
          </div>
        </button>
      </div>

      {/* Key Field Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-rose-400 text-lg font-bold font-mono">{criticalIssues}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Critical Flags</div>
        </div>
        <div
          onClick={() => onNavigate('capa')}
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center cursor-pointer hover:border-amber-500/40"
        >
          <div className="text-amber-400 text-lg font-bold font-mono">{openCapas.length}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Open CAPAs</div>
        </div>
        <div
          onClick={() => onNavigate('ocr')}
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center cursor-pointer hover:border-sky-500/40"
        >
          <div className="text-sky-400 text-lg font-bold font-mono">{expiredDocs.length}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Expired Docs</div>
        </div>
      </div>

      {/* AI Anomaly & Violation Engine Alerts */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              AI Risk & Anomaly Detection
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono">
            LIVE ANALYTICS
          </span>
        </div>

        {riskResult.anomaliesDetected.map((anomaly, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-1.5"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {anomaly.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {anomaly.confidence}% Conf.
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{anomaly.description}</p>
            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Action:</span>
              <span className="text-sky-300 font-medium">{anomaly.recommendedAction}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Inspections Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Recent Inspections
          </h3>
          <button
            onClick={() => onNavigate('inspect')}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-medium"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {inspections.slice(0, 3).map((insp) => (
          <div
            key={insp.id}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100">{insp.zone}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    insp.status === 'SYNCED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {insp.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>By {insp.inspectorName}</span>
                <span>•</span>
                <span>{new Date(insp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-bold font-mono ${
                  insp.failedChecks > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {insp.passedChecks}/{insp.totalChecks} PASS
              </span>
              {insp.criticalIssuesFound > 0 && (
                <div className="text-[10px] text-rose-400 font-medium">
                  {insp.criticalIssuesFound} Critical
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

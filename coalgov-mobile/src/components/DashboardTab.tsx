import React from 'react';
import {
  MineSite,
  InspectionRecord,
  CAPAAction,
  StatutoryDocument,
  UserRole,
  ContractorEntity,
  EmergencyAlert,
} from '../types';
import { AIRiskEngine } from '../services/aiRiskEngine';
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Camera,
  MapPin,
  AlertOctagon,
  ScanLine,
  ShieldAlert,
  HardHat,
} from 'lucide-react';

interface DashboardTabProps {
  currentMine: MineSite;
  currentRole: UserRole;
  inspections: InspectionRecord[];
  capaActions: CAPAAction[];
  documents: StatutoryDocument[];
  contractors: ContractorEntity[];
  emergencyAlerts: EmergencyAlert[];
  onNavigate: (tab: any) => void;
  onOpenSOS: () => void;
  theme?: 'dark' | 'light';
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  currentMine,
  inspections,
  capaActions,
  documents,
  emergencyAlerts,
  onNavigate,
  onOpenSOS,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const riskResult = AIRiskEngine.evaluateMineRisk(inspections, capaActions, documents);

  const openCapas = capaActions.filter(
    (c) => c.status === 'OPEN' || c.status === 'IN_PROGRESS' || c.status === 'PENDING_VERIFICATION'
  );
  const criticalIssues = inspections.reduce((acc, i) => acc + i.criticalIssuesFound, 0);
  const expiredDocs = documents.filter((d) => d.status === 'EXPIRED');
  const activeSOS = emergencyAlerts.find((a) => a.active);

  const getRiskColor = (cat: string) => {
    switch (cat) {
      case 'CRITICAL':
        return isDark
          ? 'text-rose-400 bg-rose-950/80 border-rose-800'
          : 'text-rose-700 bg-rose-100 border-rose-300 font-black';
      case 'HIGH':
        return isDark
          ? 'text-amber-400 bg-amber-950/80 border-amber-800'
          : 'text-amber-800 bg-amber-100 border-amber-300 font-black';
      case 'MEDIUM':
        return isDark
          ? 'text-yellow-300 bg-yellow-950/80 border-yellow-800'
          : 'text-amber-900 bg-yellow-100 border-yellow-300 font-bold';
      default:
        return isDark
          ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
          : 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold';
    }
  };

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Active Emergency SOS Alert Banner */}
      {activeSOS && (
        <div
          onClick={onOpenSOS}
          className="bg-rose-600 text-white rounded-2xl p-3.5 shadow-xl shadow-rose-950/40 cursor-pointer animate-pulse flex items-start gap-3"
        >
          <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest font-mono">
                CRITICAL PIT EVACUATION ALARM
              </span>
              <span className="text-[9px] bg-rose-900 px-1.5 py-0.5 rounded text-white font-mono font-bold">
                LIVE
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mt-0.5">{activeSOS.type.replace(/_/g, ' ')}</h4>
            <p className="text-[11px] text-rose-100 mt-1 leading-snug">{activeSOS.message}</p>
          </div>
        </div>
      )}

      {/* Top Banner: Mine Overview */}
      <div className={`border rounded-2xl p-4 shadow-lg transition-colors ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-amber-400' : 'text-amber-700'
            }`}>
              <MapPin className="w-3.5 h-3.5" />
              {currentMine.subsidiary}
            </div>
            <h1 className={`text-xl font-black tracking-tight mt-0.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {currentMine.name}
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentMine.location} • Pit Safety Zone 1
            </p>
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
          <div className={`flex justify-between text-[10px] font-medium mb-1 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Daily Open-Cast Safety Index</span>
            <span className={isDark ? 'text-amber-400 font-mono' : 'text-amber-700 font-mono font-bold'}>
              DGMS Baseline: 50
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden flex ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}>
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

      {/* Field Worker Shift Info Banner */}
      <div className={`px-3.5 py-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-2">
          <HardHat className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Shift Roster: <strong>General Shift (08:00 - 16:30)</strong></span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
          isDark ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
        }`}>
          FO-9412
        </span>
      </div>

      {/* Field Officer Quick Action Matrix */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('inspect')}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left active:scale-98 transition shadow-sm ${
            isDark
              ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/10 border-amber-500/30 hover:border-amber-500/60'
              : 'bg-amber-50/80 border-amber-200 hover:border-amber-400'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              New Inspection
            </div>
            <div className={`text-[10px] ${isDark ? 'text-amber-300' : 'text-amber-800 font-medium'}`}>
              Geo-tag & watermark
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ocr')}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left active:scale-98 transition shadow-sm ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-sky-300'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold shrink-0">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Scan Document
            </div>
            <div className={`text-[10px] ${isDark ? 'text-sky-300' : 'text-sky-700 font-medium'}`}>
              HEMM & Permits
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('capa')}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left active:scale-98 transition shadow-sm ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              CAPA Closures
            </div>
            <div className={`text-[10px] ${isDark ? 'text-rose-300' : 'text-rose-700 font-medium'}`}>
              {openCapas.length} In Progress
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('map')}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left active:scale-98 transition shadow-sm ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Pit GIS Map
            </div>
            <div className={`text-[10px] ${isDark ? 'text-emerald-300' : 'text-emerald-700 font-medium'}`}>
              Open-cast hazards
            </div>
          </div>
        </button>
      </div>

      {/* Key Field Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`border rounded-xl p-3 text-center transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="text-rose-500 text-lg font-black font-mono">{criticalIssues}</div>
          <div className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Critical Flags
          </div>
        </div>

        <div
          onClick={() => onNavigate('capa')}
          className={`border rounded-xl p-3 text-center cursor-pointer transition-colors ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40'
              : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="text-amber-500 text-lg font-black font-mono">{openCapas.length}</div>
          <div className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Open CAPAs
          </div>
        </div>

        <div
          onClick={() => onNavigate('ocr')}
          className={`border rounded-xl p-3 text-center cursor-pointer transition-colors ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 hover:border-sky-500/40'
              : 'bg-white border-slate-200 hover:border-sky-400 shadow-sm'
          }`}
        >
          <div className="text-sky-500 text-lg font-black font-mono">{expiredDocs.length}</div>
          <div className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Expired Docs
          </div>
        </div>
      </div>

      {/* AI Anomaly & Violation Engine Alerts */}
      <div className={`border rounded-2xl p-3.5 shadow-md space-y-3 transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <h3 className={`text-xs font-bold uppercase tracking-wide ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              AI Risk & Recurrence Anomaly Engine
            </h3>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
            isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-900'
          }`}>
            LIVE ANALYTICS
          </span>
        </div>

        {riskResult.anomaliesDetected.map((anomaly, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border space-y-1.5 transition-colors ${
              isDark
                ? 'bg-slate-950/70 border-amber-500/20'
                : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${
                isDark ? 'text-amber-300' : 'text-amber-900'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {anomaly.title}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-700 bg-slate-200'
              }`}>
                {anomaly.confidence}% Conf.
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {anomaly.description}
            </p>
            <div className={`pt-1.5 border-t flex items-center justify-between text-[10px] ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
            }`}>
              <span className="font-medium">Statutory Action:</span>
              <span className={isDark ? 'text-sky-300 font-bold' : 'text-sky-800 font-bold'}>
                {anomaly.recommendedAction}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Field Inspections Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
            isDark ? 'text-slate-300' : 'text-slate-800'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            Recent Field Inspections
          </h3>
          <button
            onClick={() => onNavigate('inspect')}
            className={`text-[11px] flex items-center gap-0.5 font-bold ${
              isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
            }`}
          >
            New Check <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {inspections.slice(0, 3).map((insp) => (
          <div
            key={insp.id}
            className={`border rounded-xl p-3 flex items-center justify-between transition-colors ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {insp.zone}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    insp.status === 'SYNCED' || insp.status === 'VERIFIED'
                      ? isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isDark ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {insp.status}
                </span>
              </div>
              <div className={`text-[11px] mt-0.5 flex items-center gap-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>By {insp.inspectorName}</span>
                <span>•</span>
                <span>{new Date(insp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-bold font-mono ${
                  insp.failedChecks > 0 ? 'text-rose-500' : 'text-emerald-600'
                }`}
              >
                {insp.passedChecks}/{insp.totalChecks} PASS
              </span>
              {insp.criticalIssuesFound > 0 && (
                <div className="text-[10px] text-rose-500 font-bold">
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

import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  Sparkles,
  AlertTriangle,
  FileWarning,
  WifiOff,
  Building,
  Scale,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface QuickDemoBarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onSimulateHazard: () => void;
  onSimulateExpiredDoc: () => void;
  onToggleOffline: () => void;
  isOffline: boolean;
  onOpenSOS: () => void;
  onOpenReport: () => void;
}

export const QuickDemoBar: React.FC<QuickDemoBarProps> = ({
  currentRole,
  onChangeRole,
  onSimulateHazard,
  onSimulateExpiredDoc,
  onToggleOffline,
  isOffline,
  onOpenSOS,
  onOpenReport,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 border-b border-amber-500/30 text-xs">
      {/* Toggle Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent text-[11px] font-bold text-amber-300 hover:text-amber-200 transition"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Enterprise Mine Safety Scenarios & Test Suite</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-normal">
            {isOpen ? 'Hide Panel' : 'Tap to Test Scenarios'}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Quick Action Grid */}
      {isOpen && (
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 space-y-2.5 animate-fadeIn">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            One-Tap Demonstration Trigger:
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Scenario 1: Highwall Hazard */}
            <button
              onClick={onSimulateHazard}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-900/50 flex items-center gap-2 font-semibold text-left shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="block font-bold">1. Inject Highwall Crack</span>
                <span className="text-[9px] text-slate-400">Triggers AI Anomaly & CAPA</span>
              </div>
            </button>

            {/* Scenario 2: Expired Permit */}
            <button
              onClick={onSimulateExpiredDoc}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-900/50 flex items-center gap-2 font-semibold text-left shadow-sm"
            >
              <FileWarning className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="block font-bold">2. Inject Expired License</span>
                <span className="text-[9px] text-slate-400">Halts Contractor in Pit</span>
              </div>
            </button>

            {/* Scenario 3: Pit SOS */}
            <button
              onClick={onOpenSOS}
              className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-200 border border-rose-800/80 flex items-center gap-2 font-semibold text-left shadow-sm"
            >
              <Zap className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <div>
                <span className="block font-bold">3. Pit Emergency Siren</span>
                <span className="text-[9px] text-rose-300">Evacuation Broadcast</span>
              </div>
            </button>

            {/* Scenario 4: DGMS Form */}
            <button
              onClick={onOpenReport}
              className="p-2 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-200 border border-emerald-800/60 flex items-center gap-2 font-semibold text-left shadow-sm"
            >
              <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="block font-bold">4. Statutory DGMS Form</span>
                <span className="text-[9px] text-emerald-300">Printable Form 24</span>
              </div>
            </button>
          </div>

          {/* Quick Perspective Switcher */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Switch Perspective:</span>
            <div className="flex gap-1">
              {[
                { r: 'FIELD_OFFICER', label: '👷 Field' },
                { r: 'MINE_MANAGER', label: '🏢 Manager' },
                { r: 'CORPORATE_MGMT', label: '🌐 HQ' },
                { r: 'REGULATORY_AUDITOR', label: '⚖️ DGMS' },
              ].map((role) => (
                <button
                  key={role.r}
                  onClick={() => onChangeRole(role.r as UserRole)}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    currentRole === role.r
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

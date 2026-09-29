import React, { useState } from 'react';
import { MineSite, UserProfile } from '../types';
import { MOCK_MINES } from '../services/mockData';
import { StorageService } from '../services/storage';
import {
  Settings,
  Shield,
  Sliders,
  Bell,
  RotateCcw,
  CheckCircle2,
  Database,
  Users,
} from 'lucide-react';

interface AdminConfigTabProps {
  currentMine: MineSite;
  userProfile: UserProfile;
  onConfigUpdated: () => void;
}

export const AdminConfigTab: React.FC<AdminConfigTabProps> = ({
  currentMine,
  userProfile,
  onConfigUpdated,
}) => {
  const [level1SLA, setLevel1SLA] = useState('24');
  const [level2SLA, setLevel2SLA] = useState('48');
  const [level3SLA, setLevel3SLA] = useState('72');
  const [highRiskThreshold, setHighRiskThreshold] = useState('65');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveConfig = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onConfigUpdated();
    }, 1200);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset demo data to initial statutory seed state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">System Administration</h2>
            <p className="text-[10px] text-slate-400">Statutory Rule Engines & SLA Calibration</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          SuperAdmin
        </span>
      </div>

      {/* Success Notification */}
      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Statutory SLA rules and risk thresholds calibrated successfully!</span>
        </div>
      )}

      {/* Escalation SLA Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            SLA Escalation Time Thresholds (Hours)
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Level 1: Supervisor Resolution</span>
              <span className="text-[10px] text-slate-400">Initial rectification window</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={level1SLA}
                onChange={(e) => setLevel1SLA(e.target.value)}
                className="w-14 bg-slate-900 border border-slate-700 rounded-lg p-1 text-center text-amber-400 font-bold"
              />
              <span className="text-slate-500 text-[10px]">hrs</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Level 2: Mine Safety Officer</span>
              <span className="text-[10px] text-slate-400">Managerial breach notification</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={level2SLA}
                onChange={(e) => setLevel2SLA(e.target.value)}
                className="w-14 bg-slate-900 border border-slate-700 rounded-lg p-1 text-center text-amber-400 font-bold"
              />
              <span className="text-slate-500 text-[10px]">hrs</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Level 3: General Manager & Agent</span>
              <span className="text-[10px] text-slate-400">Statutory show-cause escalation</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={level3SLA}
                onChange={(e) => setLevel3SLA(e.target.value)}
                className="w-14 bg-slate-900 border border-slate-700 rounded-lg p-1 text-center text-amber-400 font-bold"
              />
              <span className="text-slate-500 text-[10px]">hrs</span>
            </div>
          </div>
        </div>

        {/* High Risk Cutoff */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-200 block">High Risk Classification Index:</span>
            <span className="text-[10px] text-slate-400">Mines exceeding this index trigger corporate alerts</span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <input
              type="number"
              value={highRiskThreshold}
              onChange={(e) => setHighRiskThreshold(e.target.value)}
              className="w-14 bg-slate-900 border border-slate-700 rounded-lg p-1 text-center text-rose-400 font-bold"
            />
            <span className="text-slate-500 text-[10px]">/100</span>
          </div>
        </div>

        <button
          onClick={handleSaveConfig}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition"
        >
          Save System Configuration
        </button>
      </div>

      {/* Statutory Rules Catalog */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Statutory Rule Directives
          </h3>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-300">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span>Reg. 106 Coal Mines Regulations (CMR) 2017</span>
            <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span>DGMS (Tech) Circular No. 05/2010 (Haul Roads)</span>
            <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span>Mines Vocational Training Rules 1966 (Contractor PPE)</span>
            <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Reset Seed Demo Database */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-300">Reset Demo Database</h4>
          <p className="text-[10px] text-slate-400">Restore factory demonstration records</p>
        </div>
        <button
          onClick={handleResetData}
          className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-bold border border-rose-700 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Data
        </button>
      </div>
    </div>
  );
};

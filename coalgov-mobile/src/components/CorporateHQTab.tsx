import React, { useState } from 'react';
import { MineSite, CAPAAction } from '../types';
import { MOCK_MINES } from '../services/mockData';
import {
  Building,
  TrendingUp,
  AlertTriangle,
  Flame,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  Clock,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface CorporateHQTabProps {
  onSelectMine: (mineId: string) => void;
  capaActions: CAPAAction[];
}

export const CorporateHQTab: React.FC<CorporateHQTabProps> = ({
  onSelectMine,
  capaActions,
}) => {
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>('ALL');

  const filteredMines = MOCK_MINES.filter((m) => {
    if (selectedSubsidiary === 'ALL') return true;
    return m.subsidiary.includes(selectedSubsidiary);
  });

  const totalProduction = MOCK_MINES.reduce((acc, m) => acc + m.monthlyProductionMT, 0);
  const totalViolations = MOCK_MINES.reduce((acc, m) => acc + m.activeViolations, 0);
  const highRiskCount = MOCK_MINES.filter((m) => m.riskScore > 65).length;

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Corporate Governance HQ</h2>
            <p className="text-[10px] text-slate-400">Multi-Subsidiary Risk & Production Intelligence</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
          5 Mines Monitored
        </span>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">Total Monthly Output</span>
          <span className="text-lg font-black font-mono text-amber-400">
            {totalProduction.toFixed(1)} MT
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">Active Non-Compliances</span>
          <span className="text-lg font-black font-mono text-rose-400">{totalViolations}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">High-Risk Mines</span>
          <span className="text-lg font-black font-mono text-orange-400">{highRiskCount}</span>
        </div>
      </div>

      {/* Subsidiary Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['ALL', 'SECL', 'NCL', 'CCL'].map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubsidiary(sub)}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
              selectedSubsidiary === sub
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {sub === 'ALL' ? 'All CIL Subsidiaries' : sub}
          </button>
        ))}
      </div>

      {/* Comparative Mine League Table */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1 flex items-center justify-between">
          <span>Mine-Level Risk Scorecards</span>
          <span className="text-[10px] text-slate-500 font-mono">Sorted by Risk Index</span>
        </h3>

        {filteredMines
          .sort((a, b) => b.riskScore - a.riskScore)
          .map((mine, idx) => {
            const isCritical = mine.riskScore >= 75;
            const isHigh = mine.riskScore >= 55 && mine.riskScore < 75;

            return (
              <div
                key={mine.id}
                onClick={() => onSelectMine(mine.id)}
                className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-3.5 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 font-mono text-xs font-bold flex items-center justify-center text-slate-300">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {mine.name}
                        {isCritical && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400">{mine.subsidiary.split(' ')[0]} • {mine.location}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg border ${
                        isCritical
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : isHigh
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      RISK {mine.riskScore}
                    </span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isCritical
                          ? 'bg-rose-500'
                          : isHigh
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${mine.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Output: <strong className="text-slate-200">{mine.monthlyProductionMT} MT</strong></span>
                  <span>Active Violations: <strong className={mine.activeViolations > 0 ? 'text-rose-400' : 'text-emerald-400'}>{mine.activeViolations}</strong></span>
                  <span>Agencies: <strong className="text-slate-200">{mine.contractorCount}</strong></span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Escalation Matrix Monitor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Statutory Escalation Matrix
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            DGMS SLA DIRECTIVE
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">LEVEL 1 (0-24 hrs)</span>
              <div className="font-bold text-slate-200">Pit Safety Supervisor</div>
            </div>
            <span className="text-emerald-400 font-mono font-bold text-[11px]">8 Active</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-mono">LEVEL 2 (24-48 hrs)</span>
              <div className="font-bold text-slate-200">Mine Safety Officer (Manager)</div>
            </div>
            <span className="text-amber-400 font-mono font-bold text-[11px]">3 Breached</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-orange-400 uppercase font-mono">LEVEL 3 (48-72 hrs)</span>
              <div className="font-bold text-slate-200">General Manager / Mine Agent</div>
            </div>
            <span className="text-orange-400 font-mono font-bold text-[11px]">1 Highwall Esc.</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-400 uppercase font-mono font-bold">LEVEL 4 (&gt;72 hrs)</span>
              <div className="font-bold text-rose-300">Directorate General of Mines Safety (DGMS)</div>
            </div>
            <span className="text-rose-400 font-mono font-bold text-[11px] animate-pulse">0 Formal Notices</span>
          </div>
        </div>
      </div>
    </div>
  );
};

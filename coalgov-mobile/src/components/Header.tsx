import React from 'react';
import { MOCK_MINES } from '../services/mockData';
import { StorageService } from '../services/storage';
import { UserRole } from '../types';
import { Wifi, WifiOff, RefreshCw, UserCheck, ChevronDown, Flame } from 'lucide-react';

interface HeaderProps {
  selectedMineId: string;
  onSelectMine: (mineId: string) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  pendingSyncCount: number;
  onOpenSyncModal: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMineId,
  onSelectMine,
  currentRole,
  onChangeRole,
  pendingSyncCount,
  onOpenSyncModal,
  isOffline,
  onToggleOffline,
}) => {
  const currentMine = MOCK_MINES.find((m) => m.id === selectedMineId) || MOCK_MINES[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2.5 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Mine Select */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                COALGOV AI
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FIELD v2.6
              </span>
            </div>

            {/* Mine Picker */}
            <div className="relative inline-block mt-0.5">
              <select
                value={selectedMineId}
                onChange={(e) => onSelectMine(e.target.value)}
                className="text-xs font-semibold text-slate-200 bg-slate-800/80 border border-slate-700/80 rounded px-2 py-0.5 pr-5 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {MOCK_MINES.map((mine) => (
                  <option key={mine.id} value={mine.id} className="bg-slate-900 text-slate-100">
                    {mine.name} ({mine.subsidiary.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Status, Role & Sync Indicators */}
        <div className="flex items-center gap-1.5">
          {/* Role Badge Selector */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700 rounded-md px-1.5 py-1 appearance-none pr-4 focus:outline-none"
              title="Switch user perspective"
            >
              <option value="FIELD_OFFICER">👷 Field Officer</option>
              <option value="MINE_MANAGER">🏢 Mine Manager</option>
              <option value="REGULATORY_AUDITOR">⚖️ DGMS Auditor</option>
            </select>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-1 top-2 pointer-events-none" />
          </div>

          {/* Offline Simulator Switch */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md border transition-all ${
              isOffline
                ? 'bg-rose-950/80 text-rose-300 border-rose-800 shadow-sm shadow-rose-900/40'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
            }`}
            title="Click to toggle simulated pit connectivity"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>OFFLINE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>ONLINE</span>
              </>
            )}
          </button>

          {/* Sync Queue Button */}
          <button
            onClick={onOpenSyncModal}
            className="relative p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 active:scale-95 transition-transform"
            title="View Offline Sync Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pendingSyncCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
            {pendingSyncCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow">
                {pendingSyncCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { MOCK_MINES } from '../services/mockData';
import { Wifi, WifiOff, RefreshCw, ChevronDown, Flame, AlertOctagon, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  selectedMineId: string;
  onSelectMine: (mineId: string) => void;
  pendingSyncCount: number;
  onOpenSyncModal: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenSOS: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  inspectorName: string;
  badgeNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMineId,
  onSelectMine,
  pendingSyncCount,
  onOpenSyncModal,
  isOffline,
  onToggleOffline,
  onOpenSOS,
  theme,
  onToggleTheme,
  inspectorName,
  badgeNumber,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-3.5 py-2.5 shadow-md transition-colors ${
      isDark
        ? 'bg-slate-900/95 border-slate-800 text-slate-100'
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-1.5">
        {/* Brand & Inspector Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black tracking-wider uppercase ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}>
                COALGOV AI
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                isDark
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                FIELD APP
              </span>
            </div>

            {/* Mine Picker */}
            <div className="relative inline-block mt-0.5">
              <select
                value={selectedMineId}
                onChange={(e) => onSelectMine(e.target.value)}
                className={`text-[11px] font-bold border rounded px-2 py-0.5 pr-4 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[140px] truncate ${
                  isDark
                    ? 'text-slate-100 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-slate-100 border-slate-300'
                }`}
              >
                {MOCK_MINES.map((mine) => (
                  <option key={mine.id} value={mine.id}>
                    {mine.name.split(' ')[0]} ({mine.subsidiary.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-2.5 h-2.5 absolute right-1 top-1.5 pointer-events-none ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`} />
            </div>
          </div>
        </div>

        {/* Controls: SOS, Theme, Offline, Sync */}
        <div className="flex items-center gap-1.5">
          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/50 active:scale-95 transition"
            title="Trigger Emergency Pit Siren"
          >
            <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
            <span>SOS</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-lg border transition ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:text-amber-200'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Field Worker Badge (Fixed Role) */}
          <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold border ${
            isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-300'
          }`}>
            <span>👷 {badgeNumber}</span>
          </div>

          {/* Offline Simulator Switch */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
              isOffline
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : isDark
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
            title="Click to toggle pit cellular connectivity"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3 text-rose-400 animate-pulse" />
                <span className="text-[9px]">OFFLINE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px]">ONLINE</span>
              </>
            )}
          </button>

          {/* Sync Queue Button */}
          <button
            onClick={onOpenSyncModal}
            className={`relative p-1.5 rounded-lg border transition ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-amber-400'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-amber-600'
            }`}
            title="View Offline Sync Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pendingSyncCount > 0 ? 'text-amber-500 animate-spin' : isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            {pendingSyncCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center shadow">
                {pendingSyncCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

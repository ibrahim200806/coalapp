import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldAlert,
  ScanLine,
  MapPin,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'inspect'
  | 'capa'
  | 'ocr'
  | 'map';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  openCapaBadge?: number;
  theme?: 'dark' | 'light';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  openCapaBadge = 0,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const fieldTabs = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'inspect' as NavTab, label: 'Inspect', icon: ClipboardCheck },
    { id: 'capa' as NavTab, label: 'CAPA', icon: ShieldAlert, badge: openCapaBadge },
    { id: 'ocr' as NavTab, label: 'Doc OCR', icon: ScanLine },
    { id: 'map' as NavTab, label: 'Pit Map', icon: MapPin },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t safe-area-bottom shadow-2xl transition-colors ${
      isDark
        ? 'bg-slate-900/95 border-slate-800 text-slate-400'
        : 'bg-white/95 border-slate-200 text-slate-600 shadow-slate-300/50'
    }`}>
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1.5">
        {fieldTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-xl ${
                isActive
                  ? isDark
                    ? 'text-amber-400 font-bold'
                    : 'text-amber-600 font-extrabold bg-amber-50/80'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? isDark
                        ? 'scale-110 text-amber-400'
                        : 'scale-110 text-amber-600'
                      : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <div className={`w-4 h-0.5 rounded-full mt-0.5 animate-pulse ${
                  isDark ? 'bg-amber-400' : 'bg-amber-600'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

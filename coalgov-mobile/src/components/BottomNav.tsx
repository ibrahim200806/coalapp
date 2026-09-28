import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldAlert,
  ScanLine,
  MapPin,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'inspect' | 'capa' | 'ocr' | 'map';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  openCapaBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  openCapaBadge = 0,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'inspect' as NavTab, label: 'Inspect', icon: ClipboardCheck },
    { id: 'capa' as NavTab, label: 'CAPA', icon: ShieldAlert, badge: openCapaBadge },
    { id: 'ocr' as NavTab, label: 'Doc OCR', icon: ScanLine },
    { id: 'map' as NavTab, label: 'Mine Map', icon: MapPin },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 safe-area-bottom shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-lg ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-amber-400' : 'text-slate-400'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

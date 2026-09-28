import React, { useState, useEffect } from 'react';
import {
  MOCK_MINES,
  SEED_INSPECTIONS,
  SEED_CAPA_ACTIONS,
  SEED_STATUTORY_DOCS,
} from './services/mockData';
import { StorageService } from './services/storage';
import { UserRole, InspectionRecord } from './types';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardTab } from './components/DashboardTab';
import { InspectTab } from './components/InspectTab';
import { CapaTab } from './components/CapaTab';
import { OcrScannerTab } from './components/OcrScannerTab';
import { MineMapTab } from './components/MineMapTab';
import { SyncModal } from './components/SyncModal';
import { Smartphone, Monitor } from 'lucide-react';

export function App() {
  // Initialize storage with seeds if first load
  useEffect(() => {
    StorageService.initSeedDataIfEmpty(
      MOCK_MINES,
      SEED_INSPECTIONS,
      SEED_CAPA_ACTIONS,
      SEED_STATUTORY_DOCS
    );
  }, []);

  const [selectedMineId, setSelectedMineId] = useState<string>(() =>
    StorageService.getSelectedMineId()
  );
  const [userProfile, setUserProfile] = useState(() => StorageService.getUserProfile());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    StorageService.isSimulatedOffline()
  );
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState(true);

  // Data states
  const [inspections, setInspections] = useState(() => StorageService.getInspections());
  const [capaActions, setCapaActions] = useState(() => StorageService.getCapaActions());
  const [documents, setDocuments] = useState(() => StorageService.getDocuments());
  const [syncQueue, setSyncQueue] = useState(() => StorageService.getSyncQueue());

  const refreshData = () => {
    setInspections(StorageService.getInspections());
    setCapaActions(StorageService.getCapaActions());
    setDocuments(StorageService.getDocuments());
    setSyncQueue(StorageService.getSyncQueue());
  };

  const handleSelectMine = (mineId: string) => {
    setSelectedMineId(mineId);
    StorageService.setSelectedMineId(mineId);
  };

  const handleChangeRole = (role: UserRole) => {
    const updated = { ...userProfile, role };
    setUserProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    StorageService.setSimulatedOffline(next);
  };

  const handleInspectionCreated = (newRecord: InspectionRecord) => {
    refreshData();
    // After creating inspection, navigate to dashboard to see updated risk index
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 1200);
  };

  const currentMine =
    MOCK_MINES.find((m) => m.id === selectedMineId) || MOCK_MINES[0];

  const openCapaCount = capaActions.filter(
    (a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS' || a.status === 'PENDING_VERIFICATION'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start">
      {/* Desktop Demonstration Bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-4xl px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-semibold text-slate-200">
            CoalGov AI Field Companion — Mobile Runtime
          </span>
          <span className="font-mono text-slate-500">| SIH-26024 Compliance</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" /> Full Width
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" /> Mobile Phone Mockup
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full min-h-screen flex flex-col bg-slate-950 transition-all ${
          deviceFrameMode
            ? 'md:max-w-md md:my-6 md:min-h-[860px] md:h-[880px] md:border md:border-slate-800 md:rounded-[40px] md:shadow-2xl md:overflow-hidden md:relative'
            : 'max-w-xl'
        }`}
      >
        {/* Mobile Status Bar Simulation */}
        <div className="bg-slate-950 px-5 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-tight text-slate-500">5G DGMS-NET</span>
            <div className="w-4 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
              <div className="w-2.5 h-full bg-slate-300 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Top Header */}
        <Header
          selectedMineId={selectedMineId}
          onSelectMine={handleSelectMine}
          currentRole={userProfile.role}
          onChangeRole={handleChangeRole}
          pendingSyncCount={syncQueue.length}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
        />

        {/* Active Tab View */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab
              currentMine={currentMine}
              currentRole={userProfile.role}
              inspections={inspections}
              capaActions={capaActions}
              documents={documents}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'inspect' && (
            <InspectTab
              currentMine={currentMine}
              userProfile={userProfile}
              isOffline={isOffline}
              onInspectionCreated={handleInspectionCreated}
            />
          )}

          {activeTab === 'capa' && (
            <CapaTab
              currentMine={currentMine}
              userProfile={userProfile}
              currentRole={userProfile.role}
              capaActions={capaActions}
              onActionUpdated={refreshData}
            />
          )}

          {activeTab === 'ocr' && (
            <OcrScannerTab
              currentMine={currentMine}
              documents={documents}
              onDocumentAdded={refreshData}
            />
          )}

          {activeTab === 'map' && <MineMapTab currentMine={currentMine} />}
        </main>

        {/* Bottom Mobile Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          openCapaBadge={openCapaCount}
        />

        {/* Sync Queue Modal */}
        <SyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          syncQueue={syncQueue}
          onSyncCompleted={refreshData}
          isOffline={isOffline}
        />
      </div>
    </div>
  );
}

export default App;

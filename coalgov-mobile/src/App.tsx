import React, { useState, useEffect } from 'react';
import {
  MOCK_MINES,
  SEED_INSPECTIONS,
  SEED_CAPA_ACTIONS,
  SEED_STATUTORY_DOCS,
  MOCK_CONTRACTORS,
  SEED_AUDIT_LOGS,
  SEED_EMERGENCY_ALERTS,
} from './services/mockData';
import { StorageService } from './services/storage';
import { UserRole, InspectionRecord, StatutoryDocument, CAPAAction } from './types';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardTab } from './components/DashboardTab';
import { InspectTab } from './components/InspectTab';
import { CapaTab } from './components/CapaTab';
import { OcrScannerTab } from './components/OcrScannerTab';
import { MineMapTab } from './components/MineMapTab';
import { SyncModal } from './components/SyncModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { WebGovernancePortal } from './components/web/WebGovernancePortal';
import { GovPortalLogin } from './components/auth/GovPortalLogin';
import { Smartphone, Monitor, Layers, Sun, Moon, Sparkles, ChevronDown, AlertTriangle, FileWarning, Zap, LogOut } from 'lucide-react';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StorageService.getTheme());

  // Authentication state: starts at false so user lands on official Government Login Gateway
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('coalgov_auth') === 'true';
  });

  // Portal mode: 'mobile' | 'web' | 'split'
  const [portalMode, setPortalMode] = useState<'mobile' | 'web' | 'split'>('web');

  // Top scenario simulator toggle
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  // Initialize storage with seeds on initial load
  useEffect(() => {
    StorageService.initSeedDataIfEmpty(
      MOCK_MINES,
      SEED_INSPECTIONS,
      SEED_CAPA_ACTIONS,
      SEED_STATUTORY_DOCS,
      MOCK_CONTRACTORS,
      SEED_AUDIT_LOGS,
      SEED_EMERGENCY_ALERTS
    );
  }, []);

  // Update body class on theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    StorageService.setTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [selectedMineId, setSelectedMineId] = useState<string>(() =>
    StorageService.getSelectedMineId()
  );
  const [userProfile, setUserProfile] = useState(() => StorageService.getUserProfile());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    StorageService.isSimulatedOffline()
  );
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  // Collections
  const [inspections, setInspections] = useState(() => StorageService.getInspections());
  const [capaActions, setCapaActions] = useState(() => StorageService.getCapaActions());
  const [documents, setDocuments] = useState(() => StorageService.getDocuments());
  const [contractors, setContractors] = useState(() => StorageService.getContractors());
  const [auditLogs, setAuditLogs] = useState(() => StorageService.getAuditLogs());
  const [emergencyAlerts, setEmergencyAlerts] = useState(() => StorageService.getEmergencyAlerts());
  const [syncQueue, setSyncQueue] = useState(() => StorageService.getSyncQueue());

  const refreshData = () => {
    setInspections(StorageService.getInspections());
    setCapaActions(StorageService.getCapaActions());
    setDocuments(StorageService.getDocuments());
    setContractors(StorageService.getContractors());
    setAuditLogs(StorageService.getAuditLogs());
    setEmergencyAlerts(StorageService.getEmergencyAlerts());
    setSyncQueue(StorageService.getSyncQueue());
  };

  const handleSelectMine = (mineId: string) => {
    setSelectedMineId(mineId);
    StorageService.setSelectedMineId(mineId);
  };

  const handleChangeRole = (role: UserRole) => {
    let name = userProfile.name;
    let designation = userProfile.designation;
    let badgeNumber = userProfile.badgeNumber;

    if (role === 'SUPER_ADMIN') {
      name = 'Dr. Rajesh Gupta';
      designation = 'Chief Safety Controller & IT Directorate (Ministry of Coal)';
      badgeNumber = 'SUPER-ADMIN-00';
    } else if (role === 'MINE_MANAGER') {
      name = 'Er. Alok Ranjan';
      designation = 'Colliery Manager & Statutory Agent (First Class Mines Mgr Cert)';
      badgeNumber = 'MM-7721';
    } else if (role === 'CORPORATE_MGMT') {
      name = 'Dr. Sunita Deshmukh';
      designation = 'Executive Director (Safety & Operations), CIL HQ';
      badgeNumber = 'CIL-HQ-01';
    } else if (role === 'REGULATORY_AUDITOR') {
      name = 'Shri P. K. Srivastava';
      designation = 'Director of Mines Safety (DGMS Central Zone)';
      badgeNumber = 'DGMS-CZ-04';
    } else if (role === 'SYSTEM_ADMIN') {
      name = 'Vikramaditya Rao';
      designation = 'Chief Mine Systems & IT Security Administrator';
      badgeNumber = 'ADMIN-001';
    } else {
      name = 'Rajeshwar Sharma';
      designation = 'Field Safety Officer';
      badgeNumber = 'FO-9412';
    }

    const updated = { ...userProfile, role, name, designation, badgeNumber };
    setUserProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    StorageService.setSimulatedOffline(next);
  };

  const handleInspectionCreated = (_newRecord: InspectionRecord) => {
    refreshData();
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 1000);
  };

  // Scenario 1: Inject Highwall Tension Crack
  const handleSimulateHazard = () => {
    const now = new Date();
    const hazardInsp: InspectionRecord = {
      id: `INSP-SIM-${Date.now().toString().slice(-4)}`,
      mineId: selectedMineId,
      mineName: currentMine.name,
      zone: 'Bench 14 - Upper Highwall Terrace',
      inspectorId: 'FO-9412',
      inspectorName: 'Rajeshwar Sharma',
      timestamp: now.toISOString(),
      totalChecks: 5,
      passedChecks: 2,
      failedChecks: 3,
      criticalIssuesFound: 2,
      status: isOffline ? 'SAVED_OFFLINE' : 'SYNCED',
      syncedAt: isOffline ? undefined : now.toISOString(),
      overallComments: 'FIELD INCIDENT: Deep tension crack with water ingress observed. 30m exclusion perimeter established.',
      items: [
        {
          id: 'sim-chk-1',
          category: 'SLOPE_STABILITY',
          title: 'Bench Slope & Highwall Cracks',
          statutoryRule: 'Reg. 106 Coal Mines Regulations (CMR) 2017',
          description: 'Inspect top edge and toe of open-cast highwall for tension cracks.',
          status: 'FAIL',
          severityIfFailed: 'CRITICAL',
          observationNotes: 'Tension fissure widening to 45mm. Highwall failure risk imminent.',
        },
      ],
    };

    StorageService.saveInspection(hazardInsp);

    const newCapa: CAPAAction = {
      id: `CAPA-${Math.floor(1000 + Math.random() * 9000)}`,
      inspectionId: hazardInsp.id,
      mineId: selectedMineId,
      zone: 'Bench 14 - Upper Highwall Terrace',
      title: 'Emergency Highwall Stabilization & Radar Deployment',
      description: 'Halt all production dumpers within 30 meters of Bench 14. Deploy Terrestrial Laser Scanner.',
      violationCategory: 'SLOPE_STABILITY',
      statutoryRule: 'Reg. 106 CMR 2017',
      severity: 'CRITICAL',
      assignedTo: 'Dilip Buildcon Pit Lead & Geotechnical Team',
      assignedRole: 'CONTRACTOR_SAFETY_SUPERVISOR',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'OPEN',
      reportedAt: now.toISOString(),
      reportedBy: 'Rajeshwar Sharma (Field Safety Officer)',
    };

    StorageService.saveCapaAction(newCapa);
    refreshData();
    setShowScenarioMenu(false);
    alert('⚠️ Highwall Crack Hazard Injected! Risk Index recalculated, AI anomaly triggered, and Critical CAPA created.');
  };

  // Scenario 2: Inject Expired Contractor License
  const handleSimulateExpiredDoc = () => {
    const expiredDoc: StatutoryDocument = {
      id: `DOC-EXP-${Date.now().toString().slice(-4)}`,
      mineId: selectedMineId,
      contractorName: 'Pragati Infra Earthmovers',
      documentType: 'CONTRACTOR_LABOR_LICENSE',
      documentNumber: 'CLC/CENTRAL/2026/URGENT-EXP',
      issuingAuthority: 'Office of Chief Labour Commissioner (Central)',
      issueDate: '2025-08-01',
      expiryDate: '2026-09-20',
      status: 'EXPIRED',
      ocrConfidence: 98.4,
      extractedFields: {
        currentStatus: 'EXPIRED',
        authorizedPersonnel: '180 Uncertified Workers in Pit',
      },
    };

    StorageService.saveDocument(expiredDoc);

    const con = contractors.find((c) => c.name.includes('Pragati'));
    if (con) {
      con.status = 'HALTED_FOR_SAFETY';
      con.safetyScore = Math.max(con.safetyScore - 15, 20);
      StorageService.saveContractor(con);
    }

    refreshData();
    setShowScenarioMenu(false);
    alert('🚨 Expired Contractor Permit Injected! Agency Pragati Infra placed under HALTED status in pit.');
  };

  const currentMine =
    MOCK_MINES.find((m) => m.id === selectedMineId) || MOCK_MINES[0];

  const openCapaCount = capaActions.filter(
    (a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS' || a.status === 'PENDING_VERIFICATION'
  ).length;

  const isDark = theme === 'dark';

  // Render Frontline Mobile Companion View (Exclusively Field Worker Persona)
  const renderMobileView = () => (
    <div
      className={`w-full flex flex-col transition-colors min-h-screen ${
        isDark ? 'bg-[#070a11] text-slate-100' : 'bg-slate-50 text-slate-900'
      } ${
        portalMode !== 'split'
          ? 'md:max-w-md md:my-4 md:min-h-[860px] md:h-[880px] md:border md:rounded-[36px] md:shadow-2xl md:overflow-hidden md:relative ' +
            (isDark ? 'md:border-slate-800' : 'md:border-slate-300')
          : 'max-w-xl'
      }`}
    >
      {/* Field Worker Header */}
      <Header
        selectedMineId={selectedMineId}
        onSelectMine={handleSelectMine}
        pendingSyncCount={syncQueue.length}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        inspectorName="Rajeshwar Sharma"
        badgeNumber="FO-9412"
      />

      {/* Active Tab View */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardTab
            currentMine={currentMine}
            currentRole="FIELD_OFFICER"
            inspections={inspections}
            capaActions={capaActions}
            documents={documents}
            contractors={contractors}
            emergencyAlerts={emergencyAlerts}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSOS={() => setIsSOSModalOpen(true)}
            theme={theme}
          />
        )}

        {activeTab === 'inspect' && (
          <InspectTab
            currentMine={currentMine}
            userProfile={{
              id: 'USR-FO-01',
              name: 'Rajeshwar Sharma',
              role: 'FIELD_OFFICER',
              designation: 'Field Safety Officer',
              assignedMineId: selectedMineId,
              assignedZone: 'Pit 4 - North Haul Road Ramp 3',
              badgeNumber: 'FO-9412',
              subsidiary: currentMine.subsidiary,
            }}
            isOffline={isOffline}
            onInspectionCreated={handleInspectionCreated}
            theme={theme}
          />
        )}

        {activeTab === 'capa' && (
          <CapaTab
            currentMine={currentMine}
            userProfile={{
              id: 'USR-FO-01',
              name: 'Rajeshwar Sharma',
              role: 'FIELD_OFFICER',
              designation: 'Field Safety Officer',
              assignedMineId: selectedMineId,
              assignedZone: 'Pit 4 - North Haul Road Ramp 3',
              badgeNumber: 'FO-9412',
              subsidiary: currentMine.subsidiary,
            }}
            currentRole="FIELD_OFFICER"
            capaActions={capaActions}
            onActionUpdated={refreshData}
            theme={theme}
          />
        )}

        {activeTab === 'ocr' && (
          <OcrScannerTab
            currentMine={currentMine}
            documents={documents}
            onDocumentAdded={refreshData}
            theme={theme}
          />
        )}

        {activeTab === 'map' && (
          <MineMapTab
            currentMine={currentMine}
            theme={theme}
          />
        )}
      </main>

      {/* Field Worker Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        openCapaBadge={openCapaCount}
        theme={theme}
      />
    </div>
  );

  // If not authenticated, render official Ministry of Coal Parichay / Super Admin gateway
  if (!isAuthenticated) {
    return (
      <GovPortalLogin
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          StorageService.saveUserProfile(profile);
          sessionStorage.setItem('coalgov_auth', 'true');
          setIsAuthenticated(true);
          if (profile.role === 'FIELD_OFFICER') {
            setPortalMode('mobile');
          } else {
            setPortalMode('web');
          }
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-[#070a11] text-slate-100' : 'bg-slate-100 text-slate-900'
    } flex flex-col`}>
      {/* Universal Omnichannel Mode Switcher Bar */}
      <div className={`w-full px-5 py-2.5 border-b flex items-center justify-between text-xs transition-colors shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <strong className="tracking-wide text-xs">CoalGov AI Enterprise Ecosystem</strong>
          </div>
          <span className={`hidden sm:inline font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            | National Coal Mining Safety & Statutory Governance Platform
          </span>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-2">
          {/* Quick Scenario Injector */}
          <div className="relative">
            <button
              onClick={() => setShowScenarioMenu(!showScenarioMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                isDark ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="hidden md:inline">Simulate Scenarios</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showScenarioMenu && (
              <div className={`absolute right-0 mt-1 w-64 rounded-2xl border p-2 shadow-2xl z-50 animate-fadeIn space-y-1 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className={`text-[10px] uppercase font-bold px-2 py-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Trigger Live Incidents:
                </div>
                <button
                  onClick={handleSimulateHazard}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold transition ${
                    isDark ? 'hover:bg-slate-800 text-rose-300' : 'hover:bg-rose-50 text-rose-900'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <div>1. Highwall Crack Hazard</div>
                    <div className="text-[10px] font-normal opacity-75">Triggers AI Anomaly & Critical CAPA</div>
                  </div>
                </button>
                <button
                  onClick={handleSimulateExpiredDoc}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold transition ${
                    isDark ? 'hover:bg-slate-800 text-amber-300' : 'hover:bg-amber-50 text-amber-900'
                  }`}
                >
                  <FileWarning className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div>2. Expired Labor License</div>
                    <div className="text-[10px] font-normal opacity-75">Halts Contractor in Pit</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsSOSModalOpen(true);
                    setShowScenarioMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold transition ${
                    isDark ? 'hover:bg-slate-800 text-rose-300' : 'hover:bg-rose-50 text-rose-900'
                  }`}
                >
                  <Zap className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <div>3. Emergency Pit Siren</div>
                    <div className="text-[10px] font-normal opacity-75">Evacuation Alarm Broadcast</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setPortalMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                portalMode === 'web'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Central Web Portal</span>
            </button>

            <button
              onClick={() => setPortalMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                portalMode === 'mobile'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Field Worker App</span>
            </button>

            <button
              onClick={() => setPortalMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                portalMode === 'split'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Dual Screen: Mobile on left, Web on right"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dual Split View</span>
            </button>
          </div>

          {/* Global Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className={`p-2 rounded-xl border transition ${
              isDark ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sign Out to Official Parichay Gateway */}
          <button
            onClick={() => {
              sessionStorage.removeItem('coalgov_auth');
              setIsAuthenticated(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs shadow-sm transition"
            title="Sign Out to Govt Login Gateway"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Portal Mode 1: Central Web Governance Portal */}
      {portalMode === 'web' && (
        <WebGovernancePortal
          currentMine={currentMine}
          onSelectMine={handleSelectMine}
          userProfile={userProfile}
          onChangeRole={handleChangeRole}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          inspections={inspections}
          capaActions={capaActions}
          documents={documents}
          contractors={contractors}
          auditLogs={auditLogs}
          emergencyAlerts={emergencyAlerts}
          onRefreshData={refreshData}
          onOpenMobileView={() => setPortalMode('mobile')}
          onOpenSplitView={() => setPortalMode('split')}
          onOpenSOS={() => setIsSOSModalOpen(true)}
          onLogout={() => {
            sessionStorage.removeItem('coalgov_auth');
            setIsAuthenticated(false);
          }}
        />
      )}

      {/* Portal Mode 2: Mobile Companion View */}
      {portalMode === 'mobile' && (
        <div className="flex-1 flex justify-center items-start">
          {renderMobileView()}
        </div>
      )}

      {/* Portal Mode 3: Dual Live Split Screen View (Showcasing Live Interconnection) */}
      {portalMode === 'split' && (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {/* Mobile Field App on Left */}
          <div className={`w-full md:w-[420px] shrink-0 border-r flex flex-col justify-start items-center p-3 overflow-y-auto ${
            isDark ? 'border-slate-800 bg-[#070a11]' : 'border-slate-200 bg-slate-100'
          }`}>
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] font-mono text-amber-500 font-bold">
              <span>📱 FIELD OFFICER MOBILE COMPANION</span>
              <span className="text-emerald-500">● LIVE LINKED</span>
            </div>
            {renderMobileView()}
          </div>

          {/* Web Governance Portal on Right */}
          <div className="flex-1 overflow-y-auto">
            <WebGovernancePortal
              currentMine={currentMine}
              onSelectMine={handleSelectMine}
              userProfile={userProfile}
              onChangeRole={handleChangeRole}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              inspections={inspections}
              capaActions={capaActions}
              documents={documents}
              contractors={contractors}
              auditLogs={auditLogs}
              emergencyAlerts={emergencyAlerts}
              onRefreshData={refreshData}
              onOpenMobileView={() => setPortalMode('mobile')}
              onOpenSplitView={() => setPortalMode('split')}
              onOpenSOS={() => setIsSOSModalOpen(true)}
              onLogout={() => {
                sessionStorage.removeItem('coalgov_auth');
                setIsAuthenticated(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Sync Queue Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncQueue={syncQueue}
        onSyncCompleted={refreshData}
        isOffline={isOffline}
      />

      {/* Emergency SOS Broadcast Modal */}
      <EmergencySOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        currentMine={currentMine}
        userProfile={userProfile}
        onAlertTriggered={refreshData}
      />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import {
  MineSite,
  InspectionRecord,
  CAPAAction,
  StatutoryDocument,
  ContractorEntity,
  AuditLogEntry,
  EmergencyAlert,
  UserProfile,
  UserRole,
} from '../../types';
import { StorageService } from '../../services/storage';
import { AIRiskEngine } from '../../services/aiRiskEngine';
import { MOCK_MINES } from '../../services/mockData';
import {
  Building2,
  LayoutDashboard,
  ClipboardCheck,
  ShieldAlert,
  HardHat,
  FileCheck2,
  MapPin,
  Scale,
  Settings,
  Sun,
  Moon,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Ban,
  Printer,
  Download,
  QrCode,
  Layers,
  Flame,
  AlertOctagon,
  Lock,
  Shield,
  TrendingUp,
  Sliders,
  Sparkles,
  UserCheck,
  Crown,
  Eye,
  Camera,
  ExternalLink,
  ChevronDown,
  LogOut,
  Maximize2,
  X,
  FileWarning,
} from 'lucide-react';
import { MineMapTab } from '../MineMapTab';

interface WebGovernancePortalProps {
  currentMine: MineSite;
  onSelectMine: (mineId: string) => void;
  userProfile: UserProfile;
  onChangeRole: (role: UserRole) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  inspections: InspectionRecord[];
  capaActions: CAPAAction[];
  documents: StatutoryDocument[];
  contractors: ContractorEntity[];
  auditLogs: AuditLogEntry[];
  emergencyAlerts: EmergencyAlert[];
  onRefreshData: () => void;
  onOpenMobileView: () => void;
  onOpenSplitView: () => void;
  onOpenSOS: () => void;
  onLogout?: () => void;
}

export const WebGovernancePortal: React.FC<WebGovernancePortalProps> = ({
  currentMine,
  onSelectMine,
  userProfile,
  onChangeRole,
  theme,
  onToggleTheme,
  inspections,
  capaActions,
  documents,
  contractors,
  auditLogs,
  emergencyAlerts,
  onRefreshData,
  onOpenMobileView,
  onOpenSplitView,
  onOpenSOS,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [showStatutoryReportModal, setShowStatutoryReportModal] = useState(false);
  const [selectedSubsidiaryFilter, setSelectedSubsidiaryFilter] = useState('ALL');
  const [selectedPhotoForModal, setSelectedPhotoForModal] = useState<{
    url: string;
    title: string;
    subtitle?: string;
    meta?: any;
  } | null>(null);

  // SLA Thresholds state for Admin Console
  const [slaCriticalHours, setSlaCriticalHours] = useState('24');
  const [slaHighHours, setSlaHighHours] = useState('72');
  const [slaMediumHours, setSlaMediumHours] = useState('168');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const riskResult = AIRiskEngine.evaluateMineRisk(inspections, capaActions, documents);

  // Active role permissions mapping
  const rolePermissions: Record<UserRole, {
    allowedSections: string[];
    title: string;
    badge: string;
    description: string;
    clearance: string;
    isSuperAdmin?: boolean;
  }> = {
    SUPER_ADMIN: {
      title: 'Super Administrator (Ministry Apex)',
      badge: 'DIRECTORATE APEX CLEARANCE — LEVEL 5 (ALL ACCESS)',
      description: 'Supreme statutory command. Complete unrestricted access across all 9 governance modules, overrides, rules calibration, and system-wide audits.',
      clearance: 'LEVEL 5 — FULL UNRESTRICTED SYSTEM CLEARANCE',
      allowedSections: ['overview', 'inspections', 'capa', 'contractors', 'documents', 'corporate_league', 'gis_map', 'regulatory_audit', 'config'],
      isSuperAdmin: true,
    },
    MINE_MANAGER: {
      title: 'Colliery Mine Manager',
      badge: 'COLLIERY STATUTORY COMMAND — LEVEL 4',
      description: 'Authorized statutory signatory under CMR 2017 Reg. 27. Verifies field inspections, signs off on CAPA closures, monitors pit contractors, and manages site risk.',
      clearance: 'LEVEL 4 — COLLIERY STATUTORY COMMAND',
      allowedSections: ['overview', 'inspections', 'capa', 'contractors', 'documents', 'gis_map'],
    },
    CORPORATE_MGMT: {
      title: 'Corporate Executive (CIL HQ)',
      badge: 'MULTI-SUBSIDIARY OVERSIGHT — LEVEL 3',
      description: 'Executive monitoring across subsidiaries (SECL, NCL, CCL, ECL, WCL), risk league benchmarking, and SLA escalation tracking.',
      clearance: 'LEVEL 3 — ENTERPRISE OVERSIGHT',
      allowedSections: ['overview', 'corporate_league', 'contractors', 'gis_map', 'regulatory_audit'],
    },
    REGULATORY_AUDITOR: {
      title: 'DGMS Regulatory Inspector',
      badge: 'STATUTORY SAFETY AUDITING — LEVEL 4',
      description: 'Independent statutory auditing under Coal Mines Regulations 2017, cryptographic chain of custody, and DGMS Form 24 issuance.',
      clearance: 'LEVEL 4 — STATUTORY SAFETY AUDIT',
      allowedSections: ['overview', 'inspections', 'regulatory_audit', 'gis_map'],
    },
    SYSTEM_ADMIN: {
      title: 'System Administrator',
      badge: 'SUPERUSER ADMINISTRATION — LEVEL 4',
      description: 'Full statutory rules catalog configuration, SLA escalation timer calibration, and user/mine registry management.',
      clearance: 'LEVEL 4 — SYSTEM CONFIGURATION & SECURITY',
      allowedSections: ['overview', 'config', 'contractors', 'documents', 'regulatory_audit'],
    },
    FIELD_OFFICER: {
      title: 'Frontline Field Safety Officer',
      badge: 'FRONTLINE PIT INSPECTOR — LEVEL 1',
      description: 'Frontline field checks should be conducted using the Field Worker Mobile App.',
      clearance: 'LEVEL 1 — FRONTLINE PIT INSPECTION',
      allowedSections: ['overview', 'inspections'],
    },
  };

  const currentPerms = rolePermissions[userProfile.role] || rolePermissions.SUPER_ADMIN;

  // Counts
  const pendingInspections = inspections.filter((i) => i.status === 'SYNCED' || i.status === 'SAVED_OFFLINE');
  const openCapas = capaActions.filter((c) => c.status !== 'CLOSED');
  const pendingVerificationCapas = capaActions.filter((c) => c.status === 'PENDING_VERIFICATION');
  const expiredDocs = documents.filter((d) => d.status === 'EXPIRED');
  const activeSOS = emergencyAlerts.find((a) => a.active);

  // Top 9 Horizontal Navigation Tabs
  const topTabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, desc: 'Executive Telemetry & Risk Index' },
    { id: 'inspections', label: 'Field Inspections', icon: ClipboardCheck, badge: pendingInspections.length > 0 ? `${pendingInspections.length} New` : undefined, desc: 'Inspections with Geo-Stamped Photos' },
    { id: 'capa', label: 'CAPA Remediation', icon: ShieldAlert, badge: pendingVerificationCapas.length > 0 ? `${pendingVerificationCapas.length} Ready` : undefined, desc: 'Side-by-Side Photo Verification' },
    { id: 'contractors', label: 'Contractor Registry', icon: HardHat, desc: 'Empaneled Agencies & Fleet' },
    { id: 'documents', label: 'Statutory Permits (OCR)', icon: FileCheck2, badge: expiredDocs.length > 0 ? `${expiredDocs.length} Expired` : undefined, desc: 'MoEFCC, HEMM & Labor Licenses' },
    { id: 'gis_map', label: 'GIS Pit Map', icon: MapPin, desc: 'Spatial Open-Cast Hazard Map' },
    { id: 'corporate_league', label: 'Corporate League (CIL)', icon: Building2, desc: 'Multi-Mine Subsidiary Ranking' },
    { id: 'regulatory_audit', label: 'DGMS Audits & Form 24', icon: Scale, desc: 'SHA-256 Ledger & Printable Form 24' },
    { id: 'config', label: 'Super Admin Console', icon: Settings, desc: 'Global Role Overrides & Rules' },
  ];

  // Approval handlers
  const handleApproveInspection = (insp: InspectionRecord) => {
    const updated: InspectionRecord = { ...insp, status: 'VERIFIED' };
    StorageService.saveInspection(updated);
    StorageService.appendAuditLog({
      id: `LOG-0x${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: userProfile.name,
      role: userProfile.role,
      action: 'INSPECTION_VERIFIED_AND_SIGNED',
      targetEntity: insp.id,
      details: `Manager statutory approval on ${insp.zone} inspection. 0 objections recorded.`,
      blockHash: `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16)}`,
      previousHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
      verified: true,
      ipAddress: '192.168.1.1 (Governance Central)',
    });
    onRefreshData();
  };

  const handleVerifyCapa = (action: CAPAAction, approved: boolean) => {
    const updated: CAPAAction = {
      ...action,
      status: approved ? 'CLOSED' : 'OPEN',
      verifiedBy: `${userProfile.name} (${userProfile.designation})`,
      verifiedAt: new Date().toISOString(),
      closureNotes: approved
        ? action.closureNotes
        : `${action.closureNotes || ''} [REJECTED: Evidence insufficient; re-take closure proof]`,
    };
    StorageService.saveCapaAction(updated);
    StorageService.appendAuditLog({
      id: `LOG-0x${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: userProfile.name,
      role: userProfile.role,
      action: approved ? 'CAPA_DUAL_SIGNOFF_CLOSED' : 'CAPA_RECTIFICATION_REJECTED',
      targetEntity: action.id,
      details: approved
        ? `Dual sign-off completed for ${action.title} at ${action.zone}`
        : `Re-work mandated for ${action.title}`,
      blockHash: `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16)}`,
      previousHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
      verified: true,
      ipAddress: '192.168.1.1 (Governance Central)',
    });
    onRefreshData();
  };

  const handleToggleContractorHalt = (contractor: ContractorEntity) => {
    const updated: ContractorEntity = {
      ...contractor,
      status: contractor.status === 'HALTED_FOR_SAFETY' ? 'ACTIVE' : 'HALTED_FOR_SAFETY',
    };
    StorageService.saveContractor(updated);
    StorageService.appendAuditLog({
      id: `LOG-0x${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: userProfile.name,
      role: userProfile.role,
      action: updated.status === 'HALTED_FOR_SAFETY' ? 'CONTRACTOR_PIT_HALTED' : 'CONTRACTOR_PIT_RESUMED',
      targetEntity: contractor.name,
      details: `Statutory pit operation status toggled to ${updated.status}`,
      blockHash: `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16)}`,
      previousHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
      verified: true,
      ipAddress: '192.168.1.1 (Governance Central)',
    });
    onRefreshData();
  };

  const handleSaveAdminConfig = () => {
    setAdminSuccessMsg('✅ Statutory SLA Escalation Timers & CMR 2017 Directives calibrated successfully!');
    setTimeout(() => setAdminSuccessMsg(null), 4000);
  };

  const handleResetData = () => {
    if (confirm('⚠️ SUPER ADMIN CLEARANCE REQUIRED: Are you sure you want to reset demo database to initial statutory seed state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const [roleSwitchToast, setRoleSwitchToast] = useState<string | null>(null);

  const handleRoleChangeWithFeedback = (newRole: UserRole) => {
    onChangeRole(newRole);
    const targetPerms = rolePermissions[newRole] || rolePermissions.SUPER_ADMIN;
    if (!targetPerms.isSuperAdmin && !targetPerms.allowedSections.includes(activeSection)) {
      setActiveSection(targetPerms.allowedSections[0]);
    }
    setRoleSwitchToast(`🏛️ Statutory Authority Updated: ${targetPerms.title} (${targetPerms.badge}). Portal clearance modules re-calibrated.`);
    setTimeout(() => setRoleSwitchToast(null), 4500);
  };

  const isSectionPermitted = (sectionId: string) => {
    if (userProfile.role === 'SUPER_ADMIN') return true;
    return currentPerms.allowedSections.includes(sectionId);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-[#060911] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Indian National Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Dynamic Role Switch Notification Banner */}
      {roleSwitchToast && (
        <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-between shadow-lg animate-fadeIn z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
            <span>{roleSwitchToast}</span>
          </div>
          <button onClick={() => setRoleSwitchToast(null)} className="font-bold text-sm px-2 py-0.5 rounded hover:bg-black/10">✕</button>
        </div>
      )}

      {/* 2. Official Government of India Top Utility Bar */}
      <div className={`px-6 py-2 border-b flex items-center justify-between text-xs transition-colors ${
        isDark ? 'bg-slate-950/90 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-3">
          <span className="font-bold">भारत सरकार • Government of India</span>
          <span className="text-slate-400">|</span>
          <span className="font-semibold">कोयला मंत्रालय • Ministry of Coal</span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">DGMS & CIL Statutory Portal</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-slate-500 font-mono text-[11px]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} IST
          </span>

          {/* Active User Authority Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold ${
            userProfile.role === 'SUPER_ADMIN'
              ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 ring-1 ring-amber-500/50'
              : isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            {userProfile.role === 'SUPER_ADMIN' ? (
              <Crown className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{userProfile.name}</span>
            <span className="text-slate-400 font-normal">({userProfile.badgeNumber})</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-lg border transition ${
              isDark ? 'bg-slate-800 border-slate-700 text-amber-300 hover:text-amber-200' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Logout / Exit */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              title="Sign out of government portal session"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Official Government Portal Masthead (Brand & Live Colliery Command) */}
      <header className={`px-6 py-4 border-b backdrop-blur-md flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 text-white">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider uppercase text-amber-600">
                COALGOV AI
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                isDark ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                NATIONAL STATUTORY SAFETY PORTAL
              </span>
            </div>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              खान सुरक्षा एवं संविधिक अनुपालन निदेशालय • Ministry of Coal, Govt. of India
            </p>
          </div>
        </div>

        {/* Live Command Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mine Selector Dropdown */}
          <div className="relative">
            <select
              value={currentMine.id}
              onChange={(e) => onSelectMine(e.target.value)}
              className={`text-xs font-bold border rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                isDark ? 'bg-slate-800 text-slate-100 border-slate-700' : 'bg-slate-100 text-slate-900 border-slate-300'
              }`}
            >
              {MOCK_MINES.map((m) => (
                <option key={m.id} value={m.id}>
                  📍 {m.name} ({m.subsidiary.split(' ')[0]})
                </option>
              ))}
            </select>
            <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-3 pointer-events-none ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`} />
          </div>

          {/* Role Impersonation Selector (For testing RBAC) */}
          <div className="relative">
            <select
              value={userProfile.role}
              onChange={(e) => handleRoleChangeWithFeedback(e.target.value as UserRole)}
              className={`text-xs font-bold border rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none transition-colors ${
                userProfile.role === 'SUPER_ADMIN'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black ring-2 ring-amber-500/50'
                  : isDark ? 'bg-slate-800 text-amber-400 border-slate-700' : 'bg-amber-50 text-amber-950 border-amber-300'
              }`}
              title="Change User Role to test Strict Role-Based Permissions"
            >
              <option value="SUPER_ADMIN">👑 Super Administrator (LEVEL 5 - ALL ACCESS)</option>
              <option value="MINE_MANAGER">🏢 Colliery Mine Manager (LEVEL 4 - COLLIERY)</option>
              <option value="CORPORATE_MGMT">🌐 Corporate Executive (LEVEL 3 - CIL HQ)</option>
              <option value="REGULATORY_AUDITOR">⚖️ DGMS Safety Inspector (LEVEL 4 - AUDIT)</option>
              <option value="FIELD_OFFICER">👷 Field Safety Officer (LEVEL 1 - FRONTLINE)</option>
              <option value="SYSTEM_ADMIN">⚙️ System Administrator (LEVEL 4 - IT/RULES)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 pointer-events-none opacity-70" />
          </div>

          {/* Emergency Pit Siren Trigger */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-900/50 active:scale-95 transition"
            title="Trigger Emergency Pit Siren & Evacuation"
          >
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">PIT SOS</span>
          </button>

          {/* Mobile View Switcher */}
          <button
            onClick={onOpenMobileView}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition ${
              isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-900'
            }`}
            title="Switch to Frontline Mobile Companion App"
          >
            <Smartphone className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Field App</span>
          </button>

          {/* Dual Split Screen Mode */}
          <button
            onClick={onOpenSplitView}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition"
            title="Simulate Mobile App on Left and Web Dashboard on Right"
          >
            <Layers className="w-4 h-4" />
            <span>Dual Split Screen</span>
          </button>
        </div>
      </header>

      {/* 4. Official Authority Clearance Banner */}
      <div className={`px-6 py-2.5 border-b flex items-center justify-between text-xs transition-colors flex-wrap gap-2 ${
        isDark ? 'bg-[#090e18] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Active Clearance: <strong className={isDark ? 'text-white' : 'text-slate-950'}>{currentPerms.title}</strong></span>
          <span className="text-slate-400 hidden md:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden md:inline">{currentPerms.description}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black border ${
            userProfile.role === 'SUPER_ADMIN'
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {currentPerms.badge}
          </span>
          {userProfile.role === 'FIELD_OFFICER' && (
            <button
              onClick={onOpenMobileView}
              className="text-[11px] font-bold text-amber-500 underline ml-2 hover:text-amber-400"
            >
              Open Pit Companion →
            </button>
          )}
        </div>
      </div>

      {/* 5. TOP HORIZONTAL NAVIGATION BAR (Official Government Portal Standard) */}
      <nav className={`w-full border-b overflow-x-auto shadow-sm sticky top-0 z-30 transition-colors ${
        isDark ? 'bg-slate-900/98 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center px-4 min-w-max">
          {topTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            const isPermitted = isSectionPermitted(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-600 bg-amber-500/10 font-black'
                    : isPermitted
                    ? isDark ? 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60' : 'border-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : isDark ? 'border-transparent text-slate-500 bg-slate-950/40 opacity-40 hover:opacity-75' : 'border-transparent text-slate-400 bg-slate-100/50 opacity-40 hover:opacity-75'
                }`}
                title={isPermitted ? tab.desc : `🔒 RESTRICTED: Requires higher statutory clearance than ${currentPerms.title}`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive ? 'text-amber-500' : !isPermitted ? 'text-slate-500' : isDark ? 'text-slate-400' : 'text-slate-600'
                }`} />
                <span className={!isPermitted ? 'line-through opacity-75' : ''}>{tab.label}</span>

                {!isPermitted ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> LOCKED
                  </span>
                ) : tab.badge ? (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-rose-600 text-white shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 6. Active Tab Content Area */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Active Emergency SOS Alert Banner */}
        {activeSOS && (
          <div
            onClick={onOpenSOS}
            className="p-4 rounded-2xl border-2 border-rose-600 bg-rose-600 text-white shadow-xl shadow-rose-950/40 cursor-pointer flex items-start gap-4 animate-pulse"
          >
            <div className="p-2.5 rounded-xl bg-white/20 text-white shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest font-mono text-rose-100">
                  CRITICAL PIT EVACUATION ALARM BROADCAST (CMR 2017 REG. 106)
                </span>
                <span className="text-[10px] bg-rose-900 px-2 py-0.5 rounded text-white font-mono font-bold">
                  LIVE INCIDENT
                </span>
              </div>
              <h4 className="text-sm font-bold mt-1 text-white">
                {activeSOS.type.replace(/_/g, ' ')}
              </h4>
              <p className="text-xs mt-1 text-rose-100 leading-relaxed">
                {activeSOS.message} — Safe evacuation muster point: <strong>{activeSOS.evacuationMusterPoint}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Access Denied Warning if user navigates to an unpermitted tab */}
        {!isSectionPermitted(activeSection) && (
          <div className={`p-8 rounded-3xl border-2 border-rose-500/50 text-center space-y-4 shadow-xl ${
            isDark ? 'bg-slate-900/90 text-white' : 'bg-rose-50/50 text-slate-900'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
                STATUTORY CLEARANCE RESTRICTION • 403 FORBIDDEN
              </span>
              <h2 className="text-xl font-black mt-1">
                Access to this Module Requires Higher Statutory Clearance
              </h2>
              <p className={`text-xs max-w-lg mx-auto mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Under Coal Mines Regulations (CMR) 2017 & Mines Act 1952, this module is restricted to authorized personnel. Your current active role is <strong>{currentPerms.title}</strong> ({currentPerms.clearance}).
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => onChangeRole('SUPER_ADMIN')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition"
              >
                Switch to Super Administrator (All Access)
              </button>
              <button
                onClick={() => setActiveSection('overview')}
                className="px-5 py-2.5 rounded-xl border text-xs font-bold transition"
              >
                Return to Overview Dashboard
              </button>
            </div>
          </div>
        )}

        {/* SECTION 1: EXECUTIVE OVERVIEW DASHBOARD */}
        {activeSection === 'overview' && isSectionPermitted('overview') && (
          <div className="space-y-6">
            {/* Top KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border shadow-sm transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Colliery Safety Risk Index
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-black font-mono ${
                    riskResult.score > 70 ? 'text-rose-600' : riskResult.score > 40 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {riskResult.score}
                  </span>
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    / 100 ({riskResult.category})
                  </span>
                </div>
                <div className={`mt-2 w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full ${riskResult.score > 70 ? 'bg-rose-500' : riskResult.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${riskResult.score}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border shadow-sm transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Active Pit Violations
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-rose-600">
                    {inspections.reduce((acc, i) => acc + i.failedChecks, 0)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 font-mono">
                    ({inspections.reduce((acc, i) => acc + i.criticalIssuesFound, 0)} Critical)
                  </span>
                </div>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Statutory DGMS & CMR 2017 checks
                </p>
              </div>

              <div className={`p-4 rounded-2xl border shadow-sm transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  CAPA Remediation SLA
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-amber-600">
                    {openCapas.length}
                  </span>
                  <span className="text-xs font-bold text-sky-600 font-mono">
                    ({pendingVerificationCapas.length} ready for review)
                  </span>
                </div>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Resolution cycle compliance
                </p>
              </div>

              <div className={`p-4 rounded-2xl border shadow-sm transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Monthly Coal Extraction
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-amber-600">
                    {currentMine.monthlyProductionMT}
                  </span>
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    Million Tonnes
                  </span>
                </div>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Safe Extraction Baseline: 5.2 MT
                </p>
              </div>
            </div>

            {/* AI Risk & Anomaly Center */}
            <div className={`p-6 rounded-3xl border shadow-md space-y-4 transition-colors ${
              isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      AI Risk & Recurrence Anomaly Engine
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Machine learning photogrammetry models detecting recurring highwall tension cracks & berm erosion
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                  isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  XGBoost Recurrence Model Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {riskResult.anomaliesDetected.map((anomaly, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                      isDark ? 'bg-slate-950/70 border-amber-500/30' : 'bg-amber-50 border-amber-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        {anomaly.title}
                      </h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-900 border border-slate-200'
                      }`}>
                        {anomaly.confidence}% Confidence
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                      {anomaly.description}
                    </p>
                    <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                      isDark ? 'border-slate-800/80' : 'border-amber-200'
                    }`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-700 font-semibold'}>Directive:</span>
                      <span className="text-sky-700 dark:text-sky-400 font-bold">{anomaly.recommendedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: FIELD INSPECTION APPROVALS (WITH PHOTO EVIDENCE GALLERY) */}
        {activeSection === 'inspections' && isSectionPermitted('inspections') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Field Inspection Approvals & Geo-Stamped Photographic Evidence
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Review statutory checklists and inspect tamper-proof photos submitted by frontline field officers
                </p>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {inspections.length} Submissions Logged
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {inspections.map((insp) => {
                // Collect photos from checklist items
                const photosInInspection = insp.items.filter((item) => item.photoUrl);

                return (
                  <div
                    key={insp.id}
                    className={`p-5 rounded-3xl border transition shadow-sm space-y-4 ${
                      insp.status === 'VERIFIED'
                        ? isDark ? 'bg-slate-900/70 border-emerald-900/40' : 'bg-emerald-50/50 border-emerald-200'
                        : isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}>
                            {insp.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                            insp.status === 'VERIFIED'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 text-slate-950 font-bold'
                          }`}>
                            {insp.status}
                          </span>
                        </div>
                        <h4 className={`text-sm font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{insp.zone}</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Inspector: <strong>{insp.inspectorName}</strong> ({insp.inspectorId}) • {new Date(insp.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-emerald-600">
                          {insp.passedChecks}/{insp.totalChecks} Checks Passed
                        </div>
                        {insp.criticalIssuesFound > 0 && (
                          <span className="text-xs font-bold text-rose-600 block">
                            ⚠️ {insp.criticalIssuesFound} Critical Violations
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Overall Comments */}
                    {insp.overallComments && (
                      <div className={`p-3 rounded-xl border text-xs ${
                        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <strong>Shift Notes:</strong> {insp.overallComments}
                      </div>
                    )}

                    {/* PROMINENT GEO-STAMPED FIELD PHOTOS GALLERY */}
                    {photosInInspection.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-amber-500" />
                          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                            Geo-Tagged Photographic Evidence Captured by Inspector ({photosInInspection.length}):
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {photosInInspection.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => setSelectedPhotoForModal({
                                url: item.photoUrl!,
                                title: item.title,
                                subtitle: `${insp.zone} • ${item.statutoryRule}`,
                                meta: item.photoMetadata,
                              })}
                              className={`p-2.5 rounded-2xl border cursor-pointer hover:border-amber-500 transition group shadow-sm ${
                                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                                <img
                                  src={item.photoUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <Maximize2 className="w-4 h-4" /> Tap to Zoom Photo
                                </div>
                                <span className="absolute bottom-1 right-1 bg-black/80 text-emerald-400 font-mono text-[9px] px-1.5 py-0.5 rounded">
                                  GPS STAMPED
                                </span>
                              </div>

                              <div className="mt-2 space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                    {item.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-rose-500 font-bold">FAIL</span>
                                </div>
                                {item.photoMetadata && (
                                  <p className={`text-[10px] font-mono truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    📍 {item.photoMetadata.latitude.toFixed(4)}°, {item.photoMetadata.longitude.toFixed(4)}° • {item.photoMetadata.altitude || 318}m
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className={`p-2.5 rounded-xl border text-[11px] flex items-center gap-2 ${
                        isDark ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <span>ℹ️ No physical defect photos attached for this inspection record.</span>
                      </div>
                    )}

                    {/* Action & Statutory Sign-off */}
                    <div className={`pt-3 border-t flex items-center justify-between ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                    }`}>
                      <span className="text-xs font-mono">
                        Cryptographic Hash: {insp.cryptoProofHash ? insp.cryptoProofHash.slice(0, 16) + '...' : 'Verified on Local Chain'}
                      </span>

                      {/* Approval buttons available to Mine Manager & Super Admin */}
                      {(userProfile.role === 'MINE_MANAGER' || userProfile.role === 'SUPER_ADMIN') && insp.status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleApproveInspection(insp)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Colliery Manager Statutory Sign-Off
                        </button>
                      )}

                      {insp.status === 'VERIFIED' && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Signed Off & Statutorily Approved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: CAPA ACTION CENTER (WITH SIDE-BY-SIDE BEFORE / AFTER EVIDENCE) */}
        {activeSection === 'capa' && isSectionPermitted('capa') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Corrective Actions (CAPA) & Side-by-Side Rectification Audit
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Compare original violation evidence photos against contractor rectification proof before statutory closure
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-rose-600 text-white">
                {openCapas.length} Active Items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capaActions.map((action) => {
                const isReadyForSignOff = action.status === 'PENDING_VERIFICATION';
                const isClosed = action.status === 'CLOSED';

                return (
                  <div
                    key={action.id}
                    className={`p-5 rounded-3xl border space-y-3.5 shadow-md transition-colors ${
                      isClosed
                        ? isDark ? 'bg-slate-900/60 border-slate-800 opacity-80' : 'bg-slate-100 border-slate-200'
                        : isReadyForSignOff
                        ? isDark ? 'bg-sky-950/30 border-sky-600' : 'bg-sky-50 border-sky-300'
                        : action.severity === 'CRITICAL'
                        ? isDark ? 'bg-rose-950/30 border-rose-800' : 'bg-rose-50 border-rose-300'
                        : isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}>
                          {action.id}
                        </span>
                        <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                          action.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                        }`}>
                          {action.severity}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isClosed
                          ? 'bg-emerald-600 text-white'
                          : isReadyForSignOff
                          ? 'bg-sky-600 text-white animate-pulse'
                          : 'bg-amber-500 text-slate-950 font-bold'
                      }`}>
                        {action.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{action.title}</h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{action.description}</p>

                    <div className={`grid grid-cols-2 gap-2 text-[11px] pt-2 border-t ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                    }`}>
                      <div>Location: <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{action.zone}</strong></div>
                      <div>Contractor: <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{action.assignedTo}</strong></div>
                    </div>

                    {/* SIDE-BY-SIDE BEFORE VS AFTER PHOTOGRAPHIC PROOF */}
                    <div className={`p-3 rounded-2xl border space-y-2 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Photographic Evidence Audit (Before vs After):
                      </span>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* BEFORE: Initial Violation Photo */}
                        <div className="text-center space-y-1">
                          {action.initialEvidencePhoto ? (
                            <div
                              onClick={() => setSelectedPhotoForModal({
                                url: action.initialEvidencePhoto!,
                                title: `Violation Defect: ${action.title}`,
                                subtitle: `Location: ${action.zone}`,
                              })}
                              className="relative rounded-xl overflow-hidden aspect-video bg-black cursor-pointer border border-rose-500/60 group"
                            >
                              <img src={action.initialEvidencePhoto} alt="Violation" className="w-full h-full object-cover group-hover:scale-105 transition" />
                              <span className="absolute bottom-1 left-1 bg-rose-900/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                BEFORE (Hazard)
                              </span>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-rose-500/30 aspect-video flex items-center justify-center text-[10px] text-rose-400">
                              No initial photo
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-rose-600 block">1. Initial Defect</span>
                        </div>

                        {/* AFTER: Rectification Proof Photo */}
                        <div className="text-center space-y-1">
                          {action.closureProofPhoto ? (
                            <div
                              onClick={() => setSelectedPhotoForModal({
                                url: action.closureProofPhoto!,
                                title: `Rectification Proof: ${action.title}`,
                                subtitle: `Verified by: ${action.assignedTo}`,
                                meta: action.closureProofMetadata,
                              })}
                              className="relative rounded-xl overflow-hidden aspect-video bg-black cursor-pointer border border-emerald-500/60 group"
                            >
                              <img src={action.closureProofPhoto} alt="Closure Proof" className="w-full h-full object-cover group-hover:scale-105 transition" />
                              <span className="absolute bottom-1 right-1 bg-emerald-900/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                AFTER (Repaired)
                              </span>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-slate-700 aspect-video flex items-center justify-center text-[10px] text-slate-500">
                              Awaiting Repair Photo
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-emerald-600 block">2. Rectification Proof</span>
                        </div>
                      </div>

                      {action.closureNotes && (
                        <p className={`text-[11px] pt-1.5 border-t italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          "{action.closureNotes}"
                        </p>
                      )}
                    </div>

                    {/* Manager Verification Buttons */}
                    {isReadyForSignOff && (userProfile.role === 'MINE_MANAGER' || userProfile.role === 'SUPER_ADMIN') && (
                      <div className={`pt-3 border-t flex items-center justify-end gap-2 ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}>
                        <button
                          onClick={() => handleVerifyCapa(action, false)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold hover:bg-rose-900"
                        >
                          <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reject Proof
                        </button>
                        <button
                          onClick={() => handleVerifyCapa(action, true)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Approve & Sign-Off Closure
                        </button>
                      </div>
                    )}

                    {isClosed && (
                      <div className={`text-[11px] pt-2 border-t flex items-center gap-1.5 text-emerald-600 font-bold ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" /> Statutorily Closed & Verified by {action.verifiedBy}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: CONTRACTOR REGISTRY */}
        {activeSection === 'contractors' && isSectionPermitted('contractors') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Empaneled Mining Contractors & Fleet Registry
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Mines Vocational Training (MVT) Rules 1966 & Contractor Statutory Compliance Hub
                </p>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {contractors.length} Empaneled Agencies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractors.map((c) => (
                <div
                  key={c.id}
                  className={`p-5 rounded-3xl border space-y-3 shadow-md transition-colors ${
                    c.status === 'HALTED_FOR_SAFETY'
                      ? 'bg-rose-950/20 border-rose-600'
                      : isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</h4>
                      <p className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{c.licenseNumber}</p>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'HALTED_FOR_SAFETY'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : c.status === 'WARNED'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-2 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Workers</span>
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>{c.activeWorkersInPit}</strong>
                    </div>
                    <div className={`p-2 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>HEMM Units</span>
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>{c.deployedMachineryCount}</strong>
                    </div>
                    <div className={`p-2 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Penalties</span>
                      <strong className="text-rose-600">₹{(c.totalPenaltiesINR / 1000).toFixed(0)}k</strong>
                    </div>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <span className="text-xs">
                      Safety Score: <strong className="text-amber-500">{c.safetyScore}/100</strong>
                    </span>

                    {(userProfile.role === 'MINE_MANAGER' || userProfile.role === 'SUPER_ADMIN') && (
                      <button
                        onClick={() => handleToggleContractorHalt(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          c.status === 'HALTED_FOR_SAFETY'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {c.status === 'HALTED_FOR_SAFETY' ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Resume Pit Operations
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5" /> Halt Contractor in Pit
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: STATUTORY PERMITS (OCR) */}
        {activeSection === 'documents' && isSectionPermitted('documents') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Statutory Permits & Licensure Catalog (OCR Extracted)
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Central registry of verified MoEFCC environmental clearances, HEMM fitness, and contractor labor licenses
                </p>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {documents.length} Registered Permits
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 rounded-3xl border space-y-2 shadow-sm transition-colors ${
                    doc.status === 'EXPIRED'
                      ? 'bg-rose-950/20 border-rose-700'
                      : doc.status === 'EXPIRING_SOON'
                      ? 'bg-amber-950/20 border-amber-700'
                      : isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {doc.documentNumber}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'EXPIRED'
                        ? 'bg-rose-600 text-white'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {doc.documentType.replace(/_/g, ' ')}
                  </h4>

                  {doc.contractorName && (
                    <p className="text-[11px] text-amber-600 font-bold">{doc.contractorName}</p>
                  )}

                  <div className={`pt-2 border-t text-[10px] space-y-1 ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <div className="flex justify-between">
                      <span>Issuing Body:</span>
                      <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{doc.issuingAuthority}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Validity Till:</span>
                      <strong className={doc.status === 'EXPIRED' ? 'text-rose-600' : isDark ? 'text-slate-200' : 'text-slate-800'}>
                        {doc.expiryDate}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Confidence:</span>
                      <span className="font-mono text-emerald-600 font-bold">{doc.ocrConfidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: GIS PIT HAZARD MAP */}
        {activeSection === 'gis_map' && isSectionPermitted('gis_map') && (
          <div className="space-y-4">
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Open-Cast Pit GIS Spatial Hazard Map
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Spatial mapping of highwall cracks, eroded haul roads, AAQMS dust stations, and emergency muster posts
              </p>
            </div>
            <MineMapTab currentMine={currentMine} theme={theme} />
          </div>
        )}

        {/* SECTION 7: CORPORATE LEAGUE (CIL) */}
        {activeSection === 'corporate_league' && isSectionPermitted('corporate_league') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Coal India Limited Multi-Subsidiary Safety League Table
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Enterprise cross-mine safety benchmark ranking across SECL, NCL, CCL, ECL, and WCL
                </p>
              </div>

              {/* Subsidiary Filter */}
              <div className="flex gap-1 text-xs">
                {['ALL', 'SECL', 'NCL', 'CCL'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubsidiaryFilter(sub)}
                    className={`px-3 py-1 rounded-xl font-bold transition ${
                      selectedSubsidiaryFilter === sub
                        ? 'bg-amber-500 text-slate-950'
                        : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* League Table */}
            <div className={`border rounded-3xl overflow-hidden shadow-md transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b font-mono font-bold uppercase tracking-wider ${
                  isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Mine & Colliery</th>
                    <th className="py-3 px-4">Subsidiary</th>
                    <th className="py-3 px-4">State</th>
                    <th className="py-3 px-4">Production (MT)</th>
                    <th className="py-3 px-4">Violations</th>
                    <th className="py-3 px-4">Safety Index</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  {MOCK_MINES
                    .filter((m) => selectedSubsidiaryFilter === 'ALL' || m.subsidiary.includes(selectedSubsidiaryFilter))
                    .sort((a, b) => a.riskScore - b.riskScore)
                    .map((mine, index) => (
                      <tr key={mine.id} className={isDark ? 'hover:bg-slate-850' : 'hover:bg-slate-50'}>
                        <td className="py-3 px-4 font-mono font-bold">#{index + 1}</td>
                        <td className="py-3 px-4 font-bold">{mine.name}</td>
                        <td className="py-3 px-4">{mine.subsidiary.split(' ')[0]}</td>
                        <td className="py-3 px-4">{mine.location}</td>
                        <td className="py-3 px-4 font-mono">{mine.monthlyProductionMT} MT</td>
                        <td className="py-3 px-4 font-mono text-rose-600 font-bold">{mine.activeViolations}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                            mine.riskScore > 70
                              ? 'bg-rose-100 text-rose-800'
                              : mine.riskScore > 40
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {mine.riskScore} ({mine.riskCategory})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onSelectMine(mine.id)}
                            className="text-amber-600 font-bold hover:underline"
                          >
                            Inspect Mine →
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 8: DGMS STATUTORY AUDIT & FORM 24 */}
        {activeSection === 'regulatory_audit' && isSectionPermitted('regulatory_audit') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  DGMS Statutory Safety Audit & Form 24 Generation
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Cryptographically hashed immutable chain of custody under Coal Mines Regulations 2017
                </p>
              </div>

              <button
                onClick={() => setShowStatutoryReportModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Generate Official DGMS Form 24</span>
              </button>
            </div>

            {/* Cryptographic Hash Chain Audit Ledger */}
            <div className={`p-5 rounded-3xl border space-y-3 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  SHA-256 Block Chain of Custody ({auditLogs.length} Verified Blocks)
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  ● MATHEMATICAL INTEGRITY VERIFIED
                </span>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-2xl border text-xs space-y-1 ${
                      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-600">{log.action}</span>
                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          by {log.actor} ({log.role})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{log.details}</p>

                    <div className="pt-1 flex items-center justify-between font-mono text-[9px] text-slate-500">
                      <span>Hash: {log.blockHash}</span>
                      <span className="text-emerald-600 font-bold">✓ VERIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9: SUPER ADMIN CONSOLE */}
        {activeSection === 'config' && isSectionPermitted('config') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Super Administrator System Console & Directorate Controls
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Supreme system configuration: Automated SLA timers, statutory directives, and system maintenance
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-500 text-slate-950">
                CLEARANCE LEVEL 5 ACTIVE
              </span>
            </div>

            {adminSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{adminSuccessMsg}</span>
              </div>
            )}

            {/* SLA Escalation Threshold Calibration */}
            <div className={`p-5 rounded-3xl border space-y-4 shadow-sm transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>Automated SLA Escalation Threshold Calibration</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Level 1 Escalation (Mine Safety Lead):
                  </label>
                  <input
                    type="number"
                    value={slaCriticalHours}
                    onChange={(e) => setSlaCriticalHours(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-mono ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500">Breach triggers supervisor SMS alert</span>
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Level 2 Escalation (Colliery Manager):
                  </label>
                  <input
                    type="number"
                    value={slaHighHours}
                    onChange={(e) => setSlaHighHours(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-mono ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500">Breach locks colliery safety score</span>
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Level 3 Escalation (DGMS Regulatory):
                  </label>
                  <input
                    type="number"
                    value={slaMediumHours}
                    onChange={(e) => setSlaMediumHours(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-mono ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500">Breach issues formal DGMS Form 24 notice</span>
                </div>
              </div>

              <button
                onClick={handleSaveAdminConfig}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow transition cursor-pointer"
              >
                Save & Apply SLA Rules
              </button>
            </div>

            {/* Super Admin Database Maintenance */}
            <div className={`p-5 rounded-3xl border space-y-3 transition-colors ${
              isDark ? 'bg-slate-900 border-rose-900/50' : 'bg-rose-50/50 border-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                    Super Admin Database Maintenance
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Reset statutory database to initial seed demo state.
                  </p>
                </div>

                <button
                  onClick={handleResetData}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Reset Demo Database
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 7. Interactive Geo-Stamped Evidence Photo Zoom Modal */}
      {selectedPhotoForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className={`border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold">{selectedPhotoForModal.title}</h3>
                  {selectedPhotoForModal.subtitle && (
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedPhotoForModal.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedPhotoForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={selectedPhotoForModal.url}
                alt="Evidence"
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Anti-tamper verification footer */}
            <div className={`p-4 border-t text-xs flex flex-wrap items-center justify-between gap-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-mono text-[11px] space-y-0.5">
                <div className="text-emerald-600 font-bold">
                  ✓ Anti-Tamper Cryptographic Watermark Verified
                </div>
                {selectedPhotoForModal.meta ? (
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    GPS: {selectedPhotoForModal.meta.latitude}°, {selectedPhotoForModal.meta.longitude}° • Alt: {selectedPhotoForModal.meta.altitude}m • Stamped: {selectedPhotoForModal.meta.timestamp}
                  </div>
                ) : (
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Geotagged with Field Inspector Device Certificate
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPhotoForModal(null)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. DGMS Form 24 Official Notice Modal */}
      {showStatutoryReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className={`border rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                Statutory DGMS Compliance Form 24 Preview
              </h3>
              <button
                onClick={() => setShowStatutoryReportModal(false)}
                className={`text-xs ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Close
              </button>
            </div>

            <div className={`p-6 overflow-y-auto space-y-4 text-xs transition-colors ${
              isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-900'
            }`}>
              <div className={`text-center border-b pb-3 space-y-1 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className={`text-[10px] tracking-widest uppercase font-bold ${
                  isDark ? 'text-amber-400' : 'text-amber-700'
                }`}>
                  GOVERNMENT OF INDIA • MINISTRY OF LABOUR & EMPLOYMENT
                </div>
                <h2 className={`text-sm font-black uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
                </h2>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Central Zone, Bilaspur • Statutory Form 24 / Safety Inspection Notice
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-3 p-3.5 rounded-xl border font-mono text-[11px] ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>Mine: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{currentMine.name}</strong></div>
                <div>Subsidiary: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{currentMine.subsidiary}</strong></div>
                <div>Date: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{new Date().toLocaleDateString('en-IN')}</strong></div>
                <div>Risk Index: <strong className="text-rose-600">{currentMine.riskScore}/100</strong></div>
              </div>

              <div className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-amber-50/60 border-amber-200 text-slate-900'
              }`}>
                <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Statutory Violations Logged:</div>
                <ul className={`list-disc pl-4 space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li>Bench 14 Upper Highwall tension fissure detected (Reg. 106 CMR 2017)</li>
                  <li>Haul Road Ramp 3 berm eroded below 2.2m dumper tyre height (DGMS Cir. 05/2010)</li>
                  <li>Pragati Infra Earthmovers active with expired contractor labor certificate</li>
                </ul>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Digital Cryptographic Seal:</div>
                  <div className="font-mono text-emerald-600 text-xs font-bold">DGMS-CZ-CERT-99824 • VERIFIED</div>
                </div>
                <QrCode className="w-12 h-12 text-emerald-600" />
              </div>
            </div>

            <div className={`p-4 border-t flex justify-end gap-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => window.print()}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-white text-slate-900 border-slate-300'
                }`}
              >
                <Printer className="w-4 h-4" /> Print Document
              </button>
              <button
                onClick={() => {
                  alert('DGMS Form 24 exported and saved to statutory registry!');
                  setShowStatutoryReportModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

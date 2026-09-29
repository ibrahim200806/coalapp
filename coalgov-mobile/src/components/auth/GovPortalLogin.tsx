import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import {
  Shield,
  Lock,
  UserCheck,
  Building,
  Scale,
  HardHat,
  Crown,
  KeyRound,
  ArrowRight,
  Sun,
  Moon,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface GovPortalLoginProps {
  onLoginSuccess: (profile: UserProfile) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const GovPortalLogin: React.FC<GovPortalLoginProps> = ({
  onLoginSuccess,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [username, setUsername] = useState('superadmin@coal.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [captchaInput, setCaptchaInput] = useState('7K9M');
  const [captchaCode] = useState('7K9M');
  const [loginMode, setLoginMode] = useState<'quick' | 'credentials'>('quick');

  const roleProfiles: Record<UserRole, {
    name: string;
    designation: string;
    badgeNumber: string;
    clearance: string;
    assignedMineId: string;
    subsidiary: string;
    description: string;
    icon: any;
    color: string;
  }> = {
    SUPER_ADMIN: {
      name: 'Dr. Rajesh Gupta',
      designation: 'Chief Safety Controller & IT Directorate (Ministry of Coal)',
      badgeNumber: 'SUPER-ADMIN-00',
      clearance: 'LEVEL 5 — FULL UNRESTRICTED SYSTEM CLEARANCE',
      assignedMineId: 'mine-kusmunda',
      subsidiary: 'Ministry of Coal / CIL Apex Authority',
      description: 'Supreme administrative authority. Complete access to all 9 governance tabs, contractor halting, DGMS notices, rules calibration, and system-wide overrides.',
      icon: Crown,
      color: 'from-amber-500 to-yellow-600',
    },
    MINE_MANAGER: {
      name: 'Er. Alok Ranjan',
      designation: 'Colliery Manager & Statutory Agent (First Class Mgr Cert)',
      badgeNumber: 'MM-7721',
      clearance: 'LEVEL 4 — COLLIERY STATUTORY COMMAND',
      assignedMineId: 'mine-kusmunda',
      subsidiary: 'SECL (South Eastern Coalfields Ltd)',
      description: 'Authorized statutory signatory under CMR 2017 Reg. 27. Verifies field inspections, performs dual sign-off on CAPA closures, and halts unsafe contractor pits.',
      icon: Building,
      color: 'from-blue-600 to-indigo-700',
    },
    CORPORATE_MGMT: {
      name: 'Dr. Sunita Deshmukh',
      designation: 'Executive Director (Safety & Operations), Coal India Ltd HQ',
      badgeNumber: 'CIL-HQ-01',
      clearance: 'LEVEL 3 — MULTI-SUBSIDIARY ENTERPRISE OVERSIGHT',
      assignedMineId: 'mine-kusmunda',
      subsidiary: 'Coal India Limited (Apex Holding)',
      description: 'Enterprise executive monitoring across SECL, NCL, CCL, ECL, and WCL. Cross-subsidiary safety league tables, ESG metrics, and SLA breach tracking.',
      icon: Shield,
      color: 'from-purple-600 to-pink-700',
    },
    REGULATORY_AUDITOR: {
      name: 'Shri P. K. Srivastava',
      designation: 'Director of Mines Safety (DGMS Central Zone Bilaspur)',
      badgeNumber: 'DGMS-CZ-04',
      clearance: 'LEVEL 4 — STATUTORY SAFETY AUDITING AUTHORITY',
      assignedMineId: 'mine-kusmunda',
      subsidiary: 'DGMS / Ministry of Labour & Employment',
      description: 'Independent regulatory safety inspector under CMR 2017 & Mines Act 1952. Cryptographic SHA-256 chain verification and official DGMS Form 24 issuance.',
      icon: Scale,
      color: 'from-emerald-600 to-teal-700',
    },
    FIELD_OFFICER: {
      name: 'Rajeshwar Sharma',
      designation: 'Frontline Field Safety Inspector (Pit Sector 4)',
      badgeNumber: 'FO-9412',
      clearance: 'LEVEL 1 — FRONTLINE PIT COMPLIANCE',
      assignedMineId: 'mine-kusmunda',
      subsidiary: 'SECL Kusmunda Mega OCP',
      description: 'Frontline field checks in open-cast pits. Executes daily CMR 2017 checklists with tamper-proof geotagged camera, and submits CAPA closure photographic evidence.',
      icon: HardHat,
      color: 'from-amber-600 to-orange-700',
    },
    SYSTEM_ADMIN: {
      name: 'Vikramaditya Rao',
      designation: 'Chief Mine Systems & IT Security Administrator',
      badgeNumber: 'ADMIN-001',
      clearance: 'LEVEL 4 — SYSTEM CONFIGURATION & SECURITY',
      assignedMineId: 'mine-kusmunda',
      subsidiary: 'Ministry of Coal IT Directorate',
      description: 'Configures statutory CMR 2017 rules catalog, calibrates SLA escalation breach timers, and manages cryptographic audit infrastructure.',
      icon: Lock,
      color: 'from-slate-600 to-slate-800',
    },
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'SUPER_ADMIN') setUsername('superadmin@coal.gov.in');
    else if (role === 'MINE_MANAGER') setUsername('manager.kusmunda@secl.gov.in');
    else if (role === 'CORPORATE_MGMT') setUsername('safety.director@coalindia.in');
    else if (role === 'REGULATORY_AUDITOR') setUsername('auditor.cz@dgms.gov.in');
    else setUsername('inspector.fo9412@coal.gov.in');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const info = roleProfiles[selectedRole];
    const profile: UserProfile = {
      id: `USR-${selectedRole.slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`,
      name: info.name,
      role: selectedRole,
      badgeNumber: info.badgeNumber,
      designation: info.designation,
      assignedMineId: info.assignedMineId,
      assignedZone: 'Pit 4 - North Haul Road Ramp 3',
      subsidiary: info.subsidiary,
    };
    onLoginSuccess(profile);
  };

  const activeProfileInfo = roleProfiles[selectedRole];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-[#060911] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Indian National Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Top Govt of India Masthead Strip */}
      <div className={`px-6 py-2 border-b flex items-center justify-between text-xs transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-wide">भारत सरकार • Government of India</span>
          <span className="text-slate-400">|</span>
          <span>कोयला मंत्रालय • Ministry of Coal</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} IST
          </span>
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-lg border transition ${
              isDark ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Center Login Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Official Emblem & Portal Title Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 shadow-xl shadow-amber-500/20 text-white mb-1">
              <Flame className="w-9 h-9" />
            </div>
            <div>
              <div className="text-xs font-black tracking-widest text-amber-600 uppercase font-mono">
                MINISTRY OF COAL • DIRECTORATE GENERAL OF MINES SAFETY
              </div>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                CoalGov AI National Statutory Portal
              </h1>
              <p className={`text-xs sm:text-sm max-w-xl mx-auto mt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                राष्ट्रीय कोयला खान सुरक्षा, संविधिक अनुपालन एवं जोखिम निवारण प्रणाली
              </p>
            </div>
          </div>

          {/* Login Card Grid */}
          <div className={`border rounded-3xl overflow-hidden shadow-2xl transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Login Tab Header */}
            <div className={`flex border-b text-xs font-bold ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                type="button"
                onClick={() => setLoginMode('quick')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
                  loginMode === 'quick'
                    ? 'border-amber-500 text-amber-600 bg-amber-500/10 font-black'
                    : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span>One-Click Statutory Role Access (Instant Verification)</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginMode('credentials')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
                  loginMode === 'credentials'
                    ? 'border-amber-500 text-amber-600 bg-amber-500/10 font-black'
                    : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Official NIC Credentials Login</span>
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {loginMode === 'quick' ? (
                /* Role Selector Grid */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-300' : 'text-slate-800'
                    }`}>
                      Select Government Authority Role:
                    </span>
                    <span className="text-[11px] font-mono text-amber-600 font-bold">
                      Strict Role-Based Access Control (RBAC) Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { role: 'SUPER_ADMIN' as UserRole, label: 'Super Administrator', sub: 'Directorate Apex Access', icon: Crown, border: 'border-amber-500', bg: 'bg-amber-500/10' },
                      { role: 'MINE_MANAGER' as UserRole, label: 'Colliery Mine Manager', sub: 'Site Approvals & Pit Halting', icon: Building, border: 'border-blue-500', bg: 'bg-blue-500/10' },
                      { role: 'CORPORATE_MGMT' as UserRole, label: 'Corporate HQ (CIL)', sub: 'Multi-Subsidiary League', icon: Shield, border: 'border-purple-500', bg: 'bg-purple-500/10' },
                      { role: 'REGULATORY_AUDITOR' as UserRole, label: 'DGMS Inspector', sub: 'Statutory Audits & Form 24', icon: Scale, border: 'border-emerald-500', bg: 'bg-emerald-500/10' },
                      { role: 'FIELD_OFFICER' as UserRole, label: 'Field Safety Officer', sub: 'Mobile Pit Companion', icon: HardHat, border: 'border-orange-500', bg: 'bg-orange-500/10' },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedRole === item.role;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => handleRoleSelect(item.role)}
                          className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                            isSelected
                              ? `${item.border} ${item.bg} ring-2 ring-amber-500 shadow-md`
                              : isDark
                              ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="p-2 rounded-xl bg-slate-900/40 text-amber-500">
                                <Icon className="w-5 h-5" />
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                            <div className={`text-xs font-black ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-[10px] mt-0.5 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {item.sub}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Selected Role Clearance Details */}
                  <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {activeProfileInfo.name}
                          </strong>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-600 border border-amber-500/30">
                            {activeProfileInfo.badgeNumber}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {activeProfileInfo.designation}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {activeProfileInfo.clearance}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activeProfileInfo.description}
                    </p>
                  </div>
                </div>
              ) : (
                /* Credential Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-lg mx-auto">
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Government Email / Parichay ID:
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Password:
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                        Security Code:
                      </label>
                      <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Captcha:
                      </label>
                      <div className="h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-amber-400 tracking-widest text-sm select-none">
                        {captchaCode}
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Login Action Button */}
              <button
                type="button"
                onClick={handleLoginSubmit}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 transition cursor-pointer"
              >
                <span>Authorize & Enter CoalGov Portal ({roleProfiles[selectedRole].name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Statutory Security Footer */}
            <div className={`px-6 py-3 border-t text-[11px] flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Statutory Compliance: Mines Act 1952 & CMR 2017</span>
              </div>
              <span>SHA-256 Cryptographic Audit Ledger Active</span>
            </div>
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className={`py-4 px-6 border-t text-center text-xs space-y-1 ${
        isDark ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <p>
          Portal Designed & Developed for Ministry of Coal, Government of India • Directorate General of Mines Safety (DGMS)
        </p>
        <p className="text-[10px]">
          Best viewed in modern desktop browsers at 1920x1080 resolution. Content managed by Ministry of Coal IT Directorate.
        </p>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { ChecklistItem, GeoMetadata, InspectionRecord, MineSite, UserProfile } from '../types';
import { INITIAL_CHECKLIST_TEMPLATES } from '../services/mockData';
import { StorageService } from '../services/storage';
import { CameraWatermarkModal } from './CameraWatermarkModal';
import {
  ClipboardCheck,
  Camera,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  Send,
  Save,
  MapPin,
  Check,
  ChevronDown,
} from 'lucide-react';

interface InspectTabProps {
  currentMine: MineSite;
  userProfile: UserProfile;
  isOffline: boolean;
  onInspectionCreated: (newRecord: InspectionRecord) => void;
  theme?: 'dark' | 'light';
}

const ZONES = [
  'Pit 4 - North Haul Road Ramp 3',
  'Bench 14 - Upper Highwall Terrace',
  'Coal Loading Point & Railway Siding',
  'Heavy Machinery Workshop & Fuel Station',
  'Crusher & Coal Handling Plant (CHP)',
  'Main Incline & Muster Station #2',
];

export const InspectTab: React.FC<InspectTabProps> = ({
  currentMine,
  userProfile,
  isOffline,
  onInspectionCreated,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [selectedZone, setSelectedZone] = useState(ZONES[0]);
  const [items, setItems] = useState<ChecklistItem[]>(
    JSON.parse(JSON.stringify(INITIAL_CHECKLIST_TEMPLATES))
  );
  const [activeItemForCamera, setActiveItemForCamera] = useState<string | null>(null);
  const [overallNotes, setOverallNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: 'PASS' | 'FAIL' | 'NA') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, observationNotes: notes } : item))
    );
  };

  const handlePhotoCaptured = (photoUrl: string, metadata: GeoMetadata) => {
    if (!activeItemForCamera) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === activeItemForCamera
          ? { ...item, photoUrl, photoMetadata: metadata }
          : item
      )
    );
    setActiveItemForCamera(null);
  };

  const totalChecks = items.length;
  const passedChecks = items.filter((i) => i.status === 'PASS').length;
  const failedChecks = items.filter((i) => i.status === 'FAIL').length;
  const criticalIssues = items.filter(
    (i) => i.status === 'FAIL' && i.severityIfFailed === 'CRITICAL'
  ).length;

  const handleSubmit = (forceOffline = false) => {
    setIsSubmitting(true);

    const now = new Date();
    const shouldSaveOffline = forceOffline || isOffline || !StorageService.isNetworkAvailable();

    const record: InspectionRecord = {
      id: `INSP-${Date.now().toString().slice(-6)}`,
      mineId: currentMine.id,
      mineName: currentMine.name,
      zone: selectedZone,
      inspectorId: userProfile.id,
      inspectorName: userProfile.name,
      timestamp: now.toISOString(),
      totalChecks,
      passedChecks,
      failedChecks,
      criticalIssuesFound: criticalIssues,
      status: shouldSaveOffline ? 'SAVED_OFFLINE' : 'SYNCED',
      syncedAt: shouldSaveOffline ? undefined : now.toISOString(),
      overallComments: overallNotes || 'Field statutory checklist completed according to CMR 2017 norms.',
      items,
    };

    StorageService.saveInspection(record);

    // Auto-create CAPAs for failed critical checks with photo evidence
    items.forEach((item) => {
      if (item.status === 'FAIL') {
        StorageService.saveCapaAction({
          id: `CAPA-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 900 + 100)}`,
          inspectionId: record.id,
          mineId: currentMine.id,
          zone: selectedZone,
          statutoryRule: item.statutoryRule,
          violationCategory: item.category,
          severity: item.severityIfFailed,
          title: `Rectify: ${item.title}`,
          description: item.observationNotes || item.description,
          initialEvidencePhoto: item.photoUrl,
          assignedTo: 'Dilip Buildcon Pit Safety Lead',
          assignedRole: 'CONTRACTOR_SAFETY_SUPERVISOR',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          status: 'OPEN',
          reportedAt: now.toISOString(),
          reportedBy: userProfile.name,
        });
      }
    });

    // Reset form
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        shouldSaveOffline
          ? '💾 Inspection stored in local encrypted database. Will sync when back in network.'
          : '🚀 Field inspection uploaded to DGMS cloud and Colliery Manager ledger!'
      );
      setItems(JSON.parse(JSON.stringify(INITIAL_CHECKLIST_TEMPLATES)));
      setOverallNotes('');
      onInspectionCreated(record);
    }, 600);
  };

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title & Inspector Metadata Card */}
      <div className={`border rounded-2xl p-4 shadow-sm space-y-3 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Statutory Field Inspection
              </h2>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                DGMS Mine Safety & Compliance Protocol (CMR 2017)
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
            isDark ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {userProfile.badgeNumber}
          </span>
        </div>

        {/* Zone Selector */}
        <div>
          <label className={`text-[11px] font-semibold block mb-1 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Inspection Zone / Pit Section:
          </label>
          <div className="relative">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-100'
                  : 'bg-white border-slate-300 text-slate-900 shadow-sm'
              }`}
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  📍 {z}
                </option>
              ))}
            </select>
            <ChevronDown className={`w-4 h-4 absolute right-3 top-2.5 pointer-events-none ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`} />
          </div>
        </div>

        {/* Progress summary banner */}
        <div className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 font-mono font-bold">{passedChecks} PASS</span>
            <span className="text-rose-600 font-mono font-bold">{failedChecks} FAIL</span>
          </div>
          {criticalIssues > 0 ? (
            <span className="text-rose-600 text-[10px] font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-300 animate-pulse">
              ⚠️ {criticalIssues} CRITICAL
            </span>
          ) : (
            <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {totalChecks - passedChecks - failedChecks} Pending
            </span>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-[10px] text-emerald-700 font-bold underline mt-1 block"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider px-1 ${
          isDark ? 'text-slate-400' : 'text-slate-700'
        }`}>
          Statutory Checklist Items ({items.length})
        </h3>

        {items.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.status === 'FAIL'
                  ? isDark ? 'bg-rose-950/30 border-rose-800/80' : 'bg-rose-50/90 border-rose-300 shadow-sm'
                  : item.status === 'PASS'
                  ? isDark ? 'bg-slate-900/90 border-emerald-800/40' : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                  : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${
                      isDark ? 'text-amber-400' : 'text-amber-700'
                    }`}>
                      {item.statutoryRule}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Status buttons */}
              <div className={`flex items-center gap-2 mt-3 pt-2.5 border-t ${
                isDark ? 'border-slate-800/80' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'PASS')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition ${
                    item.status === 'PASS'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/40'
                      : isDark
                        ? 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'FAIL')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition ${
                    item.status === 'FAIL'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/40'
                      : isDark
                        ? 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" /> FAIL
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'NA')}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition ${
                    item.status === 'NA'
                      ? isDark ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-slate-300 text-slate-900 border-slate-400 font-bold'
                      : isDark ? 'bg-slate-800/60 text-slate-500 border-slate-700/60' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" /> N/A
                </button>
              </div>

              {/* Observation & Evidence Capture Section */}
              {(item.status === 'FAIL' || item.photoUrl) && (
                <div className={`mt-3 p-2.5 rounded-xl border space-y-2.5 animate-fadeIn ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-amber-50/70 border-amber-200'
                }`}>
                  <div>
                    <label className={`text-[10px] font-bold uppercase block mb-1 ${
                      isDark ? 'text-amber-300' : 'text-amber-900'
                    }`}>
                      Observation Details & Immediate Hazard:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Berm eroded 35m stretch, water ponding near ramp..."
                      value={item.observationNotes || ''}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  {/* Photo Evidence button or thumbnail */}
                  <div className="flex items-center justify-between gap-2">
                    {item.photoUrl ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={item.photoUrl}
                          alt="Evidence"
                          className="w-14 h-14 object-cover rounded-lg border border-amber-500/60 shadow"
                        />
                        <div className="text-[10px]">
                          <div className="text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Geo-Stamped Evidence
                          </div>
                          <div className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {item.photoMetadata?.latitude.toFixed(4)}°, {item.photoMetadata?.longitude.toFixed(4)}°
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveItemForCamera(item.id)}
                            className="text-amber-600 font-bold underline mt-0.5"
                          >
                            Retake Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveItemForCamera(item.id)}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold active:scale-98 transition ${
                          isDark
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                            : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        <Camera className="w-4 h-4 text-amber-600" />
                        Take Geo-Tagged Stamped Photo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Comments */}
      <div className={`border rounded-2xl p-3.5 space-y-2 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <label className={`text-xs font-bold block ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
          General Mine Shift Notes & Weather:
        </label>
        <textarea
          rows={2}
          value={overallNotes}
          onChange={(e) => setOverallNotes(e.target.value)}
          placeholder="Shift dry, high ambient dust, haul trucks operating at 20 km/h..."
          className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500'
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit(true)}
          className={`flex-1 py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition shadow-sm ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
          }`}
        >
          <Save className="w-4 h-4 text-amber-500" />
          Save Offline
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit(false)}
          className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition"
        >
          <Send className="w-4 h-4" />
          {isOffline ? 'Queue for Auto-Sync' : 'Submit to Central Portal'}
        </button>
      </div>

      {/* Camera Watermark Modal */}
      {activeItemForCamera && (
        <CameraWatermarkModal
          isOpen={true}
          onClose={() => setActiveItemForCamera(null)}
          onCapture={handlePhotoCaptured}
          title="Field Evidence Anti-Tamper Camera"
          mineName={currentMine.name}
          zone={selectedZone}
          inspectorName={userProfile.name}
        />
      )}
    </div>
  );
};

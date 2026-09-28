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
}) => {
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
      items,
      overallComments: overallNotes,
    };

    StorageService.saveInspection(record);

    // If failed checks occurred, also auto-create CAPA actions
    items
      .filter((i) => i.status === 'FAIL')
      .forEach((failed) => {
        StorageService.saveCapaAction({
          id: `CAPA-${Math.floor(1000 + Math.random() * 9000)}`,
          inspectionId: record.id,
          mineId: currentMine.id,
          zone: selectedZone,
          title: `Rectify: ${failed.title}`,
          description: failed.observationNotes || failed.description,
          violationType: failed.category,
          severity: failed.severityIfFailed,
          assignedTo: 'Designated Pit Safety Supervisor',
          dueDate: new Date(Date.now() + 86400000 * (failed.severityIfFailed === 'CRITICAL' ? 1 : 3)).toISOString(),
          status: 'OPEN',
          initialEvidencePhoto: failed.photoUrl,
          createdAt: now.toISOString(),
        });
      });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        shouldSaveOffline
          ? 'Saved to Local Device Offline Queue! Will auto-sync when cellular returns.'
          : 'Inspection Synced & Distributed to Central Compliance Engine!'
      );
      onInspectionCreated(record);

      // Reset form
      setItems(JSON.parse(JSON.stringify(INITIAL_CHECKLIST_TEMPLATES)));
      setOverallNotes('');
    }, 600);
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title & Zone Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Statutory Field Inspection</h2>
              <p className="text-[10px] text-slate-400">DGMS Mine Safety & Compliance Protocol</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
            {userProfile.badgeNumber}
          </span>
        </div>

        {/* Zone Selector */}
        <div>
          <label className="text-[11px] font-medium text-slate-300 block mb-1">
            Inspection Zone / Pit Section:
          </label>
          <div className="relative">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium appearance-none focus:outline-none focus:border-amber-500"
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  📍 {z}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Progress summary banner */}
        <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-mono font-bold">{passedChecks} PASS</span>
            <span className="text-rose-400 font-mono font-bold">{failedChecks} FAIL</span>
          </div>
          {criticalIssues > 0 && (
            <span className="text-rose-400 text-[10px] font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 animate-pulse">
              ⚠️ {criticalIssues} CRITICAL
            </span>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs flex items-start gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-[10px] text-emerald-400 underline mt-1 block"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          DGMS Checklist Items ({items.length})
        </h3>

        {items.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.status === 'FAIL'
                  ? 'bg-rose-950/30 border-rose-800/80'
                  : item.status === 'PASS'
                  ? 'bg-slate-900/90 border-emerald-800/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {item.statutoryRule}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Status buttons */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'PASS')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition ${
                    item.status === 'PASS'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/40'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
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
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" /> FAIL
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'NA')}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition ${
                    item.status === 'NA'
                      ? 'bg-slate-700 text-slate-200 border-slate-600'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" /> N/A
                </button>
              </div>

              {/* Observation & Evidence Capture Section (Shows when failed or when officer wants to attach proof) */}
              {(item.status === 'FAIL' || item.photoUrl) && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 animate-fadeIn">
                  <div>
                    <label className="text-[10px] font-bold text-amber-300 uppercase block mb-1">
                      Observation Details & Immediate Hazard:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Berm missing for 35m stretch, water ponding near haul ramp..."
                      value={item.observationNotes || ''}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
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
                          <div className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Geo-Stamped Evidence
                          </div>
                          <div className="text-slate-400 font-mono">
                            {item.photoMetadata?.latitude.toFixed(4)}°, {item.photoMetadata?.longitude.toFixed(4)}°
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveItemForCamera(item.id)}
                            className="text-amber-400 underline mt-0.5"
                          >
                            Retake Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveItemForCamera(item.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/25 active:scale-98 transition"
                      >
                        <Camera className="w-4 h-4 text-amber-400" />
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <label className="text-xs font-bold text-slate-300 block">
          General Mine Shift Notes & Weather:
        </label>
        <textarea
          rows={2}
          value={overallNotes}
          onChange={(e) => setOverallNotes(e.target.value)}
          placeholder="Shift dry, high ambient dust, haul trucks operating at 20 km/h..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit(true)}
          className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition shadow"
        >
          <Save className="w-4 h-4 text-amber-400" />
          Save Offline
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit(false)}
          className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition"
        >
          <Send className="w-4 h-4" />
          {isOffline ? 'Queue for Auto-Sync' : 'Submit & Broadcast to Central'}
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

import React, { useState } from 'react';
import { CAPAAction, GeoMetadata, MineSite, UserProfile, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { CameraWatermarkModal } from './CameraWatermarkModal';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  UserCheck,
  Check,
  RotateCcw,
  Calendar,
  ChevronRight,
  X,
} from 'lucide-react';

interface CapaTabProps {
  currentMine: MineSite;
  userProfile: UserProfile;
  currentRole: UserRole;
  capaActions: CAPAAction[];
  onActionUpdated: () => void;
  theme?: 'dark' | 'light';
}

export const CapaTab: React.FC<CapaTabProps> = ({
  currentMine,
  userProfile,
  currentRole,
  capaActions,
  onActionUpdated,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'PENDING_VERIFICATION' | 'CLOSED'>('ALL');
  const [selectedActionForClosure, setSelectedActionForClosure] = useState<CAPAAction | null>(null);
  const [closureNotes, setClosureNotes] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedProofPhoto, setCapturedProofPhoto] = useState<string | null>(null);
  const [capturedProofMetadata, setCapturedProofMetadata] = useState<GeoMetadata | null>(null);

  const filtered = capaActions.filter((a) => {
    if (filter === 'ALL') return true;
    if (filter === 'OPEN') return a.status === 'OPEN' || a.status === 'IN_PROGRESS';
    return a.status === filter;
  });

  const handleStartClosure = (action: CAPAAction) => {
    setSelectedActionForClosure(action);
    setClosureNotes(action.closureNotes || '');
    setCapturedProofPhoto(action.closureProofPhoto || null);
    setCapturedProofMetadata(action.closureProofMetadata || null);
  };

  const handleProofPhotoCaptured = (photoUrl: string, metadata: GeoMetadata) => {
    setCapturedProofPhoto(photoUrl);
    setCapturedProofMetadata(metadata);
    setIsCameraOpen(false);
  };

  const handleSubmitProof = () => {
    if (!selectedActionForClosure) return;

    const updated: CAPAAction = {
      ...selectedActionForClosure,
      status: 'PENDING_VERIFICATION',
      closureNotes,
      closureProofPhoto: capturedProofPhoto || undefined,
      closureProofMetadata: capturedProofMetadata || undefined,
    };

    StorageService.saveCapaAction(updated);
    setSelectedActionForClosure(null);
    onActionUpdated();
  };

  const handleManagerVerification = (action: CAPAAction, approved: boolean) => {
    const updated: CAPAAction = {
      ...action,
      status: approved ? 'CLOSED' : 'OPEN',
      verifiedBy: `${userProfile.name} (${userProfile.role})`,
      verifiedAt: new Date().toISOString(),
      closureNotes: approved
        ? action.closureNotes
        : `${action.closureNotes || ''} [REJECTED: Verification evidence insufficient, work to be re-done.]`,
    };

    StorageService.saveCapaAction(updated);
    onActionUpdated();
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return isDark
          ? 'bg-rose-950 text-rose-300 border-rose-800'
          : 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
      case 'HIGH':
        return isDark
          ? 'bg-amber-950 text-amber-300 border-amber-800'
          : 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return isDark
          ? 'bg-slate-800 text-slate-300 border-slate-700'
          : 'bg-slate-200 text-slate-800 border-slate-300 font-bold';
    }
  };

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title */}
      <div className={`border rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Corrective Actions (CAPA)
            </h2>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Field Remediation & Proof Submission Workflow
            </p>
          </div>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
          isDark ? 'bg-slate-800 text-amber-400 border-slate-700' : 'bg-amber-100 text-amber-900 border-amber-300'
        }`}>
          {capaActions.filter((c) => c.status !== 'CLOSED').length} Active
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'All Actions' },
          { key: 'OPEN', label: 'Open / In-Pit' },
          { key: 'PENDING_VERIFICATION', label: 'Pending Manager' },
          { key: 'CLOSED', label: 'Resolved' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
              filter === f.key
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* CAPA Action Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className={`p-8 text-center rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-xs font-medium">No CAPA items under current filter.</p>
          </div>
        )}

        {filtered.map((action) => {
          const isOverdue = new Date(action.dueDate).getTime() < Date.now() && action.status !== 'CLOSED';

          return (
            <div
              key={action.id}
              className={`p-4 rounded-2xl border transition shadow-sm space-y-3 ${
                action.status === 'CLOSED'
                  ? isDark ? 'bg-slate-900/40 border-slate-800 opacity-75' : 'bg-slate-50 border-slate-200 opacity-80'
                  : isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getSeverityBadge(action.severity)}`}>
                      {action.severity}
                    </span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-amber-400' : 'text-amber-800 font-bold'}`}>
                      {action.statutoryRule}
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {action.title}
                  </h3>
                </div>

                {/* Status pill */}
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                    action.status === 'CLOSED'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : action.status === 'PENDING_VERIFICATION'
                      ? 'bg-sky-600 text-white border-sky-500'
                      : isOverdue
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-amber-500 text-slate-950 font-black border-amber-400'
                  }`}
                >
                  {action.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Description */}
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {action.description}
              </p>

              {/* Meta details */}
              <div className={`p-2 rounded-xl text-[10px] space-y-1 border ${
                isDark ? 'bg-slate-950/70 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <div className="flex justify-between">
                  <span>Assigned Agency:</span>
                  <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{action.assignedTo}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className={isDark ? 'text-slate-200' : 'text-slate-900'}>{action.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolution SLA:</span>
                  <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600' : isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    Due {new Date(action.dueDate).toLocaleDateString()} {isOverdue && '⚠️ OVERDUE'}
                  </span>
                </div>
              </div>

              {/* Photographic Evidence Gallery: Initial Violation vs Rectification Proof */}
              <div className="space-y-2 pt-1">
                {action.initialEvidencePhoto && (
                  <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
                    isDark ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50/70 border-rose-200'
                  }`}>
                    <img
                      src={action.initialEvidencePhoto}
                      alt="Hazard Evidence"
                      className="w-16 h-16 object-cover rounded-lg border border-rose-500 shrink-0 shadow-sm"
                    />
                    <div className="text-[10px] space-y-0.5">
                      <span className="text-rose-600 font-bold block">
                        ⚠️ 1. Initial Hazard Evidence (Taken During Inspection)
                      </span>
                      <p className={`line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Documented non-compliance awaiting physical repair by contractor.
                      </p>
                    </div>
                  </div>
                )}

                {action.closureProofPhoto && (
                  <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-emerald-50/70 border-emerald-200'
                  }`}>
                    <img
                      src={action.closureProofPhoto}
                      alt="Proof of Closure"
                      className="w-16 h-16 object-cover rounded-lg border border-emerald-500 shrink-0 shadow-sm"
                    />
                    <div className="text-[10px] space-y-0.5">
                      <span className="text-emerald-600 font-bold block">
                        ✓ 2. Rectification Evidence (Post-Repair Proof)
                      </span>
                      {action.closureProofMetadata && (
                        <span className={`font-mono block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          GPS: {action.closureProofMetadata.latitude.toFixed(4)}°, {action.closureProofMetadata.longitude.toFixed(4)}°
                        </span>
                      )}
                      {action.closureNotes && (
                        <p className={`line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          "{action.closureNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`mt-2 flex items-center justify-end gap-2 pt-2 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                {/* Field Officer: Submit Proof of Closure */}
                {action.status !== 'CLOSED' && action.status !== 'PENDING_VERIFICATION' && (
                  <button
                    onClick={() => handleStartClosure(action)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md hover:bg-amber-400 active:scale-95 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Submit Closure Proof
                  </button>
                )}

                {/* Manager / Auditor Verification Sign-off */}
                {action.status === 'PENDING_VERIFICATION' &&
                  (currentRole === 'MINE_MANAGER' || currentRole === 'REGULATORY_AUDITOR') && (
                    <div className="flex gap-2 w-full justify-end">
                      <button
                        onClick={() => handleManagerVerification(action, false)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          isDark ? 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900' : 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleManagerVerification(action, true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg hover:bg-emerald-500"
                      >
                        <Check className="w-4 h-4" /> Sign Off & Close
                      </button>
                    </div>
                  )}

                {action.status === 'PENDING_VERIFICATION' && currentRole === 'FIELD_OFFICER' && (
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${
                    isDark ? 'text-sky-400' : 'text-sky-700'
                  }`}>
                    <Clock className="w-3.5 h-3.5" /> Proof Submitted • Awaiting Manager Sign-Off
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Submit Proof of Closure */}
      {selectedActionForClosure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3">
          <div className={`border rounded-2xl w-full max-w-md p-4 space-y-3.5 shadow-2xl transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Submit Proof of Closure
              </h3>
              <button
                onClick={() => setSelectedActionForClosure(null)}
                className={`text-xs ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                {selectedActionForClosure.id}
              </span>
              <h4 className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {selectedActionForClosure.title}
              </h4>
            </div>

            {/* Closure Evidence Photo Trigger */}
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {capturedProofPhoto ? (
                <div className="space-y-2">
                  <img
                    src={capturedProofPhoto}
                    alt="Proof Preview"
                    className="max-h-36 mx-auto rounded-lg border border-emerald-500 shadow"
                  />
                  <div className="text-[10px] text-emerald-600 font-bold font-mono">
                    ✓ Geo-stamped at {capturedProofMetadata?.latitude.toFixed(4)}°, {capturedProofMetadata?.longitude.toFixed(4)}°
                  </div>
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="text-xs text-amber-600 underline font-bold"
                  >
                    Retake Closure Photo
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className={`w-full py-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl transition ${
                    isDark
                      ? 'border-amber-500/40 text-amber-300 hover:border-amber-500'
                      : 'border-amber-400 text-amber-900 hover:border-amber-600 bg-amber-50/50'
                  }`}
                >
                  <Camera className="w-6 h-6 text-amber-500" />
                  <span className="text-xs font-bold">Take Geo-Tagged Proof Photo</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Required proof of physical hazard elimination
                  </span>
                </button>
              )}
            </div>

            {/* Closure Notes */}
            <div>
              <label className={`text-[11px] font-semibold block mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Rectification Notes & Measurements:
              </label>
              <textarea
                rows={3}
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
                placeholder="e.g. Berm rebuilt to 2.4m height using compacted boulder clay over 40m length..."
                className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Submit Proof Button */}
            <button
              onClick={handleSubmitProof}
              disabled={!capturedProofPhoto}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Submit for Manager Sign-off
            </button>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <CameraWatermarkModal
          isOpen={true}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleProofPhotoCaptured}
          title="CAPA Closure Geo-Proof"
          mineName={currentMine.name}
          zone={selectedActionForClosure?.zone || 'Active Pit'}
          inspectorName={userProfile.name}
        />
      )}
    </div>
  );
};

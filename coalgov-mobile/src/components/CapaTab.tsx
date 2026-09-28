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
} from 'lucide-react';

interface CapaTabProps {
  currentMine: MineSite;
  userProfile: UserProfile;
  currentRole: UserRole;
  capaActions: CAPAAction[];
  onActionUpdated: () => void;
}

export const CapaTab: React.FC<CapaTabProps> = ({
  currentMine,
  userProfile,
  currentRole,
  capaActions,
  onActionUpdated,
}) => {
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

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Corrective Actions (CAPA)</h2>
            <p className="text-[10px] text-slate-400">Statutory Violation Closure Cycle</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
          {filtered.length} Total
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['ALL', 'OPEN', 'PENDING_VERIFICATION', 'CLOSED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filter === tab
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {tab === 'PENDING_VERIFICATION' ? 'VERIFICATION' : tab}
          </button>
        ))}
      </div>

      {/* Action Cards List */}
      <div className="space-y-3">
        {filtered.map((action) => {
          const isCritical = action.severity === 'CRITICAL';
          const isOverdue =
            (action.status === 'OPEN' || action.status === 'IN_PROGRESS') &&
            new Date(action.dueDate) < new Date();

          return (
            <div
              key={action.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                action.status === 'CLOSED'
                  ? 'bg-slate-900/70 border-emerald-900/40 opacity-80'
                  : action.status === 'PENDING_VERIFICATION'
                  ? 'bg-sky-950/30 border-sky-800/80 shadow-md shadow-sky-950/20'
                  : isCritical
                  ? 'bg-rose-950/30 border-rose-800/80 shadow-md shadow-rose-950/30'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                    {action.id}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isCritical
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600/90 text-white'
                    }`}
                  >
                    {action.severity}
                  </span>
                  {isOverdue && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
                      OVERDUE SLA
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    action.status === 'CLOSED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : action.status === 'PENDING_VERIFICATION'
                      ? 'bg-sky-950 text-sky-400 border border-sky-800 animate-pulse'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {action.status.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Description */}
              <h4 className="text-xs font-bold text-slate-100 mt-2">{action.title}</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {action.description}
              </p>

              {/* Zone & Assigned To */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="text-slate-300 font-medium">{action.zone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned To:</span>
                  <span className="text-slate-300 font-medium truncate block">
                    {action.assignedTo}
                  </span>
                </div>
              </div>

              {/* Proof photos if available */}
              {(action.initialEvidencePhoto || action.closureProofPhoto) && (
                <div className="flex gap-2 mt-3 pt-2 border-t border-slate-800/80">
                  {action.initialEvidencePhoto && (
                    <div className="text-center">
                      <img
                        src={action.initialEvidencePhoto}
                        alt="Initial Defect"
                        className="w-16 h-16 object-cover rounded-lg border border-rose-500/50"
                      />
                      <span className="text-[9px] text-rose-400 font-medium block mt-0.5">
                        Defect Proof
                      </span>
                    </div>
                  )}
                  {action.closureProofPhoto && (
                    <div className="text-center">
                      <img
                        src={action.closureProofPhoto}
                        alt="Closure Proof"
                        className="w-16 h-16 object-cover rounded-lg border border-emerald-500/50"
                      />
                      <span className="text-[9px] text-emerald-400 font-medium block mt-0.5">
                        Closure Proof
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Verification Info if closed */}
              {action.status === 'CLOSED' && action.verifiedBy && (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-[10px] text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Verified & Closed by <strong>{action.verifiedBy}</strong> on{' '}
                    {new Date(action.verifiedAt || '').toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                {/* Field Officer: Submit Proof of Closure */}
                {action.status !== 'CLOSED' && action.status !== 'PENDING_VERIFICATION' && (
                  <button
                    onClick={() => handleStartClosure(action)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md hover:bg-amber-400 active:scale-95 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Submit Proof of Closure
                  </button>
                )}

                {/* Mine Manager or Auditor Verification Sign-off */}
                {action.status === 'PENDING_VERIFICATION' &&
                  (currentRole === 'MINE_MANAGER' || currentRole === 'REGULATORY_AUDITOR') && (
                    <div className="flex gap-2 w-full justify-end">
                      <button
                        onClick={() => handleManagerVerification(action, false)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold hover:bg-rose-900"
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
                  <span className="text-[11px] text-sky-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Awaiting Manager Sign-Off
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-4 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Submit Proof of Closure</h3>
              <button
                onClick={() => setSelectedActionForClosure(null)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                Cancel
              </button>
            </div>

            <div>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                {selectedActionForClosure.id}
              </span>
              <h4 className="text-xs font-bold text-slate-100">
                {selectedActionForClosure.title}
              </h4>
            </div>

            {/* Closure Evidence Photo Trigger */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              {capturedProofPhoto ? (
                <div className="space-y-2">
                  <img
                    src={capturedProofPhoto}
                    alt="Proof Preview"
                    className="max-h-36 mx-auto rounded-lg border border-emerald-500/50"
                  />
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ✓ Geo-stamped at {capturedProofMetadata?.latitude.toFixed(4)}°,{' '}
                    {capturedProofMetadata?.longitude.toFixed(4)}°
                  </div>
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="text-xs text-amber-400 underline font-medium"
                  >
                    Retake Closure Photo
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full py-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-500/40 rounded-xl hover:border-amber-500 text-amber-300"
                >
                  <Camera className="w-6 h-6 text-amber-400" />
                  <span className="text-xs font-bold">Take Geo-Tagged Proof Photo</span>
                  <span className="text-[10px] text-slate-400">
                    Proves berm reconstruction or machinery fix on-site
                  </span>
                </button>
              )}
            </div>

            {/* Closure Notes */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Rectification Notes & Measurements:
              </label>
              <textarea
                rows={3}
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
                placeholder="e.g. Berm rebuilt to 2.4m height using compacted boulder clay over 40m length..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit Proof Button */}
            <button
              onClick={handleSubmitProof}
              disabled={!capturedProofPhoto}
              className="w-full py-2.5 rounded-xl bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-1.5"
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

import React, { useState } from 'react';
import { EmergencyAlert, MineSite, UserProfile } from '../types';
import { StorageService } from '../services/storage';
import {
  AlertOctagon,
  BellRing,
  MapPin,
  X,
  Volume2,
  Radio,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMine: MineSite;
  userProfile: UserProfile;
  onAlertTriggered: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  currentMine,
  userProfile,
  onAlertTriggered,
}) => {
  const [selectedType, setSelectedType] = useState<EmergencyAlert['type']>('HIGHWALL_COLLAPSE_RISK');
  const [customNotes, setCustomNotes] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = () => {
    setIsBroadcasting(true);

    setTimeout(() => {
      const newAlert: EmergencyAlert = {
        id: `SOS-${Date.now().toString().slice(-4)}`,
        type: selectedType,
        severity: 'CRITICAL_EVACUATION',
        mineId: currentMine.id,
        zone: userProfile.assignedZone,
        message: customNotes || `CRITICAL PIT ALARM: ${selectedType.replace(/_/g, ' ')}. Immediate evacuation ordered.`,
        timestamp: new Date().toISOString(),
        triggeredBy: `${userProfile.name} (${userProfile.badgeNumber})`,
        active: true,
        coordinates: currentMine.coordinates,
        evacuationMusterPoint: 'Muster Station #2 (North Ramp Incline)',
      };

      StorageService.triggerEmergencyAlert(newAlert);
      setIsBroadcasting(false);
      setAlertSuccess(true);
      onAlertTriggered();

      setTimeout(() => {
        setAlertSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] shadow-2xl shadow-rose-950/60 animate-pulse-subtle">
        {/* Header */}
        <div className="p-4 bg-rose-950/80 border-b border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold animate-ping">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-rose-100 uppercase tracking-wider">
                PIT EMERGENCY & SOS BROADCAST
              </h3>
              <p className="text-[10px] text-rose-300 font-mono">Immediate Mine Evacuation Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {alertSuccess ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">EMERGENCY BROADCAST DELIVERED!</h4>
              <p className="text-xs text-slate-300">
                All muster stations, siren relays, and mine managers have been alerted with live GPS coordinates.
              </p>
            </div>
          ) : (
            <>
              {/* Emergency Type Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1.5">
                  Select Incident Type:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'HIGHWALL_COLLAPSE_RISK', label: '⚠️ Highwall Slide / Rockfall' },
                    { id: 'METHANE_GAS_LEAK', label: '💨 Toxic / Methane Gas Spike' },
                    { id: 'HAUL_TRUCK_COLLISION', label: '🚜 HEMM Dumper Collision' },
                    { id: 'FIRE_COAL_SEAM', label: '🔥 Spontaneous Coal Seam Fire' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition ${
                        selectedType === t.id
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Stamp */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Target Mine:</span>
                  <span className="text-white font-bold">{currentMine.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Reporting Zone:</span>
                  <span className="text-amber-400">{userProfile.assignedZone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>GPS Coordinate:</span>
                  <span className="text-sky-400">
                    {currentMine.coordinates[0]}° N, {currentMine.coordinates[1]}° E
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Evacuation Point:</span>
                  <span className="text-emerald-400 font-bold">Muster Station #2</span>
                </div>
              </div>

              {/* Additional message */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Urgent Instructions / Dispatch Details:
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Evacuate all personnel from Bench 14 lower terrace towards North Incline immediately..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Broadcast Button */}
              <button
                onClick={handleBroadcast}
                disabled={isBroadcasting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-900/60 active:scale-95 transition"
              >
                {isBroadcasting ? (
                  <>
                    <Radio className="w-5 h-5 animate-spin" />
                    Broadcasting Emergency Alarm to All Mines...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    Trigger Immediate Pit Siren & Evacuation
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

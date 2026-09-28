import React, { useState } from 'react';
import { SyncQueueItem } from '../types';
import { StorageService } from '../services/storage';
import { RefreshCw, CheckCircle2, XCircle, Clock, Wifi, WifiOff, X, ArrowUpRight } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncQueue: SyncQueueItem[];
  onSyncCompleted: () => void;
  isOffline: boolean;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  syncQueue,
  onSyncCompleted,
  isOffline,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  if (!isOpen) return null;

  const handleTriggerSync = () => {
    if (isOffline) {
      alert('Device is currently in offline mode. Turn on cellular/Wi-Fi to sync with central server.');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(25);

    setTimeout(() => {
      setSyncProgress(65);
      setTimeout(() => {
        setSyncProgress(100);
        setTimeout(() => {
          // Mark all items as synced in storage
          StorageService.clearSyncQueue();
          setIsSyncing(false);
          setSyncProgress(0);
          onSyncCompleted();
        }, 400);
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-4 space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Offline Synchronization Queue</h3>
              <p className="text-[10px] text-slate-400">Mine-to-Cloud Data Pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network State Warning */}
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
            isOffline
              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Simulated Pit Offline:</strong> Records are stored safely in local IndexedDB. Toggle to ONLINE to broadcast.
              </span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Network Connected:</strong> Ready to transmit payload to FastAPI Backend.
              </span>
            </>
          )}
        </div>

        {/* Sync Progress Bar */}
        {isSyncing && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Uploading queued records...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Queue Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[140px]">
          {syncQueue.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-200">All Records are Synchronized</p>
              <p className="text-[11px] text-slate-500">
                Zero pending records. Central database is up to date.
              </p>
            </div>
          ) : (
            syncQueue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-300 uppercase text-[10px] font-mono">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Queued at {new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400 font-mono">
            Pending: <strong>{syncQueue.length}</strong> items
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing || syncQueue.length === 0 || isOffline}
            className="py-2.5 px-4 rounded-xl bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Now to Central API
          </button>
        </div>
      </div>
    </div>
  );
};

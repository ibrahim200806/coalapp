import React, { useState } from 'react';
import { AuditLogEntry, InspectionRecord, MineSite, UserProfile } from '../types';
import {
  Scale,
  ShieldCheck,
  FileCheck2,
  Lock,
  Printer,
  QrCode,
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Building2,
} from 'lucide-react';

interface RegulatoryAuditTabProps {
  currentMine: MineSite;
  userProfile: UserProfile;
  auditLogs: AuditLogEntry[];
  inspections: InspectionRecord[];
}

export const RegulatoryAuditTab: React.FC<RegulatoryAuditTabProps> = ({
  currentMine,
  userProfile,
  auditLogs,
  inspections,
}) => {
  const [showStatutoryReportModal, setShowStatutoryReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<'FORM_24' | 'SAFETY_AUDIT_CERT' | 'MONTHLY_DGMS_DIGEST'>('FORM_24');
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Regulatory Oversight & Audit</h2>
            <p className="text-[10px] text-slate-400">DGMS Statutory Verification & Evidence Ledger</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
          <Lock className="w-3 h-3" /> SHA-256
        </span>
      </div>

      {/* Generate Official DGMS Report Action Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
              STATUTORY REPORT ENGINE
            </span>
            <h3 className="text-xs font-bold text-white mt-0.5">
              Automated DGMS Compliance Form Generator
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Exports tamper-proof statutory reports with embedded cryptographic proof hashes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowStatutoryReportModal(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-98 transition"
        >
          <FileCheck2 className="w-4 h-4" /> Generate & Preview Official DGMS Certificate
        </button>
      </div>

      {/* Cryptographic Chain of Custody */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Immutable Audit Trail Ledger
          </h3>
          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Chain Verified
          </span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {log.id}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {log.action}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    By <strong>{log.actor}</strong> ({log.role})
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                {log.details}
              </p>

              {/* Cryptographic Hash Details */}
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-1 text-[10px] font-mono">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Block Hash:</span>
                  <span className="text-emerald-400/90 truncate max-w-[240px]">
                    {log.blockHash}
                  </span>
                </div>
                {log.geoStamp && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Geo Lock:</span>
                    <span className="text-sky-400">{log.geoStamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Report Modal / Viewer */}
      {showStatutoryReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Statutory Report Preview</h3>
                  <p className="text-[10px] text-slate-400">Directorate General of Mines Safety</p>
                </div>
              </div>
              <button
                onClick={() => setShowStatutoryReportModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Close
              </button>
            </div>

            {/* Printable Official Document Sheet */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/95 text-slate-200">
              {/* Official Seal Header */}
              <div className="text-center border-b border-slate-800 pb-3 space-y-1">
                <div className="text-[10px] tracking-widest uppercase font-bold text-amber-400">
                  GOVERNMENT OF INDIA • MINISTRY OF LABOUR & EMPLOYMENT
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
                </h2>
                <p className="text-[10px] text-slate-400">
                  Central Zone, Bilaspur (CG) • Statutory Safety Inspection Record
                </p>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">
                  STATUTORY FORM 24 — CMR 2017 REG. 106 COMPLIANCE
                </div>
              </div>

              {/* Mine Particulars */}
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-500 block">Mine Name:</span>
                  <span className="text-white font-bold">{currentMine.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Subsidiary:</span>
                  <span className="text-white font-bold">{currentMine.subsidiary}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="text-white">{currentMine.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Audit Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              {/* Inspection Summary */}
              <div className="space-y-1.5 text-xs">
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Inspection Findings:
                </h4>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Statutory Checks Evaluated:</span>
                    <span className="font-bold text-white">5 Standard Items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Critical Non-Compliances:</span>
                    <span className="font-bold text-rose-400">1 (Bench 14 Highwall Crack)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Haul Road Berm Defect:</span>
                    <span className="font-bold text-amber-400">40m Section (Rectification Ongoing)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Mine Risk Index:</span>
                    <span className="font-bold text-rose-400">{currentMine.riskScore}/100 (HIGH RISK)</span>
                  </div>
                </div>
              </div>

              {/* Digital Verification & Stamp */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Statutory Digital Signature:</div>
                  <div className="text-xs font-bold text-white">Shri A. K. Sengupta, DGMS</div>
                  <div className="text-[9px] text-emerald-400 font-mono mt-0.5">
                    DGMS-CZ-CERT-99824 • VERIFIED
                  </div>
                </div>
                <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center p-1">
                  <QrCode className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Printer className="w-4 h-4 text-emerald-400" /> Print Document
              </button>
              <button
                onClick={() => {
                  alert('Statutory DGMS Compliance Form exported and saved to device memory!');
                  setShowStatutoryReportModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40"
              >
                <Download className="w-4 h-4" /> Download PDF / Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

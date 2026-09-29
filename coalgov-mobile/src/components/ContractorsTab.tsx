import React, { useState } from 'react';
import { ContractorEntity, MineSite, StatutoryDocument } from '../types';
import { StorageService } from '../services/storage';
import {
  HardHat,
  Truck,
  Users,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Ban,
  CheckCircle,
  Phone,
  Search,
  IndianRupee,
} from 'lucide-react';

interface ContractorsTabProps {
  currentMine: MineSite;
  contractors: ContractorEntity[];
  documents: StatutoryDocument[];
  onContractorUpdated: () => void;
}

export const ContractorsTab: React.FC<ContractorsTabProps> = ({
  currentMine,
  contractors,
  documents,
  onContractorUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<ContractorEntity | null>(null);
  const [penaltyAmount, setPenaltyAmount] = useState('50000');
  const [penaltyReason, setPenaltyReason] = useState('Non-compliance with DGMS PPE and vehicle fitness norms');
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);

  const filtered = contractors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleHalt = (contractor: ContractorEntity) => {
    const updated: ContractorEntity = {
      ...contractor,
      status: contractor.status === 'HALTED_FOR_SAFETY' ? 'ACTIVE' : 'HALTED_FOR_SAFETY',
    };
    StorageService.saveContractor(updated);
    onContractorUpdated();
  };

  const handleIssuePenalty = () => {
    if (!selectedContractor) return;
    const amount = parseInt(penaltyAmount, 10) || 50000;
    const updated: ContractorEntity = {
      ...selectedContractor,
      totalPenaltiesINR: selectedContractor.totalPenaltiesINR + amount,
      activeViolations: selectedContractor.activeViolations + 1,
      safetyScore: Math.max(selectedContractor.safetyScore - 8, 20),
      status: 'WARNED',
    };
    StorageService.saveContractor(updated);

    StorageService.appendAuditLog({
      id: `LOG-0x${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: 'Mine Safety Directorate',
      role: 'MINE_MANAGER',
      action: 'CONTRACTOR_PENALTY_ISSUED',
      targetEntity: selectedContractor.name,
      details: `Penalty of ₹${amount.toLocaleString()} issued. Reason: ${penaltyReason}`,
      blockHash: `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16)}`,
      previousHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
      verified: true,
      ipAddress: '192.168.61.240',
    });

    setShowPenaltyModal(false);
    setSelectedContractor(null);
    onContractorUpdated();
  };

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Contractor Safety & Compliance</h2>
            <p className="text-[10px] text-slate-400">Mines Vocational Training & DGMS Oversight</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
          {contractors.length} Agencies
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search contractor or license #..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
      </div>

      {/* Contractor Cards */}
      <div className="space-y-3">
        {filtered.map((contractor) => {
          const isHalted = contractor.status === 'HALTED_FOR_SAFETY';
          const contractorDocs = documents.filter((d) => d.contractorName?.includes(contractor.name));

          return (
            <div
              key={contractor.id}
              className={`p-4 rounded-2xl border transition-all ${
                isHalted
                  ? 'bg-rose-950/30 border-rose-800/80 shadow-lg shadow-rose-950/20'
                  : contractor.status === 'WARNED'
                  ? 'bg-amber-950/20 border-amber-800/60'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {contractor.id}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        contractor.complianceGrade === 'A+' || contractor.complianceGrade === 'A'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : contractor.complianceGrade === 'B'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                      }`}
                    >
                      GRADE {contractor.complianceGrade}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-1">{contractor.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{contractor.licenseNumber}</p>
                </div>

                {/* Safety Score Meter */}
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">Safety Score</div>
                  <div
                    className={`text-lg font-black font-mono ${
                      contractor.safetyScore >= 80
                        ? 'text-emerald-400'
                        : contractor.safetyScore >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {contractor.safetyScore}/100
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[10px]">
                <div className="bg-slate-950/60 p-2 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                    <Users className="w-3 h-3 text-sky-400" /> Workers
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {contractor.activeWorkersInPit}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                    <Truck className="w-3 h-3 text-amber-400" /> HEMM Units
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {contractor.deployedMachineryCount}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                    <IndianRupee className="w-3 h-3 text-rose-400" /> Penalties
                  </div>
                  <span className="font-mono font-bold text-rose-400">
                    ₹{(contractor.totalPenaltiesINR / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Status & Contact */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Phone className="w-3 h-3 text-amber-400" /> {contractor.phone}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isHalted
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : contractor.status === 'WARNED'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {contractor.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedContractor(contractor);
                    setShowPenaltyModal(true);
                  }}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700"
                >
                  <IndianRupee className="w-3.5 h-3.5" /> Issue Notice / Fine
                </button>

                <button
                  onClick={() => handleToggleHalt(contractor)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                    isHalted
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      : 'bg-rose-600/90 hover:bg-rose-500 text-white shadow'
                  }`}
                >
                  {isHalted ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Revoke Halt
                    </>
                  ) : (
                    <>
                      <Ban className="w-3.5 h-3.5" /> Stop Pit Operations
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Penalty Modal */}
      {showPenaltyModal && selectedContractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-4 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Issue Statutory Notice / Penalty</h3>
              <button
                onClick={() => setShowPenaltyModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                Cancel
              </button>
            </div>

            <div>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                {selectedContractor.licenseNumber}
              </span>
              <h4 className="text-xs font-bold text-slate-100">{selectedContractor.name}</h4>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Penalty Amount (INR ₹):
              </label>
              <select
                value={penaltyAmount}
                onChange={(e) => setPenaltyAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="25000">₹25,000 — Minor PPE / Safety Violation</option>
                <option value="50000">₹50,000 — Machine Telematics / Reverse Alarm Defect</option>
                <option value="150000">₹1,50,000 — Haul Road Berm Negligence</option>
                <option value="500000">₹5,000,000 — Expired Statutory Labor Permit Violation</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Violation Cause & Statutory Citation:
              </label>
              <textarea
                rows={2}
                value={penaltyReason}
                onChange={(e) => setPenaltyReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleIssuePenalty}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" /> Issue Statutory Fine & Log to Audit Trail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

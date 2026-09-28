import React, { useState } from 'react';
import { MineSite, StatutoryDocument } from '../types';
import { StorageService } from '../services/storage';
import {
  ScanLine,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Building2,
  Calendar,
  Sparkles,
  ShieldAlert,
  Save,
} from 'lucide-react';

interface OcrScannerTabProps {
  currentMine: MineSite;
  documents: StatutoryDocument[];
  onDocumentAdded: () => void;
}

export const OcrScannerTab: React.FC<OcrScannerTabProps> = ({
  currentMine,
  documents,
  onDocumentAdded,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDoc, setScannedDoc] = useState<StatutoryDocument | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'HEMM_FITNESS' | 'LABOR_LICENSE' | 'ENV_CLEARANCE'>('HEMM_FITNESS');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'EXPIRED' | 'EXPIRING_SOON' | 'VALID'>('ALL');

  const filteredDocs = documents.filter((d) => {
    if (statusFilter === 'ALL') return true;
    return d.status === statusFilter;
  });

  // Simulated OCR Engine (simulating PaddleOCR / Tesseract backend extraction)
  const handleRunOcr = () => {
    setIsScanning(true);
    setScannedDoc(null);

    setTimeout(() => {
      let doc: StatutoryDocument;

      if (selectedPreset === 'HEMM_FITNESS') {
        doc = {
          id: `DOC-OCR-${Date.now().toString().slice(-4)}`,
          mineId: currentMine.id,
          contractorName: 'Eastern Coal Logistics Ltd',
          documentType: 'HEMM_FITNESS',
          documentNumber: 'DGMS/CZ/KUS/FIT-2026-904',
          issuingAuthority: 'DGMS Central Zone Bilaspur',
          issueDate: '2025-10-15',
          expiryDate: '2026-10-14',
          status: 'EXPIRING_SOON',
          ocrConfidence: 97.4,
          extractedFields: {
            vehicleRegistration: 'CG-12-BG-4901 (Cat 793 Dumper)',
            chassisNumber: 'CAT0793D99021884',
            brakeEfficiency: '84.2% (Pass DGMS CMR 2017)',
            steeringBackUp: 'Dual Hydraulic Accumulator Verified',
          },
        };
      } else if (selectedPreset === 'LABOR_LICENSE') {
        doc = {
          id: `DOC-OCR-${Date.now().toString().slice(-4)}`,
          mineId: currentMine.id,
          contractorName: 'Pragati Infra Earthmovers Pvt Ltd',
          documentType: 'CONTRACTOR_LABOR_LICENSE',
          documentNumber: 'CLC/CG/KRB/CON-4401/2025',
          issuingAuthority: 'Office of Chief Labour Commissioner (Central)',
          issueDate: '2025-09-01',
          expiryDate: '2026-09-20',
          status: 'EXPIRED',
          ocrConfidence: 95.8,
          extractedFields: {
            maximumWorkersPermitted: '180 Contract Laborers',
            epfEstablishmentCode: 'CG-BIL-008472-A',
            welfareAmenityAudit: 'Pending CIL Muster Verification',
          },
        };
      } else {
        doc = {
          id: `DOC-OCR-${Date.now().toString().slice(-4)}`,
          mineId: currentMine.id,
          documentType: 'ENVIRONMENTAL_CLEARANCE',
          documentNumber: 'MoEFCC/EC/MIN/2026/088',
          issuingAuthority: 'Ministry of Environment, Forest & Climate Change',
          issueDate: '2026-01-10',
          expiryDate: '2036-01-09',
          status: 'VALID',
          ocrConfidence: 99.1,
          extractedFields: {
            miningLeaseArea: '2,450 Hectares (Kusmunda Extension)',
            peakAnnualExtraction: '62.5 MTPA Clean Coal',
            flyAshStowingCompliance: 'Clause 18 Mandated',
          },
        };
      }

      setScannedDoc(doc);
      setIsScanning(false);
    }, 1200);
  };

  const handleSaveToRegistry = () => {
    if (!scannedDoc) return;
    StorageService.saveDocument(scannedDoc);
    setScannedDoc(null);
    onDocumentAdded();
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-lg mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Statutory Document Scanner</h2>
            <p className="text-[10px] text-slate-400">AI-OCR Expiry & Compliance Verification</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
          PaddleOCR
        </span>
      </div>

      {/* OCR Scan Trigger Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-200">Scan Mine / Contractor Permit:</h3>

        {/* Preset Selector */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setSelectedPreset('HEMM_FITNESS')}
            className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
              selectedPreset === 'HEMM_FITNESS'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🚜 HEMM Fitness
          </button>
          <button
            onClick={() => setSelectedPreset('LABOR_LICENSE')}
            className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
              selectedPreset === 'LABOR_LICENSE'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            👷 Labor License
          </button>
          <button
            onClick={() => setSelectedPreset('ENV_CLEARANCE')}
            className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
              selectedPreset === 'ENV_CLEARANCE'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🌱 Env Clearance
          </button>
        </div>

        {/* Scan Action Button */}
        <button
          onClick={handleRunOcr}
          disabled={isScanning}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-98 transition disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>PaddleOCR Model Extracting Document Fields...</span>
            </>
          ) : (
            <>
              <ScanLine className="w-4 h-4" />
              <span>Scan & Extract Permit with OCR</span>
            </>
          )}
        </button>
      </div>

      {/* Extracted Document Preview Card */}
      {scannedDoc && (
        <div className="bg-slate-900 border border-sky-500/50 rounded-2xl p-4 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold">
                  OCR CONFIDENCE: {scannedDoc.ocrConfidence}%
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5">
                  {scannedDoc.documentType.replace(/_/g, ' ')}
                </h4>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                scannedDoc.status === 'EXPIRED'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                  : scannedDoc.status === 'EXPIRING_SOON'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}
            >
              {scannedDoc.status}
            </span>
          </div>

          {/* Details table */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Doc Number:</span>
              <span className="text-slate-100 font-mono font-bold">
                {scannedDoc.documentNumber}
              </span>
            </div>
            {scannedDoc.contractorName && (
              <div className="flex justify-between">
                <span className="text-slate-400">Contractor:</span>
                <span className="text-slate-200 font-medium">{scannedDoc.contractorName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Issuing Body:</span>
              <span className="text-slate-300 font-medium">{scannedDoc.issuingAuthority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valid Till:</span>
              <span
                className={`font-mono font-bold ${
                  scannedDoc.status === 'EXPIRED' ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {scannedDoc.expiryDate}
              </span>
            </div>

            {/* Extracted JSON fields */}
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Parsed Attributes:
              </span>
              {Object.entries(scannedDoc.extractedFields).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{k}:</span>
                  <span className="text-slate-200 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save to Registry Button */}
          <button
            onClick={handleSaveToRegistry}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition"
          >
            <Save className="w-4 h-4" /> Save Document & Add to Sync Queue
          </button>
        </div>
      )}

      {/* Document Registry List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Registered Mine Documents ({filteredDocs.length})
          </h3>

          {/* Filter */}
          <div className="flex gap-1 text-[10px]">
            {(['ALL', 'EXPIRED', 'EXPIRING_SOON', 'VALID'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded-lg font-medium transition ${
                  statusFilter === st
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'EXPIRING_SOON' ? 'SOON' : st}
              </button>
            ))}
          </div>
        </div>

        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className={`p-3 rounded-xl border transition ${
              doc.status === 'EXPIRED'
                ? 'bg-rose-950/30 border-rose-900/60'
                : doc.status === 'EXPIRING_SOON'
                ? 'bg-amber-950/30 border-amber-900/60'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{doc.documentNumber}</span>
                <h4 className="text-xs font-bold text-slate-100 mt-0.5">
                  {doc.documentType.replace(/_/g, ' ')}
                </h4>
                {doc.contractorName && (
                  <p className="text-[11px] text-amber-300/90 mt-0.5">{doc.contractorName}</p>
                )}
              </div>

              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  doc.status === 'EXPIRED'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : doc.status === 'EXPIRING_SOON'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {doc.status}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Authority: {doc.issuingAuthority}</span>
              <span className="font-mono">Expires: {doc.expiryDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

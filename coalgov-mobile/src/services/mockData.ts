import {
  MineSite,
  ChecklistItem,
  InspectionRecord,
  CAPAAction,
  StatutoryDocument,
  ContractorEntity,
  AuditLogEntry,
  EmergencyAlert,
} from '../types';

export const MOCK_MINES: MineSite[] = [
  {
    id: 'mine-kusmunda',
    name: 'Kusmunda Mega OCP',
    subsidiary: 'SECL (South Eastern Coalfields)',
    location: 'Korba Coalfield, Chhattisgarh',
    coordinates: [22.3524, 82.6854],
    riskScore: 78,
    riskCategory: 'HIGH',
    activeViolations: 4,
    openCapaCount: 3,
    lastInspectionDate: 'Today, 07:45 AM',
    monthlyProductionMT: 4.8,
    workerCount: 3850,
    contractorCount: 8,
  },
  {
    id: 'mine-gevra',
    name: 'Gevra Mega Pit',
    subsidiary: 'SECL (South Eastern Coalfields)',
    location: 'Korba Coalfield, Chhattisgarh',
    coordinates: [22.3411, 82.5932],
    riskScore: 42,
    riskCategory: 'MEDIUM',
    activeViolations: 2,
    openCapaCount: 1,
    lastInspectionDate: 'Yesterday, 04:15 PM',
    monthlyProductionMT: 5.6,
    workerCount: 4200,
    contractorCount: 12,
  },
  {
    id: 'mine-dipka',
    name: 'Dipka Expansion OCP',
    subsidiary: 'SECL (South Eastern Coalfields)',
    location: 'Korba Coalfield, Chhattisgarh',
    coordinates: [22.3188, 82.5539],
    riskScore: 24,
    riskCategory: 'LOW',
    activeViolations: 0,
    openCapaCount: 0,
    lastInspectionDate: '26 Sep 2026',
    monthlyProductionMT: 3.2,
    workerCount: 2600,
    contractorCount: 6,
  },
  {
    id: 'mine-singrauli',
    name: 'Jayant Open Cast Mine',
    subsidiary: 'NCL (Northern Coalfields)',
    location: 'Singrauli Coalfield, MP',
    coordinates: [24.1167, 82.6333],
    riskScore: 89,
    riskCategory: 'CRITICAL',
    activeViolations: 7,
    openCapaCount: 5,
    lastInspectionDate: '25 Sep 2026',
    monthlyProductionMT: 2.9,
    workerCount: 3100,
    contractorCount: 9,
  },
  {
    id: 'mine-rajrappa',
    name: 'Rajrappa Open Cast Project',
    subsidiary: 'CCL (Central Coalfields)',
    location: 'Ramgarh, Jharkhand',
    coordinates: [23.6322, 85.7114],
    riskScore: 35,
    riskCategory: 'MEDIUM',
    activeViolations: 1,
    openCapaCount: 1,
    lastInspectionDate: '27 Sep 2026',
    monthlyProductionMT: 1.8,
    workerCount: 1950,
    contractorCount: 5,
  },
];

export const MOCK_CONTRACTORS: ContractorEntity[] = [
  {
    id: 'CON-01',
    name: 'Dilip Buildcon Ltd',
    licenseNumber: 'CLC-CENTRAL-2024-DBL-88',
    category: 'EARTHMOVING_OVERBURDEN',
    safetyScore: 82,
    complianceGrade: 'A',
    activeWorkersInPit: 480,
    deployedMachineryCount: 64,
    activeViolations: 1,
    totalPenaltiesINR: 150000,
    primaryContact: 'S. K. Verma (Project Director)',
    phone: '+91 94252 09182',
    verifiedLaborPF: true,
    status: 'ACTIVE',
  },
  {
    id: 'CON-02',
    name: 'Eastern Coal Logistics Pvt Ltd',
    licenseNumber: 'CLC-CENTRAL-2023-ECL-12',
    category: 'HAULAGE_TRANSPORT',
    safetyScore: 68,
    complianceGrade: 'B',
    activeWorkersInPit: 240,
    deployedMachineryCount: 42,
    activeViolations: 2,
    totalPenaltiesINR: 420000,
    primaryContact: 'Arunav Banerjee (Transport Mgr)',
    phone: '+91 98310 44521',
    verifiedLaborPF: true,
    status: 'WARNED',
  },
  {
    id: 'CON-03',
    name: 'Pragati Infra Earthmovers',
    licenseNumber: 'CLC-CENTRAL-2022-PIE-90',
    category: 'EARTHMOVING_OVERBURDEN',
    safetyScore: 44,
    complianceGrade: 'CRITICAL_REVIEW',
    activeWorkersInPit: 180,
    deployedMachineryCount: 28,
    activeViolations: 3,
    totalPenaltiesINR: 950000,
    primaryContact: 'Mohan Lal Sahu (Partner)',
    phone: '+91 94060 33819',
    verifiedLaborPF: false,
    status: 'HALTED_FOR_SAFETY',
  },
  {
    id: 'CON-04',
    name: 'BEML Technical Maintenance Hub',
    licenseNumber: 'DGMS-MAINT-OEM-2021-04',
    category: 'MAINTENANCE',
    safetyScore: 96,
    complianceGrade: 'A+',
    activeWorkersInPit: 95,
    deployedMachineryCount: 16,
    activeViolations: 0,
    totalPenaltiesINR: 0,
    primaryContact: 'G. R. Rao (Chief Engineer)',
    phone: '+91 98450 11982',
    verifiedLaborPF: true,
    status: 'ACTIVE',
  },
];

export const INITIAL_CHECKLIST_TEMPLATES: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'HAUL_ROAD',
    title: 'Haul Road Berm Height & Width',
    statutoryRule: 'DGMS (Tech) Circular No. 05/2010',
    description: 'Berm height must not be less than the diameter of the tyre of the largest vehicle (dumper) plying on the road.',
    status: 'NA',
    severityIfFailed: 'HIGH',
  },
  {
    id: 'chk-2',
    category: 'SLOPE_STABILITY',
    title: 'Bench Slope & Highwall Cracks',
    statutoryRule: 'Reg. 106 Coal Mines Regulations (CMR) 2017',
    description: 'Inspect top edge and toe of open-cast highwall for tension cracks, water seepage, or overhangs.',
    status: 'NA',
    severityIfFailed: 'CRITICAL',
  },
  {
    id: 'chk-3',
    category: 'DUST_SUPPRESSION',
    title: 'Haul Road Water Sprinklers & Fog Cannons',
    statutoryRule: 'Environment (Protection) Act & DGMS Guidelines',
    description: 'Continuous water spraying active on active transport corridors; mist cannons operating at transfer points.',
    status: 'NA',
    severityIfFailed: 'MEDIUM',
  },
  {
    id: 'chk-4',
    category: 'MACHINERY_HEMM',
    title: 'HEMM Pre-Shift Brake & Horn Check',
    statutoryRule: 'DGMS Safety Circular No. 09/2008',
    description: 'Audio-visual alarm, rear-view camera, emergency steering, and fail-safe service brakes operational on dumpers and excavators.',
    status: 'NA',
    severityIfFailed: 'HIGH',
  },
  {
    id: 'chk-5',
    category: 'PPE_WORKER_SAFETY',
    title: 'Contractor Labor PPE & Safety Induction',
    statutoryRule: 'Mines Vocational Training Rules 1966',
    description: 'All contractor personnel wearing DGMS-certified hard helmets, fluorescent high-vis jackets, and steel-toe boots.',
    status: 'NA',
    severityIfFailed: 'HIGH',
  },
];

export const createMiningGeoPhoto = (
  title: string,
  subtitle: string,
  color: string,
  badgeText: string,
  coords: string,
  isRectified = false
) => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
  <defs>
    <linearGradient id="pitGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="40%" stop-color="#292524"/>
      <stop offset="85%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </linearGradient>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="800" height="160" fill="url(#skyGrad)"/>
  <rect y="160" width="800" height="360" fill="url(#pitGrad)"/>
  <polygon points="0,150 800,120 800,210 0,250" fill="#78350f" opacity="0.6"/>
  <polygon points="0,230 800,190 800,320 0,370" fill="#292524" opacity="0.8"/>
  <polygon points="0,350 800,290 800,430 0,470" fill="#1c1917"/>
  <rect x="150" y="180" width="500" height="200" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="6,4" rx="8"/>
  <circle cx="400" cy="280" r="16" fill="none" stroke="${color}" stroke-width="2.5"/>
  <line x1="375" y1="280" x2="425" y2="280" stroke="${color}" stroke-width="2"/>
  <line x1="400" y1="255" x2="400" y2="305" stroke="${color}" stroke-width="2"/>
  <rect x="20" y="20" width="230" height="28" rx="6" fill="#000000" opacity="0.85"/>
  <text x="32" y="39" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">📷 STATUTORY FIELD EVIDENCE</text>
  <rect x="170" y="195" width="240" height="28" rx="5" fill="#000000" opacity="0.9"/>
  <text x="180" y="214" fill="${color}" font-family="monospace" font-size="12" font-weight="bold">${badgeText}</text>
  <text x="170" y="260" fill="#ffffff" font-family="sans-serif" font-size="17" font-weight="bold">${title}</text>
  <text x="170" y="285" fill="#cbd5e1" font-family="sans-serif" font-size="13">${subtitle}</text>
  ${isRectified ? `
    <rect x="490" y="295" width="145" height="60" rx="8" fill="#14532d" opacity="0.95" stroke="#22c55e" stroke-width="2"/>
    <text x="502" y="322" fill="#22c55e" font-family="sans-serif" font-size="14" font-weight="bold">✓ RECTIFIED</text>
    <text x="502" y="342" fill="#86efac" font-family="monospace" font-size="10">DGMS INSPECTION PASS</text>
  ` : ''}
  <rect x="0" y="440" width="800" height="80" fill="#000000" opacity="0.92"/>
  <line x1="0" y1="440" x2="800" y2="440" stroke="#f59e0b" stroke-width="2"/>
  <text x="24" y="462" fill="#22c55e" font-family="monospace" font-size="12" font-weight="bold">● SEC. 65B INDIAN EVIDENCE ACT VERIFIED • ANTI-TAMPER MERKLE CHAIN</text>
  <text x="24" y="482" fill="#f8fafc" font-family="monospace" font-size="12">${coords}</text>
  <text x="24" y="502" fill="#94a3b8" font-family="monospace" font-size="10">KUSMUNDA MEGA OCP • FO-9412 RAJESHWAR SHARMA • SHA-256: 0x8f2c91b8a4f009e4d1c9</text>
  <text x="670" y="485" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">GPS SYNCED</text>
</svg>
`)}`;

export const SAMPLE_GEO_PHOTOS = {
  BERM_COLLAPSE: createMiningGeoPhoto(
    'HAUL ROAD BERM EROSION (40M COLLAPSE)',
    'Current height 1.4m (CMR Reg. 106 requires min 2.2m for 240T dumpers)',
    '#ef4444',
    '⚠️ CMR 2017 REG 106 VIOLATION',
    'LAT: 22.352419° N, LNG: 82.685412° E • ALT: 318.5m • 28-SEP-2026 07:45 IST'
  ),
  HIGHWALL_CRACK: createMiningGeoPhoto(
    'BENCH 14 HIGHWALL TENSION CRACK',
    'Tension fissure gap 14mm with moisture seepage • Geotechnical alert',
    '#f97316',
    '⚠️ HIGHWALL FAILURE HAZARD',
    'LAT: 22.353104° N, LNG: 82.686120° E • ALT: 342.0m • 28-SEP-2026 07:58 IST'
  ),
  ALARM_DEFECT: createMiningGeoPhoto(
    'DUMPER D-409 DEFECTIVE REVERSING ALARM',
    'Alarm sound level inaudible (<70dB) • Wire harness severed',
    '#ef4444',
    '⚠️ DGMS CIR 09/2008 VIOLATION',
    'LAT: 22.351820° N, LNG: 82.684910° E • ALT: 315.0m • 25-SEP-2026 14:30 IST'
  ),
  ALARM_RECTIFIED: createMiningGeoPhoto(
    'DUMPER D-409 AUDIO-VISUAL ALARM REPLACED',
    'DGMS-compliant 114dB Smart Reverse Chime installed & calibrated',
    '#22c55e',
    '✅ CAPA RECTIFICATION PROOF',
    'LAT: 22.351820° N, LNG: 82.684910° E • ALT: 315.0m • 27-SEP-2026 11:15 IST',
    true
  ),
};

export const SEED_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'INSP-2026-0928-01',
    mineId: 'mine-kusmunda',
    mineName: 'Kusmunda Mega OCP',
    zone: 'Pit 4 - North Haul Road Ramp 3',
    inspectorId: 'FO-9412',
    inspectorName: 'Rajeshwar Sharma',
    timestamp: '2026-09-28T07:45:00.000Z',
    totalChecks: 5,
    passedChecks: 3,
    failedChecks: 2,
    criticalIssuesFound: 1,
    status: 'SYNCED',
    syncedAt: '2026-09-28T08:15:00.000Z',
    cryptoProofHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
    overallComments: 'High dust suspension near Ramp 3 due to dry surface. Haul road berm eroded on curve #2.',
    items: [
      {
        id: 'chk-1',
        category: 'HAUL_ROAD',
        title: 'Haul Road Berm Height & Width',
        statutoryRule: 'DGMS (Tech) Circular No. 05/2010',
        description: 'Berm height must not be less than the diameter of the tyre of the largest vehicle.',
        status: 'FAIL',
        severityIfFailed: 'HIGH',
        observationNotes: 'Berm collapsed over 40m stretch near Ramp 3 turn. Dumper spill hazard detected.',
        photoUrl: SAMPLE_GEO_PHOTOS.BERM_COLLAPSE,
        photoMetadata: {
          latitude: 22.352419,
          longitude: 82.685412,
          altitude: 318.5,
          accuracy: 3.8,
          timestamp: '2026-09-28T07:45:12.000Z',
          stampedText: 'BERM HEIGHT 1.4M (BELOW 2.2M SPEC) • LAT 22.352419, LNG 82.685412',
          deviceHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
        },
      },
      {
        id: 'chk-2',
        category: 'SLOPE_STABILITY',
        title: 'Bench Slope & Highwall Cracks',
        statutoryRule: 'Reg. 106 CMR 2017',
        description: 'Inspect top edge and toe of open-cast highwall for tension cracks.',
        status: 'FAIL',
        severityIfFailed: 'CRITICAL',
        observationNotes: 'Micro-fissures observed on Bench 14 upper terrace after monsoon rain.',
        photoUrl: SAMPLE_GEO_PHOTOS.HIGHWALL_CRACK,
        photoMetadata: {
          latitude: 22.353104,
          longitude: 82.686120,
          altitude: 342.0,
          accuracy: 4.1,
          timestamp: '2026-09-28T07:58:30.000Z',
          stampedText: 'BENCH 14 HIGHWALL TENSION CRACK (14MM GAP) • LAT 22.353104, LNG 82.686120',
          deviceHash: '0x3a7d41f92e018b2c45e990172bfac5518b7c329d48e021a8c909e12891cc19',
        },
      },
      {
        id: 'chk-3',
        category: 'DUST_SUPPRESSION',
        title: 'Haul Road Water Sprinklers & Fog Cannons',
        statutoryRule: 'Environment (Protection) Act',
        description: 'Continuous water spraying active on transport corridors.',
        status: 'PASS',
        severityIfFailed: 'MEDIUM',
      },
      {
        id: 'chk-4',
        category: 'MACHINERY_HEMM',
        title: 'HEMM Pre-Shift Brake & Horn Check',
        statutoryRule: 'DGMS Circular No. 09/2008',
        description: 'Audio-visual alarm and emergency steering operational.',
        status: 'PASS',
        severityIfFailed: 'HIGH',
      },
      {
        id: 'chk-5',
        category: 'PPE_WORKER_SAFETY',
        title: 'Contractor Labor PPE & Safety Induction',
        statutoryRule: 'Mines Vocational Training Rules 1966',
        description: 'All contractor personnel wearing certified PPE.',
        status: 'PASS',
        severityIfFailed: 'HIGH',
      },
    ],
  },
];

export const SEED_CAPA_ACTIONS: CAPAAction[] = [
  {
    id: 'CAPA-8821',
    inspectionId: 'INSP-2026-0928-01',
    mineId: 'mine-kusmunda',
    zone: 'Pit 4 - North Haul Road Ramp 3',
    title: 'Rebuild Collapsed Haul Road Berm (40m)',
    description: 'Rebuild compacted earth/rock berm to at least 2.2m height (exceeding 240T Cat 793 dumper tyre diameter) with reflector posts.',
    statutoryRule: 'DGMS (Tech) Circular No. 05/2010',
    violationCategory: 'HAUL_ROAD',
    violationType: 'HAUL_ROAD_NON_COMPLIANCE',
    severity: 'HIGH',
    assignedTo: 'M/s Dilip Buildcon (Contractor Supervisor)',
    assignedContractor: 'Dilip Buildcon Ltd',
    dueDate: '2026-09-30T18:00:00.000Z',
    escalationLevel: 2,
    status: 'OPEN',
    initialEvidencePhoto: SAMPLE_GEO_PHOTOS.BERM_COLLAPSE,
    createdAt: '2026-09-28T08:15:00.000Z',
  },
  {
    id: 'CAPA-8822',
    inspectionId: 'INSP-2026-0928-01',
    mineId: 'mine-kusmunda',
    zone: 'Bench 14 - Upper Highwall',
    title: 'Slope Radar Sensor & Crack Gauge Installation',
    description: 'Install tell-tale crack gauges and restrict heavy machine movement within 30m of Highwall Bench 14 until geotechnical clearance.',
    statutoryRule: 'Reg. 106 CMR 2017',
    violationCategory: 'SLOPE_STABILITY',
    violationType: 'SLOPE_INSTABILITY_RISK',
    severity: 'CRITICAL',
    assignedTo: 'Sr. Geotechnical Officer (SECL)',
    dueDate: '2026-09-29T20:00:00.000Z',
    escalationLevel: 3,
    status: 'IN_PROGRESS',
    initialEvidencePhoto: SAMPLE_GEO_PHOTOS.HIGHWALL_CRACK,
    createdAt: '2026-09-28T08:15:00.000Z',
  },
  {
    id: 'CAPA-8790',
    inspectionId: 'INSP-2026-0925-04',
    mineId: 'mine-kusmunda',
    zone: 'Muster Point #2',
    title: 'Replace Defective Audio-Visual Alarm on Dumper D-409',
    description: 'Reverse alarm was inaudible beyond 5 meters. Mandate DGMS-approved 112dB smart reversing chime.',
    statutoryRule: 'DGMS Circular No. 09/2008',
    violationCategory: 'MACHINERY_HEMM',
    violationType: 'MACHINERY_SAFETY',
    severity: 'HIGH',
    assignedTo: 'HEMM Maintenance Workshop',
    assignedContractor: 'Eastern Coal Logistics Pvt Ltd',
    dueDate: '2026-09-27T12:00:00.000Z',
    escalationLevel: 1,
    status: 'PENDING_VERIFICATION',
    initialEvidencePhoto: SAMPLE_GEO_PHOTOS.ALARM_DEFECT,
    closureProofPhoto: SAMPLE_GEO_PHOTOS.ALARM_RECTIFIED,
    closureProofMetadata: {
      latitude: 22.351820,
      longitude: 82.684910,
      altitude: 315.0,
      accuracy: 3.2,
      timestamp: '2026-09-27T11:15:22.000Z',
      stampedText: 'ALARM REPLACED WITH 114DB SMART CHIME • LAT 22.351820, LNG 82.684910',
      deviceHash: '0x991f82c45e018b2c45e990172bfac5518b7c329d48e021a8c909e12891bb02',
    },
    closureNotes: 'Replaced alarm horn unit and tested with decibel meter. Sound level measured 114 dB at 10m.',
    createdAt: '2026-09-25T14:30:00.000Z',
  },
];

export const SEED_STATUTORY_DOCS: StatutoryDocument[] = [
  {
    id: 'DOC-DGMS-01',
    mineId: 'mine-kusmunda',
    contractorName: 'Eastern Coal Logistics Pvt Ltd',
    documentType: 'HEMM_FITNESS',
    documentNumber: 'DGMS/CZ/KUS/FIT-2026-894',
    issuingAuthority: 'DGMS Central Zone Bilaspur',
    issueDate: '2025-10-15',
    expiryDate: '2026-10-14',
    status: 'EXPIRING_SOON',
    ocrConfidence: 96.8,
    extractedFields: {
      vehicleNumber: 'CG-12-BG-4901 (Cat 793 Dumper)',
      model: 'Komatsu HD785-7',
      fitnessGrade: 'Grade-A Heavy Mining',
      nextInspectionDue: '14 Oct 2026',
    },
  },
  {
    id: 'DOC-ENV-02',
    mineId: 'mine-kusmunda',
    documentType: 'ENVIRONMENTAL_CLEARANCE',
    documentNumber: 'MoEFCC/EC/MIN/2019/331',
    issuingAuthority: 'Ministry of Environment, Forest & Climate Change',
    issueDate: '2020-04-01',
    expiryDate: '2030-03-31',
    status: 'VALID',
    ocrConfidence: 99.2,
    extractedFields: {
      approvedCapacity: '50 MTPA (Million Tonnes Per Annum)',
      clearanceCondition: 'Zero liquid discharge + continuous AAQMS monitoring',
    },
  },
  {
    id: 'DOC-LABOR-03',
    mineId: 'mine-kusmunda',
    contractorName: 'Pragati Infra Earthmovers',
    documentType: 'CONTRACTOR_LABOR_LICENSE',
    documentNumber: 'CLC/CG/KRB/CON-4401',
    issuingAuthority: 'Office of Chief Labour Commissioner (Central)',
    issueDate: '2025-09-01',
    expiryDate: '2026-09-20',
    status: 'EXPIRED',
    ocrConfidence: 94.5,
    extractedFields: {
      maxAuthorizedWorkers: '180 Personnel',
      statutoryPFRegistration: 'CG-BIL-008472-A',
      currentStatus: 'EXPIRED 9 DAYS AGO (Statutory Stop Notice)',
    },
  },
  {
    id: 'DOC-EXP-04',
    mineId: 'mine-kusmunda',
    documentType: 'EXPLOSIVE_MAGAZINE_PERMIT',
    documentNumber: 'PESO/EXP/CG/2024/991',
    issuingAuthority: 'Petroleum & Explosives Safety Organisation (PESO)',
    issueDate: '2024-03-15',
    expiryDate: '2027-03-14',
    status: 'VALID',
    ocrConfidence: 98.7,
    extractedFields: {
      magazineCapacity: '50 Tonnes Bulk Emulsion Explosives',
      licensedBlaster: 'Shri B. K. Tandi (First Class Blaster Cert #401)',
    },
  },
];

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-0x9812',
    timestamp: '2026-09-28T07:45:10.000Z',
    actor: 'Rajeshwar Sharma',
    role: 'FIELD_OFFICER',
    action: 'INSPECTION_SUBMITTED',
    targetEntity: 'INSP-2026-0928-01',
    details: 'Submitted statutory inspection for Pit 4 North Ramp. 2 non-compliances logged.',
    blockHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
    previousHash: '0x3a19b83e449210aa90c8831ef78921a91bc74e9281a8c0919208a11b98ac1239',
    verified: true,
    ipAddress: '192.168.61.240',
    geoStamp: '22.3524° N, 82.6854° E',
  },
  {
    id: 'LOG-0x9813',
    timestamp: '2026-09-28T08:15:22.000Z',
    actor: 'AI Risk Engine v2.6',
    role: 'SYSTEM_ADMIN',
    action: 'ANOMALY_TRIGGERED',
    targetEntity: 'BENCH-14-SLOPE',
    details: 'Cluster anomaly: 3rd Highwall fissure in Sector 4 within 14 days. Escalated to Level 3.',
    blockHash: '0x2a991823bb9900c9e198234ab88912ef39c18274a10892c9081a98bc19280a91',
    previousHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
    verified: true,
    ipAddress: '10.0.4.1 (Internal Cluster)',
  },
  {
    id: 'LOG-0x9814',
    timestamp: '2026-09-28T09:30:00.000Z',
    actor: 'Dr. V. K. Mishra',
    role: 'MINE_MANAGER',
    action: 'PENALTY_ISSUED',
    targetEntity: 'CON-03 (Pragati Infra)',
    details: 'Issued Rs. 2,50,000 fine for expired labor license & unauthorized pit entry.',
    blockHash: '0x5c881923bc1100f9a298312ab99013ef49c28385a20993d9092b99cd29391b92',
    previousHash: '0x2a991823bb9900c9e198234ab88912ef39c18274a10892c9081a98bc19280a91',
    verified: true,
    ipAddress: '192.168.10.15',
    geoStamp: 'Mine Manager Admin HQ',
  },
];

export const SEED_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'SOS-2026-01',
    type: 'HIGHWALL_COLLAPSE_RISK',
    severity: 'CRITICAL_EVACUATION',
    mineId: 'mine-kusmunda',
    zone: 'Bench 14 - Upper Terrace',
    message: 'Tension fissure widening at 3.4 mm/hr. Geotechnical ground radar warns of immediate sliding risk. Cease all dump operations immediately.',
    timestamp: '2026-09-29T08:15:00.000Z',
    triggeredBy: 'Geotechnical Slope Radar Sensor #SR-04',
    active: true,
    coordinates: [22.3566, 82.6885],
    evacuationMusterPoint: 'Muster Station #2 (North Ramp Incline)',
  },
];

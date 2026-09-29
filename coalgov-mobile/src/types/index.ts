export type UserRole =
  | 'FIELD_OFFICER'
  | 'MINE_MANAGER'
  | 'CORPORATE_MGMT'
  | 'REGULATORY_AUDITOR'
  | 'SYSTEM_ADMIN'
  | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  badgeNumber: string;
  assignedMineId: string;
  assignedZone: string;
  designation: string;
  mineId?: string;
  subsidiary?: string;
}

export interface MineSite {
  id: string;
  name: string;
  subsidiary: string; // e.g. SECL, NCL, CCL, ECL, WCL
  location: string;
  coordinates: [number, number]; // [lat, lng]
  riskScore: number; // 0 - 100
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeViolations: number;
  openCapaCount: number;
  lastInspectionDate: string;
  monthlyProductionMT: number; // in Million Tonnes
  workerCount: number;
  contractorCount: number;
}

export type HazardSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ChecklistItem {
  id: string;
  category: 'HAUL_ROAD' | 'SLOPE_STABILITY' | 'DUST_SUPPRESSION' | 'MACHINERY_HEMM' | 'PPE_WORKER_SAFETY';
  title: string;
  statutoryRule: string; // e.g. "DGMS (Tech) Cir. No. 05/2010"
  description: string;
  status: 'PASS' | 'FAIL' | 'NA';
  severityIfFailed: HazardSeverity;
  observationNotes?: string;
  photoUrl?: string;
  photoMetadata?: GeoMetadata;
}

export interface GeoMetadata {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number; // in meters
  timestamp: string;
  stampedText: string;
  deviceHash: string;
}

export interface InspectionRecord {
  id: string;
  mineId: string;
  mineName: string;
  zone: string;
  inspectorId: string;
  inspectorName: string;
  timestamp: string;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  criticalIssuesFound: number;
  status: 'DRAFT' | 'SAVED_OFFLINE' | 'SYNCED' | 'VERIFIED';
  items: ChecklistItem[];
  overallComments: string;
  syncedAt?: string;
  cryptoProofHash?: string;
}

export interface CAPAAction {
  id: string;
  inspectionId: string;
  mineId: string;
  zone: string;
  title: string;
  description: string;
  violationType?: string;
  violationCategory?: string;
  statutoryRule?: string;
  severity: HazardSeverity;
  assignedTo: string;
  assignedContractor?: string;
  assignedRole?: string;
  dueDate: string;
  escalationLevel?: 1 | 2 | 3 | 4; // 1: Supervisor, 2: Safety Officer, 3: GM, 4: DGMS
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'CLOSED';
  initialEvidencePhoto?: string;
  closureProofPhoto?: string;
  closureProofMetadata?: GeoMetadata;
  closureNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  reportedAt?: string;
  reportedBy?: string;
  createdAt?: string;
}

export interface StatutoryDocument {
  id: string;
  mineId: string;
  contractorName?: string;
  documentType:
    | 'DGMS_MINE_PLAN'
    | 'ENVIRONMENTAL_CLEARANCE'
    | 'HEMM_FITNESS'
    | 'CONTRACTOR_LABOR_LICENSE'
    | 'PUC_CERTIFICATE'
    | 'EXPLOSIVE_MAGAZINE_PERMIT'
    | 'HEAVY_VEHICLE_LICENSE'
    | 'BLASTER_CERTIFICATE';
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  scannedImageUrl?: string;
  ocrConfidence: number; // 0 - 100%
  extractedFields: Record<string, string>;
}

export interface ContractorEntity {
  id: string;
  name: string;
  licenseNumber: string;
  category: 'HAULAGE_TRANSPORT' | 'EARTHMOVING_OVERBURDEN' | 'SECURITY_BLASTING' | 'MAINTENANCE';
  safetyScore: number; // 0 - 100
  complianceGrade: 'A+' | 'A' | 'B' | 'CRITICAL_REVIEW';
  activeWorkersInPit: number;
  deployedMachineryCount: number;
  activeViolations: number;
  totalPenaltiesINR: number;
  primaryContact: string;
  phone: string;
  verifiedLaborPF: boolean;
  status: 'ACTIVE' | 'WARNED' | 'HALTED_FOR_SAFETY';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetEntity: string;
  details: string;
  blockHash: string;
  previousHash: string;
  verified: boolean;
  ipAddress: string;
  geoStamp?: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'HIGHWALL_COLLAPSE_RISK' | 'METHANE_GAS_LEAK' | 'HAUL_TRUCK_COLLISION' | 'FLOODING_SUMP_OVERFLOW' | 'FIRE_COAL_SEAM';
  severity: 'CRITICAL_EVACUATION' | 'HIGH_HAZARD';
  mineId: string;
  zone: string;
  message: string;
  timestamp: string;
  triggeredBy: string;
  active: boolean;
  coordinates: [number, number];
  evacuationMusterPoint: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'INSPECTION' | 'CAPA_CLOSURE' | 'DOCUMENT_UPLOAD' | 'EMERGENCY_SOS';
  createdAt: string;
  payload: any;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  error?: string;
}

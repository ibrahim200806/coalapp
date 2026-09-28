export type UserRole = 'FIELD_OFFICER' | 'MINE_MANAGER' | 'CORPORATE_MGMT' | 'REGULATORY_AUDITOR';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  badgeNumber: string;
  assignedMineId: string;
  assignedZone: string;
}

export interface MineSite {
  id: string;
  name: string;
  subsidiary: string; // e.g. SECL, NCDC, CCL, ECL
  location: string;
  coordinates: [number, number]; // [lat, lng]
  riskScore: number; // 0 - 100
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeViolations: number;
  openCapaCount: number;
  lastInspectionDate: string;
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
}

export interface CAPAAction {
  id: string;
  inspectionId: string;
  mineId: string;
  zone: string;
  title: string;
  description: string;
  violationType: string;
  severity: HazardSeverity;
  assignedTo: string;
  dueDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'CLOSED';
  initialEvidencePhoto?: string;
  closureProofPhoto?: string;
  closureProofMetadata?: GeoMetadata;
  closureNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface StatutoryDocument {
  id: string;
  mineId: string;
  contractorName?: string;
  documentType: 'DGMS_MINE_PLAN' | 'ENVIRONMENTAL_CLEARANCE' | 'HEMM_FITNESS' | 'CONTRACTOR_LABOR_LICENSE' | 'PUC_CERTIFICATE' | 'EXPLOSIVE_MAGAZINE_PERMIT';
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  scannedImageUrl?: string;
  ocrConfidence: number; // 0 - 100%
  extractedFields: Record<string, string>;
}

export interface SyncQueueItem {
  id: string;
  type: 'INSPECTION' | 'CAPA_CLOSURE' | 'DOCUMENT_UPLOAD' | 'INCIDENT_ALERT';
  createdAt: string;
  payload: any;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  error?: string;
}

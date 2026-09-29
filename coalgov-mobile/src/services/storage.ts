import {
  InspectionRecord,
  CAPAAction,
  StatutoryDocument,
  SyncQueueItem,
  UserProfile,
  ContractorEntity,
  AuditLogEntry,
  EmergencyAlert,
  MineSite,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'coalgov_user_profile',
  SELECTED_MINE: 'coalgov_selected_mine',
  INSPECTIONS: 'coalgov_inspections',
  CAPA_ACTIONS: 'coalgov_capa_actions',
  DOCUMENTS: 'coalgov_documents',
  CONTRACTORS: 'coalgov_contractors',
  AUDIT_LOGS: 'coalgov_audit_logs',
  EMERGENCY_ALERTS: 'coalgov_emergency_alerts',
  SYNC_QUEUE: 'coalgov_sync_queue',
  SIMULATED_OFFLINE: 'coalgov_simulated_offline',
  THEME: 'coalgov_theme',
};

export class StorageService {
  // Theme support
  static getTheme(): 'dark' | 'light' {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  }

  static setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Offline simulation toggle
  static isSimulatedOffline(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SIMULATED_OFFLINE) === 'true';
  }

  static setSimulatedOffline(offline: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, offline ? 'true' : 'false');
  }

  static isNetworkAvailable(): boolean {
    if (this.isSimulatedOffline()) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // User Profile
  static getUserProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // fallback
      }
    }
    const defaultUser: UserProfile = {
      id: 'FO-9412',
      name: 'Rajeshwar Sharma',
      role: 'FIELD_OFFICER',
      badgeNumber: 'DGMS-INSP-2024',
      assignedMineId: 'mine-kusmunda',
      assignedZone: 'Pit 4 - North Wall',
      designation: 'Senior Field Compliance Inspector',
    };
    this.saveUserProfile(defaultUser);
    return defaultUser;
  }

  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // Selected Mine
  static getSelectedMineId(): string {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MINE) || 'mine-kusmunda';
  }

  static setSelectedMineId(mineId: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MINE, mineId);
  }

  // Inspections
  static getInspections(): InspectionRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
    return raw ? JSON.parse(raw) : [];
  }

  static saveInspection(record: InspectionRecord): void {
    const list = this.getInspections();
    const existingIndex = list.findIndex((i) => i.id === record.id);
    if (existingIndex >= 0) {
      list[existingIndex] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(list));

    // Append to audit log
    this.appendAuditLog({
      id: `LOG-0x${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: record.inspectorName,
      role: 'FIELD_OFFICER',
      action: 'INSPECTION_RECORDED',
      targetEntity: record.id,
      details: `Field inspection in ${record.zone}. ${record.failedChecks} failure(s) detected.`,
      blockHash: `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16)}`,
      previousHash: '0x8f2c91b8a4f009e4d1c998319fbc41235b6a718c39e08821a8c909e12891bb24',
      verified: true,
      ipAddress: '192.168.61.240',
      geoStamp: record.items.find((i) => i.photoMetadata)?.photoMetadata?.stampedText,
    });

    // If offline or marked as draft/saved_offline, add to sync queue
    if (record.status === 'SAVED_OFFLINE' || !this.isNetworkAvailable()) {
      this.enqueueSync({
        id: `sync-insp-${Date.now()}`,
        type: 'INSPECTION',
        createdAt: new Date().toISOString(),
        payload: record,
        status: 'QUEUED',
        retryCount: 0,
      });
    }
  }

  // CAPA Actions
  static getCapaActions(): CAPAAction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CAPA_ACTIONS);
    return raw ? JSON.parse(raw) : [];
  }

  static saveCapaAction(action: CAPAAction): void {
    const list = this.getCapaActions();
    const existingIndex = list.findIndex((a) => a.id === action.id);
    if (existingIndex >= 0) {
      list[existingIndex] = action;
    } else {
      list.unshift(action);
    }
    localStorage.setItem(STORAGE_KEYS.CAPA_ACTIONS, JSON.stringify(list));

    if (!this.isNetworkAvailable() || action.status === 'PENDING_VERIFICATION') {
      this.enqueueSync({
        id: `sync-capa-${Date.now()}`,
        type: 'CAPA_CLOSURE',
        createdAt: new Date().toISOString(),
        payload: action,
        status: 'QUEUED',
        retryCount: 0,
      });
    }
  }

  // Documents
  static getDocuments(): StatutoryDocument[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return raw ? JSON.parse(raw) : [];
  }

  static saveDocument(doc: StatutoryDocument): void {
    const list = this.getDocuments();
    const existingIndex = list.findIndex((d) => d.id === doc.id);
    if (existingIndex >= 0) {
      list[existingIndex] = doc;
    } else {
      list.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(list));

    this.enqueueSync({
      id: `sync-doc-${Date.now()}`,
      type: 'DOCUMENT_UPLOAD',
      createdAt: new Date().toISOString(),
      payload: doc,
      status: 'QUEUED',
      retryCount: 0,
    });
  }

  // Contractors
  static getContractors(): ContractorEntity[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTRACTORS);
    return raw ? JSON.parse(raw) : [];
  }

  static saveContractor(contractor: ContractorEntity): void {
    const list = this.getContractors();
    const idx = list.findIndex((c) => c.id === contractor.id);
    if (idx >= 0) {
      list[idx] = contractor;
    } else {
      list.push(contractor);
    }
    localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(list));
  }

  // Audit Logs
  static getAuditLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  static appendAuditLog(entry: AuditLogEntry): void {
    const logs = this.getAuditLogs();
    logs.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 50)));
  }

  // Emergency Alerts (SOS)
  static getEmergencyAlerts(): EmergencyAlert[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_ALERTS);
    return raw ? JSON.parse(raw) : [];
  }

  static triggerEmergencyAlert(alert: EmergencyAlert): void {
    const list = this.getEmergencyAlerts();
    list.unshift(alert);
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_ALERTS, JSON.stringify(list));

    this.appendAuditLog({
      id: `LOG-0x${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: alert.triggeredBy,
      role: 'FIELD_OFFICER',
      action: 'EMERGENCY_SOS_BROADCAST',
      targetEntity: alert.id,
      details: `CRITICAL ALERT: ${alert.type} in ${alert.zone}. Evacuation to ${alert.evacuationMusterPoint}.`,
      blockHash: `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16)}`,
      previousHash: '0x2a991823bb9900c9e198234ab88912ef39c18274a10892c9081a98bc19280a91',
      verified: true,
      ipAddress: '192.168.61.240',
      geoStamp: `${alert.coordinates[0]}° N, ${alert.coordinates[1]}° E`,
    });
  }

  static resolveEmergencyAlert(alertId: string): void {
    const list = this.getEmergencyAlerts();
    const alert = list.find((a) => a.id === alertId);
    if (alert) {
      alert.active = false;
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_ALERTS, JSON.stringify(list));
    }
  }

  // Sync Queue
  static getSyncQueue(): SyncQueueItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return raw ? JSON.parse(raw) : [];
  }

  static enqueueSync(item: SyncQueueItem): void {
    const queue = this.getSyncQueue();
    queue.push(item);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  }

  static clearSyncQueue(): void {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
  }

  // Seed Data Initializer
  static initSeedDataIfEmpty(
    seedMines: MineSite[],
    seedInspections: InspectionRecord[],
    seedCapa: CAPAAction[],
    seedDocs: StatutoryDocument[],
    seedContractors: ContractorEntity[],
    seedLogs: AuditLogEntry[],
    seedAlerts: EmergencyAlert[]
  ): void {
    if (!localStorage.getItem(STORAGE_KEYS.INSPECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(seedInspections));
    } else {
      try {
        const stored: InspectionRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INSPECTIONS) || '[]');
        let modified = false;
        stored.forEach((insp) => {
          const matchingSeed = seedInspections.find((s) => s.id === insp.id);
          if (matchingSeed) {
            insp.items.forEach((item) => {
              const seedItem = matchingSeed.items.find((si) => si.id === item.id);
              if (seedItem && seedItem.photoUrl && !item.photoUrl) {
                item.photoUrl = seedItem.photoUrl;
                item.photoMetadata = seedItem.photoMetadata;
                modified = true;
              }
            });
          }
        });
        if (modified) {
          localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(stored));
        }
      } catch (e) {
        localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(seedInspections));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.CAPA_ACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.CAPA_ACTIONS, JSON.stringify(seedCapa));
    } else {
      try {
        const storedCapa: CAPAAction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAPA_ACTIONS) || '[]');
        let modifiedCapa = false;
        storedCapa.forEach((capa) => {
          const matchingSeed = seedCapa.find((s) => s.id === capa.id);
          if (matchingSeed) {
            if (matchingSeed.initialEvidencePhoto && !capa.initialEvidencePhoto) {
              capa.initialEvidencePhoto = matchingSeed.initialEvidencePhoto;
              modifiedCapa = true;
            }
            if (matchingSeed.closureProofPhoto && !capa.closureProofPhoto) {
              capa.closureProofPhoto = matchingSeed.closureProofPhoto;
              capa.closureProofMetadata = matchingSeed.closureProofMetadata;
              modifiedCapa = true;
            }
          }
        });
        if (modifiedCapa) {
          localStorage.setItem(STORAGE_KEYS.CAPA_ACTIONS, JSON.stringify(storedCapa));
        }
      } catch (e) {
        localStorage.setItem(STORAGE_KEYS.CAPA_ACTIONS, JSON.stringify(seedCapa));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(seedDocs));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTRACTORS)) {
      localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(seedContractors));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(seedLogs));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMERGENCY_ALERTS)) {
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_ALERTS, JSON.stringify(seedAlerts));
    }
  }
}

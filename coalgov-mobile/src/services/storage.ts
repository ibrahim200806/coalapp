import { InspectionRecord, CAPAAction, StatutoryDocument, SyncQueueItem, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'coalgov_user_profile',
  SELECTED_MINE: 'coalgov_selected_mine',
  INSPECTIONS: 'coalgov_inspections',
  CAPA_ACTIONS: 'coalgov_capa_actions',
  DOCUMENTS: 'coalgov_documents',
  SYNC_QUEUE: 'coalgov_sync_queue',
  SIMULATED_OFFLINE: 'coalgov_simulated_offline',
};

export class StorageService {
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

  static updateSyncItemStatus(id: string, status: SyncQueueItem['status'], error?: string): void {
    const queue = this.getSyncQueue();
    const item = queue.find((q) => q.id === id);
    if (item) {
      item.status = status;
      if (error) item.error = error;
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    }
  }

  // Initialize seed data if storage is empty
  static initSeedDataIfEmpty(
    seedMines: any,
    seedInspections: InspectionRecord[],
    seedCapa: CAPAAction[],
    seedDocs: StatutoryDocument[]
  ): void {
    if (!localStorage.getItem(STORAGE_KEYS.INSPECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(seedInspections));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAPA_ACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.CAPA_ACTIONS, JSON.stringify(seedCapa));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(seedDocs));
    }
  }
}

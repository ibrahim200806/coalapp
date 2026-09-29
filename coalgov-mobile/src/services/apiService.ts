import { InspectionRecord, CAPAAction, EmergencyAlert } from '../types';
import { StorageService } from './storage';

const API_BASE_URL = 'http://localhost:8000';

export class ApiService {
  private static isBackendAvailable = true;

  static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/`, { method: 'GET', signal: AbortSignal.timeout(2500) });
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch {
      this.isBackendAvailable = false;
      return false;
    }
  }

  static async submitInspection(record: InspectionRecord): Promise<{ success: boolean; id?: string }> {
    try {
      if (this.isBackendAvailable) {
        const payload = {
          mine_id: record.mineId,
          mine_name: record.mineName,
          zone: record.zone,
          inspector_id: record.inspectorId,
          inspector_name: record.inspectorName,
          total_checks: record.totalChecks,
          passed_checks: record.passedChecks,
          failed_checks: record.failedChecks,
          critical_issues_found: record.criticalIssuesFound,
          items: record.items.map((i) => ({
            id: i.id,
            category: i.category,
            title: i.title,
            statutory_rule: i.statutoryRule,
            status: i.status,
            severity_if_failed: i.severityIfFailed,
            observation_notes: i.observationNotes,
            photo_url: i.photoUrl,
          })),
          overall_comments: record.overallComments,
        };

        const res = await fetch(`${API_BASE_URL}/api/inspections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(4000),
        });

        if (res.ok) {
          const data = await res.json();
          return { success: true, id: data.inspection_id };
        }
      }
    } catch (err) {
      console.warn('Backend sync failed, storing locally:', err);
    }

    // Fallback locally
    StorageService.saveInspection(record);
    return { success: true, id: record.id };
  }

  static async verifyCapa(
    actionId: string,
    approved: boolean,
    verifierName: string,
    verifierRole: string,
    remarks = ''
  ): Promise<boolean> {
    try {
      if (this.isBackendAvailable) {
        const res = await fetch(`${API_BASE_URL}/api/capa/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_id: actionId,
            approved,
            verifier_name: verifierName,
            verifier_role: verifierRole,
            remarks,
          }),
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) return true;
      }
    } catch (err) {
      console.warn('Backend CAPA verify failed, falling back to local:', err);
    }
    return false;
  }

  static async broadcastSOS(alert: EmergencyAlert): Promise<boolean> {
    try {
      if (this.isBackendAvailable) {
        const res = await fetch(`${API_BASE_URL}/api/sos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mine_id: alert.mineId,
            zone: alert.zone,
            incident_type: alert.type,
            triggered_by: alert.triggeredBy,
            message: alert.message,
            latitude: alert.coordinates[0],
            longitude: alert.coordinates[1],
          }),
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) return true;
      }
    } catch (err) {
      console.warn('Backend SOS broadcast failed:', err);
    }
    return false;
  }
}

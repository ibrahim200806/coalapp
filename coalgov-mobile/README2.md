# 🏛️ CoalGov AI — Master Operational Manual & Technical Architecture Guide

> **National Statutory Safety, Risk Intelligence & Regulatory Governance Platform for Coal Mining**  
> *Conforming to Coal Mines Regulations (CMR) 2017, Mines Act 1952, DGMS Statutory Circulars & Ministry of Coal Governance Standards.*

Please refer to the comprehensive root documentation in:
[`../README2.md`](../README2.md)

---

## 🚀 Quick Reference Summary

### Web Governance Portal (The 9 Top Horizontal Tabs)
1. **🏛️ Dashboard**: Executive Overview, Colliery Risk Gauge (0-100), Active Violations & SLA Tracking.
2. **📋 Field Inspections**: Shift checklist submissions with **Geo-Stamped Photographic Evidence** & Full-Screen Zoom Modal.
3. **🛡️ CAPA Remediation**: Side-by-side **Before (Hazard) vs After (Repair) Photo Audit** & Managerial Dual Sign-Off.
4. **🚜 Contractor Registry**: Empaneled agencies, HEMM fleet counts, labor PF verification & **"Halt Contractor in Pit"** emergency switch.
5. **📄 Statutory Permits (OCR)**: Scanned MoEFCC, HEMM fitness, blaster & driver permits with real-time expiry engine.
6. **🗺️ GIS Pit Map**: Opencast bench layout, active hazard beacons, and evacuation muster points.
7. **🌐 Corporate League (CIL)**: Enterprise safety benchmarking across SECL, NCL, CCL, ECL, WCL, and BCCL.
8. **⚖️ DGMS Audits & Form 24**: Cryptographic SHA-256 Merkle chain ledger & Printable statutory **DGMS Form 24 Legal Notice**.
9. **👑 Super Admin Console**: Directorate-level configuration for SLA escalation timers, AI sensitivity & database maintenance.

### Field Worker Mobile Companion (The 5 Bottom Tabs)
1. **📊 Overview**: Shift briefing, active AI pit anomalies, and current colliery risk rating.
2. **📋 Inspect**: Digital checklist under CMR 2017 with live camera & tamper-evident GPS watermark HUD.
3. **🛡️ CAPA**: Field remediation tracking & post-repair closure proof photo submission.
4. **📄 Doc OCR**: On-the-spot mobile camera scanner for contractor licenses & vehicle roadworthiness certificates.
5. **🗺️ Pit Map**: Tactical field navigation with hazard exclusion perimeters and muster stations.

### The 5 Role Clearances (RBAC)
- **Level 5 — Super Administrator (`SUPER_ADMIN`)**: Unrestricted Directorate access across all 9 modules.
- **Level 4 — Colliery Mine Manager (`MINE_MANAGER`)**: Colliery command signatory under CMR 2017 Reg. 27.
- **Level 3 — Corporate Executive (`CORPORATE_MGMT`)**: Enterprise CIL HQ multi-subsidiary monitoring.
- **Level 4 — DGMS Regulatory Inspector (`REGULATORY_AUDITOR`)**: Independent statutory auditor & Form 24 authority.
- **Level 1 — Field Safety Officer (`FIELD_OFFICER`)**: Frontline pit inspector using the Field Companion app.

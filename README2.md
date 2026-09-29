# 🏛️ CoalGov AI — Master Operational Manual & Technical Architecture Guide

> **National Statutory Safety, Risk Intelligence & Regulatory Governance Platform for Coal Mining**  
> *Conforming to Coal Mines Regulations (CMR) 2017, Mines Act 1952, DGMS Statutory Circulars & Ministry of Coal Governance Standards.*

---

## 📑 Table of Contents

1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Glossary of Mining, Statutory & Technical Terms](#2-glossary-of-mining-statutory--technical-terms)
3. [The 5 Clearance Levels & Government RBAC Roles](#3-the-5-clearance-levels--government-rbac-roles)
4. [Central Web Governance Portal (The 9 Top Horizontal Tabs)](#4-central-web-governance-portal-the-9-top-horizontal-tabs)
   - [Tab 1: 🏛️ Dashboard (Overview Telemetry & Risk Index)](#tab-1-️-dashboard-overview-telemetry--risk-index)
   - [Tab 2: 📋 Field Inspections (Geo-Tagged Photo Evidence Gallery)](#tab-2--field-inspections-geo-tagged-photo-evidence-gallery)
   - [Tab 3: 🛡️ CAPA Remediation (Side-by-Side Before/After Photo Audit)](#tab-3-️-capa-remediation-side-by-side-beforeafter-photo-audit)
   - [Tab 4: 🚜 Contractor Registry (Agencies, Machinery & Pit Halt Switch)](#tab-4--contractor-registry-agencies-machinery--pit-halt-switch)
   - [Tab 5: 📄 Statutory Permits (OCR Scanner & Expiry Engine)](#tab-5--statutory-permits-ocr-scanner--expiry-engine)
   - [Tab 6: 🗺️ GIS Pit Map (Spatial Hazard & Evacuation Schematic)](#tab-6-️-gis-pit-map-spatial-hazard--evacuation-schematic)
   - [Tab 7: 🌐 Corporate League - CIL (Enterprise Zero-Harm Benchmarking)](#tab-7--corporate-league---cil-enterprise-zero-harm-benchmarking)
   - [Tab 8: ⚖️ DGMS Audits & Form 24 (Cryptographic Ledger & Legal Notices)](#tab-8-️-dgms-audits--form-24-cryptographic-ledger--legal-notices)
   - [Tab 9: 👑 Super Admin Console (Directorate SLAs & Rules Engine)](#tab-9--super-admin-console-directorate-slas--rules-engine)
5. [Field Worker Mobile Companion (The 5 Bottom Tabs)](#5-field-worker-mobile-companion-the-5-bottom-tabs)
   - [Mobile Tab 1: 📊 Overview (Shift Telemetry & Alerts)](#mobile-tab-1--overview-shift-telemetry--alerts)
   - [Mobile Tab 2: 📋 Inspect (Digital Checklist & Camera Watermarker)](#mobile-tab-2--inspect-digital-checklist--camera-watermarker)
   - [Mobile Tab 3: 🛡️ CAPA (Field Remediation & Closure Proof)](#mobile-tab-3-️-capa-field-remediation--closure-proof)
   - [Mobile Tab 4: 📄 Doc OCR (Mobile Permit Scanner)](#mobile-tab-4--doc-ocr-mobile-permit-scanner)
   - [Mobile Tab 5: 🗺️ Pit Map (Tactical Field Navigation)](#mobile-tab-5-️-pit-map-tactical-field-navigation)
6. [Interactive Simulation Controls (Omnichannel Header)](#6-interactive-simulation-controls-omnichannel-header)
7. [Step-by-Step Practical Testing Walkthrough](#7-step-by-step-practical-testing-walkthrough)

---

## 1. Executive Summary & Purpose

Coal mining in India is among the world's most hazardous heavy industries, governed by rigorous statutory frameworks overseen by the **Ministry of Coal (MoC)** and the **Directorate General of Mines Safety (DGMS)** under the **Mines Act 1952** and the **Coal Mines Regulations (CMR) 2017**.

### The Core Problem Solved
Historically, colliery safety inspections, contractor machinery certifications, and corrective hazard actions were recorded on paper logbooks (*Form IVB, Form V, pre-shift registers*). This led to:
- **Zero Real-Time Visibility**: Hazardous bench tension cracks or inaudible dumper reversing sirens took days to reach colliery managers.
- **Evidence Tampering**: Photographs could be taken of old repairs or off-site areas with no cryptographic guarantee of physical pit presence.
- **Audit Failure in Court Inquiries**: When pit accidents occurred, paper records lacked the timestamped, tamper-evident admissibility mandated under **Section 65B of the Indian Evidence Act**.
- **Contractor Accountability Gaps**: Unlicensed machinery and untrained contract labor frequently operated inside active blasting zones.

### The CoalGov AI Solution
CoalGov AI establishes an unbroken, real-time digital governance loop connecting frontline safety inspectors in deep pits (>250m underground or open-cast) to Colliery Managers, DGMS Regulatory Inspectors, and Corporate Executives at Coal India Limited (CIL) Headquarters:

$$\textbf{PIT DATA (Edge Mobile)} \longrightarrow \textbf{AI RISK SCORING} \longrightarrow \textbf{CAPA REMEDIATION} \longrightarrow \textbf{DUAL SIGN-OFF} \longrightarrow \textbf{SHA-256 AUDIT CHAIN}$$

---

## 2. Glossary of Mining, Statutory & Technical Terms

| Term | Full Name / Reference | Meaning & Context in Mining Operations |
| :--- | :--- | :--- |
| **DGMS** | Directorate General of Mines Safety | The apex statutory regulatory body under the Ministry of Labour & Employment, Government of India, empowered to enforce safety laws in all mines. |
| **CMR 2017** | Coal Mines Regulations, 2017 | The primary codified regulations governing coal mines in India, covering manager certifications, bench dimensions, blasting, haulage, and ventilation. |
| **Reg. 27** | CMR 2017 Regulation 27 | Mandates that every mine must be under the sole statutory control of a qualified Colliery Manager holding a First Class Mines Manager's Certificate of Competency. |
| **Reg. 106** | CMR 2017 Regulation 106 | Governs the **height and width of benches** in open-cast mines to prevent catastrophic highwall slope collapse. |
| **Reg. 182** | CMR 2017 Regulation 182 | Mandates daily pre-shift safety examinations of all Heavy Earth Moving Machinery (HEMM) including fail-safe service brakes, steering, and reverse warning systems. |
| **Mines Act 1952** | Act No. 35 of 1952 | The foundational parliamentary act establishing statutory duties, inspector powers, and safety liabilities for Indian mines. |
| **Section 22** | Mines Act 1952 Section 22 | Empowers DGMS inspectors to issue statutory prohibition notices prohibiting employment in any pit section where an imminent danger to human life exists. |
| **DGMS Form 24** | Notice under Reg. 106 / Sec. 22 | Official legal order issued by a DGMS Director of Mines Safety citing statutory violations and mandating pit halt or immediate remedial works. |
| **CAPA** | Corrective & Preventive Action | An ISO / DGMS statutory remediation workflow where an identified hazard is tracked from discovery to contractor repair and managerial sign-off. |
| **HEMM** | Heavy Earth Moving Machinery | High-tonnage mining machinery operating in the pit: dump trucks (e.g. Caterpillar 793, Komatsu HD785), hydraulic excavators, electric rope shovels, and draglines. |
| **Form V** | Contract Labour Certificate | Official certificate issued under Section 12 of the Contract Labour (Regulation & Abolition) Act granting legal authority for an empaneled contractor to deploy workers. |
| **MVT Rules** | Mines Vocational Training Rules 1966 | Mandatory safety induction, refresher training, and PPE certification required for all workers prior to entering any mine pit. |
| **Section 65B** | Indian Evidence Act, 1872 | Legal requirement stating that computer output and digital photos are only admissible in court if accompanied by cryptographic proof of device hash, timestamp, and untampered storage. |
| **Highwall** | Open-Cast Mining Highwall | The unexcavated, steep rock face on the perimeter of an open-pit coal mine. Subject to catastrophic slope failure if tension cracks develop. |
| **Bench** | Mining Terrace / Bench | Stepped horizontal ledges carved into the quarry to extract coal safely. Regulation 106 mandates bench width must always exceed bench height. |
| **Haul Road Berm** | Safety Bund / Berm | A raised earthen/rock barrier constructed along the outer edge of pit haulage roads. DGMS Circular 05/2010 mandates berm height must equal or exceed the largest dumper tire diameter (min 2.2m). |
| **Sump** | Pit Drainage Sump | The lowest topographic depression in an open-cast pit where groundwater and rainwater accumulate to be pumped to the surface. |
| **Overburden (OB)** | Waste Rock / Strata | Non-coal rock layers (sandstone, shale, soil) overlying the coal seam that must be blasted and stripped by excavators. |
| **CIL** | Coal India Limited | The Maharatna holding company and world's largest coal producer, operating through 8 subsidiaries: **SECL, NCL, CCL, ECL, WCL, BCCL, MCL, and CMPDI**. |
| **PaddleOCR** | Ultra-Lightweight Edge OCR | Deep learning optical character recognition model (PP-OCRv4, 8.2MB) running locally on field devices without internet access to parse documents in ~450ms. |
| **Merkle Chain** | Cryptographic Hash Ledger | Append-only block ledger where every inspection and managerial approval is linked to the previous block's SHA-256 hash, preventing retrospective tampering. |

---

## 3. The 5 Clearance Levels & Government RBAC Roles

CoalGov AI implements strict, multi-tiered Role-Based Access Control (RBAC) reflecting the statutory chain of command in the Ministry of Coal:

```
[Level 5] 👑 Super Administrator (Ministry Apex Directorate)
              │
  ┌───────────┴──────────────────────────────┐
  ▼                                          ▼
[Level 4] 🏢 Colliery Mine Manager        [Level 4] ⚖️ DGMS Regulatory Auditor
  │                                          │
  ▼                                          ▼
[Level 3] 🌐 Corporate Executive (CIL HQ)  [Level 1] 👷 Frontline Safety Officer
```

### 1. 👑 Super Administrator (`SUPER_ADMIN`)
- **Identity**: Dr. Rajesh Gupta, Chief Safety Controller & IT Directorate, Ministry of Coal
- **Statutory Clearance**: `LEVEL 5 — FULL UNRESTRICTED SYSTEM CLEARANCE`
- **Scope & Authority**: Apex command over all 9 governance tabs. Authorized to configure SLA escalation timers, recalibrate DGMS risk algorithms, execute emergency shutdowns, and perform system maintenance.

### 2. 🏢 Colliery Mine Manager (`MINE_MANAGER`)
- **Identity**: Er. Alok Ranjan, Colliery Manager & Statutory Agent (First Class Cert. #MM-7721)
- **Statutory Clearance**: `LEVEL 4 — COLLIERY STATUTORY COMMAND`
- **Scope & Authority**: Statutory signatory under **CMR 2017 Reg. 27**. Authorized to conduct digital verification on field inspections, execute dual sign-off on CAPA closures, and hit the statutory **"Halt Contractor in Pit"** emergency switch.
- **Allowed Modules**: Dashboard, Field Inspections, CAPA Remediation, Contractor Registry, Statutory Permits, GIS Pit Map.

### 3. 🌐 Corporate Executive - CIL HQ (`CORPORATE_MGMT`)
- **Identity**: Dr. Sunita Deshmukh, Executive Director (Safety & Operations), Coal India Limited HQ
- **Statutory Clearance**: `LEVEL 3 — MULTI-SUBSIDIARY ENTERPRISE OVERSIGHT`
- **Scope & Authority**: Strategic oversight across all 8 CIL subsidiaries. Monitors the Corporate Safety League, Zero-Harm metrics, and ESG compliance. Does not execute daily colliery-level sign-offs.
- **Allowed Modules**: Dashboard, Corporate League (CIL), Contractor Fleet Analytics, GIS Pit Map, Statutory Audit Overview.

### 4. ⚖️ DGMS Regulatory Inspector (`REGULATORY_AUDITOR`)
- **Identity**: Shri P. K. Srivastava, Director of Mines Safety (DGMS Central Zone Bilaspur)
- **Statutory Clearance**: `LEVEL 4 — STATUTORY SAFETY AUDITING AUTHORITY`
- **Scope & Authority**: Independent statutory regulator under the **Mines Act 1952**. Inspects colliery records, verifies cryptographic SHA-256 chain custody, and issues official **DGMS Form 24 Statutory Notices**.
- **Allowed Modules**: Dashboard, Field Inspections, DGMS Audits & Form 24, GIS Pit Map.

### 5. 👷 Frontline Field Safety Officer (`FIELD_OFFICER`)
- **Identity**: Rajeshwar Sharma, Senior Field Compliance Inspector (Badge #FO-9412)
- **Statutory Clearance**: `LEVEL 1 — FRONTLINE PIT COMPLIANCE`
- **Scope & Authority**: Frontline safety officer operating directly in the pit. Conducts physical checklist examinations, captures geo-stamped photo evidence, and logs initial defect reports. Operates primarily via the **Field Worker Mobile Companion**.

---

## 4. Central Web Governance Portal (The 9 Top Horizontal Tabs)

Modeled directly after [`coal.gov.in`](https://coal.gov.in), the web portal provides an authoritative, horizontal top navigation interface with national branding, India tricolor accents, accessibility font controls (`A-` / `A` / `A+`), and instant Light/Dark mode.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [🏛️ Dashboard]  [📋 Field Inspections]  [🛡️ CAPA Remediation]  [🚜 Contractor Registry] │
│  [📄 Statutory Permits]  [🗺️ GIS Pit Map]  [🌐 Corporate League]  [⚖️ DGMS Audits]       │
│  [👑 Super Admin Console]                                                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Tab 1: 🏛️ Dashboard (Overview Telemetry & Risk Index)
- **Why it is used**: Provides executive colliery situational awareness at a glance, eliminating fragmented spreadsheets and disjointed morning report meetings.
- **What it is for**: Aggregating real-time safety risk scores, active statutory violations, pending CAPA remediations, and live pit sirens across the mine.
- **When it is used**: Continuously throughout every 8-hour shift by Colliery Managers, Shift Incharges, and DGMS Auditors.
- **How it is used**:
  1. Review the **Colliery Safety Risk Index** (0 to 100 gauge). Scores above 70 trigger critical orange/red visual warnings.
  2. Inspect the **Active Pit Violations** card to view the breakdown of Critical vs High non-compliances.
  3. Monitor the **CAPA Remediation SLA** counter to ensure open tasks are not breaching statutory deadlines.
  4. Track the **Statutory Document Expiry** badge to identify contractors operating on expired permits.
  5. If a pit evacuation alarm is active, a pulsing red banner appears across the top; clicking it opens the emergency broadcast terminal.

---

### Tab 2: 📋 Field Inspections (Geo-Tagged Photo Evidence Gallery)
- **Why it is used**: Resolves the historic challenge where safety officers documented violations in logbooks with no photographic proof of pit conditions.
- **What it is for**: Displays shift safety inspections submitted from field tablets, complete with embedded **camera photos, GPS coordinates, timestamps, and inspector metadata**.
- **When it is used**: After each shift safety round (Morning, Afternoon, Night) when inspectors complete their physical inspections.
- **How it is used**:
  1. Browse inspections grouped by colliery zone (e.g. *Bench 14 - Upper Highwall Terrace*, *Pit 4 - North Haul Road Ramp 3*).
  2. Inspect the **Geo-Tagged Photographic Evidence Gallery**: Every inspection card displays high-resolution thumbnails of detected defects.
  3. Click on any photograph to launch the **Full-Screen Interactive Zoom Modal**, displaying:
     - Real-time GPS coordinates (`22.3524° N, 82.6854° E`)
     - Altitude (`318.5m`)
     - UTC and IST Timestamp
     - Device SHA-256 cryptographic hash (Section 65B certified)
  4. **Managerial Action**: Colliery Managers (`MINE_MANAGER`) and Super Admins click **"Colliery Manager Statutory Sign-Off"** to append their digital signature. Other roles see a locked indicator awaiting manager approval.

---

### Tab 3: 🛡️ CAPA Remediation (Side-by-Side Before/After Photo Audit)
- **Why it is used**: Eliminates photo ambiguity by presenting **Before vs After** physical evidence side-by-side prior to closing any statutory non-compliance.
- **What it is for**: Managing the lifecycle of Corrective & Preventive Actions from violation discovery to physical contractor repair and final closure.
- **When it is used**: When a contractor completes field remediation work and submits closure proof for managerial audit.
- **How it is used**:
  1. Locate tasks marked `PENDING_VERIFICATION`.
  2. Review the two photographs side-by-side:
     - **Photo 1 (Initial Defect Photo)**: Captured by the inspector showing the initial hazard (e.g. severed reversing alarm wire, collapsed road berm).
     - **Photo 2 (Rectification Proof Photo)**: Captured post-repair by the contractor showing the rectified installation with green verification stamp.
  3. Colliery Managers review the closure notes (e.g. *"Replaced alarm horn unit; sound level measured 114 dB at 10m"*).
  4. **Decision Actions**:
     - Click **"Approve & Sign-Off Closure"**: Marks the CAPA as statutorily closed and logs a dual sign-off block on the cryptographic audit ledger.
     - Click **"Reject Proof"**: Mandates immediate re-work by the contractor if evidence is inadequate or blurry.

---

### Tab 4: 🚜 Contractor Registry (Agencies, Machinery & Pit Halt Switch)
- **Why it is used**: In modern Indian mining, up to 70% of open-cast excavation and transport is handled by private contractors (e.g. Dilip Buildcon, Eastern Coal Logistics). Managing contractor compliance is legally mandated under CMR Reg. 27.
- **What it is for**: Tracking empaneled contractor safety grades, active personnel counts, deployed HEMM units, accumulated statutory penalties, and labor welfare (EPF/CMPF).
- **When it is used**: When auditing contractor fitness, vetting entry into high-risk blast sectors, or enforcing statutory safety shutdowns.
- **How it is used**:
  1. View contractor scorecard cards showing Safety Scores (0-100), Compliance Grades (`A+`, `A`, `B`, `CRITICAL_REVIEW`), and active pit workers.
  2. Audit labor welfare compliance: verify whether contractor has active **Provident Fund (CMPF/EPF)** verification.
  3. **The Statutory Pit Halt Switch**:
     - If a contractor commits repeated safety violations, the Colliery Manager or Super Admin clicks **"Halt Contractor in Pit"**.
     - This immediately changes their status to `HALTED_FOR_SAFETY`, halts their vehicles from passing through colliery weighbridges, and logs a statutory notice.
     - Once rectified, clicking **"Resume Pit Operations"** re-authorizes pit entry.

---

### Tab 5: 📄 Statutory Permits (OCR Scanner & Expiry Engine)
- **Why it is used**: Eliminates illegal pit operation of uncertified machinery and expired contractor licenses.
- **What it is for**: Central registry of all environmental clearances (MoEFCC), HEMM fitness certificates (CMR Reg. 182), blaster competency permits, and labor licenses (Form V).
- **When it is used**: Whenever a new contractor machine enters the mine, or during monthly statutory compliance audits.
- **How it is used**:
  1. Use the **Status Filter** pills (`ALL`, `EXPIRING SOON`, `EXPIRED`, `VALID`) or the **Search Bar** to find specific licenses.
  2. View document cards with OCR extraction confidence scores (e.g. `98.4%`), issuing authorities (DGMS, MoEFCC, RTO), and expiration dates.
  3. Expired documents flash with a red `EXPIRED` badge, notifying management that the equipment must be grounded immediately.

---

### Tab 6: 🗺️ GIS Pit Map (Spatial Hazard & Evacuation Schematic)
- **Why it is used**: Open-cast coal mines span multiple square kilometers across deep terraces. Static 2D maps fail to communicate active hazards during dynamic blasting shifts.
- **What it is for**: Spatial visualization of pit benches, haul roads, sump drainage, real-time hazard beacons, HEMM vehicle locations, and evacuation muster stations.
- **When it is used**: During pre-shift planning, blast clearance zoning, and emergency pit evacuations.
- **How it is used**:
  1. Inspect the interactive opencast pit terrain showing elevation contours and haul road ramps.
  2. Click on pulsing hazard beacons to read real-time alerts (e.g. *Bench 14 Tension Crack — 30m exclusion perimeter*).
  3. Locate green **Evacuation Muster Points** to guide personnel during emergency evacuation sirens.

---

### Tab 7: 🌐 Corporate League - CIL (Enterprise Zero-Harm Benchmarking)
- **Why it is used**: Coal India Limited oversees 8 distinct subsidiaries operating hundreds of mines. Corporate leadership needs normalized safety benchmarking across all subsidiaries.
- **What it is for**: Subsidiary ranking league table, Zero-Harm Compliance Index, Days Without Lost Time Injury (LTI), and ESG compliance tracking.
- **When it is used**: Monthly and quarterly by CIL Apex Executive Leadership and the Ministry of Coal.
- **How it is used**:
  1. Review subsidiary league rankings (e.g. **SECL, NCL, CCL, ECL, WCL**).
  2. Monitor the **Zero-Harm Score** and **Lost-Time Injury (LTI) Free Days**.
  3. Compare environmental AAQMS dust levels and statutory compliance percentages across mines.

---

### Tab 8: ⚖️ DGMS Audits & Form 24 (Cryptographic Ledger & Legal Notices)
- **Why it is used**: DGMS inquiry courts require immutable, cryptographic proof that records have not been altered post-incident.
- **What it is for**:
  1. Providing a **SHA-256 Merkle Audit Ledger** recording every statutory action with actor, timestamp, IP address, and cryptographic block hash.
  2. Generating official, printable **DGMS Form 24 Statutory Notices of Danger** under CMR 2017 Reg. 106 and Mines Act Section 22.
- **When it is used**: During statutory audits by DGMS Directors of Mines Safety or formal court inquiries following accidents.
- **How it is used**:
  1. Audit the immutable cryptographic log: verify that every entry possesses an authentic previous block hash (`0x8f2c...`).
  2. Click **"Generate DGMS Form 24 Notice"** to open the official legal document generator.
  3. Review the preview complete with the **National Emblem of India**, statutory citation, violation description, and statutory signature lines.
  4. Click **"Print / Export Official Notice"** to generate a court-admissible PDF/printout.

---

### Tab 9: 👑 Super Admin Console (Directorate SLAs & Rules Engine)
- **Why it is used**: Directorate-level system administration without requiring manual source code modifications or developer deployments.
- **What it is for**: Calibrating statutory SLA escalation timers, tuning AI hazard sensitivity thresholds, conducting database maintenance, and managing user roles.
- **When it is used**: By the Ministry IT Directorate (`SUPER_ADMIN`) during quarterly governance calibrations.
- **How it is used**:
  1. Calibrate **Statutory SLA Escalation Timers**:
     - *Level 1 (Supervisor)*: Default 24 Hours
     - *Level 2 (Safety Officer)*: Default 48 Hours
     - *Level 3 (Colliery GM)*: Default 72 Hours
  2. Set **AI Risk Anomaly Sensitivity** (e.g. trigger Critical alerts when risk score crosses 65/100).
  3. Conduct database health checks and seed state calibrations.
  4. *Access Restriction*: Strictly locked to Level 5 Super Administrators. Other users receive an official 403 Statutory Clearance denial.

---

## 5. Field Worker Mobile Companion (The 5 Bottom Tabs)

The Mobile Field Companion is an **offline-first Progressive Web Application (PWA) / native Android APK** built specifically for pit safety officers operating in extreme outdoor mining environments (glare, coal dust, zero cellular connectivity).

```
┌────────────────────────────────────────────────────────┐
│  [📊 Overview]  [📋 Inspect]  [🛡️ CAPA]  [📄 Doc OCR]   │
│  [🗺️ Pit Map]                                          │
└────────────────────────────────────────────────────────┘
```

---

### Mobile Tab 1: 📊 Overview (Shift Telemetry & Alerts)
- **What it is for**: The field inspector's home screen providing their active shift briefing, mine risk gauge, critical alerts, and quick action shortcuts.
- **Key Elements**:
  - **Colliery Safety Risk Gauge**: Displays current pit risk score (`78/100 HIGH`) calculated in real time by the on-device AI engine.
  - **Quick Action Pills**: One-tap shortcuts to *New Inspection*, *Open CAPAs*, and *Scan Document*.
  - **Active AI Anomalies**: Real-time warnings (e.g. *Haul Road Berm Defect detected near Ramp 3*).
  - **Recent Shift Inspections Stream**: Displays the inspector's last 3 checklists with pass/fail ratios.

---

### Mobile Tab 2: 📋 Inspect (Digital Checklist & Camera Watermarker)
- **What it is for**: Conducting digital shift safety examinations under **CMR 2017 Regulations 106, 182 & DGMS Circulars**.
- **The Checklist Items**:
  1. *Haul Road Berm Height & Width* (DGMS Tech Cir. 05/2010)
  2. *Bench Slope & Highwall Cracks* (Reg. 106 CMR 2017)
  3. *Haul Road Water Sprinklers & Fog Cannons* (Air Act 1981)
  4. *HEMM Pre-Shift Brake & Horn Check* (Reg. 182 CMR 2017)
  5. *Contractor Labor PPE & Safety Induction* (MVT Rules 1966)
- **How it is used**:
  1. Select the **Inspection Zone** from the dropdown (e.g. *Bench 14 - Upper Highwall Terrace*).
  2. For each checklist item, tap **PASS**, **FAIL**, or **NA**.
  3. **Mandatory Evidence on Failure**: If an item is marked **FAIL**, a photo button appears. Tapping it opens the **Geo-Tagged Camera Modal**.
  4. The camera captures the image and burns an indelible watermark HUD directly onto the pixels showing:
     - WGS84 GPS Latitude & Longitude
     - Device Altitude & Precision Accuracy
     - UTC and Local IST Date & Time
     - Mine ID, Zone, and Inspector Badge ID
     - Device SHA-256 Tamper Hash
  5. Enter shift observation notes.
  6. Tap **"Submit Inspection to Central Portal"**:
     - If **Online**: Instantly uploaded to the colliery central database and linked to the web portal.
     - If **Offline**: Encrypted and queued in local IndexedDB storage; syncs automatically upon returning to colliery surface Wi-Fi.

---

### Mobile Tab 3: 🛡️ CAPA (Field Remediation & Closure Proof)
- **What it is for**: Allows field officers to inspect open remediation tasks assigned to contractors and upload post-repair closure proof photos.
- **How it is used**:
  1. Open the CAPA list and filter by `OPEN`, `IN_PROGRESS`, or `PENDING_VERIFICATION`.
  2. Tap on an open action (e.g. *Rebuild Collapsed Haul Road Berm*).
  3. Review the **Initial Defect Photo** taken during the inspection to verify the original non-compliance.
  4. Once contractor repairs are physically inspected in the pit, tap **"Submit Rectification Proof Photo"**.
  5. Capture the post-repair proof photo using the geo-watermarking camera.
  6. Add closure remarks (e.g. *"Berm rebuilt with compacted rock to 2.4m height; reflective markers installed"*).
  7. Tap **"Submit for Colliery Manager Sign-Off"**: This advances the task to `PENDING_VERIFICATION` where the manager conducts the final dual sign-off on the web portal.

---

### Mobile Tab 4: 📄 Doc OCR (Mobile Permit Scanner)
- **What it is for**: Rapid, on-the-spot roadside verification of contractor licenses, HEMM fitness permits, blaster certificates, and driver licenses directly in the pit.
- **How it is used**:
  1. Select the **Document Category** (e.g. *HEMM Fitness*, *Contractor Labor License Form V*, *Blaster Competency Cert*).
  2. Choose scan input:
     - Tap **"Camera Scan"** to launch the live camera viewfinder with alignment guide and snap a photo.
     - Tap **"Upload Document"** to select an existing file/PDF.
     - Or tap **"Generate & Scan Sample"** for instant simulated testing.
  3. Watch the **Progressive 4-Step Scanning Laser**:
     - *Step 1*: Image enhancement & binarization
     - *Step 2*: Detection of official DGMS seals and text zones
     - *Step 3*: Extraction of registration numbers and validity dates
     - *Step 4*: Cross-referencing against statutory CMR 2017 rules
  4. Review the extracted metadata card showing OCR recognition confidence (e.g. `98.2%`) and real-time validity badge (**VALID**, **EXPIRING SOON**, **EXPIRED**).
  5. Tap **"Save & Verify to Mine Ledger"** to add the permit into the colliery database.
  6. Use the built-in search bar and filter chips to look up any registered document in seconds.

---

### Mobile Tab 5: 🗺️ Pit Map (Tactical Field Navigation)
- **What it is for**: Tactical GPS map navigation for inspectors inside the pit to locate active hazard perimeters, blaster exclusion cordons, and evacuation routes.
- **How it is used**:
  1. View the live opencast pit schematic.
  2. Locate active hazard icons to ensure inspectors do not inadvertently wander into unstable highwall zones.
  3. Identify muster points and primary emergency haul road corridors.

---

## 6. Interactive Simulation Controls (Omnichannel Header)

Located at the very top of the application is the **Omnichannel Mode Switcher Bar**, enabling simultaneous testing of both mobile and web interfaces:

```
[● CoalGov AI Enterprise Ecosystem]  [✨ Simulate Scenarios ▼]  [🖥️ Central Web Portal]  [📱 Field Worker App]  [📑 Dual Split View]  [☀️/🌙 Theme]  [🚪 Sign Out]
```

### 1. View Mode Switcher
- **🖥️ Central Web Portal**: Switches the entire viewport to the full-screen Ministry of Coal Web Governance Portal.
- **📱 Field Worker App**: Switches to the mobile-optimized pit companion application.
- **📑 Dual Split View**: Displays the **Mobile Field App on the left** and the **Central Web Portal on the right** on the same screen. Any inspection or photo submitted on the mobile companion updates the web portal in real time!

### 2. Live Scenario Simulator (`Simulate Scenarios ▼`)
Allows testing crisis management scenarios with a single click:
1. **1. Highwall Crack Hazard**: Simulates an active slope tension crack on Bench 14. Immediately creates a high-priority inspection record with geo-photos and escalates a Critical CAPA.
2. **2. Expired Labor License**: Simulates an uncertified contractor operating in the pit. Triggers an alert and allows testing the **"Halt Contractor in Pit"** statutory switch.
3. **3. Emergency Pit Siren**: Broadcasts a live evacuation alert across both the mobile and web interfaces with safe muster point directions.

### 3. Emergency SOS Siren Button (`PIT SOS`)
- Located prominently in both the web and mobile headers.
- Tapping it triggers an emergency siren sound and broadcasts an immediate evacuation alarm to all pit workers under **CMR 2017 Emergency Preparedness Regulations**.

### 4. Global Theme Toggle (`☀️ / 🌙`)
- Switches instantly between **Government Dark Mode** (optimized for low-light control rooms) and **Official Light Mode** (high-contrast NIC government portal styling).

### 5. Sign Out Button (`🚪 Sign Out`)
- Ends the current session and returns to the **Parichay / NIC Government Login Gateway**, enabling instant switching between the 5 official administrative clearances.

---

## 7. Step-by-Step Practical Testing Walkthrough

Follow this 5-minute walkthrough to verify the complete mega-project:

### Step 1: Open the Application
Open your web browser and navigate to:
```
http://localhost:5173/
```

### Step 2: Test the Official Government Login Gateway
1. You are greeted by the **Parichay Ministry of Coal Login Gateway**.
2. Click on **"👑 Super Administrator (Ministry Directorate Apex)"** to log in as Dr. Rajesh Gupta with **Level 5 Unrestricted Clearance**.
3. You enter the **Central Web Governance Portal** with all 9 top horizontal tabs active.

### Step 3: Inspect Geo-Tagged Field Photos
1. Click on the **"📋 Field Inspections"** tab.
2. Scroll to the inspection for **Pit 4 - North Haul Road Ramp 3**.
3. Notice the **Geo-Tagged Photographic Evidence Gallery** showing the highwall crack and berm collapse photos.
4. Click on any photo to open the **Interactive Full-Screen Zoom Modal**. Notice the GPS watermark coordinates, altitude, and SHA-256 hash.
5. Click **"Colliery Manager Statutory Sign-Off"** to record your managerial approval.

### Step 4: Verify Side-by-Side CAPA Remediation
1. Click on the **"🛡️ CAPA Remediation"** tab.
2. Locate task **CAPA-8790: Replace Defective Audio-Visual Alarm on Dumper D-409**.
3. Compare the **Before Photo (Defective Alarm)** on the left with the **After Photo (Rectified 114dB Alarm)** on the right.
4. Click **"Approve & Sign-Off Closure"** to statutorily close the violation.

### Step 5: Test the Dual Split View & Live Data Sync
1. In the top omnichannel bar, click **"📑 Dual Split View"**.
2. On the left side, you now have the **Field Officer Mobile App**; on the right side, the **Central Web Portal**.
3. On the mobile companion, tap the **"Inspect"** tab at the bottom.
4. Mark a check item as **FAIL**, attach a photo, and tap **"Submit Inspection"**.
5. Watch the inspection appear dynamically on the right-side Web Governance Portal!

### Step 6: Test Dynamic Role Clearance (RBAC)
1. In the top right header, locate the **Active Clearance Dropdown**.
2. Switch role from **Super Administrator** to **"👷 Field Safety Officer (LEVEL 1 - FRONTLINE)"**.
3. Observe how managerial modules (CAPA Approval, Super Admin Console, Corporate League) immediately display `🔒 LOCKED` badges and line-through text.
4. Switch back to **Super Administrator** to restore full clearance.

---

*Authored by the CoalGov AI Technical Directorate • Government of India • Ministry of Coal & DGMS Statutory Standards.*

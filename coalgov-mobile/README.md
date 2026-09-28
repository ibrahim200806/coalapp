# CoalGov AI — Mobile Field Companion

An AI-powered, offline-first smart governance, safety compliance, and inspection mobile application for coal mining operations, conforming to the **Smart India Hackathon SIH-26024** specification.

---

## 🚀 Live Access & Running the App

The development server is running locally and on the network:

- **Local URL**: [http://localhost:5173/](http://localhost:5173/)
- **Mobile Network URL**: `http://192.168.61.240:5173/` (Open on your phone connected to the same Wi-Fi)

To restart the app anytime:
```bash
cd coalgov-mobile
npm install
npm run dev
```

---

## 🎯 Architecture & The 5-Stage Governance Loop

The app operates on the core cycle defined in `sih26024.md`:
$$\text{DATA} \longrightarrow \text{RISK} \longrightarrow \text{ACTION} \longrightarrow \text{VERIFICATION} \longrightarrow \text{AUDIT}$$

### Key Modules:

1. **Offline-First Synchronization Engine (`src/services/storage.ts`)**:
   - Stores inspections, CAPAs, and certificates locally in IndexedDB / LocalStorage.
   - Operates seamlessly with zero cellular connectivity deep in open-cast pits.
   - Sync Queue records pending uploads; auto-syncs or one-tap pushes when network returns.
   - Includes a **Simulated Pit Offline toggle** in the top bar for testing.

2. **Geo-Tagged Anti-Tamper Camera (`src/components/CameraWatermarkModal.tsx`)**:
   - Captures live device camera video stream or file photo.
   - Acquires real device GPS coordinates (Latitude, Longitude, Altitude, Accuracy).
   - Burns a permanent, cryptographic anti-tamper watermark banner directly onto image pixels:
     - Coordinates: `22.3524° N, 82.6854° E (±4.2m)`
     - Timestamps: UTC + Local IST
     - Mine ID, Zone, and Inspector Badge ID
     - Cryptographic verification stamp (SHA-256 simulation)

3. **Digital DGMS Statutory Inspection (`src/components/InspectTab.tsx`)**:
   - Checklists for:
     - Haul Road Berm Height & Width (DGMS Tech Cir. 05/2010)
     - Bench Slope & Highwall Cracks (CMR 2017 Reg. 106)
     - Continuous Dust Suppression & AAQMS
     - HEMM Machinery Pre-Shift Brakes & Alarms
     - Contractor Worker PPE & Safety Induction
   - Instant calculation of Critical vs High violations.

4. **Corrective Action (CAPA) Loop (`src/components/CapaTab.tsx`)**:
   - Automatic generation of CAPA tasks whenever a check item fails.
   - Field Officer takes **Proof-of-Closure photo** on-site after repair.
   - Mine Manager reviews before-and-after proof and conducts digital sign-off.

5. **AI Document & Permit Scanner (OCR) (`src/components/OcrScannerTab.tsx`)**:
   - Simulates PaddleOCR / Tesseract extraction for HEMM Fitness Certificates, Contractor Labor Licenses, and Environmental Clearances.
   - Automatically detects expired documents and flags non-compliance.

6. **Interactive Mine GIS Map (`src/components/MineMapTab.tsx`)**:
   - Leaflet + OpenStreetMap integration.
   - Shows active pit boundaries, hazard pins (highwall fissures, eroded berms), and air monitoring stations.

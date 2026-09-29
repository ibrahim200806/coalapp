from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import hashlib

app = FastAPI(
    title="CoalGov AI — Ministry of Coal Statutory Governance Backend API",
    description="Statutory Compliance, Risk Monitoring & Inspection API for Coal Mines under Coal Mines Regulations 2017 & Mines Act 1952",
    version="3.5.0"
)

# Enable CORS for Mobile and Web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database store simulating PostgreSQL tables
MINES_DB = [
    {
        "id": "mine-kusmunda",
        "name": "Kusmunda Mega OCP",
        "subsidiary": "SECL (South Eastern Coalfields)",
        "location": "Korba Coalfield, Chhattisgarh",
        "coordinates": [22.3524, 82.6854],
        "risk_score": 78,
        "risk_category": "HIGH",
        "monthly_production_mt": 4.8,
        "worker_count": 3850,
        "active_violations": 4,
    },
    {
        "id": "mine-gevra",
        "name": "Gevra Mega Pit",
        "subsidiary": "SECL (South Eastern Coalfields)",
        "location": "Korba Coalfield, Chhattisgarh",
        "coordinates": [22.3411, 82.5932],
        "risk_score": 42,
        "risk_category": "MEDIUM",
        "monthly_production_mt": 5.6,
        "worker_count": 4200,
        "active_violations": 2,
    },
    {
        "id": "mine-singrauli",
        "name": "Jayant Open Cast Mine",
        "subsidiary": "NCL (Northern Coalfields)",
        "location": "Singrauli, MP",
        "coordinates": [24.1167, 82.6333],
        "risk_score": 89,
        "risk_category": "CRITICAL",
        "monthly_production_mt": 2.9,
        "worker_count": 3100,
        "active_violations": 7,
    },
    {
        "id": "mine-manikpur",
        "name": "Manikpur OCP",
        "subsidiary": "SECL (South Eastern Coalfields)",
        "location": "Korba, Chhattisgarh",
        "coordinates": [22.3167, 82.7167],
        "risk_score": 34,
        "risk_category": "LOW",
        "monthly_production_mt": 3.2,
        "worker_count": 2400,
        "active_violations": 1,
    }
]

INSPECTIONS_DB = []
CAPA_DB = []
AUDIT_LOG_DB = []
DOCUMENTS_DB = []

# Pydantic Schemas
class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class ChecklistItemSchema(BaseModel):
    id: str
    category: str
    title: str
    statutory_rule: str
    status: str # PASS, FAIL, NA
    severity_if_failed: str
    observation_notes: Optional[str] = None
    photo_url: Optional[str] = None

class InspectionCreateSchema(BaseModel):
    mine_id: str
    mine_name: Optional[str] = None
    zone: str
    inspector_id: str
    inspector_name: str
    total_checks: int
    passed_checks: int
    failed_checks: int
    critical_issues_found: int
    items: List[ChecklistItemSchema]
    overall_comments: Optional[str] = ""

class CAPAVerifySchema(BaseModel):
    action_id: str
    approved: bool
    verifier_name: str
    verifier_role: str
    remarks: Optional[str] = ""

class EmergencySOSSchema(BaseModel):
    mine_id: str
    zone: str
    incident_type: str
    triggered_by: str
    message: str
    latitude: float
    longitude: float

# Helper: Append to Cryptographic Audit Ledger
def append_audit_entry(actor: str, role: str, action: str, details: str, target: str):
    now_str = datetime.utcnow().isoformat()
    prev_hash = AUDIT_LOG_DB[0]["block_hash"] if AUDIT_LOG_DB else "0x0000000000000000000000000000000000000000000000000000000000000000"
    raw_data = f"{now_str}:{actor}:{role}:{action}:{details}:{prev_hash}"
    block_hash = "0x" + hashlib.sha256(raw_data.encode()).hexdigest()
    
    entry = {
        "id": f"LOG-0x{uuid.uuid4().hex[:6]}",
        "timestamp": now_str,
        "actor": actor,
        "role": role,
        "action": action,
        "target_entity": target,
        "details": details,
        "block_hash": block_hash,
        "previous_hash": prev_hash,
        "verified": True
    }
    AUDIT_LOG_DB.insert(0, entry)
    return entry

# API Endpoints
@app.get("/")
def root():
    return {
        "platform": "CoalGov AI — Ministry of Coal Central Statutory API",
        "version": "3.5.0",
        "statutory_mandate": "DGMS & Coal Mines Regulations (CMR) 2017",
        "status": "OPERATIONAL",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/auth/login")
def login(payload: LoginRequest):
    # Simulated authentication returning government clearance
    clearance_map = {
        "SUPER_ADMIN": "LEVEL_5_UNRESTRICTED_DIRECTORATE",
        "MINE_MANAGER": "LEVEL_4_COLLIERY_STATUTORY_COMMAND",
        "CORPORATE_MGMT": "LEVEL_3_ENTERPRISE_OVERSIGHT",
        "REGULATORY_AUDITOR": "LEVEL_4_STATUTORY_SAFETY_AUDIT",
        "FIELD_OFFICER": "LEVEL_1_FRONTLINE_INSPECTION"
    }
    return {
        "status": "AUTHENTICATED",
        "token": f"govt-bearer-{uuid.uuid4().hex}",
        "user": {
            "username": payload.username,
            "role": payload.role,
            "clearance": clearance_map.get(payload.role, "LEVEL_1_GUEST")
        }
    }

@app.get("/api/mines")
def get_mines():
    return {"mines": MINES_DB}

@app.post("/api/inspections")
def submit_inspection(payload: InspectionCreateSchema):
    insp_id = f"INSP-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"
    record = {
        "id": insp_id,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "SYNCED",
        **payload.dict()
    }
    INSPECTIONS_DB.insert(0, record)
    
    # Auto-generate CAPA for failed checks, linking initial evidence photo!
    for item in payload.items:
        if item.status == "FAIL":
            capa_id = f"CAPA-{uuid.uuid4().hex[:4].upper()}"
            capa_item = {
                "id": capa_id,
                "inspection_id": insp_id,
                "mine_id": payload.mine_id,
                "zone": payload.zone,
                "title": f"Rectify: {item.title}",
                "description": item.observation_notes or f"Non-compliance with statutory rule {item.statutory_rule}",
                "initial_evidence_photo": item.photo_url,
                "severity": item.severity_if_failed,
                "status": "OPEN",
                "escalation_level": 3 if item.severity_if_failed == "CRITICAL" else 1,
                "created_at": datetime.utcnow().isoformat()
            }
            CAPA_DB.insert(0, capa_item)
    
    # Log to cryptographic audit trail
    append_audit_entry(
        actor=payload.inspector_name,
        role="FIELD_OFFICER",
        action="INSPECTION_SUBMITTED_WITH_GEO_PHOTOS",
        details=f"Statutory inspection in {payload.zone}. {payload.failed_checks} violations documented.",
        target=insp_id
    )
    
    return {"status": "SUCCESS", "inspection_id": insp_id, "record": record}

@app.get("/api/inspections")
def list_inspections():
    return {"total": len(INSPECTIONS_DB), "inspections": INSPECTIONS_DB}

@app.get("/api/capa")
def list_capa():
    return {"total": len(CAPA_DB), "actions": CAPA_DB}

@app.post("/api/capa/verify")
def verify_capa(payload: CAPAVerifySchema):
    for capa in CAPA_DB:
        if capa["id"] == payload.action_id:
            capa["status"] = "CLOSED" if payload.approved else "OPEN"
            capa["verified_by"] = f"{payload.verifier_name} ({payload.verifier_role})"
            capa["verified_at"] = datetime.utcnow().isoformat()
            
            append_audit_entry(
                actor=payload.verifier_name,
                role=payload.verifier_role,
                action="CAPA_STATUTORY_DUAL_SIGNOFF" if payload.approved else "CAPA_RECTIFICATION_REJECTED",
                details=payload.remarks or f"CAPA sign-off by {payload.verifier_role}",
                target=payload.action_id
            )
            return {"status": "SUCCESS", "capa": capa}
    raise HTTPException(status_code=404, detail="CAPA action not found")

@app.post("/api/sos")
def broadcast_pit_emergency(payload: EmergencySOSSchema):
    sos_id = f"SOS-{uuid.uuid4().hex[:4].upper()}"
    alert_entry = {
        "id": sos_id,
        "timestamp": datetime.utcnow().isoformat(),
        **payload.dict()
    }
    
    append_audit_entry(
        actor=payload.triggered_by,
        role="FIELD_OFFICER",
        action="CRITICAL_PIT_SIREN_BROADCAST",
        details=f"PIT EVACUATION ALARM: {payload.incident_type} at {payload.zone} [{payload.latitude}, {payload.longitude}]",
        target=sos_id
    )
    return {"status": "BROADCAST_TRANSMITTED", "alert": alert_entry}

@app.get("/api/audit-logs")
def get_audit_logs():
    return {"total": len(AUDIT_LOG_DB), "chain": AUDIT_LOG_DB}

---
title: "Goods on Country"
slug: "goods"
website_path: /projects/goods
excerpt: "Community-owned manufacturing and asset tracking across remote Australia"
category: "core-platform"
status: "active"
last_updated: "2026-01-26"
shareability: "PUBLIC"

# Infrastructure
infrastructure:
  local_path: "/Users/benknight/Code/Goods Asset Register"
  github_repo: "act-now-coalition/goods-asset-tracker"
  deployed_url: "https://goodsoncountry.au"
  alt_urls:
    - "https://goodsoncountry.netlify.app"
  tech_stack:
    v1_backend:
      language: "Python 3.7+"
      database: "PostgreSQL (Supabase)"
      qr: "Python QR libraries"
    v2_frontend:
      framework: "Next.js 16.1.4"
      language: "TypeScript"
      runtime: "React 19.2.3"
      database: "Supabase SSR"
      payments: "Stripe"
      hosting: "Netlify"
  supabase_project: "goods-tracker"

# Data Connections
data_connections:
  key_tables:
    - assets
    - checkins
    - tickets
    - usage_logs
    - alerts
  views:
    - overdue_assets
    - active_tickets_summary
    - community_asset_health
  total_assets: 389
  qr_codes: 389

# GHL Integration
ghl_integration:
  pipeline: "Goods"
  tags: ["goods", "beds", "washers", "assets"]

# Xero Integration
xero_integration:
  tracking_category: "GOODS"
  project_codes: ["GOODS-BEDS", "GOODS-WASHERS", "GOODS-MAINT"]

# Health Monitoring
health:
  status: "critical"
  health_score: 47
  last_check: "2026-01-24"
  response_time_ms: 266

# Linked Vignettes
linked_vignettes: []

# ALMA Aggregate
alma_aggregate:
  avg_evidence: 0
  avg_authority: 0
  total_vignettes: 0

# Authority Check
authority:
  who_holds: "ACT + Community Partners"
  how_we_know: "Co-design process with communities we serve"
  consent_status: "In place"
  handover_plan: "Enterprise designed for community ownership"
---

# Goods on Country

**Community-owned manufacturing and real-time asset tracking across remote Australian communities.**

---

## Quick Links

| Resource | Link |
|----------|------|
| **Live Site** | [goodsoncountry.au](https://goodsoncountry.au) |
| **GitHub** | [goods-asset-tracker](https://github.com/act-now-coalition/goods-asset-tracker) |
| **Netlify** | [Deployment](https://app.netlify.com/sites/goodsoncountry) |

---

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│ GOODS ON COUNTRY                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Asset Tracking (V1)        Frontend (V2)                   │
│  ┌───────────────┐          ┌──────────────────────┐       │
│  │ Python Scripts│          │ Next.js 16           │       │
│  │ QR Generation │──────────│ React 19             │       │
│  │ CSV Processing│          │ TypeScript           │       │
│  │ SQL Seeding   │          │ Stripe Payments      │       │
│  └───────────────┘          └──────────────────────┘       │
│                                    │                        │
│                                    ▼                        │
│                        ┌──────────────────────┐            │
│                        │ Supabase Database    │            │
│                        │ 389 assets           │            │
│                        │ 8 communities        │            │
│                        │ QR tracking          │            │
│                        └──────────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Asset Inventory

### By Community

| Community | Assets |
|-----------|--------|
| Palm Island | 141 |
| Tennant Creek | 139 |
| Alice Homelands | 60 |
| Maningrida | 24 |
| Kalgoorlie | 20 |
| Others | 5 |
| **Total** | **389** |

### By Product Type

| Product | Count |
|---------|-------|
| Basket Beds | 363 |
| ID Washing Machines | 20 |
| Weave Beds | 6 |
| **Total** | **389** |

---

## Data Sources

### Database (Supabase)

**Tables:**
- `assets` - 389 individual assets with QR codes
- `checkins` - Visit/inspection records
- `tickets` - Support requests via QR scans
- `usage_logs` - IoT washer monitoring (optional)
- `alerts` - Automated alert system

**Views:**
- `overdue_assets` - No check-in in 6+ months
- `active_tickets_summary` - Ticket counts
- `community_asset_health` - Health score per community

### GHL (Contacts)

| Field | Value |
|-------|-------|
| Pipeline | Goods |
| Tags | goods, beds, washers, assets |

### Xero (Finance)

| Tracking | Code |
|----------|------|
| Category | GOODS |
| Projects | GOODS-BEDS, GOODS-WASHERS, GOODS-MAINT |

---

## Health Status

| Check | Status |
|-------|--------|
| Site Reachable | ⚠️ Critical |
| Health Score | 47/100 |
| Response Time | 266ms |
| Last Check | 2026-01-24 |

---

## QR Code System

### How It Works

1. **Each asset** has unique QR code (SVG + PNG)
2. **URL pattern:** `https://goods-tracker.app/support?asset_id={id}`
3. **Scanning** opens support form
4. **Check-ins** track location and condition
5. **Tickets** created for maintenance needs

### Organization

QR codes organized by:
- Community (Palm Island, Tennant Creek, etc.)
- Product type (Basket Bed, Washing Machine, Weave Bed)

---

## Alert System

| Alert Type | Trigger |
|------------|---------|
| Overuse | High usage detected |
| Maintenance | Scheduled maintenance due |
| No Check-in | 6+ months since last check |
| High Priority | Critical ticket submitted |

**Severity Levels:** Low → Medium → High → Critical

---

## Development Status

| Phase | Status |
|-------|--------|
| Phase 1: Data Foundation | ✅ Complete |
| Phase 2: Database Architecture | ✅ Complete |
| Phase 3: QR Code Generation | ✅ Complete |
| Phase 4: Frontend V2 | 🚧 In Progress |
| Phase 5: IoT Integration | ⏳ Planned |
| Phase 6: Community Dashboard | ⏳ Planned |

---

## Product Lines

### Basket Beds
- Co-designed with communities
- Durable, maintainable
- 363 deployed

### ID Washing Machines
- IoT-enabled (optional)
- Community laundry support
- 20 deployed

### Weave Beds
- Cultural design elements
- Premium line
- 6 deployed

---

## Development

```bash
# Clone
git clone git@github.com:act-now-coalition/goods-asset-tracker.git
cd "Goods Asset Register"

# V1 (Python scripts)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Generate QR codes
python scripts/generate_qr.py

# V2 (Next.js frontend)
cd v2
npm install
npm run dev
# → http://localhost:3005
```

---

## Data Pipeline

```
CSV (97 entries)
    ↓
Expansion (389 individual assets)
    ↓
Validation (unique IDs)
    ↓
QR Generation (SVG + PNG)
    ↓
Organization (by community/product)
    ↓
Database Seeding (SQL INSERTs)
```

---

## Story Opportunities

*No stories yet captured for Goods.*

**Priority storytelling:**
- Co-design conversations that sparked products
- Community feedback on receiving goods
- Check-in stories from field workers
- Impact testimonials from community

---

## Authority Check

| Question | Answer |
|----------|--------|
| **Who holds authority?** | ACT as producer, community co-design authority |
| **How do we know?** | Products developed through community conversations |
| **Consent in place?** | Co-design process documented |
| **Handover plan?** | Open sourcing designs, supporting community production |

---

## Partners

| Partner | Role |
|---------|------|
| Palm Island community | Asset deployment, feedback |
| Tennant Creek community | Asset deployment, feedback |
| Orange Sky Australia | Origin story, distribution |
| Community services | Distribution network |

---

*See also: [The Harvest](./the-harvest.md) | [Ecosystem Overview](../overview.md)*

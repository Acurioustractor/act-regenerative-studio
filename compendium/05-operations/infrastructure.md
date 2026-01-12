---
title: Technical Infrastructure
slug: infrastructure
website_path: null
excerpt: "Shared tooling, quiet systems, and handover-ready architecture"
status: published
last_updated: 2026-01-12
shareability: INTERNAL
---

# Technical Infrastructure

Global infrastructure keeps the ecosystem visible and coordinated. It should be quiet, reduce admin, and make stewardship easier.

> "If a system is loud, it is not doing its job. Quiet systems create room for people to show up."

---

## Principle

Infrastructure serves the work, not the other way around.

---

## Technology Stack Overview

### Frontend
| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.5.2+ (App Router) |
| UI Library | React 19.1.0 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui, Radix UI |
| Forms | React Hook Form + Zod validation |
| State | React Context, SWR for data fetching |

### Backend & Database
| Layer | Technology |
|-------|------------|
| Database | Supabase (PostgreSQL 15+) |
| Auth | Supabase Auth (JWT-based) |
| Storage | Supabase Storage (S3-compatible) |
| Security | Row Level Security (RLS) for multi-tenancy |
| Functions | Supabase Edge Functions (Deno) |
| Realtime | Supabase Realtime subscriptions |

### Integration Services
| Service | Use |
|---------|-----|
| Notion API | CMS, project management |
| GoHighLevel (GHL) | CRM, forms, pipeline |
| Airtable MCP | Legacy data |
| Resend/SendGrid | Email |
| Twilio (via GHL) | SMS |
| Vercel Analytics | Performance |

### AI & ML
| Layer | Technology |
|-------|------------|
| LLMs | OpenAI GPT-4, Anthropic Claude |
| Embeddings | OpenAI Ada-002 |
| Vector Search | Supabase pgvector |
| Guardrails | Community consent + cultural protocols |

### Deployment
| Layer | Technology |
|-------|------------|
| Hosting | Vercel (Next.js) |
| CDN | Vercel Edge Network |
| Version Control | GitHub |
| CI/CD | GitHub Actions + Vercel webhooks |
| Monitoring | Vercel Analytics, Sentry |
| DNS | Cloudflare |

---

## Multi-Tenant Architecture

Used in Empathy Ledger, potentially JusticeHub.

### Approach
Shared database with Row Level Security (RLS)

### Benefits
- Cost-efficient (single database for all tenants)
- Data sovereignty through RLS policies
- Cross-tenant analytics while maintaining isolation
- Compliance-ready (GDPR, Indigenous data sovereignty)
- Simpler operations (one migration, one backup)

### Schema Pattern
```sql
-- Tenant hierarchy
organizations (tenant root)
  ↓
projects (within tenant)
  ↓
users (belong to organization)
  ↓
content (stories, programs, etc.)

-- Every table includes tenant_id
```

### RLS Policies
```sql
-- Users can only see data from their organization
CREATE POLICY organization_isolation
  ON stories
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'tenant_id');
```

---

## Registry System

### Purpose
Unified content aggregation across all ACT projects.

### Pattern
Each project exposes standardized `/api/registry` endpoint.

### Implementation

| Project | Endpoint | Content |
|---------|----------|---------|
| Empathy Ledger | `/api/registry` | Consented public stories |
| JusticeHub | `/api/registry` | Forkable programs |
| Goods on Country | `/registry.json` | Product catalog |
| The Harvest | `/api/registry` | Events and CSA shares |

### ACT Hub Aggregation
```javascript
// ACT Hub fetches from all registries
const empathyData = await fetch('empathy-ledger.app/api/registry');
const justiceData = await fetch('justicehub.app/api/registry');
// Combines and displays in unified feed
```

---

## Operational Infrastructure

### Knowledge Hub
The ACT Knowledge Hub is the single source of truth:
- Notion command centre
- Codebases (GitHub)
- Empathy Ledger (stories and consent)

Should be explainable in five minutes.

### Shared Automation
| Element | Implementation |
|---------|----------------|
| Daily syncs | GitHub Actions |
| Reporting | Notion automations |
| Data flow | External inputs visible without centralising control |

### Operational Threads

| Thread | Description |
|--------|-------------|
| Knowledge capture | Weekly updates to Notion with project slugs and ALMA signals |
| Media governance | Empathy Ledger is source of truth for stories, photos, video |
| Product infrastructure | act-global-infrastructure provides shared tooling, CI, release |
| Data hygiene | Clear ownership, versioning, consent flags on every record |
| Quiet reliability | Fewer tools, clearer pathways, faster handover |

---

## Deployment Pipeline

### GitHub → Vercel Flow
```
1. Developer pushes to branch
      ↓
2. GitHub Actions run:
   - Linting (ESLint)
   - Type checking (TypeScript)
   - Tests (Jest, Playwright)
      ↓
3. Vercel detects push:
   - Build preview deployment
   - Deploy to preview URL
      ↓
4. PR review + approval
      ↓
5. Merge to main:
   - Vercel production build
   - Deploy to production
      ↓
6. Post-deploy:
   - Cache purge
   - Sitemap generation
   - Registry update
```

### Environment Management
```
.env.local (local development)
      ↓
Vercel Environment Variables (staging/production)
      ↓
Injected at build time
```

---

## Performance Optimization

### Caching Strategy

| Strategy | Use Case |
|----------|----------|
| Static Generation (SSG) | Project pages (revalidate hourly) |
| Server-Side Rendering (SSR) | Dynamic user content |
| Client-Side Fetching (CSR) | User-specific, real-time data |

### Image Optimization
- Next.js Image component (automatic WebP, sizing)
- Supabase image transformations
- CDN caching via Vercel Edge
- Lazy loading with blur placeholders

### Database Optimization
- Indexed queries (RLS + filters)
- Materialized views for complex aggregations
- pgvector for semantic search
- Connection pooling (Supabase Pooler)

---

## Security Architecture

### Authentication
- Supabase Auth (JWT)
- Social logins (Google, GitHub)
- Magic link email
- MFA support

### Authorization
- Role-Based Access Control (RBAC)
- Row Level Security (RLS)
- API route protection
- Client-side guards (UX only)

### Data Protection
- TLS/HTTPS everywhere
- Encrypted at rest (Supabase)
- No sensitive data in logs
- Regular security audits

### Cultural Security
- Consent enforcement via RLS
- Elder review workflows
- Sacred content protection
- Data export for sovereignty

---

## Handover-Ready Design

All infrastructure should be:
- **Documented:** Setup guides, architecture diagrams
- **Forkable:** Open-source, standard patterns
- **Portable:** Data export, self-hosting options
- **Maintainable:** Clear ownership, versioning

---

*See also: [Farmhand & AI](farmhand-ai.md) | [Website Integration](../03-ecosystem/website-integration.md) | [Technical Architecture (Appendix)](../appendices/tech-architecture.md)*

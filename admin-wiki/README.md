# ACT Ecosystem Admin Wiki

> **World-class administrative dashboard** for managing The Harvest, ACT Farm, Empathy Ledger, and JusticeHub through a unified interface.

## Overview

This admin portal provides:

- **📊 System Health Dashboard** - Monitor GHL, Supabase, Resend, and Redis status
- **🗺️ Interactive Ecosystem Map** - Visualize how all 4 projects interconnect
- **📈 Pipeline Management** - View all 15 pipelines across projects
- **💰 Revenue Tracking** - Combined financial dashboard with projections
- **📚 Documentation Hub** - Access all strategy docs, guides, and technical references
- **🔗 Quick Links** - Direct access to GHL, Supabase, Resend, Stripe dashboards

## Features

### Dashboard
- Real-time system health monitoring (GHL API, Supabase, Resend, Redis)
- Cross-project activity metrics (contacts, revenue, referrals)
- Top referral pathway tracking
- Multi-project member statistics

### Ecosystem Map
- Visual representation of shared infrastructure
- Project cards with user types and revenue models
- Automated cross-project referral flows
- Combined ecosystem value calculations

### Pipeline View
- All 15 pipelines organized by project
- Active contact counts per pipeline
- Revenue tracking for each pipeline
- Quick links to GHL dashboard and analytics

### Revenue Dashboard
- Monthly revenue by project
- Revenue stream breakdowns (tenants, residencies, subscriptions, etc.)
- Annual run rate projections
- Conservative/moderate/aggressive growth scenarios

### Documentation Hub
- Complete strategy documents
- Implementation guides
- Claude Code skills
- Technical API references
- Quick links to external dashboards
- Project website statuses

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to GHL API credentials
- Access to Supabase project (for admin auth)
- Connection to Redis NAS (192.168.0.34:6379)

### Installation

```bash
# Navigate to admin-wiki directory
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/admin-wiki"

# Install dependencies
npm install

# Copy environment variables template
cp .env.local.example .env.local

# Edit .env.local with your actual credentials
# (GHL API key, Supabase URL, etc.)

# Run development server
npm run dev
```

The admin wiki will be available at [http://localhost:4000](http://localhost:4000)

### Environment Variables

Create `.env.local` with:

```bash
# GoHighLevel
GHL_API_KEY=your_key_here
GHL_LOCATION_ID=your_location_id
GHL_API_VERSION=2021-07-28

# Supabase (for admin authentication)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis (shared NAS)
REDIS_URL=redis://192.168.0.34:6379

# Admin access control
NEXT_PUBLIC_ADMIN_EMAILS=admin@actfarm.org.au,team@theharvest.org.au
```

## Tech Stack

- **Framework**: Next.js 15 (React 19, App Router)
- **Styling**: Tailwind CSS with custom ACT color palette
- **Data Visualization**: Recharts (for future chart implementations)
- **Icons**: Lucide React
- **Authentication**: Supabase Auth (planned)
- **Data Sources**: GoHighLevel API, Supabase, Redis cache

## Project Structure

```
admin-wiki/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx             # Main app with view routing
│   │   └── globals.css          # Tailwind styles
│   ├── components/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── Dashboard.tsx        # System health & metrics
│   │   ├── EcosystemMap.tsx     # Visual integration map
│   │   ├── PipelineView.tsx     # All pipelines view
│   │   ├── RevenueView.tsx      # Financial dashboard
│   │   └── DocumentationView.tsx # Docs hub
│   └── lib/                     # Utilities (future)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Current Features (v1.0)

- ✅ Dashboard with system health monitoring
- ✅ Cross-project activity metrics
- ✅ Ecosystem map visualization
- ✅ Pipeline overview (all 15 pipelines)
- ✅ Revenue dashboard with projections
- ✅ Documentation hub with all guides
- ✅ Responsive design with Tailwind CSS
- ✅ Custom ACT color palette

## Planned Features (v1.1+)

- [ ] Live GHL API integration (fetch real pipeline data)
- [ ] Supabase admin authentication
- [ ] Interactive charts (conversion funnels, revenue trends)
- [ ] Bulk contact management tools
- [ ] Email analytics dashboard (Resend stats)
- [ ] Workflow trigger management
- [ ] Tag taxonomy editor
- [ ] Cross-project member search
- [ ] Export tools (CSV, PDF reports)
- [ ] System logs and audit trail

## Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run lint
```

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# (GHL_API_KEY, SUPABASE_URL, etc.)
```

### Option 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

## Security Considerations

- ⚠️ **Admin access only** - This portal contains sensitive business metrics
- 🔒 **Authentication required** - Implement Supabase auth before production deployment
- 🔑 **API keys protected** - Never commit `.env.local` to git
- 📊 **Revenue data** - Ensure proper access controls before exposing financial data

## Related Documentation

- [ACT Ecosystem Visual Strategy](../ACT_ECOSYSTEM_VISUAL_STRATEGY.md)
- [GHL Pipeline Strategy](../GHL_PIPELINE_STRATEGY.md)
- [Supabase + GHL Integration Architecture](../SUPABASE_GHL_INTEGRATION_ARCHITECTURE.md)
- [GHL Setup Guide](../GHL_SETUP_GUIDE.md)
- [GHL CRM Advisor Skill](../.claude/skills/ghl-crm-advisor/SKILL.md)

## Support

Questions or issues? Refer to:

1. **Documentation View** in the admin wiki itself
2. **GHL CRM Advisor Skill** (ask Claude: "How do I [task] in the admin wiki?")
3. ACT development team

## License

Internal use only - ACT Ecosystem projects.

## Changelog

### v1.0.0 (2025-12-24)
- Initial release with 5 main views (Dashboard, Ecosystem, Pipelines, Revenue, Docs)
- System health monitoring
- Cross-project metrics
- Complete documentation hub
- Responsive design with custom ACT branding

---

**Built with** ❤️ **for regenerative community work**

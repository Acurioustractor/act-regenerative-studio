# ACT Ecosystem Dashboard Strategy

**Created**: 2025-12-26
**Purpose**: Unified visibility across all ACT projects - codebase health, deployments, progress, public showcase

---

## 🎯 The Three Dashboards We Need

### 1. **Internal Operations Dashboard** (Team Daily View)
**Who**: ACT team, developers
**Purpose**: "What's the status of everything right now?"
**Access**: Private

**Shows**:
- All 7+ codebases and their health
- Build/deployment status for each project
- Open issues, PRs across ecosystem
- Recent activity feed
- Quick links to all projects
- Broken builds, security alerts

---

### 2. **Public Project Showcase** (Community View)
**Who**: Public, potential contributors, funders
**Purpose**: "Look at all the amazing work ACT is doing!"
**Access**: Public

**Shows**:
- All ACT projects with beautiful cards
- Project descriptions, impact, status
- Links to repos, live sites, documentation
- Contribution opportunities
- Ecosystem roadmap timeline
- Community metrics (contributors, stars, etc.)

---

### 3. **GitHub Projects Board** (Development View)
**Who**: Developers, project managers
**Purpose**: "What work is happening across projects?"
**Access**: Public or Private (per project)

**Shows**:
- All issues/PRs across ecosystem
- Kanban, roadmap, table views
- Filter by project, priority, LCAA phase
- Sprint planning
- Cross-project coordination

---

## 🛠️ Recommended Solution: Hybrid Approach

After researching options, here's the best approach for ACT:

### Solution Architecture

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ACT Regenerative Studio (Next.js App)                 │
│  https://act-studio.vercel.app                         │
│                                                         │
│  ┌───────────────────┐  ┌──────────────────────────┐   │
│  │  Public Pages     │  │  Team Dashboard          │   │
│  │  /projects        │  │  /admin/ecosystem        │   │
│  │  /ecosystem       │  │  (requires auth)         │   │
│  │  /roadmap         │  │                          │   │
│  └───────────────────┘  └──────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            │ Fetches data from:
                            ▼
        ┌───────────────────────────────────────┐
        │  GitHub API                           │
        │  - Repos, issues, PRs, commits        │
        │  - Deployment status (via checks API) │
        │  - Projects board data                │
        └───────────────────────────────────────┘
                            │
        ┌───────────────────────────────────────┐
        │  Vercel API                           │
        │  - Deployment status                  │
        │  - Build logs                         │
        │  - Production URLs                    │
        └───────────────────────────────────────┘
                            │
        ┌───────────────────────────────────────┐
        │  Supabase (caching layer)             │
        │  - Cache API responses                │
        │  - Store historical data              │
        │  - Track custom metrics               │
        └───────────────────────────────────────┘
```

---

## 📊 Dashboard 1: Internal Operations (Team View)

### URL
`https://act-studio.vercel.app/admin/ecosystem`

### Features

**Project Health Cards** (one per project):
```
┌──────────────────────────────────────────────┐
│ 🌾 Empathy Ledger v2                         │
│ ──────────────────────────────────────────── │
│ Status: 🟢 Healthy                           │
│ Deployment: ✅ Production (2h ago)           │
│ Build: ✅ Passing                            │
│ Tests: ✅ 247 passing                        │
│ Issues: 42 open (3 high priority)           │
│ PRs: 2 open, 1 needs review                 │
│ Last commit: 3 hours ago                     │
│                                              │
│ [View Repo] [View Deploy] [View Issues]     │
└──────────────────────────────────────────────┘
```

**Ecosystem Overview**:
- Total repositories: 7
- Total issues: 140
- Open PRs: 8
- Deployments today: 12
- Build status: 6 passing, 1 failing
- Security alerts: 1

**Activity Feed**:
- Recent commits across all projects
- New issues created
- PRs merged
- Deployments completed
- Security scans run

**Quick Actions**:
- Deploy all projects
- Run security scans
- Sync types across repos
- View unified Projects board

---

## 🌍 Dashboard 2: Public Project Showcase

### URL
`https://act-studio.vercel.app/projects`

### Features

**Hero Section**:
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  🌾 ACT Regenerative Innovation Ecosystem                 │
│                                                            │
│  Building the infrastructure for a post-extractive economy│
│  through technology, storytelling, and community action.  │
│                                                            │
│  [7 Active Projects] [42 Contributors] [View on GitHub]   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Project Cards** (beautiful, on-brand):
```
┌──────────────────────────────────────────────┐
│ 📖 Empathy Ledger                            │
│ ──────────────────────────────────────────── │
│ Ethical storytelling platform prioritizing   │
│ consent, OCAP principles, and community      │
│ voice in narrative control.                  │
│                                              │
│ 🏷️ Storytelling • Consent • OCAP            │
│ 💻 Next.js • Supabase • TypeScript           │
│ 📊 Status: Active Development                │
│ 🌐 empathyledger.org                         │
│                                              │
│ [View Project] [GitHub] [Contribute]         │
└──────────────────────────────────────────────┘
```

**Ecosystem Roadmap** (visual timeline):
- Q1 2025: Empathy Ledger World Tour Launch
- Q2 2025: JusticeHub Beta Release
- Q3 2025: The Harvest Opening
- Q4 2025: Full ecosystem integration

**Contribution Opportunities**:
- Filter by "good first issue"
- Filter by project
- Filter by skill (frontend, backend, design, content)

**Impact Metrics**:
- Stories preserved: 247
- Communities served: 12
- Code contributors: 42
- Open source releases: 7

---

## 🔧 Dashboard 3: GitHub Projects Board

### URL
`https://github.com/users/Acurioustractor/projects/1`

### Features (Already Built!)

✅ **Unified view** of all issues/PRs across ecosystem
✅ **Custom fields**: LCAA Phase, ACT Project, Effort, Sprint
✅ **Multiple views**: Kanban, Table, Roadmap, Timeline
✅ **Filters**: By project, priority, type, LCAA phase
✅ **Automation**: Auto-add issues, auto-label, workflows

**Views to Create**:
1. **Kanban by Status** - Todo, In Progress, Done
2. **Roadmap by Project** - Timeline view grouped by project
3. **Sprint Board** - Current sprint items
4. **LCAA Phases** - Group by Listen/Curiosity/Action/Art
5. **High Priority** - Filter: priority: high or critical

---

## 💻 Implementation: Custom Dashboard

### Tech Stack

**Frontend**:
- Next.js 15 (already using)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/ui components

**Data Sources**:
- GitHub API (Octokit)
- Vercel API
- Supabase (caching)

**Authentication**:
- Supabase Auth (already using)
- Team dashboard requires login
- Public pages are open

---

### Page Structure

```
src/app/
├── projects/
│   └── page.tsx              # Public project showcase
├── ecosystem/
│   └── page.tsx              # Public ecosystem overview
├── roadmap/
│   └── page.tsx              # Public roadmap timeline
└── admin/
    └── ecosystem/
        ├── page.tsx          # Team operations dashboard
        ├── [project]/
        │   └── page.tsx      # Individual project detail
        └── deployments/
            └── page.tsx      # Deployment history
```

---

### API Routes

```
src/app/api/
├── ecosystem/
│   ├── projects/route.ts     # List all projects
│   ├── health/route.ts       # Health check all projects
│   └── activity/route.ts     # Recent activity feed
├── github/
│   ├── repos/route.ts        # Fetch repos data
│   ├── issues/route.ts       # Fetch issues across repos
│   └── deployments/route.ts  # Deployment status
└── vercel/
    ├── deployments/route.ts  # Vercel deployment data
    └── builds/route.ts       # Build status
```

---

### Database Schema (Supabase)

**Tables for caching and historical data**:

```sql
-- Ecosystem projects registry
CREATE TABLE ecosystem_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_repo TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  live_url TEXT,
  status TEXT, -- 'active', 'beta', 'planning', 'archived'
  impact_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project health snapshots (historical data)
CREATE TABLE project_health_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES ecosystem_projects(id),
  snapshot_date TIMESTAMPTZ DEFAULT NOW(),
  build_status TEXT, -- 'passing', 'failing'
  deployment_status TEXT,
  open_issues INT,
  open_prs INT,
  last_commit_date TIMESTAMPTZ,
  test_coverage FLOAT,
  security_alerts INT
);

-- Ecosystem activity feed
CREATE TABLE ecosystem_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES ecosystem_projects(id),
  activity_type TEXT, -- 'commit', 'pr', 'issue', 'deployment', 'release'
  title TEXT,
  description TEXT,
  url TEXT,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📦 Components to Build

### 1. ProjectHealthCard.tsx
Shows real-time status of one project

**Props**:
- `repo`: GitHub repo name
- `showDetails`: boolean

**Data fetched**:
- Latest commit
- Build status (from GitHub Actions)
- Deployment status (from Vercel API)
- Open issues/PRs count
- Security alerts

---

### 2. EcosystemOverview.tsx
High-level metrics across all projects

**Shows**:
- Total projects
- Total issues/PRs
- Builds passing/failing
- Recent activity count
- Deployment frequency

---

### 3. ActivityFeed.tsx
Stream of recent activity across ecosystem

**Shows**:
- Recent commits
- New issues
- Merged PRs
- Deployments
- Releases

**Grouped by**: Today, Yesterday, This Week, This Month

---

### 4. ProjectShowcaseCard.tsx
Beautiful public-facing project card

**Props**:
- `project`: Project data
- `variant`: 'compact' | 'full'

**Shows**:
- Project name, tagline
- Description
- Tech stack badges
- Status badge
- Links to repo, live site, docs
- Contribution CTA

---

### 5. RoadmapTimeline.tsx
Visual timeline of ecosystem roadmap

**Shows**:
- Milestones by quarter
- Project phases
- Key releases
- LCAA alignment

---

## 🔄 Data Fetching Strategy

### Approach: Hybrid Caching

**Real-time data** (fetch on page load):
- Current build status
- Latest deployment
- Open PR count

**Cached data** (update every 15 min):
- Issue counts
- Commit history
- Project descriptions
- Activity feed

**Historical data** (stored in Supabase):
- Health snapshots over time
- Deployment frequency trends
- Issue resolution time
- Contributor growth

---

### Implementation

```typescript
// src/lib/ecosystem/data-fetcher.ts

import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const supabase = createClient(/*...*/);

export async function getEcosystemProjects() {
  // Check cache first
  const { data: cached } = await supabase
    .from('ecosystem_projects')
    .select('*')
    .gte('updated_at', new Date(Date.now() - 15 * 60 * 1000)); // 15 min

  if (cached && cached.length > 0) {
    return cached;
  }

  // Fetch fresh data from GitHub
  const repos = [
    'act-regenerative-studio',
    'empathy-ledger-v2',
    'justicehub-platform',
    'theharvest',
    'act-farm',
    'act-placemat',
    'goods-asset-tracker',
  ];

  const projects = await Promise.all(
    repos.map(repo => fetchProjectData(repo))
  );

  // Update cache
  await supabase.from('ecosystem_projects').upsert(projects);

  return projects;
}

async function fetchProjectData(repo: string) {
  const [repoData, issues, prs, workflows] = await Promise.all([
    octokit.repos.get({ owner: 'Acurioustractor', repo }),
    octokit.issues.listForRepo({ owner: 'Acurioustractor', repo, state: 'open' }),
    octokit.pulls.list({ owner: 'Acurioustractor', repo, state: 'open' }),
    octokit.actions.listWorkflowRunsForRepo({ owner: 'Acurioustractor', repo, per_page: 1 }),
  ]);

  return {
    github_repo: repo,
    name: repoData.data.name,
    description: repoData.data.description,
    live_url: repoData.data.homepage,
    open_issues: issues.data.length,
    open_prs: prs.data.length,
    build_status: workflows.data.workflow_runs[0]?.conclusion === 'success' ? 'passing' : 'failing',
    last_commit_date: repoData.data.pushed_at,
    updated_at: new Date(),
  };
}
```

---

## 🎨 Design Mockup: Team Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│ 🌾 ACT Ecosystem Operations                    [@ben] [Logout] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Ecosystem Overview                                       │  │
│ │ ──────────────────────────────────────────────────────── │  │
│ │ 7 Projects  •  6 Healthy  •  1 Needs Attention          │  │
│ │ 140 Open Issues  •  8 Open PRs  •  12 Deploys Today     │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌────────────────────────┐  ┌────────────────────────┐        │
│ │ 🟢 ACT Main            │  │ 🟢 Empathy Ledger      │        │
│ │ ✅ Deployed 2h ago     │  │ ✅ Deployed 3h ago     │        │
│ │ ✅ Build passing       │  │ ✅ Build passing       │        │
│ │ 6 issues, 2 PRs        │  │ 42 issues, 1 PR        │        │
│ │ [View] [Deploy]        │  │ [View] [Deploy]        │        │
│ └────────────────────────┘  └────────────────────────┘        │
│                                                                │
│ ┌────────────────────────┐  ┌────────────────────────┐        │
│ │ 🟡 JusticeHub          │  │ 🟢 The Harvest         │        │
│ │ ⚠️  Build failing      │  │ ✅ Deployed 1d ago     │        │
│ │ ✅ Last deploy: 1d ago │  │ ✅ Build passing       │        │
│ │ 12 issues, 0 PRs       │  │ 1 issue, 0 PRs         │        │
│ │ [View] [Fix Build]     │  │ [View] [Deploy]        │        │
│ └────────────────────────┘  └────────────────────────┘        │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Recent Activity                                          │  │
│ │ ──────────────────────────────────────────────────────── │  │
│ │ 🚀 empathy-ledger-v2 deployed to production (2h ago)    │  │
│ │ 🔀 PR #42 merged in act-main: Add security features     │  │
│ │ 🐛 Issue #35 created: SQL injection prevention          │  │
│ │ 💻 3 commits pushed to justicehub-platform (4h ago)     │  │
│ │ [View All Activity]                                      │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🌍 Design Mockup: Public Showcase

```
┌────────────────────────────────────────────────────────────────┐
│                🌾 ACT Regenerative Innovation                   │
│              Building the Farm for a Post-Extractive Economy    │
│                                                                │
│        [7 Projects] [42 Contributors] [View on GitHub]         │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                     Our Ecosystem Projects                      │
└────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────┐
│ 📖 Empathy Ledger    │  │ ⚖️ JusticeHub         │  │ 🌾 Harvest  │
│ ──────────────────── │  │ ──────────────────── │  │ ─────────── │
│ Ethical storytelling │  │ Open-source justice  │  │ Community   │
│ with consent-first   │  │ program network with │  │ hub with    │
│ approach and OCAP    │  │ forkable models      │  │ therapeutic │
│ principles.          │  │                      │  │ horticulture│
│                      │  │                      │  │             │
│ 🏷️ Active • 42 issues│  │ 🏷️ Beta • 12 issues  │  │ 🏷️ Planning │
│ 💻 Next.js, Supabase │  │ 💻 Next.js, Postgres │  │ 💻 Next.js  │
│                      │  │                      │  │             │
│ [Visit Site] [GitHub]│  │ [Visit Site] [GitHub]│  │ [GitHub]    │
│ [Contribute]         │  │ [Contribute]         │  │ [Contribute]│
└──────────────────────┘  └──────────────────────┘  └─────────────┘

[More Projects...]

┌────────────────────────────────────────────────────────────────┐
│                    How You Can Contribute                       │
│ ──────────────────────────────────────────────────────────────│
│ 💻 Frontend Development  •  12 open issues                     │
│ 🎨 Design & UX          •  5 open issues                       │
│ 📝 Documentation        •  8 open issues                       │
│ 🔒 Security             •  3 open issues                       │
│                                                                │
│                [Browse All Opportunities]                       │
└────────────────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Phases

### Phase 1: Basic Team Dashboard (4-6 hours)
- [ ] Create `/admin/ecosystem` page
- [ ] Build `ProjectHealthCard` component
- [ ] Fetch data from GitHub API (repos, issues, PRs)
- [ ] Display 7 project cards
- [ ] Add basic ecosystem overview metrics

**Deliverable**: Team can see all project health in one place

---

### Phase 2: Add Deployment Status (2-3 hours)
- [ ] Integrate Vercel API
- [ ] Show deployment status per project
- [ ] Add "last deployed" timestamp
- [ ] Link to live deployments

**Deliverable**: See which projects are deployed and when

---

### Phase 3: Activity Feed (3-4 hours)
- [ ] Fetch recent commits across all repos
- [ ] Fetch recent issues/PRs
- [ ] Fetch deployment events
- [ ] Build unified activity feed
- [ ] Add time grouping (today, yesterday, this week)

**Deliverable**: Stream of what's happening across ecosystem

---

### Phase 4: Public Showcase (4-6 hours)
- [ ] Create `/projects` page
- [ ] Build `ProjectShowcaseCard` component
- [ ] Design beautiful hero section
- [ ] Add project filtering/search
- [ ] Link to contribution opportunities

**Deliverable**: Public-facing project showcase

---

### Phase 5: Roadmap Timeline (3-4 hours)
- [ ] Create `/roadmap` page
- [ ] Build timeline component
- [ ] Add milestones from GitHub Projects
- [ ] Group by quarter/phase
- [ ] Add LCAA phase indicators

**Deliverable**: Visual ecosystem roadmap

---

### Phase 6: Caching & Performance (2-3 hours)
- [ ] Add Supabase caching layer
- [ ] Implement 15-minute cache strategy
- [ ] Store historical snapshots
- [ ] Optimize API calls

**Deliverable**: Fast, efficient dashboard

---

## 💰 Cost Analysis

### Option 1: Custom Dashboard (Recommended)
**Cost**: $0/month
- GitHub API: Free (60 requests/hour)
- Vercel API: Free
- Supabase Free tier: Sufficient for caching
- Hosting: Already have ACT Studio on Vercel

**Development Time**: 20-30 hours total
**Maintenance**: Low (part of existing codebase)

---

### Option 2: Third-Party Tool (Linear, Height)
**Cost**: $8-12/user/month = $96-144/year (for 1 user)
- Linear: $8/user/month
- Height: $10/user/month

**Pros**:
- Beautiful UI out of the box
- Advanced features (roadmaps, insights)
- Mobile apps

**Cons**:
- ❌ Ongoing cost
- ❌ Less customization
- ❌ Doesn't show deployment status
- ❌ Can't create public showcase

**Recommendation**: Not ideal for ACT (ongoing cost, limited customization)

---

### Option 3: GitHub Projects Only
**Cost**: $0/month
**Pros**:
- ✅ Free
- ✅ Already set up
- ✅ Good for development workflow

**Cons**:
- ❌ No deployment status
- ❌ No public showcase
- ❌ Limited customization
- ❌ Not designed for ecosystem overview

**Recommendation**: Use as **supplement** to custom dashboard

---

## 🎯 Recommendation: Build Custom Dashboard

**Why**:
1. ✅ **Zero ongoing cost** - Free GitHub/Vercel APIs
2. ✅ **Full control** - Customize for ACT's needs
3. ✅ **Integrated** - Part of existing ACT Studio app
4. ✅ **Public + Private** - Team dashboard + public showcase
5. ✅ **On-brand** - Match ACT design language
6. ✅ **Deployment status** - Show Vercel deployments
7. ✅ **Extensible** - Add features as needed

**Start with**:
- Phase 1: Basic team dashboard (6 hours)
- Phase 4: Public showcase (6 hours)
- **Total**: 12 hours for MVP

**Then add**:
- Phases 2, 3, 5, 6 as time permits

---

## 📚 Resources & References

- [GitHub REST API Docs](https://docs.github.com/en/rest)
- [Vercel API Docs](https://vercel.com/docs/rest-api)
- [GitHub Projects API](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects)
- [Octokit.js](https://github.com/octokit/rest.js)

---

## 🔗 Next Steps

1. **Review this strategy** - Does this match your vision?
2. **Prioritize phases** - Which dashboard is most urgent?
3. **Start with Phase 1** - Basic team dashboard (6 hours)
4. **Iterate** - Add features based on team feedback

---

**Last Updated**: 2025-12-26
**Status**: Draft - Ready for Implementation
**Estimated Total Time**: 20-30 hours for complete system

🌾 **Building unified visibility for the ACT ecosystem** 🌾

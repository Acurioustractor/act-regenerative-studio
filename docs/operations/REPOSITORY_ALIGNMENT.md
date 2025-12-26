# ACT Ecosystem - Repository Alignment

**Last Updated**: 2025-12-26
**Status**: Complete and Production-Ready

---

## 🎯 Primary Active Codebases

These are the main repositories with full automation, deployment, and Claude skills support:

### 1. **ACT Regenerative Studio** (This Repo)
- **Local Path**: `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/`
- **GitHub Repo**: `act-regenerative-studio`
- **GitHub URL**: https://github.com/Acurioustractor/act-regenerative-studio
- **Purpose**: Operations hub, Living Wiki, multi-project dashboard
- **Stack**: Next.js 15, React 19, TypeScript, Supabase, pgvector
- **Port**: `:3001`
- **Status**: ✅ Active Development
- **Deployment**: Vercel
- **Automation**: Full GitHub Projects integration

### 2. **Empathy Ledger v2**
- **Local Path**: `/Users/benknight/Code/Empathy Ledger v.02/`
- **GitHub Repo**: `empathy-ledger-v2`
- **GitHub URL**: https://github.com/Acurioustractor/empathy-ledger-v2
- **Purpose**: Ethical storytelling platform, consent-first, OCAP® principles
- **Stack**: Next.js 14, TypeScript, Supabase
- **Port**: `:3001`
- **Status**: ✅ Active Development
- **Deployment**: Vercel
- **Automation**: Full GitHub Projects integration

### 3. **JusticeHub Platform**
- **Local Path**: `/Users/benknight/Code/JusticeHub/`
- **GitHub Repo**: `justicehub-platform`
- **GitHub URL**: https://github.com/Acurioustractor/justicehub-platform
- **Purpose**: Youth justice network, forkable program models
- **Stack**: Next.js 14, TypeScript, Supabase, Auth0
- **Port**: `:3003`
- **Status**: ✅ Active Development
- **Deployment**: Vercel
- **Automation**: Full GitHub Projects integration

### 4. **The Harvest Community Hub** ⭐ NEW
- **Local Path**: `/Users/benknight/Code/The Harvest Website/`
- **GitHub Repo**: `harvest-community-hub`
- **GitHub URL**: https://github.com/Acurioustractor/harvest-community-hub
- **Purpose**: Community hub, therapeutic horticulture, heritage preservation
- **Stack**: Next.js 14, TypeScript, Supabase
- **Port**: `:3004`
- **Status**: ✅ Active Development
- **Deployment**: Vercel
- **Automation**: Full GitHub Projects integration
- **Note**: This is the ACTIVE codebase (not `theharvest` which is old holding site)

### 5. **Goods Asset Register**
- **Local Path**: `/Users/benknight/Code/Goods Asset Register/`
- **GitHub Repo**: `goods-asset-tracker`
- **GitHub URL**: https://github.com/Acurioustractor/goods-asset-tracker
- **Purpose**: Circular economy asset tracking, waste-to-wealth
- **Stack**: Next.js, TypeScript, Supabase
- **Port**: `:3006`
- **Status**: ✅ Active Development
- **Deployment**: Vercel
- **Automation**: Full GitHub Projects integration

### 6. **ACT Farm Website**
- **Local Path**: `/Users/benknight/Code/ACT Farm/act-farm/`
- **GitHub Repo**: `act-farm`
- **GitHub URL**: https://github.com/Acurioustractor/act-farm
- **Purpose**: Black Cockatoo Valley estate, conservation, residencies
- **Stack**: Next.js 16, TypeScript, Tailwind
- **Port**: `:3005`
- **Status**: ⚠️ Active Development
- **Deployment**: Vercel
- **Automation**: Full GitHub Projects integration

---

## 🔧 Automation Alignment

All 6 primary codebases have:

### GitHub Projects Integration
- **Project**: https://github.com/users/Acurioustractor/projects/1
- **Auto-field assignment**: ACT Project, Type, Priority, Effort, Sprint, LCAA Phase, Milestone
- **Auto-date management**: Due Date, Start Date (synced from milestones)
- **Workflow file**: `.github/workflows/auto-tag-project-items.yml`

### Repository Mappings
```javascript
const REPO_TO_PROJECT = {
  'act-regenerative-studio': 'ACT Main',
  'empathy-ledger-v2': 'Empathy Ledger',
  'justicehub-platform': 'JusticeHub',
  'harvest-community-hub': 'The Harvest',      // ⭐ Active repo
  'goods-asset-tracker': 'Goods',
  'act-farm': 'ACT Farm',
};
```

### Milestone Distribution
- **empathy-ledger-v2**: 5 milestones
- **act-regenerative-studio**: 3 milestones
- **goods-asset-tracker**: 2 milestones
- **justicehub-platform**: 2 milestones
- **harvest-community-hub**: 1 milestone

---

## 📝 Deprecated / Inactive Repositories

### `theharvest` (Old Holding Site)
- **GitHub URL**: https://github.com/Acurioustractor/theharvest
- **Status**: ⛔ DEPRECATED - Do not use for development
- **Reason**: Old static holding page before real site was built
- **Replacement**: `harvest-community-hub` (see above)

---

## 🚀 Deployment Alignment

All primary codebases deploy to Vercel:

### Production URLs (when deployed)
- **ACT Studio**: TBD
- **Empathy Ledger**: TBD
- **JusticeHub**: TBD
- **The Harvest**: TBD
- **Goods**: TBD
- **ACT Farm**: TBD

### Environment Variables
All repos require:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Project-specific variables (see each repo's `.env.example`)

---

## 🤖 Claude Skills Alignment

### Available Skills
All primary codebases have access to:

1. **`/act-brand-alignment`** - ACT voice, tone, LCAA method, all projects
2. **`/ghl-crm-advisor`** - GoHighLevel CRM strategy across all projects
3. **Future skills**: Knowledge base, multi-repo sync, deployment automation

### Multi-Codebase Context
When working in any ACT codebase, Claude has context about:
- All 6 primary repositories
- Shared types and utilities
- Cross-project dependencies
- Automation workflows
- Deployment pipelines

---

## 🔄 Cross-Repository Operations

### Deployment Script
Deploy automation to all repos:
```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./scripts/deploy-auto-tagging.sh
```

### Bulk Operations
All scripts in `scripts/` understand the 6-repo ecosystem:
- `scripts/bulk-add-to-project.js` - Add issues to GitHub Project
- `scripts/assign-milestones.js` - Assign milestones across repos
- `scripts/sync-milestone-dates.js` - Sync dates across repos
- `scripts/deploy-auto-tagging.sh` - Deploy workflows to all repos

---

## ✅ Verification Checklist

### For Each Repository

**GitHub Configuration**:
- [ ] Workflow file deployed: `.github/workflows/auto-tag-project-items.yml`
- [ ] Workflow permissions: Read and write
- [ ] Secret configured: `GH_PROJECT_TOKEN` (Classic PAT)
- [ ] Milestones created (see `scripts/CREATE_MILESTONES.md`)

**Local Development**:
- [ ] Repository cloned to correct path
- [ ] Dependencies installed: `npm install`
- [ ] Environment variables configured: `.env.local`
- [ ] Dev server runs: `npm run dev`

**Claude Code Integration**:
- [ ] CLAUDE.md file present (if main repo)
- [ ] Skills accessible from this codebase
- [ ] Multi-repo context understood

---

## 📊 Repository Status Matrix

| Repo | Local Path | GitHub | Automation | Milestones | Status |
|------|-----------|--------|------------|-----------|--------|
| ACT Studio | `/ACT Farm and Regenerative Innovation Studio/` | `act-regenerative-studio` | ✅ | 3 | Active |
| Empathy Ledger | `/Empathy Ledger v.02/` | `empathy-ledger-v2` | ✅ | 5 | Active |
| JusticeHub | `/JusticeHub/` | `justicehub-platform` | ✅ | 2 | Active |
| **The Harvest** | **`/The Harvest Website/`** | **`harvest-community-hub`** | ✅ | 1 | **Active** |
| Goods | `/Goods Asset Register/` | `goods-asset-tracker` | ✅ | 2 | Active |
| ACT Farm | `/ACT Farm/act-farm/` | `act-farm` | ✅ | 0 | Active |

---

## 🎯 Key Takeaways

1. **The Harvest Website** local code at `/Users/benknight/Code/The Harvest Website/` is now:
   - ✅ Pushed to GitHub: `harvest-community-hub`
   - ✅ Integrated with GitHub Projects automation
   - ✅ Aligned with milestone system
   - ✅ Recognized as primary active codebase
   - ✅ Full Claude skills and deployment support

2. **Old `theharvest` repo** is deprecated - do not use for development

3. **All 6 primary repos** have identical automation:
   - Auto-field assignment on new issues
   - Milestone-based date management
   - Type detection and categorization
   - Cross-project visibility

4. **Claude Code** has full context across all 6 codebases for:
   - Multi-repo operations
   - Brand alignment
   - Technical coordination
   - Deployment workflows

---

## 📚 Related Documentation

- **Multi-Repo Management**: [docs/operations/multi-repo-management.md](./multi-repo-management.md)
- **Milestone System**: [docs/operations/MILESTONE_IMPLEMENTATION_GUIDE.md](./MILESTONE_IMPLEMENTATION_GUIDE.md)
- **Type Field Strategy**: [docs/operations/TYPE_FIELD_STRATEGY.md](./TYPE_FIELD_STRATEGY.md)
- **Automation Guide**: [docs/operations/AUTOMATION_COMPLETE.md](./AUTOMATION_COMPLETE.md)
- **Claude Context**: [CLAUDE.md](../../CLAUDE.md)

---

**Maintained By**: ACT Ecosystem Team
**Last Verified**: 2025-12-26
**Next Review**: When new repositories added

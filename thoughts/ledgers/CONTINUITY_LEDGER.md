# ACT Regenerative Studio - Continuity Ledger

> Last Updated: 2025-01-18
> Session: Initial Setup

## Active Context

### Current Goals
- [ ] Complete Continuous Claude v3 integration
- [ ] Set up persistent memory system
- [ ] Configure lifecycle hooks

### Key Patterns Discovered
- This project uses **Supabase** with pgvector for storage
- Already has a `.claude/skills/` directory with project-specific skills
- Uses Next.js 15 + React 19 + TypeScript
- LCAA methodology (Listen, Curiosity, Action, Art) drives all work

### Architecture Notes
- **Living Wiki**: Knowledge extraction from Gmail, Notion, Calendar
- **Multi-Project Hub**: Empathy Ledger, JusticeHub, Harvest, BCV, Goods
- **GHL Integration**: CRM automation for all projects

## Memory System

### How to Recall
```bash
cd $CLAUDE_PROJECT_DIR/opc && PYTHONPATH=. uv run python scripts/core/recall_learnings.py --query "your search" --k 5
```

### How to Store
```bash
cd $CLAUDE_PROJECT_DIR/opc && PYTHONPATH=. uv run python scripts/core/store_learning.py \
  --session-id "session-id" \
  --type WORKING_SOLUTION \
  --content "what you learned" \
  --context "what it relates to" \
  --tags "tag1,tag2" \
  --confidence high
```

## Blocked Items
None currently.

## Completed This Session
- Created database migration for Continuous Claude tables
- Set up opc/ Python package with core scripts
- Created thoughts/ directory structure
- Set up memory recall/store system

## Handoff Notes
For the next session:
1. Run database migration to create tables
2. Configure hooks in `.claude/settings.json`
3. Test memory system with sample learnings
4. Set up status line integration

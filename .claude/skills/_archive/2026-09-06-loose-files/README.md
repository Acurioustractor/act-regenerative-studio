# ACT Claude Configuration

This directory contains Claude Code configuration and skills for ACT Farm and Regenerative Innovation Studio.

## 🚀 Quick Start

### Option 1: Interactive Menu (Recommended)
```bash
./.claude/skills-menu.sh
```

### Option 2: Direct Invocation
In any Claude conversation:
```
/act-brand-alignment
/ghl-crm-advisor
```

### Option 3: Read the Guide
```bash
cat .claude/SKILLS_GUIDE.md
# or
code .claude/SKILLS_GUIDE.md
```

---

## 📁 Directory Structure

```
.claude/
├── README.md (this file)
├── SKILLS_GUIDE.md (comprehensive skills documentation)
├── skills-menu.sh (interactive skill launcher)
├── settings.local.json (Claude Code settings)
└── skills/
    ├── act-brand-alignment/ (brand, content, voice)
    ├── ghl-crm-advisor/ (CRM strategy)
    ├── act-knowledge-base/ (knowledge extraction)
    └── dist/ (packaged skills)
```

---

## 🎯 Available Skills

### 1. act-brand-alignment
**Purpose**: Comprehensive ACT brand alignment for all ecosystem projects

**Use for**:
- Writing web pages, marketing copy, grant applications
- Designing UI and visual assets
- Reviewing content for voice/tone consistency
- Planning any ACT project communications

**Invoke**: `/act-brand-alignment`

---

### 2. ghl-crm-advisor
**Purpose**: Strategic advisor for GoHighLevel CRM implementation

**Use for**:
- Designing pipelines and workflows
- Creating email sequences and automation
- Optimizing lead management
- Troubleshooting GHL integrations

**Invoke**: `/ghl-crm-advisor`

---

### 3. act-knowledge-base
**Purpose**: Knowledge extraction and management system

**Status**: In development (Phase 2 complete)

**Use for**:
- Extracting knowledge from Gmail, Notion, Calendar
- Managing review workflows
- Timeline planning
- Source tracking

**Invoke**: Mention "knowledge extraction" or "living wiki"

---

## 📚 Documentation

- **[SKILLS_GUIDE.md](SKILLS_GUIDE.md)** - Complete skills reference
- **[skills/act-brand-alignment/SKILL.md](skills/act-brand-alignment/SKILL.md)** - Brand skill details
- **[skills/ghl-crm-advisor/SKILL.md](skills/ghl-crm-advisor/SKILL.md)** - CRM skill details

---

## 💡 Tips

1. **Be specific** when invoking skills:
   - ❌ "Help me with this"
   - ✅ "Use act-brand-alignment to review this homepage"

2. **Chain skills** for complex tasks:
   - Brand alignment → CRM design → Brand review

3. **Update the guide** when adding new skills:
   - Edit `SKILLS_GUIDE.md`
   - Update this README

4. **Test skills** before deploying:
   - Invoke in conversation
   - Verify outputs
   - Iterate as needed

---

## 🔧 Managing Skills

### Add a New Skill
1. Create directory: `mkdir skills/skill-name`
2. Create `SKILL.md` with frontmatter
3. Add references if needed
4. Update `SKILLS_GUIDE.md`
5. Test thoroughly

### Update a Skill
1. Edit `skills/skill-name/SKILL.md`
2. Update references
3. Test changes
4. Document in README

### Package a Skill
```bash
claude skill package skills/skill-name -o dist/skill-name.skill
```

---

## 🎓 Learning More

**For Users**:
- Read [SKILLS_GUIDE.md](SKILLS_GUIDE.md)
- Run `./skills-menu.sh` to explore
- Ask Claude: "What skills are available?"

**For Developers**:
- Study existing skills
- Review [Claude Code docs](https://docs.anthropic.com/claude/docs/skills)
- Check skill frontmatter format
- Test thoroughly

---

## 📞 Support

**Issues?**
- Check skill SKILL.md for correct usage
- Review SKILLS_GUIDE.md for troubleshooting
- Update skill references if knowledge is missing

**Questions?**
Ask Claude: "How do I use the [skill-name] skill?"

---

**Maintained By**: Ben Knight + Claude AI
**Last Updated**: 2025-12-26
**Location**: `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.claude/`

import { FileText, BookOpen, Code, Workflow, Database } from 'lucide-react'

export default function DocumentationView() {
  const docs = [
    {
      category: 'Ecosystem Strategy',
      icon: FileText,
      docs: [
        { title: 'ACT Ecosystem Visual Strategy', file: 'ACT_ECOSYSTEM_VISUAL_STRATEGY.md', description: 'Complete visual map of how all 4 projects interconnect' },
        { title: 'GHL Pipeline Strategy', file: 'GHL_PIPELINE_STRATEGY.md', description: '15 pipelines across all projects with automation workflows' },
        { title: 'Supabase + GHL Integration Architecture', file: 'SUPABASE_GHL_INTEGRATION_ARCHITECTURE.md', description: 'How auth and CRM systems work together' },
      ],
    },
    {
      category: 'Implementation Guides',
      icon: Code,
      docs: [
        { title: 'GHL Setup Guide', file: 'GHL_SETUP_GUIDE.md', description: 'Step-by-step GoHighLevel configuration' },
        { title: 'Quick Start GHL', file: 'QUICK_START_GHL.md', description: '30-minute quick start for new team members' },
        { title: 'Tenant/Vendor Pipeline', file: 'The Harvest/TENANT_VENDOR_PIPELINE.md', description: 'Complete 14-stage tenant management system' },
      ],
    },
    {
      category: 'Skills & Tools',
      icon: Workflow,
      docs: [
        { title: 'GHL CRM Advisor Skill', file: '.claude/skills/ghl-crm-advisor/SKILL.md', description: 'Claude Code skill for ongoing CRM guidance' },
        { title: 'GHL Quick Reference', file: '.claude/skills/ghl-crm-advisor/QUICK-REFERENCE.md', description: 'Common questions and answers' },
      ],
    },
    {
      category: 'Technical Reference',
      icon: Database,
      docs: [
        { title: 'GHL Client Library', file: 'src/lib/ghl/client.ts', description: 'Shared GHL API client for all projects' },
        { title: 'GHL Types', file: 'src/lib/ghl/types.ts', description: 'TypeScript type definitions' },
        { title: 'Redis Utilities', file: 'src/lib/redis.ts', description: 'Caching helpers' },
      ],
    },
  ]

  const quickLinks = [
    { label: 'GHL Dashboard', url: 'https://app.gohighlevel.com/', external: true },
    { label: 'Supabase Console', url: 'https://supabase.com/dashboard', external: true },
    { label: 'Resend Dashboard', url: 'https://resend.com/overview', external: true },
    { label: 'Stripe Dashboard', url: 'https://dashboard.stripe.com/', external: true },
  ]

  const projectLinks = [
    { name: 'The Harvest', url: 'https://theharvest.org.au', status: 'production' },
    { name: 'ACT Farm', url: 'https://actfarm.org.au', status: 'production' },
    { name: 'Empathy Ledger', url: 'https://empathyledger.com', status: 'beta' },
    { name: 'JusticeHub', url: 'https://justicehub.org.au', status: 'beta' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documentation Hub</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive guides, technical references, and world-class CRM implementation documentation
        </p>
      </div>

      {/* Documentation Categories */}
      <div className="space-y-8 mb-12">
        {docs.map((category) => {
          const Icon = category.icon

          return (
            <section key={category.category}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-act-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {category.docs.map((doc) => (
                  <div
                    key={doc.file}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-act-green-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{doc.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-mono">{doc.file}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-act-green-100 hover:bg-act-green-200 text-act-green-800 text-sm font-medium rounded transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Quick Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-act-green-400 hover:shadow-md transition-all text-center"
            >
              <div className="font-semibold text-gray-900">{link.label}</div>
              <div className="text-xs text-gray-500 mt-1">↗ External</div>
            </a>
          ))}
        </div>
      </section>

      {/* Project Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Websites</h2>
        <div className="grid grid-cols-2 gap-4">
          {projectLinks.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-act-green-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{project.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{project.url}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'production'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Key Concepts */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Integration Philosophy</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              The ACT ecosystem uses a best-of-breed approach: Supabase for complex auth, GoHighLevel for CRM automation,
              Resend for transactional emails, and Redis for performance caching. Email serves as the primary reconciliation
              key across all systems.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Cross-Project Synergy</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Community members naturally flow between projects based on their interests. GHL automation detects these interests
              via tags and triggers warm referral emails, increasing lifetime value by 3-5x compared to single-project engagement.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Mission-First Revenue Model</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Revenue generation supports regenerative community work, not the other way around. Sliding scale pricing, freemium
              tiers, and grant funding ensure accessibility while sustainable income from tenants, residencies, and org subscriptions
              funds core operations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-900 mb-2">World-Class CRM Implementation</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              15 pipelines, 100+ automation workflows, intelligent tag taxonomy, cross-project referral tracking, and unified
              email delivery create a best-in-class CRM system typically seen only in enterprise SaaS companies—but purpose-built
              for regenerative community work.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

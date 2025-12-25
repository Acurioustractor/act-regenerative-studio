import { ArrowRight, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function EcosystemMap() {
  const projects = [
    {
      id: 'harvest',
      name: 'The Harvest',
      description: 'Community Hub',
      color: 'emerald',
      users: ['Volunteers', 'Members', 'Tenants', 'Event Attendees'],
      revenue: '$100k-200k/yr',
      position: 'top-left',
    },
    {
      id: 'actfarm',
      name: 'ACT Farm',
      description: 'Regenerative Tourism',
      color: 'green',
      users: ['Residency Guests', 'Workshop Attendees', 'June\'s Patch Patients'],
      revenue: '$150k-300k/yr',
      position: 'top-right',
    },
    {
      id: 'empathy',
      name: 'Empathy Ledger',
      description: 'Storytelling Platform',
      color: 'teal',
      users: ['Storytellers', 'Organizations', 'Researchers'],
      revenue: '$50k-500k/yr',
      position: 'bottom-left',
    },
    {
      id: 'justicehub',
      name: 'JusticeHub',
      description: 'Service Directory',
      color: 'cyan',
      users: ['Families', 'Service Providers', 'Campaign Leaders'],
      revenue: '$50k-200k/yr',
      position: 'bottom-center',
    },
    {
      id: 'goods',
      name: 'Goods on Country',
      description: 'Commerce & Funding',
      color: 'amber',
      users: ['Customers', 'Supporters', 'Patrons'],
      revenue: '$50k-150k/yr',
      position: 'bottom-right',
    },
  ]

  const referralPaths = [
    { from: 'harvest', to: 'actfarm', label: 'Volunteer → Workshop', count: 12 },
    { from: 'actfarm', to: 'empathy', label: 'Resident → Storyteller', count: 7 },
    { from: 'empathy', to: 'justicehub', label: 'Story → Campaign', count: 4 },
    { from: 'justicehub', to: 'harvest', label: 'Family → Program', count: 3 },
  ]

  const infrastructure = [
    { name: 'GoHighLevel', purpose: 'CRM & Automation', status: 'active' },
    { name: 'Supabase', purpose: 'Auth & Database', status: 'active' },
    { name: 'Resend', purpose: 'Transactional Email', status: 'active' },
    { name: 'Redis (NAS)', purpose: 'Caching', status: 'active' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ACT Ecosystem Integration Map</h1>
        <p className="text-gray-600 mt-2">
          Visual representation of how all 5 projects interconnect through shared infrastructure and cross-project referrals
        </p>
      </div>

      {/* Shared Infrastructure Layer */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shared Infrastructure</h2>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-4 gap-4">
            {infrastructure.map((infra) => (
              <div key={infra.name} className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{infra.name}</h3>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                </div>
                <p className="text-gray-300 text-sm">{infra.purpose}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Ecosystem</h2>
        <div className="grid grid-cols-2 gap-6 mb-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`bg-${project.color}-50 border-2 border-${project.color}-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-2xl font-bold text-${project.color}-900`}>{project.name}</h3>
                  <p className={`text-${project.color}-700 font-medium`}>{project.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full bg-${project.color}-500`}></div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase mb-2">User Types</div>
                  <div className="flex flex-wrap gap-2">
                    {project.users.map((user) => (
                      <span
                        key={user}
                        className={`px-2 py-1 bg-white border border-${project.color}-200 text-${project.color}-800 text-xs rounded-md`}
                      >
                        {user}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-600 uppercase">Revenue Potential</div>
                    <div className={`text-lg font-bold text-${project.color}-900`}>{project.revenue}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Pathways */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cross-Project Referral Flows</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {referralPaths.map((path, index) => {
              const fromProject = projects.find((p) => p.id === path.from)
              const toProject = projects.find((p) => p.id === path.to)

              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 flex items-center gap-4">
                    <div className={`px-4 py-2 bg-${fromProject?.color}-100 border border-${fromProject?.color}-300 text-${fromProject?.color}-900 font-semibold rounded-lg`}>
                      {fromProject?.name}
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <div className="text-sm font-medium text-gray-700 mb-1">{path.label}</div>
                      <div className="w-full h-0.5 bg-gray-300 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          <ArrowRight className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Automated via GHL workflow</div>
                    </div>

                    <div className={`px-4 py-2 bg-${toProject?.color}-100 border border-${toProject?.color}-300 text-${toProject?.color}-900 font-semibold rounded-lg`}>
                      {toProject?.name}
                    </div>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="text-2xl font-bold text-gray-900">{path.count}</div>
                    <div className="text-xs text-gray-500">this month</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Total Ecosystem Value */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Combined Ecosystem Value</h2>
        <div className="bg-gradient-to-br from-act-green-600 to-act-green-800 rounded-lg p-8 text-white">
          <div className="grid grid-cols-3 gap-8 items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">Annual Revenue Potential</div>
              <div className="text-5xl font-bold">$350k - $1.2M</div>
              <div className="text-sm mt-2 opacity-75">Mature state (3-5 years)</div>
            </div>

            <div className="border-l border-r border-white/30 px-8">
              <div className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">Multi-Project Members</div>
              <div className="text-5xl font-bold">47</div>
              <div className="text-sm mt-2 opacity-75">Engaged with 2+ projects</div>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">Avg Customer LTV</div>
              <div className="text-5xl font-bold">$1,247</div>
              <div className="text-sm mt-2 opacity-75">Across all touchpoints</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Notes */}
      <section className="mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🔗 Integration Strategy</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span><strong>Supabase</strong> handles platform authentication, complex permissions, and database for Empathy Ledger + JusticeHub</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span><strong>GoHighLevel</strong> handles CRM, marketing automation, pipelines, and booking for all 4 projects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span><strong>Resend</strong> handles all transactional emails (unified system across projects)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span><strong>Email as primary key</strong> for reconciliation between Supabase users and GHL contacts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span><strong>Redis caching</strong> reduces API calls and improves performance across all integrations</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

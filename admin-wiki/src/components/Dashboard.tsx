import { Check, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

export default function Dashboard() {
  // Mock data - in production, fetch from GHL API + Supabase
  const systemHealth = [
    { name: 'GHL API', status: 'operational', details: '47/100 calls today' },
    { name: 'Supabase', status: 'operational', details: '12ms avg response' },
    { name: 'Resend', status: 'operational', details: '98.5% delivery' },
    { name: 'Redis Cache', status: 'operational', details: '99.2% hit rate' },
  ]

  const projects = [
    { name: 'The Harvest', contacts: 142, newThisMonth: 37, revenue: 12450, color: 'bg-emerald-500' },
    { name: 'ACT Farm', contacts: 89, newThisMonth: 21, revenue: 28500, color: 'bg-green-600' },
    { name: 'Empathy Ledger', contacts: 312, newThisMonth: 45, revenue: 3200, color: 'bg-teal-500' },
    { name: 'JusticeHub', contacts: 527, newThisMonth: 89, revenue: 0, color: 'bg-cyan-600' },
    { name: 'Goods on Country', contacts: 234, newThisMonth: 52, revenue: 8750, color: 'bg-amber-600' },
  ]

  const crossProjectStats = [
    { label: 'Multi-Project Members', value: '47', description: 'Engaged with 2+ projects' },
    { label: 'This Month Referrals', value: '26', description: 'Cross-project conversions' },
    { label: 'Total Ecosystem Value', value: '$44,150', description: 'Combined monthly revenue' },
    { label: 'Avg Customer LTV', value: '$1,247', description: 'Across all projects' },
  ]

  const topReferralPaths = [
    { from: 'Harvest Volunteer', to: 'ACT Farm Workshop', count: 12 },
    { from: 'ACT Farm Resident', to: 'Empathy Ledger', count: 7 },
    { from: 'Empathy Ledger', to: 'JusticeHub Campaign', count: 4 },
    { from: 'JusticeHub Family', to: 'Harvest Programs', count: 3 },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ACT Ecosystem Dashboard</h1>
        <p className="text-gray-600 mt-2">System health and cross-project metrics (Last 30 days)</p>
      </div>

      {/* System Health */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="grid grid-cols-4 gap-4">
          {systemHealth.map((system) => (
            <div key={system.name} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{system.name}</h3>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-green-700 font-medium mb-1">✓ {system.status}</p>
              <p className="text-xs text-gray-500">{system.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Project Activity */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cross-Project Activity</h2>
        <div className="grid grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.name} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                </div>
                <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{project.contacts}</div>
                  <div className="text-xs text-gray-500">Total contacts</div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    +{project.newThisMonth} this month
                  </span>
                </div>
                {project.revenue > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-lg font-bold text-gray-900">
                      ${project.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Revenue this month</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ecosystem Statistics</h2>
        <div className="grid grid-cols-4 gap-6">
          {crossProjectStats.map((stat) => (
            <div key={stat.label} className="bg-gradient-to-br from-act-green-50 to-white rounded-lg border border-act-green-200 p-5">
              <div className="text-3xl font-bold text-act-green-800 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Referral Pathways */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Referral Pathways (This Month)</h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {topReferralPaths.map((path, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-lg font-bold text-gray-400 w-8">{index + 1}</div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                    {path.from}
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                    {path.to}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{path.count}</div>
                <div className="text-xs text-gray-500">people</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-act-green-500 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900 mb-1">Generate Report</div>
            <div className="text-sm text-gray-600">Export cross-project analytics</div>
          </button>

          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-act-green-500 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium text-gray-900 mb-1">Sync Contacts</div>
            <div className="text-sm text-gray-600">Manual Supabase → GHL sync</div>
          </button>

          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-act-green-500 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">📧</div>
            <div className="font-medium text-gray-900 mb-1">Email Analytics</div>
            <div className="text-sm text-gray-600">View delivery and engagement</div>
          </button>
        </div>
      </section>
    </div>
  )
}

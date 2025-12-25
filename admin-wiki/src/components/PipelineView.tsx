export default function PipelineView() {
  const pipelines = [
    {
      project: 'The Harvest',
      pipelines: [
        { name: 'Tenant/Vendor Pipeline', stages: 14, activeContacts: 8, revenue: '$12,000/mo' },
        { name: 'Volunteer Pipeline', stages: 6, activeContacts: 47, revenue: 'N/A' },
        { name: 'Member Pipeline', stages: 7, activeContacts: 23, revenue: '$450/mo' },
        { name: 'Program Participant Pipeline', stages: 5, activeContacts: 12, revenue: '$1,200/mo' },
      ],
    },
    {
      project: 'ACT Farm',
      pipelines: [
        { name: 'Residency Pipeline', stages: 8, activeContacts: 15, revenue: '$28,500/mo' },
        { name: 'Workshop Pipeline', stages: 6, activeContacts: 34, revenue: '$4,200/mo' },
        { name: 'June\'s Patch Clinical Pipeline', stages: 7, activeContacts: 6, revenue: 'TBD' },
        { name: 'General Inquiry Pipeline', stages: 5, activeContacts: 21, revenue: 'N/A' },
      ],
    },
    {
      project: 'Empathy Ledger',
      pipelines: [
        { name: 'Organization Lead Pipeline', stages: 9, activeContacts: 18, revenue: '$3,200/mo' },
        { name: 'Storyteller Onboarding Pipeline', stages: 6, activeContacts: 45, revenue: 'Freemium' },
        { name: 'Partnership Pipeline', stages: 8, activeContacts: 7, revenue: 'Grant-funded' },
      ],
    },
    {
      project: 'JusticeHub',
      pipelines: [
        { name: 'Service Provider Pipeline', stages: 7, activeContacts: 89, revenue: 'Future' },
        { name: 'Family Support Pipeline', stages: 6, activeContacts: 127, revenue: 'N/A' },
        { name: 'CONTAINED Campaign Pipeline', stages: 8, activeContacts: 34, revenue: 'Donations' },
        { name: 'Story Submission Pipeline', stages: 5, activeContacts: 56, revenue: 'N/A' },
      ],
    },
  ]

  const projectColors: { [key: string]: string } = {
    'The Harvest': 'emerald',
    'ACT Farm': 'green',
    'Empathy Ledger': 'teal',
    'JusticeHub': 'cyan',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pipeline Overview</h1>
        <p className="text-gray-600 mt-2">
          All 15 pipelines across 4 projects - track stages, active contacts, and revenue
        </p>
      </div>

      {/* Pipeline Grid by Project */}
      <div className="space-y-8">
        {pipelines.map((projectGroup) => {
          const colorClass = projectColors[projectGroup.project]

          return (
            <section key={projectGroup.project}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-4 h-4 rounded-full bg-${colorClass}-500`}></div>
                <h2 className="text-2xl font-bold text-gray-900">{projectGroup.project}</h2>
                <span className="text-sm text-gray-500">
                  ({projectGroup.pipelines.length} pipeline{projectGroup.pipelines.length > 1 ? 's' : ''})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {projectGroup.pipelines.map((pipeline) => (
                  <div
                    key={pipeline.name}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-act-green-400 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg">{pipeline.name}</h3>
                      <div className={`px-2 py-1 bg-${colorClass}-100 text-${colorClass}-800 text-xs font-medium rounded`}>
                        {pipeline.stages} stages
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{pipeline.activeContacts}</div>
                        <div className="text-xs text-gray-500">Active contacts</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{pipeline.revenue}</div>
                        <div className="text-xs text-gray-500">Monthly revenue</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                        View in GHL
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-act-green-100 hover:bg-act-green-200 text-act-green-800 rounded transition-colors">
                        Analytics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Pipeline Performance Summary */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
            <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Pipelines</div>
            <div className="text-4xl font-bold text-blue-900">15</div>
            <div className="text-sm text-gray-600 mt-2">Across 4 projects</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6">
            <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Active Contacts</div>
            <div className="text-4xl font-bold text-green-900">542</div>
            <div className="text-sm text-gray-600 mt-2">In all pipelines combined</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-lg p-6">
            <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Monthly Revenue</div>
            <div className="text-4xl font-bold text-emerald-900">$49,550</div>
            <div className="text-sm text-gray-600 mt-2">From revenue-generating pipelines</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-8">
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pipeline Management Tools</h3>
          <div className="grid grid-cols-4 gap-4">
            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-all">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-gray-900 text-sm">Export All Data</div>
            </button>
            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-all">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-medium text-gray-900 text-sm">Bulk Stage Update</div>
            </button>
            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-all">
              <div className="text-2xl mb-2">🏷️</div>
              <div className="font-medium text-gray-900 text-sm">Tag Management</div>
            </button>
            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-all">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-medium text-gray-900 text-sm">Workflow Triggers</div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

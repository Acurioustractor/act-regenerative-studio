export default function RevenueView() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Dashboard</h1>
      <p className="text-gray-600 mb-8">Track income across all 4 ACT projects</p>

      {/* Revenue Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-lg p-6">
          <div className="text-sm font-semibold uppercase opacity-90 mb-2">The Harvest</div>
          <div className="text-3xl font-bold">$12,450</div>
          <div className="text-sm opacity-75 mt-2">This month</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg p-6">
          <div className="text-sm font-semibold uppercase opacity-90 mb-2">ACT Farm</div>
          <div className="text-3xl font-bold">$28,500</div>
          <div className="text-sm opacity-75 mt-2">This month</div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-lg p-6">
          <div className="text-sm font-semibold uppercase opacity-90 mb-2">Empathy Ledger</div>
          <div className="text-3xl font-bold">$3,200</div>
          <div className="text-sm opacity-75 mt-2">This month</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white rounded-lg p-6">
          <div className="text-sm font-semibold uppercase opacity-90 mb-2">JusticeHub</div>
          <div className="text-3xl font-bold">$0</div>
          <div className="text-sm opacity-75 mt-2">Grant-funded</div>
        </div>
      </div>

      {/* Total Ecosystem Revenue */}
      <div className="bg-gradient-to-r from-act-green-600 to-act-green-800 text-white rounded-xl p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold uppercase opacity-90 mb-2">Total Ecosystem Revenue</div>
            <div className="text-5xl font-bold">$44,150</div>
            <div className="text-sm opacity-75 mt-2">This month (excluding grants)</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold uppercase opacity-90 mb-2">Annual Run Rate</div>
            <div className="text-4xl font-bold">$529,800</div>
            <div className="text-sm opacity-75 mt-2">Projected (current pace)</div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Revenue Streams</h2>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* The Harvest */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">The Harvest</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Tenant Rent</div>
                <div className="text-2xl font-bold text-emerald-900">$9,000</div>
                <div className="text-xs text-gray-500 mt-1">3 active tenants</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Event Tickets</div>
                <div className="text-2xl font-bold text-emerald-900">$1,850</div>
                <div className="text-xs text-gray-500 mt-1">8 events this month</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Memberships</div>
                <div className="text-2xl font-bold text-emerald-900">$450</div>
                <div className="text-xs text-gray-500 mt-1">23 active members</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Program Fees</div>
                <div className="text-2xl font-bold text-emerald-900">$1,150</div>
                <div className="text-xs text-gray-500 mt-1">12 participants</div>
              </div>
            </div>
          </div>

          {/* ACT Farm */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">ACT Farm</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Residencies</div>
                <div className="text-2xl font-bold text-green-900">$24,000</div>
                <div className="text-xs text-gray-500 mt-1">8 residencies (avg $3,000)</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Workshops</div>
                <div className="text-2xl font-bold text-green-900">$4,500</div>
                <div className="text-xs text-gray-500 mt-1">45 tickets sold</div>
              </div>
            </div>
          </div>

          {/* Empathy Ledger */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Empathy Ledger</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Organization Subscriptions</div>
                <div className="text-2xl font-bold text-teal-900">$3,200</div>
                <div className="text-xs text-gray-500 mt-1">4 paying orgs (MRR)</div>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Storyteller Platform</div>
                <div className="text-2xl font-bold text-teal-900">$0</div>
                <div className="text-xs text-gray-500 mt-1">Freemium model</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projections */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Revenue Projections (Next 12 Months)</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Conservative (Current Pace)</div>
                <div className="text-sm text-gray-600">No growth, maintain current revenue</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">$530k</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Moderate Growth</div>
                <div className="text-sm text-gray-600">+2 tenants, +10 residencies, +3 org subscriptions</div>
              </div>
              <div className="text-2xl font-bold text-green-900">$750k</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Aggressive Growth</div>
                <div className="text-sm text-gray-600">Full tenant capacity, 30 residencies, 10 org subscriptions</div>
              </div>
              <div className="text-2xl font-bold text-emerald-900">$1.2M</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

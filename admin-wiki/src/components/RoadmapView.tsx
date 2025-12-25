'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2, Circle, Clock, Target, Zap, Users, DollarSign, MessageSquare, Database, ShoppingCart, BookOpen } from 'lucide-react'

type ProjectStatus = 'not-started' | 'in-progress' | 'testing' | 'live' | 'mature'
type Priority = 'critical' | 'high' | 'medium' | 'low'

interface Feature {
  name: string
  category: 'ghl' | 'supabase' | 'ecommerce' | 'storytelling' | 'community' | 'fundraising'
  the_harvest: ProjectStatus
  act_farm: ProjectStatus
  empathy_ledger: ProjectStatus
  justicehub: ProjectStatus
  goods_on_country: ProjectStatus
  act_hub: ProjectStatus
  priority: Priority
  notes?: string
}

interface Milestone {
  id: string
  title: string
  target_date: string
  status: 'completed' | 'on-track' | 'at-risk' | 'blocked'
  projects: string[]
  dependencies: string[]
  description: string
}

const features: Feature[] = [
  // GHL Integration
  {
    name: 'Contact Form → GHL',
    category: 'ghl',
    the_harvest: 'in-progress',
    act_farm: 'in-progress',
    empathy_ledger: 'in-progress',
    justicehub: 'in-progress',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'critical',
    notes: 'Need GHL sub-accounts first'
  },
  {
    name: 'Booking Calendar (GHL)',
    category: 'ghl',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'high',
    notes: 'ACT Farm residencies, Harvest events, JH CONTAINED'
  },
  {
    name: 'Email Automation (GHL)',
    category: 'ghl',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'high'
  },
  {
    name: 'Pipeline Management',
    category: 'ghl',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium',
    notes: '30 pipelines total across ecosystem'
  },

  // Supabase Integration
  {
    name: 'User Authentication',
    category: 'supabase',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'live',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'critical',
    notes: 'Auth0 in JH, native Supabase in EL'
  },
  {
    name: 'Database Schema',
    category: 'supabase',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'live',
    goods_on_country: 'not-started',
    act_hub: 'in-progress',
    priority: 'critical'
  },
  {
    name: 'Row Level Security (RLS)',
    category: 'supabase',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'testing',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'critical'
  },
  {
    name: 'Supabase ↔ GHL Sync',
    category: 'supabase',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'high',
    notes: 'Email as reconciliation key'
  },

  // E-commerce
  {
    name: 'Stripe Integration',
    category: 'ecommerce',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'testing',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'high',
    notes: 'EL subscriptions, ACT Farm deposits, Goods e-commerce'
  },
  {
    name: 'Booking with Payment',
    category: 'ecommerce',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'high'
  },
  {
    name: 'CSA Subscriptions',
    category: 'ecommerce',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium'
  },
  {
    name: 'Revenue Tracking',
    category: 'ecommerce',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium',
    notes: '40% community share tracking'
  },

  // Storytelling & Content
  {
    name: 'Story Submission',
    category: 'storytelling',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'live',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium'
  },
  {
    name: 'AI Content Analysis',
    category: 'storytelling',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'low',
    notes: 'EL uses OpenAI, Anthropic, AssemblyAI'
  },
  {
    name: 'Media Upload/Processing',
    category: 'storytelling',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'testing',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium',
    notes: 'Cloudinary for EL'
  },
  {
    name: 'Registry API',
    category: 'storytelling',
    the_harvest: 'live',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'live',
    goods_on_country: 'live',
    act_hub: 'in-progress',
    priority: 'high',
    notes: 'ACT Hub aggregates all registries'
  },

  // Community Management
  {
    name: 'User Profiles',
    category: 'community',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'live',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium'
  },
  {
    name: 'Community Directory',
    category: 'community',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'live',
    justicehub: 'live',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium'
  },
  {
    name: 'Tenant Management',
    category: 'community',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'high',
    notes: 'Critical for Harvest tenant pipeline'
  },
  {
    name: 'Volunteer Management',
    category: 'community',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium'
  },

  // Fundraising & Grants
  {
    name: 'Donation Forms',
    category: 'fundraising',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'low'
  },
  {
    name: 'Grant Application Tracking',
    category: 'fundraising',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'low',
    notes: 'Internal tool for ACT team'
  },
  {
    name: 'Impact Reporting',
    category: 'fundraising',
    the_harvest: 'not-started',
    act_farm: 'not-started',
    empathy_ledger: 'not-started',
    justicehub: 'not-started',
    goods_on_country: 'not-started',
    act_hub: 'not-started',
    priority: 'medium',
    notes: 'Automated reports for funders'
  },
]

const milestones: Milestone[] = [
  {
    id: 'ghl-setup',
    title: 'GHL Sub-Accounts Created',
    target_date: '2026-01-15',
    status: 'at-risk',
    projects: ['All'],
    dependencies: [],
    description: 'Create 6 GHL accounts (1 master + 5 sub-accounts), generate API keys, populate .env vault'
  },
  {
    id: 'harvest-ghl',
    title: 'The Harvest - GHL Integration Live',
    target_date: '2026-02-01',
    status: 'at-risk',
    projects: ['The Harvest'],
    dependencies: ['ghl-setup'],
    description: 'Contact form, volunteer signup, event booking all connected to GHL'
  },
  {
    id: 'act-farm-booking',
    title: 'ACT Farm - Residency Booking System',
    target_date: '2026-02-15',
    status: 'at-risk',
    projects: ['ACT Farm'],
    dependencies: ['ghl-setup'],
    description: 'Full residency booking with calendar, payment, confirmation emails'
  },
  {
    id: 'el-org-pipeline',
    title: 'Empathy Ledger - Organization Pipeline',
    target_date: '2026-02-01',
    status: 'at-risk',
    projects: ['Empathy Ledger'],
    dependencies: ['ghl-setup'],
    description: 'Organization inquiry forms, partnership requests, GHL sync'
  },
  {
    id: 'jh-booking-complete',
    title: 'JusticeHub - CONTAINED Booking Complete',
    target_date: '2026-02-15',
    status: 'at-risk',
    projects: ['JusticeHub'],
    dependencies: ['ghl-setup'],
    description: 'Complete /api/booking implementation, 24 slots/day system'
  },
  {
    id: 'act-hub-launch',
    title: 'ACT Hub Website - Public Launch',
    target_date: '2026-03-01',
    status: 'on-track',
    projects: ['ACT Hub'],
    dependencies: ['ghl-setup', 'harvest-ghl', 'act-farm-booking'],
    description: 'act.place live with project directory, blog aggregation, governance'
  },
  {
    id: 'supabase-ghl-sync',
    title: 'Supabase ↔ GHL Sync Live',
    target_date: '2026-03-15',
    status: 'on-track',
    projects: ['Empathy Ledger', 'JusticeHub'],
    dependencies: ['el-org-pipeline', 'jh-booking-complete'],
    description: 'Automated sync between Supabase users and GHL contacts via email'
  },
  {
    id: 'phase-1-complete',
    title: 'Phase 1 Complete: All Sites GHL-Ready',
    target_date: '2026-03-31',
    status: 'on-track',
    projects: ['All'],
    dependencies: ['harvest-ghl', 'act-farm-booking', 'el-org-pipeline', 'jh-booking-complete', 'act-hub-launch'],
    description: 'All 6 sites have working forms, CRM integration, email automation'
  },
]

const categoryIcons = {
  ghl: MessageSquare,
  supabase: Database,
  ecommerce: ShoppingCart,
  storytelling: BookOpen,
  community: Users,
  fundraising: DollarSign,
}

const categoryColors = {
  ghl: 'bg-purple-100 text-purple-700',
  supabase: 'bg-green-100 text-green-700',
  ecommerce: 'bg-blue-100 text-blue-700',
  storytelling: 'bg-orange-100 text-orange-700',
  community: 'bg-pink-100 text-pink-700',
  fundraising: 'bg-yellow-100 text-yellow-700',
}

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'testing': 'bg-yellow-100 text-yellow-700',
  'live': 'bg-green-100 text-green-700',
  'mature': 'bg-purple-100 text-purple-700',
}

const statusIcons = {
  'not-started': Circle,
  'in-progress': Clock,
  'testing': Zap,
  'live': CheckCircle2,
  'mature': Target,
}

const milestoneStatusColors = {
  'completed': 'bg-green-100 text-green-700 border-green-300',
  'on-track': 'bg-blue-100 text-blue-700 border-blue-300',
  'at-risk': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'blocked': 'bg-red-100 text-red-700 border-red-300',
}

export default function RoadmapView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [view, setView] = useState<'features' | 'timeline'>('features')

  const filteredFeatures = features.filter(f =>
    (!selectedCategory || f.category === selectedCategory) &&
    (!selectedProject || (
      (selectedProject === 'the_harvest' && f.the_harvest !== 'not-started') ||
      (selectedProject === 'act_farm' && f.act_farm !== 'not-started') ||
      (selectedProject === 'empathy_ledger' && f.empathy_ledger !== 'not-started') ||
      (selectedProject === 'justicehub' && f.justicehub !== 'not-started') ||
      (selectedProject === 'goods_on_country' && f.goods_on_country !== 'not-started') ||
      (selectedProject === 'act_hub' && f.act_hub !== 'not-started')
    ))
  )

  const getCompletionPercentage = () => {
    const total = features.length * 6 // 6 projects per feature
    const completed = features.reduce((acc, f) => {
      let count = 0
      if (f.the_harvest === 'live' || f.the_harvest === 'mature') count++
      if (f.act_farm === 'live' || f.act_farm === 'mature') count++
      if (f.empathy_ledger === 'live' || f.empathy_ledger === 'mature') count++
      if (f.justicehub === 'live' || f.justicehub === 'mature') count++
      if (f.goods_on_country === 'live' || f.goods_on_country === 'mature') count++
      if (f.act_hub === 'live' || f.act_hub === 'mature') count++
      return acc + count
    }, 0)
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Development Roadmap</h1>
        <p className="text-gray-600 mt-2">
          Track features and milestones across all ACT projects
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Overall Progress</h2>
          <span className="text-2xl font-bold text-green-600">{getCompletionPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {features.filter(f =>
            f.the_harvest === 'live' || f.act_farm === 'live' ||
            f.empathy_ledger === 'live' || f.justicehub === 'live' ||
            f.goods_on_country === 'live' || f.act_hub === 'live'
          ).length} features live across ecosystem
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('features')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'features'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Feature Matrix
        </button>
        <button
          onClick={() => setView('timeline')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'timeline'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Timeline & Milestones
        </button>
      </div>

      {view === 'features' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    !selectedCategory ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                {Object.entries(categoryIcons).map(([key, Icon]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                      selectedCategory === key ? categoryColors[key as keyof typeof categoryColors] : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    !selectedProject ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                {['the_harvest', 'act_farm', 'empathy_ledger', 'justicehub', 'goods_on_country', 'act_hub'].map(proj => (
                  <button
                    key={proj}
                    onClick={() => setSelectedProject(proj)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProject === proj ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {proj.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Matrix */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      The Harvest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACT Farm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empathy Ledger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JusticeHub
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Goods on Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACT Hub
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFeatures.map((feature, idx) => {
                    const Icon = categoryIcons[feature.category]
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${categoryColors[feature.category].split(' ')[1]}`} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                              {feature.notes && (
                                <div className="text-xs text-gray-500">{feature.notes}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        {['the_harvest', 'act_farm', 'empathy_ledger', 'justicehub', 'goods_on_country', 'act_hub'].map(proj => {
                          const status = feature[proj as keyof typeof feature] as ProjectStatus
                          const StatusIcon = statusIcons[status]
                          return (
                            <td key={proj} className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.replace('-', ' ')}
                              </span>
                            </td>
                          )
                        })}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feature.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            feature.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {feature.priority}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Timeline View */}
          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div key={milestone.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${milestoneStatusColors[milestone.status]}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${milestoneStatusColors[milestone.status]}`}>
                        {milestone.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Target: {new Date(milestone.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Target className="w-4 h-4" />
                        Projects: {milestone.projects.join(', ')}
                      </div>
                    </div>
                    {milestone.dependencies.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Depends on: {milestone.dependencies.map(d => milestones.find(m => m.id === d)?.title).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Server, Database, Cloud, MessageSquare, DollarSign, Users, FileCode, GitBranch, Zap } from 'lucide-react'

export default function ArchitectureView() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ecosystem Architecture</h1>
        <p className="text-gray-600 mt-2">
          How A Curious Tractor works as the parent organization and central hub
        </p>
      </div>

      {/* ACT as Core Organization */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-8 border-2 border-green-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">A Curious Tractor</h2>
          <p className="text-gray-600">Parent Organization & Central Hub</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Physical Commons */}
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Physical Commons</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Black Cockatoo Valley (150 acres)</li>
              <li>• Working farm & R&D site</li>
              <li>• Accommodation & residencies</li>
              <li>• Event venue & gathering space</li>
              <li>• The Harvest CSA program</li>
            </ul>
          </div>

          {/* Governance Entity */}
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Governance Entity</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Dual structure: Foundation + Trading Co</li>
              <li>• 40% profit → community ownership</li>
              <li>• Mission-locked purpose</li>
              <li>• Shared governance experiments</li>
              <li>• Design for obsolescence</li>
            </ul>
          </div>

          {/* Central Hub (act.place) */}
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Central Hub Website</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• act.place (in development)</li>
              <li>• Front door to ecosystem</li>
              <li>• Project directory</li>
              <li>• Blog aggregation</li>
              <li>• Partnership hub</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Infrastructure Stack */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Development Infrastructure</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dev Orchestrator */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Dev Orchestrator</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Multi-project development server</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Runs 5 projects simultaneously</li>
              <li>• Auto-restart on crash</li>
              <li>• Shared environment injection</li>
              <li>• Health monitoring</li>
            </ul>
          </div>

          {/* Admin Wiki */}
          <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <FileCode className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Admin Wiki</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">You are here! 👋</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• System health dashboard</li>
              <li>• Ecosystem map</li>
              <li>• Pipeline overview</li>
              <li>• Documentation library</li>
            </ul>
          </div>

          {/* NAS Services */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">NAS Services</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Shared infrastructure (192.168.0.34)</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Redis (6379): Caching</li>
              <li>• ChromaDB (8000): Vector DB</li>
              <li>• Portainer (9000): Docker mgmt</li>
            </ul>
          </div>

          {/* Environment Management */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Environment Vault</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Centralized secrets management</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• .env-vault/ (gitignored)</li>
              <li>• Sync scripts</li>
              <li>• Validation tools</li>
              <li>• Encrypted backups</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Project Tiers */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Active Seeds (Projects)</h2>

        {/* Tier 1: Production Websites */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Tier 1</span>
            <h3 className="font-semibold text-gray-900">Production Websites (GHL-Only)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">The Harvest</h4>
              <p className="text-sm text-gray-600 mb-3">Community hub + CSA program</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">GHL only</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">3004 (dev)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">theharvest.org.au</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Deployed</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">ACT Farm</h4>
              <p className="text-sm text-gray-600 mb-3">Tourism + residency bookings</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">GHL only</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">3001 (dev)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">actfarm.org.au</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">In Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Full Platforms */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Tier 2</span>
            <h3 className="font-semibold text-gray-900">Full Platforms (Supabase + GHL)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Empathy Ledger</h4>
              <p className="text-sm text-gray-600 mb-3">Storytelling platform</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">Supabase + GHL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">3003 (dev)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">empathyledger.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Features:</span>
                  <span className="font-medium">226 storytellers, AI analysis</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">JusticeHub</h4>
              <p className="text-sm text-gray-600 mb-3">Service directory + campaigns</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">Supabase + GHL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">3002 (dev)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">justicehub.org.au</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Features:</span>
                  <span className="font-medium">Service directory, CONTAINED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: Admin Tools */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Tier 3</span>
            <h3 className="font-semibold text-gray-900">Admin Tools & Core Hub</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-gray-900 mb-2">ACT Hub</h4>
              <p className="text-sm text-gray-600 mb-3">Main website (act.place)</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">Shared Supabase + GHL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">3000 (not in orchestrator yet)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">act.place</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">In Development</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-gray-900 mb-2">Admin Wiki</h4>
              <p className="text-sm text-gray-600 mb-3">Backend dashboard (this site)</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">None (reads from NAS)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">4000 (dev)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">admin.act.place (planned)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Running</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Services */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Shared Services Across Ecosystem</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {/* CRM */}
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">CRM (GoHighLevel)</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong>Master Account:</strong> ACT Core</li>
              <li><strong>Sub-Accounts:</strong></li>
              <li className="text-xs pl-4">• The Harvest Community Hub</li>
              <li className="text-xs pl-4">• ACT Farm Tourism</li>
              <li className="text-xs pl-4">• Empathy Ledger Platform</li>
              <li className="text-xs pl-4">• JusticeHub Service Finder</li>
              <li className="mt-2"><strong>Total Pipelines:</strong> 15</li>
            </ul>
          </div>

          {/* Email */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Email (Resend)</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong>Shared API Key:</strong> All projects</li>
              <li><strong>Transactional:</strong> Resend</li>
              <li><strong>Marketing:</strong> GHL</li>
              <li className="text-xs mt-2">Different FROM addresses:</li>
              <li className="text-xs pl-4">• hello@theharvest.org.au</li>
              <li className="text-xs pl-4">• bookings@actfarm.org.au</li>
              <li className="text-xs pl-4">• stories@empathyledger.com</li>
              <li className="text-xs pl-4">• support@justicehub.org.au</li>
            </ul>
          </div>

          {/* Payments */}
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Payments (Stripe)</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong>Empathy Ledger:</strong> Subscriptions</li>
              <li><strong>ACT Farm:</strong> Residency deposits</li>
              <li><strong>The Harvest:</strong> CSA subscriptions</li>
              <li className="mt-2 text-xs">Or use GHL payment processing</li>
              <li className="mt-2"><strong>Revenue Split:</strong></li>
              <li className="text-xs pl-4">• 40% → Community ownership</li>
              <li className="text-xs pl-4">• 30% → Project reinvestment</li>
              <li className="text-xs pl-4">• 30% → ACT Core</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Flow */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Data Flow & Integration</h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Project Registry Aggregation</h3>
            <p className="text-sm text-gray-600 mb-3">ACT Hub fetches content from all projects via registry APIs</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Empathy Ledger</div>
                <div className="text-gray-600">/api/registry</div>
                <div className="text-gray-500">Stories, storytellers</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">JusticeHub</div>
                <div className="text-gray-600">/api/registry</div>
                <div className="text-gray-500">Services, programs</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">The Harvest</div>
                <div className="text-gray-600">/api/registry</div>
                <div className="text-gray-500">Events, CSA</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Goods on Country</div>
                <div className="text-gray-600">/registry.json</div>
                <div className="text-gray-500">Products</div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Supabase ↔ GHL Sync (Planned)</h3>
            <p className="text-sm text-gray-600 mb-3">Automated synchronization for Tier 2 platforms</p>
            <div className="text-sm space-y-1">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Reconciliation Key:</span>
                <span className="font-medium">Email address</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Sync Trigger:</span>
                <span className="font-medium">User signup, profile update</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Cache Layer:</span>
                <span className="font-medium">Redis (10-min TTL)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600">Conflict Resolution:</span>
                <span className="font-medium">Supabase = source of truth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Related Documentation</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="/docs/unified-standards" className="text-blue-600 hover:underline">→ Unified Project Standards</a>
          <a href="/docs/env-management" className="text-blue-600 hover:underline">→ Environment Management</a>
          <a href="/docs/ghl-strategy" className="text-blue-600 hover:underline">→ GHL Pipeline Strategy</a>
          <a href="/docs/master-plan" className="text-blue-600 hover:underline">→ ACT Master Plan</a>
        </div>
      </div>
    </div>
  )
}

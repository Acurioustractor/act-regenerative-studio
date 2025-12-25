import {
  LayoutDashboard,
  Network,
  GitBranch,
  DollarSign,
  BookOpen,
  Settings,
  Users,
  Mail,
  Map,
  CalendarDays
} from 'lucide-react'

interface SidebarProps {
  currentView: string
  setCurrentView: (view: any) => void
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'architecture', label: 'Architecture', icon: Map },
    { id: 'roadmap', label: 'Roadmap', icon: CalendarDays },
    { id: 'ecosystem', label: 'Ecosystem Map', icon: Network },
    { id: 'pipelines', label: 'Pipelines', icon: GitBranch },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'docs', label: 'Documentation', icon: BookOpen },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-act-green-700">ACT Ecosystem</h1>
        <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors text-left
                ${isActive
                  ? 'bg-act-green-100 text-act-green-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="text-xs text-gray-500">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>All systems operational</span>
          </div>
          <div className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
        </div>
      </div>
    </aside>
  )
}

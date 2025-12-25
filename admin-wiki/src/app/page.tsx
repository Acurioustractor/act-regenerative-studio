'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import EcosystemMap from '@/components/EcosystemMap'
import PipelineView from '@/components/PipelineView'
import RevenueView from '@/components/RevenueView'
import DocumentationView from '@/components/DocumentationView'
import ArchitectureView from '@/components/ArchitectureView'
import RoadmapView from '@/components/RoadmapView'

type View = 'dashboard' | 'ecosystem' | 'architecture' | 'roadmap' | 'pipelines' | 'revenue' | 'docs'

export default function AdminWiki() {
  const [currentView, setCurrentView] = useState<View>('dashboard')

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'ecosystem' && <EcosystemMap />}
        {currentView === 'architecture' && <ArchitectureView />}
        {currentView === 'roadmap' && <RoadmapView />}
        {currentView === 'pipelines' && <PipelineView />}
        {currentView === 'revenue' && <RevenueView />}
        {currentView === 'docs' && <DocumentationView />}
      </main>
    </div>
  )
}

import React from 'react'

/**
 * TrendAura Dashboard Viewport Content Toggle Tabs
 */
export default function ResultTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'script', label: '📄 السيناريو والسكريبت' },
    { id: 'analytics', label: '🔬 تحليلات ومؤشرات viral engine' }
  ]

  return (
    <div className="w-full flex items-center gap-2 bg-slate-950/40 border border-slate-800/80 p-1 rounded-2xl select-none text-right dir-rtl font-sans">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black transition-all duration-200 ${activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
              : 'text-slate-500 hover:text-slate-300 bg-transparent'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
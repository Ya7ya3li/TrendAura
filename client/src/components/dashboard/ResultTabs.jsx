import React from 'react'

/**
 * TrendAura Dashboard Viewport Content Toggle Tabs
 */
export default function ResultTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'script', label: '📄 السيناريو والسكريبت' },
    { id: 'analytics', label: '🔬 تحليلات ومؤشرات الفايرال' }
  ]

  return (
    <div className="w-full flex items-center gap-2 bg-slate-100/70 border p-1 rounded-2xl select-none text-right dir-rtl font-sans">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black transition-all duration-200 active-touch ${
            activeTab === tab.id
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/40'
              : 'text-slate-400 hover:text-slate-600 bg-transparent'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
import React from 'react'

/**
 * TrendAura Mobile Floating View Segment Switcher - Pure SVG Edition
 */
export default function SwipeTabs({ activeTab, onTabChange }) {
  // صياغة بنية التبويبات واستبدال الإيموجيز بأيقونات SVG برمجية نظيفة ومحكمة
  const tabs = [
    { 
      id: 'script', 
      label: 'النص والسيناريو',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'metrics', 
      label: 'المؤشرات والتحليل',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      )
    }
  ]

  return (
    <div className="w-full flex items-center bg-slate-950/40 border border-slate-800/80 p-1 rounded-xl select-none text-right dir-rtl font-sans md:hidden mb-4">
      {tabs.map((tab) => {
        const isCurrent = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-black transition-all duration-200 bg-transparent border-none outline-none ${
              isCurrent
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="shrink-0">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
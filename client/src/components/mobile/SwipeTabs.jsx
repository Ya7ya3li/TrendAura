import React from 'react'

/**
 * TrendAura Mobile Floating View Segment Switcher
 */
export default function SwipeTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'script', label: '📄 النص والسيناريو' },
    { id: 'metrics', label: '📊 المؤشرات والتحليل' }
  ]

  return (
    <div className="w-full flex items-center bg-slate-100/80 border p-0.5 rounded-xl select-none text-right dir-rtl font-sans md:hidden mb-4">
      {tabs.map((tab) => {
        const isCurrent = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 text-center py-2 rounded-lg text-[11px] font-black transition-all duration-150 active-touch ${
              isCurrent
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/20 font-black'
                : 'text-slate-400 font-bold bg-transparent'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
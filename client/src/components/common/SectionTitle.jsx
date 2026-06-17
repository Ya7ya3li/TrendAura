import React from 'react'

/**
 * TrendAura Section Heading Matrix - Dual Theme Edition
 */
export default function SectionTitle({ title, subtitle, badge }) {
  return (
    <div className="flex flex-col text-right dir-rtl select-none mb-6 transition-colors duration-300">
      <div className="flex items-center gap-2.5">
        <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white md:text-lg transition-colors">
          {title}
        </h2>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-wider font-sans transition-colors">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed transition-colors">
          {subtitle}
        </p>
      )}
    </div>
  )
}
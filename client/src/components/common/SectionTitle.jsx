import React from 'react'

/**
 * TrendAura Section Heading Matrix
 * Standardizes layout sub-headers with optional trailing badge elements.
 */
export default function SectionTitle({ title, subtitle, badge }) {
  return (
    <div className="flex flex-col text-right dir-rtl select-none mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-black tracking-tight text-slate-900 md:text-xl">
          {title}
        </h2>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-100/50 uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[11px] font-bold text-slate-400 mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
import React from 'react'

/**
 * TrendAura Section Heading Matrix
 * Standardizes layout sub-headers with optional trailing badge elements.
 */
export default function SectionTitle({ title, subtitle, badge }) {
  return (
    <div className="flex flex-col text-right dir-rtl select-none mb-6">
      <div className="flex items-center gap-2.5">
        <h2 className="text-base font-black tracking-tight text-white md:text-lg">
          {title}
        </h2>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black bg-blue-500/10 text-cyan-400 border border-blue-500/20 uppercase tracking-wider font-sans">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[11px] font-bold text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
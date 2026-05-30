import React from 'react'

/**
 * TrendAura Dashboard Numeric Statistical Metric Micro-Card
 */
export default function TrendMetricsCard({ title, value, change, isPositive = true, icon = '📈' }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-right dir-rtl select-none flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-black text-slate-400 tracking-tight truncate">{title}</span>
        <h3 className="text-base font-black text-slate-800 mt-1 font-sans tracking-wide">{value}</h3>
        <span className={`text-[9px] font-black mt-1 inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '▲' : '▼'} {change}
        </span>
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-base flex items-center justify-center shrink-0 shadow-2xs">
        {icon}
      </div>
    </div>
  )
}
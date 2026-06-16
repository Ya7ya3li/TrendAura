import React from 'react'

/**
 * TrendAura Premium Luminous Card - Dual Theme Edition
 * Houses interactive elements with smooth translation scales and micro light reflections.
 */
export default function GlowCard({ children, className = '', onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-3xl p-5 md:p-6 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-0.5 hover:border-blue-500/40 dark:hover:border-blue-500/20 transition-all duration-300 text-right dir-rtl select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
import React from 'react'

/**
 * TrendAura Premium Luminous Card
 * Houses interactive elements with smooth translation scales and micro light reflections.
 */
export default function GlowCard({ children, className = '', onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-5 md:p-6 shadow-md hover:shadow-2xl hover:-translate-y-0.5 hover:border-blue-500/20 transition-all duration-300 text-right dir-rtl select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
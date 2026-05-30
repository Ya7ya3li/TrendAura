import React from 'react'

/**
 * TrendAura Micro Spinning Loop
 * Centralizes processing indicators with soft pulses matching image_43.png design language.
 */
export default function Loader({ size = 'md', label = 'جاري هندسة الأفكار...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center select-none animate-fade-in dir-rtl">
      <div className="relative flex items-center justify-center mb-4">
        <div className={`${sizeClasses[size]} border-slate-100 border-t-blue-600 rounded-full animate-spin`} />
        <div className="absolute text-[11px] font-black text-blue-600/80 animate-pulse">✦</div>
      </div>
      {label && <p className="text-[11px] font-black text-slate-400 tracking-wide">{label}</p>}
    </div>
  )
}
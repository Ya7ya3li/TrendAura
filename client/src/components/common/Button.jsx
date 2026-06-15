import React from 'react'

/**
 * TrendAura Reusable Premium Button - Pure SVG Edition
 * Multi-variant button core with active micro-scaling and safe padding properties.
 */
export default function Button({ children, type = 'button', variant = 'primary', size = 'md', loading = false, disabled = false, onClick, className = '' }) {
  const baseStyle = "inline-flex items-center justify-center gap-2 rounded-2xl text-xs font-black transition-all duration-200 select-none transform active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 border-none",
    secondary: "bg-slate-900 border border-slate-800 hover:bg-slate-900/80 text-slate-300",
    purple: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-purple-900/30 border-none",
    danger: "bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-500/30"
  }

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-5 py-3",
    lg: "px-7 py-4 text-sm"
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          {/* محاكاة التحميل بأيقونة SVG دوارة فاخرة */}
          <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>جاري التوليد...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
import React from 'react'

/**
 * TrendAura Reusable Premium Button
 * Multi-variant button core with active micro-scaling and safe padding properties.
 */
export default function Button({ children, type = 'button', variant = 'primary', size = 'md', loading = false, disabled = false, onClick, className = '' }) {
  const baseStyle = "inline-flex items-center justify-center gap-2 rounded-2xl text-xs font-black transition-all duration-200 select-none transform active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100/70",
    secondary: "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60",
    purple: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-100/50",
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50"
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
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          <span>جاري المعالجة...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
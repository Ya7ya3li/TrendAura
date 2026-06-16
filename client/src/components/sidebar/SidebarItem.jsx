import React from 'react'
import { NavLink } from 'react-router-dom'

/**
 * TrendAura Atomic Sidebar Link Component - Dual Theme Optimized
 */
export default function SidebarItem({ to, label, icon, external, onClick }) {
  const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black transition-all duration-300 select-none transform active:scale-[0.97]"

  // 🌐 معالجة الروابط الخارجية الآمنة
  if (external) {
    return (
      <a 
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white border border-transparent transition-colors`}
        onClick={onClick}
      >
        <span className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-colors">{icon}</span>
        <span className="flex-1 text-right">{label}</span>
        <svg className="w-3 h-3 opacity-50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    )
  }

  // 🔄 معالجة الروابط الداخلية
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        isActive 
          ? `${baseClass} bg-blue-600 text-white shadow-lg shadow-blue-500/20`
          : `${baseClass} text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200 transition-colors`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`w-4 h-4 shrink-0 transition-all ${isActive ? 'scale-110 text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            {icon}
          </span>
          <span className="flex-1 text-right truncate">{label}</span>
          {isActive && (
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
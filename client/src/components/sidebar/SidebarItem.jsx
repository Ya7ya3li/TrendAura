import React from 'react'
import { NavLink } from 'react-router-dom'

/**
 * TrendAura Atomic Sidebar Link Component - V2 Optimized
 * تصميم مهندسين محترفين مع تفعيل نظام الـ Active-State الذكي
 */
export default function SidebarItem({ to, label, icon, external, onClick }) {
  // قاعدة التصميم (Base Design Token)
  const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold transition-all duration-300 select-none transform active:scale-[0.97]"

  // 🌐 معالجة الروابط الخارجية (External Links)
  if (external) {
    return (
      <a 
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} text-slate-500 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent`}
        onClick={onClick}
      >
        <span className="text-base">{icon}</span>
        <span className="flex-1 text-right">{label}</span>
        <span className="text-[9px] opacity-40">↗</span>
      </a>
    )
  }

  // 🔄 معالجة الروابط الداخلية (Internal Routing) - الأداء الصاروخي
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        isActive 
          ? `${baseClass} bg-blue-600 text-white font-black shadow-lg shadow-blue-500/20`
          : `${baseClass} text-slate-500 hover:bg-slate-100/50 hover:text-slate-800`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`text-base transition-transform ${isActive ? 'scale-110' : 'opacity-70'}`}>
            {icon}
          </span>
          <span className="flex-1 text-right truncate">{label}</span>
          {isActive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
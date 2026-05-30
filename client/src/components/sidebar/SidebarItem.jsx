import React from 'react'
import { NavLink } from 'react-router-dom'

/**
 * TrendAura Atomic Sidebar Link Component
 * Handles active routing styles natively with premium light highlight tokens.
 */
export default function SidebarItem({ to, label, icon, external, onClick }) {
  const baseClass = "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 select-none transform active:scale-[0.98]"
  
  // 🌐 معالجة روابط الدعم الفني الخارجية أو الروابط المفتوحة بكتل منفصلة
  if (external) {
    return (
      <a 
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100`}
        onClick={onClick}
      >
        <span className="text-base filter drop-shadow-xs">{icon}</span>
        <span className="flex-1 text-right">{label}</span>
        <span className="text-[10px] opacity-40">↗️</span>
      </a>
    )
  }

  // 🔄 معالجة الروابط الداخلية للمنصة مع حقن الحالات النشطة (Active Route Highlight)
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        isActive 
          ? `${baseClass} bg-blue-50 text-blue-600 font-black border border-blue-100/50 shadow-xs shadow-blue-100/10`
          : `${baseClass} text-slate-500 hover:bg-slate-50/80 hover:text-slate-900 border border-transparent hover:border-slate-100/40`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`text-base transition-transform ${isActive ? 'scale-110 filter drop-shadow-xs' : 'opacity-80'}`}>
            {icon}
          </span>
          <span className="flex-1 text-right">{label}</span>
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
        </>
      )}
    </NavLink>
  )
}
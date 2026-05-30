import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SIDEBAR_ITEMS } from '../../constants/sidebarItems'

/**
 * TrendAura Mobile Bottom Navigation Bar Overlay
 * Sticky docked menu engineered for high-fidelity ergonomic touch-targets.
 */
export default function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  // تصفية وحصر العناصر الأربعة الأولى لعرضها بداخل شريط الجوال المحدود
  const mobileTabs = SIDEBAR_ITEMS.filter(item => !item.external).slice(0, 4)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-4 py-2 pb-safe shadow-[0_-8px_30px_rgba(148,163,184,0.08)] z-40 flex items-center justify-around dir-rtl text-center select-none md:hidden">
      {mobileTabs.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center py-1 flex-1 active-touch transition-all duration-200 ${
              isActive 
                ? 'text-blue-600 scale-105' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {/* الأيقونة الرمزية العلوية */}
            <span className={`text-lg mb-1 filter transition-transform ${isActive ? 'drop-shadow-xs' : 'opacity-70'}`}>
              {tab.icon}
            </span>
            {/* التسمية النصية المجهرية الفخمة */}
            <span className={`text-[9px] font-black tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
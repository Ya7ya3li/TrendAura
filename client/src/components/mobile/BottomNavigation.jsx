import React from 'react'

/**
 * TrendAura Mobile Bottom Navigation - Disabled by Architectural Request
 * Replaced entirely by the global top hamburger menu drawer.
 */
export default function BottomNavigation() {
  return null
}

import { useNavigate, useLocation } from 'react-router-dom'
import { SIDEBAR_ITEMS } from '../../constants/sidebarItems.js'

/**
 * TrendAura Mobile-First Responsive Bottom Navigation Bar
 */
export default function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  // فحص واستخراج الأقسام الخمسة الأساسية للتنقل الداخلي الآمن للجوال
  const mobileTabs = SIDEBAR_ITEMS.filter(item => !item.external).slice(0, 5)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-40 flex items-center justify-around dir-rtl text-center select-none md:hidden h-16">
      {mobileTabs.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 outline-none border-none bg-transparent ${
              isActive 
                ? 'text-blue-500 scale-105' 
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            {/* عرض أيقونة الـ SVG النظيفة والمستقرة القادمة من الثوابت المركزية */}
            <span className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'text-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.4)]' : 'text-slate-500'}`}>
              {tab.icon}
            </span>
            
            {/* التبويب النصي المتوافق مليمترولياً مع الاسم المعتمد */}
            <span className={`text-[9px] tracking-tight transition-colors ${isActive ? 'font-black text-white' : 'font-bold text-slate-500'}`}>
              {tab.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
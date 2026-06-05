import React from 'react'
import { getSidebarItems } from '../../constants/sidebarItems.js'
import SidebarItem from './SidebarItem.jsx'
import UserProfileCard from './UserProfileCard.jsx'
import useSubscription from '../../hooks/useSubscription.js'

export default function DesktopSidebar() {
  const { plan } = useSubscription()
  const isPremium = plan === 'pro' || plan === 'viral_engine'
  
  // استدعاء مصفوفة الروابط وتمرير ليفل الباقة ديناميكياً لتأمين المسارات
  const menuItems = getSidebarItems(isPremium)

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 h-screen bg-slate-950 border-l border-slate-900 fixed top-0 right-0 z-40 p-5 text-right dir-rtl select-none">
      
      <div>
        {/* هيدر وشعار لوحة التحكم لـ TrendAura الفاخر - مع حماية الـ SVG المعززة */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-900">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white">TrendAura</span>
            <span className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase font-sans">SaaS Trend Engine</span>
          </div>
        </div>

        {/* 🏆 تصحيح الثغرة: ربط وتوجيه خصائص الـ Mapping بالملي لتتطابق مع معايير الـ Static Object Constants */}
        <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-240px)] pr-0.5 scrollbar-none">
          {menuItems.map((item, idx) => (
            <SidebarItem 
              key={idx}
              to={item.path}     // تم التصحيح من item.to إلى item.path القياسي
              label={item.name}  // تم التصحيح من item.label إلى item.name القياسي
              icon={item.icon}
              external={item.external}
            />
          ))}
        </nav>
      </div>

      {/* الفوتر الحاضن لكرت البروفايل الشخصي المعزول */}
      <div className="w-full pt-4 border-t border-slate-900">
        <UserProfileCard />
      </div>

    </aside>
  )
}
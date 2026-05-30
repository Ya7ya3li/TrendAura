import React from 'react'
import { getSidebarItems } from '../../constants/sidebarItems'
import SidebarItem from './SidebarItem'
import UserProfileCard from './UserProfileCard'
import useSubscription from '../../hooks/useSubscription'

/**
 * TrendAura Fixed Desktop Navigation Core Layout
 * Rendered on large screens with smooth floating blur backgrounds.
 */
export default function DesktopSidebar() {
  const { plan } = useSubscription()
  const isPremium = plan === 'pro' || plan === 'viral_engine' || plan === 'viral engine' || plan === 'pro_viral'
  
  // استدعاء مصفوفة الروابط وتمرير ليفل الباقة ديناميكياً لتأمين المسارات
  const menuItems = getSidebarItems(isPremium)

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 h-screen bg-white border-l border-slate-100 fixed top-0 right-0 z-40 p-5 text-right dir-rtl select-none">
      
      <div>
        {/* هيدر وشعار لوحة التحكم لـ TrendAura الفاخر */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-blue-100">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-slate-900">TrendAura</span>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5">SaaS Trend Engine</span>
          </div>
        </div>

        {/* قائمة روابط التنقل والملاحة المصفاة بالكامل */}
        <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-240px)] pr-0.5">
          {menuItems.map((item, idx) => (
            <SidebarItem 
              key={idx}
              to={item.to}
              label={item.label}
              icon={item.icon}
              external={item.external}
            />
          ))}
        </nav>
      </div>

      {/* الفوتر الحاضن لكرت البروفايل الشخصي المعزول */}
      <div className="w-full pt-4 border-t border-slate-50">
        <UserProfileCard />
      </div>

    </aside>
  )
}
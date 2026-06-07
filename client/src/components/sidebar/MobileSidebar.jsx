import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext.jsx'
import { getSidebarItems } from '../../constants/sidebarItems.js'
import SidebarItem from './SidebarItem.jsx'
import UserProfileCard from './UserProfileCard.jsx'
import useSubscription from '../../hooks/useSubscription.js'

/**
 * TrendAura Mobile Navigation Sidebar
 * شريحة جانبية منزلقة مصممة للجوال واللمس 100%
 */
export default function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext)
  const { plan } = useSubscription()
  const isPremium = plan === 'pro' || plan === 'viral_engine'
  const menuItems = getSidebarItems(isPremium)

  if (!sidebarOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 flex dir-rtl text-right select-none">
      
      {/* الخلفية المضببة التفاعلية لغلق القائمة فور الضغط خارج الحيز */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />

      {/* انزلاق القائمة من الجهة اليمنى المتوافقة مع اللغة العربية */}
      <div className="relative w-64 max-w-sm h-full bg-slate-950 border-l border-slate-900 shadow-2xl p-5 flex flex-col justify-between z-10 animate-slide-right mr-0 transition-all duration-300">
        
        <div>
          {/* هيدر اللوجو للبراند مع زر الإغلاق الحركي السريع */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-black text-white">TrendAura Mobile</span>
            </div>
            
            {/* زر غلق السايدبار بالجوال */}
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* روابط الملاحة المحدثة بناءً على حالة باقة العميل */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item, idx) => (
              <SidebarItem 
                key={idx}
                to={item.path}
                label={item.name}
                icon={item.icon}
                external={item.external}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>
        </div>

        {/* الكرت السفلي للبروفايل مدمج بشكل فخم */}
        <div className="pt-4 border-t border-slate-900">
          <UserProfileCard />
        </div>

      </div>
    </div>
  )
}
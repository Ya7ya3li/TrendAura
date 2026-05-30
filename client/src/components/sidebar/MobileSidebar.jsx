import React from 'react'
import { getSidebarItems } from '../../constants/sidebarItems'
import SidebarItem from './SidebarItem'
import UserProfileCard from './UserProfileCard'
import useSubscription from '../../hooks/useSubscription'

/**
 * TrendAura Sliding Overlay Mobile Navigation Drawer
 * Seamlessly interfaces with responsive state controllers.
 */
export default function MobileSidebar({ isOpen, onClose }) {
  const { plan } = useSubscription()
  const isPremium = plan === 'pro' || plan === 'viral_engine' || plan === 'viral engine' || plan === 'pro_viral'
  
  const menuItems = getSidebarItems(isPremium)

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 flex dir-rtl text-right select-none select-none">
      
      {/* الخلفية المضببة التفاعلية لغلق القائمة فور الضغط عليها */}
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* حاوية القائمة الجانبية المنزلقة للجوال (Slide Over Responsive Drawer) */}
      <div className="relative w-64 max-w-sm h-full bg-white border-l border-slate-100 shadow-2xl p-5 flex flex-col justify-between z-10 animate-slide-right">
        
        <div>
          {/* هيدر لوجو الجوال مع زر إغلاق صريح ومباشر */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base font-black shadow-md shadow-blue-50">✦</div>
              <span className="text-sm font-black text-slate-900">TrendAura Mobile</span>
            </div>
            
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-50 border text-xs font-bold text-slate-500 flex items-center justify-center active:bg-slate-100">
              ✕
            </button>
          </div>

          {/* روابط الملاحة للجوال مع غلق السايدبار تلقائياً فور توجيه المسار */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item, idx) => (
              <SidebarItem 
                key={idx}
                to={item.to}
                label={item.label}
                icon={item.icon}
                external={item.external}
                onClick={onClose} // غلق تلقائي آمن
              />
            ))}
          </nav>
        </div>

        {/* الكرت السفلي للبروفايل بداخل الجوال */}
        <div className="pt-4 border-t border-slate-50">
          <UserProfileCard />
        </div>

      </div>

    </div>
  )
}
import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import NotificationBell from './NotificationBell'

/**
 * TrendAura Mobile Contextual Top Header Strip
 * Extracted explicitly to drive touch drawer scopes on low-width devices.
 */
export default function MobileNavbar() {
  const { setSidebarOpen } = useContext(AppContext)

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between dir-rtl text-right select-none md:hidden fixed top-0 left-0 right-0 z-40 shadow-2xs">
      
      {/* القسم الأيمن: زر فتح قائمة التصفح الـ Drawer وهامبرغر الجوال */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="w-9 h-9 bg-slate-50 border border-slate-200/60 text-slate-500 rounded-xl flex items-center justify-center text-xs font-black active-touch"
      >
        ☰
      </button>

      {/* القسم الأوسط: شعار وأيقونة المشروع المعتمدة بهيكلك المكتمل */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
          ▲
        </div>
        <span className="text-xs font-black text-slate-900 font-sans tracking-tight">
          Trend<span className="text-blue-600">Aura</span>
        </span>
      </div>

      {/* القسم الأيسر: أيقونة وجرس استقبال الإشعارات المشترك */}
      <NotificationBell />

    </div>
  )
}
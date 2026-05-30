import React from 'react'
import MobileNavbar from './MobileNavbar'
import NotificationBell from './NotificationBell'

/**
 * TrendAura Master Global Responsive Navbar Orchestrator
 * Integrates horizontal action anchors across variable layouts.
 */
export default function Navbar({ title = 'لوحة التحكم الملوكية' }) {
  return (
    <>
      {/* 1. استدعاء هيدر الجوال المستقل المثبت بأعلى الشاشات الذكية */}
      <MobileNavbar />

      {/* 2. شريط الأدوات العلوي الأفقي الحصري للشاشات الكبيرة والمكتبية (إذا تم تفعيله اختيارياً بالهياكل) */}
      <div className="hidden md:flex w-full items-center justify-between py-4 px-6 bg-white border-b border-slate-100 mb-6 rounded-2xl shadow-2xs select-none dir-rtl text-right">
        <div className="flex flex-col">
          <h2 className="text-sm font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100/50 px-2.5 py-1 rounded-xl font-sans tracking-wide">
            STABLE PRODUCTION
          </span>
          <NotificationBell />
        </div>
      </div>
    </>
  )
}
import React, { useContext } from 'react'
import MobileNavbar from './MobileNavbar.jsx'
import NotificationBell from './NotificationBell.jsx'
import { ThemeContext } from '../../context/ThemeContext.jsx'

export default function Navbar({ title = 'لوحة التحكم الملوكية' }) {
  const { theme } = useContext(ThemeContext)

  return (
    <>
      {/* 1. استدعاء هيدر الجوال المستقل المثبت بأعلى الشاشات */}
      <MobileNavbar />

      {/* 2. شريط الأدوات العلوي الأفقي الحصري للشاشات الكبيرة والمكتبية متفاعل الإضاءة والمظهر */}
      <div className={`hidden md:flex w-full items-center justify-between py-4 px-6 border mb-6 rounded-2xl shadow-xs select-none dir-rtl text-right transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/20 border-slate-800/60 text-white' 
          : 'bg-white border-slate-100 text-slate-900'
      }`}>
        <div className="flex flex-col">
          <h2 className="text-sm font-black tracking-tight">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black bg-blue-500/10 text-cyan-400 border border-blue-500/20 px-2.5 py-1 rounded-xl font-sans tracking-wide">
            STABLE PRODUCTION
          </span>
          <NotificationBell />
        </div>
      </div>
    </>
  )
}
import React from 'react'
import MobileNavbar from './MobileNavbar.jsx'
import NotificationBell from './NotificationBell.jsx'

export default function Navbar({ title = 'لوحة التحكم ' }) {
  return (
    <>
      <MobileNavbar />

      <div className="hidden md:flex w-full items-center justify-between py-4 px-6 border mb-6 rounded-2xl shadow-sm dark:shadow-none select-none dir-rtl text-right transition-colors duration-300 bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white">
        <div className="flex flex-col">
          <h2 className="text-sm font-black tracking-tight">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-xl font-sans tracking-wide transition-colors">
            STABLE PRODUCTION
          </span>
          <NotificationBell />
        </div>
      </div>
    </>
  )
}
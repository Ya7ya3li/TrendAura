import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext.jsx'
import NotificationBell from './NotificationBell.jsx'

export default function MobileNavbar() {
  const { setSidebarOpen } = useContext(AppContext)

  return (
    <div className="w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 px-4 py-3 flex items-center justify-between dir-rtl text-right select-none md:hidden fixed top-0 left-0 right-0 z-40 shadow-sm dark:shadow-xl transition-colors duration-300">
      
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="w-9 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center active:scale-95 transition-all shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-xs font-black text-slate-900 dark:text-white font-sans tracking-tight transition-colors">
          Trend<span className="text-blue-600 dark:text-blue-500">Aura</span>
        </span>
      </div>

      <NotificationBell />
    </div>
  )
}
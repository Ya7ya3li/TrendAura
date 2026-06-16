import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { ROUTES } from '../constants/routes.js'
import Sidebar from '../components/sidebar/Sidebar.jsx'
import Navbar from '../components/navbar/Navbar.jsx'
import MobileSidebar from '../components/sidebar/MobileSidebar.jsx'

export default function DashboardLayout() {
  const { user, loading } = useContext(AuthContext)

  if (!loading && !user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased relative overflow-hidden transition-colors duration-300">
      
      {/* هالات النيون الخلفية الجمالية */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none select-none z-0" />

      {/* 🗂️ الشريط الجانبي المكتبي */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-l border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 relative z-20 transition-colors duration-300">
        <Sidebar />
      </aside>

      {/* 📱 السايدبار المنزلق الحركي للجوال */}
      <MobileSidebar />

      {/* 🖥️ المحور والمنطقة الجدارية المركزية */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        
        {/* ترويسة التصفح العلوية (Navbar) */}
        <header className="w-full h-16 border-b border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-950/40 backdrop-blur-md flex items-center px-4 md:px-8 z-20 transition-colors duration-300">
          <Navbar />
        </header>

        {/* حيز عرض محتويات لوحة التحكم */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8 pb-12 md:pb-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-900 dir-rtl text-right">
          <div className="max-w-6xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'
import Sidebar from '../components/sidebar/Sidebar'
import BottomNavigation from '../components/mobile/BottomNavigation'

/**
 * TrendAura Dashboard Layout - V2 Enterprise Edition
 * هيكل تنظيمي فائق السرعة، يضمن استمرار التنقل دون أي تعليق
 */
export default function DashboardLayout() {
  const { user, loading } = useContext(AuthContext)
  const { globalLoading } = useContext(AppContext)
  const { theme } = useContext(ThemeContext)

  // حارس البوابة (Route Guard) - سريع وغير حاصر للمستخدم
  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row dir-rtl text-right font-sans relative antialiased transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#05020c] text-slate-100' : 'bg-slate-50/80 text-slate-900'
    }`}>
      
      {/* القائمة الجانبية */}
      <Sidebar />

      {/* منطقة المحتوى */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:pl-64 relative">
        
        {/* مؤشر تحميل نيوني (Ultra-thin loading bar) */}
        {(globalLoading || loading) && (
          <div className="absolute top-0 left-0 right-0 h-[2px] z-50 overflow-hidden">
            <div className={`h-full w-full animate-pulse ${
              theme === 'dark' ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-pink-500'
            }`} />
          </div>
        )}

        {/* المحتوى الرئيسي - تم استخدام flex-grow لضمان توازن المساحة */}
        <main className="flex-grow p-4 md:p-8 pb-28 md:pb-8 relative z-10 transition-opacity duration-300">
          <Outlet />
        </main>
        
        {/* شريط التنقل السفلي للجوال */}
        <nav className={`md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-2xl border-t transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#0d071d]/90 border-[#1f1438]' : 'bg-white/90 border-slate-200'
        }`}>
          <BottomNavigation />
        </nav>
      </div>
    </div>
  )
}
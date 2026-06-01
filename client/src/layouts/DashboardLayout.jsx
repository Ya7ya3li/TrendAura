import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'
import Sidebar from '../components/sidebar/Sidebar'
import BottomNavigation from '../components/mobile/BottomNavigation'
import Loader from '../components/common/Loader'

export default function DashboardLayout() {
  const { user, loading } = useContext(AuthContext)
  const { globalLoading } = useContext(AppContext)
  const { theme } = useContext(ThemeContext)

  // حارس البوابة الحقيقي المستقر: إذا انتهى التحميل ولا يوجد مستخدم، طرد فوري للوجن
  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  // منع ومصادرة الشاشة البيضاء أثناء جلب البيانات من السحاب
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#05020c] text-cyan-400' : 'bg-slate-50 text-blue-600'
      }`}>
        <Loader label="جاري تأمين النطاق الرقمي للوحة التحكم..." />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row dir-rtl text-right font-sans relative antialiased overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#05020c] text-slate-100' : 'bg-slate-50/50 text-slate-800'
    }`}>
      
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:pl-64 relative">
        {globalLoading && (
          <div className={`absolute top-0 left-0 right-0 h-[2px] animate-pulse z-50 ${
            theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-pink-500' : 'bg-gradient-to-r from-blue-600 to-pink-500'
          }`} />
        )}

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 relative z-10">
          <Outlet />
        </main>
        
        <div className={`md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-lg border-t transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#0d071d]/90 border-[#1f1438]' : 'bg-white/90 border-slate-200 shadow-lg'
        }`}>
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}
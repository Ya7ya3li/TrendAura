import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'
import Sidebar from '../components/sidebar/Sidebar'
import BottomNavigation from '../components/mobile/BottomNavigation'

export default function DashboardLayout() {
  const { user, loading } = useContext(AuthContext)
  const { globalLoading } = useContext(AppContext)
  const { theme } = useContext(ThemeContext)

  // حارس البوابة: إذا انتهى فحص الحساب وتبين أنه لا يوجد مستخدم، يتم التوجيه لصفحة الدخول
  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  // 🔥 تم تدمير شاشة "جاري تأمين النطاق الرقمي" الفول-سكرين نهائياً بناءً على طلبك لمنع أي تعليق مستقبل أو قفل للواجهة

  return (
    <div className={`min-h-screen flex flex-col md:flex-row dir-rtl text-right font-sans relative antialiased overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#05020c] text-slate-100' : 'bg-slate-50/50 text-slate-800'
    }`}>
      
      {/* القائمة الجانبية تظهر فوراً وبدون أي شاشات حجب */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:pl-64 relative">
        
        {/* استبدال الشاشة الكاملة بخط علوي نيوني مجهري ناعم فقط يشتغل بالخلفية عند التحميل دون حجب التحكم */}
        {(globalLoading || loading) && (
          <div className={`absolute top-0 left-0 right-0 h-[3px] animate-pulse z-50 ${
            theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-pink-500' : 'bg-gradient-to-r from-blue-600 to-pink-500'
          }`} />
        )}

        {/* محتوى الصفحة والسكريبتات يفتح مباشرة */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 relative z-10">
          <Outlet />
        </main>
        
        {/* شريط الجوال السفلي */}
        <div className={`md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-lg border-t transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#0d071d]/90 border-[#1f1438]' : 'bg-white/90 border-slate-200 shadow-lg'
        }`}>
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}
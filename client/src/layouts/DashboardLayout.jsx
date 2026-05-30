import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext' // 🧬 حقن شريان المظهر العالمي
import Sidebar from '../components/sidebar/Sidebar'
import BottomNavigation from '../components/mobile/BottomNavigation'
import Loader from '../components/common/Loader'

/**
 * TrendAura Core Dashboard Layout (Dynamic Adaptive Edition)
 * Surgically updated to switch seamlessly between Premium Light and Cyber Neon Dark using Global Theme State.
 */
export default function DashboardLayout() {
  const { user, loading } = useContext(AuthContext)
  const { globalLoading } = useContext(AppContext)
  const { theme } = useContext(ThemeContext) // ⚡ قراءة المظهر النشط حالياً (light أو dark)

  // 🧠 فحص استباقي: هل زرعنا توكن المعاينة الوهمي في المتصفح؟ (محفوظ بالكامل)
  const hasMockToken = localStorage.getItem('trendaura_token') || localStorage.setItem('token', 'mock_master_session_2026')
  const shouldBypass = !!hasMockToken // تفعيل وضع العبور التلقائي إذا وجد التوكن

  // 🛡️ حارس المسار المطور: لا يطرد المستخدم إذا كان وضع العبور (Bypass) فعالاً
  if (!shouldBypass && !loading && !user) {
    return <Navigate to="/login" replace />
  }

  // منع تعليق الواجهة في شاشة التحميل (متكيف ديناميكياً مع المظهر النشط)
  if (!shouldBypass && loading) {
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
      theme === 'dark' 
        ? 'bg-[#05020c] text-slate-100 selection:bg-purple-500/30' 
        : 'bg-slate-50/50 text-slate-800 selection:bg-blue-100'
    }`}>
      
      {/* 1. القائمة الجانبية الموحدة (مستقرة يسار الشاشة - ستستجيب في الخطوة القادمة) */}
      <Sidebar />

      {/* 2. منطقة معالجة وضخ البيانات المحاطة بهالات المظهر المتغير هندسياً */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:pl-64 relative">
        
        {/* شريط انتظار العمليات العلوي المجهري - يتغير لونه حسب المظهر المختار */}
        {globalLoading && (
          <div className={`absolute top-0 left-0 right-0 h-[2px] animate-pulse z-50 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500'
          }`} />
        )}

        {/* 🌌 حقن هالات ضوئية ناعمة - تسبح وتظهر فقط في الوضع الداكن النيوني لضمان صفاء ونقاء الوضع الفاتح */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />
          </>
        )}

        {/* الحاوية المركزية التي يتم حقن الصفحات الداخلية جواها تلقائياً */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 transition-all duration-300 ease-in-out relative z-10">
          <Outlet />
        </main>
        
        {/* 3. شريط التنقل السفلي الفخم للجوال - يتغير مظهره بالكامل بتغير الزر */}
        <div className={`md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-lg border-t transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-[#0d071d]/90 border-[#1f1438]' 
            : 'bg-white/90 border-slate-200 shadow-lg'
        }`}>
          <BottomNavigation />
        </div>

      </div>
    </div>
  )
}
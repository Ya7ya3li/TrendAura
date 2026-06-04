import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Sidebar from '../components/sidebar/Sidebar'
import Navbar from '../components/navbar/Navbar'
import BottomNavigation from '../components/mobile/BottomNavigation'

export default function DashboardLayout() {
  const { user, loading } = useContext(AuthContext)

  // 🛡️ صمام الأمان النهائي لمنع تسلل غير المصرح لهم أثناء إعادة تدوير الكود
  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased relative overflow-hidden">
      
      {/* 🔮 توهج الخلفية النيوني المستقر لتأكيد الهوية التصميمية الفاخرة لـ TrendAura */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none select-none z-0" />

      {/* 🗂️ الشريط الجانبي المكتبي (Desktop Sidebar) - يختفي تلقائياً على شاشات الجوال */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-e border-slate-800/60 bg-slate-900/40 backdrop-blur-xl relative z-20">
        <Sidebar />
      </aside>

      {/* 🖥️ منطقة المحتوى الرئيسية والمستقرة هيدروليكياً */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        
        {/* الهيدر العلوي الذكي (Navbar) - متوافق مع الكمبيوتر والموبايل */}
        <header className="w-full h-16 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-md flex items-center px-4 md:px-8 z-20">
          <Navbar />
        </header>

        {/* حاوية الصفحات الداخلية القابلة للتمرير بسلاسة ناعمة */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8 pb-24 md:pb-8 scrollbar-thin scrollbar-thumb-slate-800 dir-rtl text-right">
          <div className="max-w-6xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 📱 شريط التنقل السفلي الاحترافي للجوال - يظهر فقط في الشاشات الصغيرة */}
      <nav className="block md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/80 z-30">
        <BottomNavigation />
      </nav>

    </div>
  )
}
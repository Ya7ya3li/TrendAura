import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function LandingLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col antialiased relative">
      
      {/* 🌐 الهيدر الخارجي العائم مع التوافقية الشاملة */}
      <header className="w-full sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between dir-rtl">
          
          {/* شعار التميز الحركي المستوحى من دقة ChatGPT المدمجة */}
          <Link to={ROUTES.LANDING} className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
              TA
            </div>
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              TrendAura
            </span>
          </Link>

          {/* أزرار القفز الداخلي للسكشنات عبر الـ Anchors المعززة */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
            <a href="#features" className="hover:text-blue-400 transition-colors duration-200">الميزات الفنية</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors duration-200">الباقات والأسعار</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors duration-200">الأسئلة الشائعة</a>
          </nav>

          {/* محولات التوجيه التكتيكية لبوابات الدخول */}
          <div className="flex items-center gap-3">
            <Link 
              to={ROUTES.LOGIN} 
              className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2 transition-colors duration-200"
            >
              تسجيل الدخول
            </Link>
            <Link 
              to={ROUTES.REGISTER} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-2.5 rounded-xl hover:from-blue-700 shadow-lg shadow-blue-500/10 transition-all duration-200 hover:scale-[1.02]"
            >
              ابدأ مجاناً 🚀
            </Link>
          </div>

        </div>
      </header>

      {/* قطاع العرض الخارجي للمحتوى الديناميكي */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* تذييل الصفحة الختامي المهندم قانونياً وتقنياً */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500 font-medium dir-rtl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TrendAura. جميع الحقوق محفوظة لشريكي الأول.</p>
          <div className="flex items-center gap-6 font-bold">
            <a href="#terms" className="hover:text-slate-300 transition-colors duration-200">شروط الاستخدام</a>
            <a href="#privacy" className="hover:text-slate-300 transition-colors duration-200">سياسة الخصوصية</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col antialiased relative">
      
      <header className="w-full sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between dir-rtl">
          
          {/* الشعار الملوكي المعزول بالـ SVG هندسياً بالملي */}
          <Link to={ROUTES.LANDING} className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TrendAura
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500">
            <a href="#features" className="hover:text-blue-400 transition-colors duration-200">الميزات الفنية</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors duration-200">الباقات والأسعار</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors duration-200">الأسئلة الشائعة</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              to={ROUTES.LOGIN} 
              className="text-xs font-bold text-slate-500 hover:text-white px-3 py-2 transition-colors duration-200"
            >
              تسجيل الدخول
            </Link>
            <Link 
              to={ROUTES.REGISTER} 
              className="bg-blue-600 text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] border-none inline-flex items-center gap-1.5"
            >
              <span>ابدأ مجاناً</span>
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </Link>
          </div>

        </div>
      </header>

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-600 font-medium dir-rtl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TrendAura.جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6 font-bold">
            <a href="#terms" className="hover:text-slate-400 transition-colors duration-200">شروط الاستخدام</a>
            <a href="#privacy" className="hover:text-slate-400 transition-colors duration-200">سياسة الخصوصية</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
import React from 'react'
import { Outlet, Link } from 'react-router-dom'

/**
 * TrendAura Premium Marketing Layout - V2 Enterprise Certified
 * Engineered to provide a high-performance, blur-backed, zero-block wrapper for marketing views.
 */
export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col antialiased">
      
      {/* 🌐 الهيدر الخارجي المستقر للمنصة (Navbar) */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between dir-rtl">
          
          {/* الشعار المينيومالي الفاخر (TA) المتناسق مع الهوية الحركية للتطبيق */}
          <Link to="/" className="flex items-center gap-2 group select-none">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200 group-hover:scale-105 transition-all duration-300">
              TA
            </div>
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              TrendAura
            </span>
          </Link>

          {/* روابط التنقل السلسة بين قطاعات صفحة الهبوط */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
            <a href="#features" className="hover:text-blue-600 transition-colors duration-200">الميزات الفنية</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors duration-200">الباقات والأسعار</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors duration-200">الأسئلة الشائعة</a>
          </nav>

          {/* أزرار العبور السريع لبوابات المصادقة */}
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-2 transition-colors duration-200"
            >
              تسجيل الدخول
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-2.5 rounded-xl hover:from-blue-700 shadow-md shadow-blue-100 transition-all duration-200 hover:scale-[1.02]"
            >
              ابدأ مجاناً 🚀
            </Link>
          </div>

        </div>
      </header>

      {/* 🚀 محتوى الصفحات الخارجية الديناميكي (Landing.jsx و Pricing.jsx) */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* 📊 تذييل الصفحة الختامي المستقر الحامي للحقوق القانونية (Footer) */}
      <footer className="w-full bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400 font-medium dir-rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TrendAura. جميع الحقوق محفوظة لشريكي الأول.</p>
          <div className="flex items-center gap-6 font-bold">
            <a href="#terms" className="hover:text-slate-600 transition-colors duration-200">شروط الاستخدام</a>
            <a href="#privacy" className="hover:text-slate-600 transition-colors duration-200">سياسة الخصوصية</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
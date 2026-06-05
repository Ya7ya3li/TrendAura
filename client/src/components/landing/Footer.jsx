import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

/**
 * TrendAura Global Master Footer Architecture Component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-12 text-right dir-rtl select-none font-sans relative z-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        
        {/* العمود الأول: نبذة عن البراند والهوية الموحدة محول لـ SVG لوجو */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/10 shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-black text-white tracking-tight">TrendAura</span>
          </div>
          <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">
            منصتك الإستراتيجية لتطويق خوارزميات السوشيال ميديا وحصد ملايين المشاهدات بهندسة نصوص وسيناريوهات ذكية ومبنية على التحليل النفسي.
          </p>
        </div>

        {/* العمود الثاني: روابط التنقل الداخلي للمنتج مربوطة بالـ ROUTES مئة بالمئة */}
        <div className="flex flex-col gap-2.5 text-[11px] font-bold text-slate-400">
          <h5 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">المنصة والترسانة</h5>
          <a href="#features" className="hover:text-blue-500 transition-colors">الميزات والأدوات الفنية</a>
          <Link to={ROUTES.PRICING} className="hover:text-blue-500 transition-colors">باقات الاشتراك والأسعار المعتمدة</Link>
          <Link to={ROUTES.DASHBOARD} className="hover:text-blue-500 transition-colors">دخول لوحة التحكم الداخلية</Link>
        </div>

        {/* العمود الثالث: الدعم والتواصل الفني المباشر */}
        <div className="flex flex-col gap-2.5 text-[11px] font-bold text-slate-400">
          <h5 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">المساعدة والمجتمع</h5>
          <a href="https://t.me/TrendAuraSupport" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors inline-flex items-center gap-1.5">
            <span>الدعم الفني المباشر 24/7</span>
            <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <Link to={ROUTES.MAINTENANCE} className="hover:text-blue-500 transition-colors">مركز التحديثات وحالة الأنظمة</Link>
        </div>

        {/* العمود الرابع: الروابط والالتزامات القانونية السيادية المحمية من الـ Hard Reload */}
        <div className="flex flex-col gap-2.5 text-[11px] font-bold text-slate-400">
          <h5 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">الالتزامات القانونية</h5>
          <Link to={ROUTES.MAINTENANCE} className="hover:text-blue-500 transition-colors">شروط وأحكام الاستخدام الموثقة (ToS)</Link>
          <Link to={ROUTES.MAINTENANCE} className="hover:text-blue-500 transition-colors">سياسة حماية البيانات والخصوصية الفيدرالية</Link>
        </div>

      </div>

      {/* شريط الحقوق السفلي الموحد والمقفل */}
      <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-500">
        <span>جميع الحقوق محفوظة لمنصة TrendAura © {currentYear}</span>
        <span className="font-mono text-slate-700 select-all">v1.0.0 Stable Build Production</span>
      </div>
    </footer>
  )
}
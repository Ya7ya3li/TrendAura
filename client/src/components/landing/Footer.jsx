import React from 'react'
import { Link } from 'react-router-dom'

/**
 * TrendAura Global Master Footer Architecture Component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-100 py-12 text-right dir-rtl select-none font-sans">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* العمود الأول: نبذة عن البراند والهوية */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">▲</div>
            <span className="text-sm font-black text-slate-900">TrendAura</span>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
            منصتك الإستراتيجية لتطويق خوارزميات السوشيال ميديا وحصد ملايين المشاهدات بهندسة نصوص وسيناريوهات ذكية ومبنية على التحليل النفسي.
          </p>
        </div>

        {/* العمود الثاني: روابط التنقل الداخلي للمنتج */}
        <div className="flex flex-col gap-2.5 text-[11px] font-bold text-slate-500">
          <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-1">المنصة والترسانة</h5>
          <a href="#features" className="hover:text-blue-600 transition-colors">الميزات والأدوات</a>
          <Link to="/pricing" className="hover:text-blue-600 transition-colors">باقات الاشتراك والأسعار</Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">دخول لوحة التحكم</Link>
        </div>

        {/* العمود الثالث: الدعم والتواصل الفني المباشر */}
        <div className="flex flex-col gap-2.5 text-[11px] font-bold text-slate-500">
          <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-1">المساعدة والمجتمع</h5>
          <a href="https://t.me/TrendAuraSupport" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">الدعم الفني المباشر 24/7</a>
          <Link to="/maintenance" className="hover:text-blue-600 transition-colors">مركز التحديثات والأنظمة</Link>
        </div>

        {/* العمود الرابع: الروابط والالتزامات القانونية السيادية */}
        <div className="flex flex-col gap-2.5 text-[11px] font-bold text-slate-500">
          <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-1">الالتزامات القانونية</h5>
          <Link to="/maintenance" className="hover:text-blue-600 transition-colors">شروط وأحكام الاستخدام (ToS)</Link>
          <Link to="/maintenance" className="hover:text-blue-600 transition-colors">سياسة حماية البيانات والخصوصية</Link>
        </div>

      </div>

      {/* شريط الحقوق السفلي الموحد والمقفل */}
      <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400">
        <span>جميع الحقوق محفوظة لمنصة TrendAura © {currentYear}</span>
        <span className="font-mono text-slate-300">v1.0.0 Stable Build Production</span>
      </div>
    </footer>
  )
}
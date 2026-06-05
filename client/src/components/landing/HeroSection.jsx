import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import Button from '../common/Button.jsx'

/**
 * TrendAura Landing Hero Section - Pure SVG & Constants Wired Edition
 */
export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative w-full py-20 md:py-32 bg-slate-950 overflow-hidden text-center dir-rtl select-none">
      {/* التوهجات النيونية السيبرانية لتعزيز أبعاد الهوية البصرية الفاخرة لـ TrendAura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 to-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* شارة التميز المجهرية بالأعلى محولة لـ SVG هندسي */}
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-6 animate-fade-in">
          <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>مدعوم بأحدث تقنيات التحليل السلوكي للذكاء الاصطناعي</span>
        </span>

        {/* العنوان السيادي الخارق */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight md:leading-none mb-6 animate-scale-up">
          حوّل أفكارك البسيطة إلى <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">سيناريوهات فيروسية</span> تحصد الملايين
        </h1>

        {/* الوصف التسويقي الاستراتيجي */}
        <p className="text-xs md:text-sm font-bold text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in">
          منصة TrendAura تدمج ذكاء السلوك الجماهيري مع خوارزميات السوشيال ميديا لتصيغ لك خطافات بصرية ونصوصاً خارقة تمنع التمرير وتضمن أعلى معدلات البقاء والانتشار للفيديو.
        </p>

        {/* أزرار اتخاذ الإجراء السريع المربوطة بالثوابت الصارمة */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-up max-w-sm mx-auto sm:max-w-none">
          <Button
            onClick={() => navigate(ROUTES.REGISTER)} // ربط موحد مع الثوابت
            variant="primary"
            className="w-full sm:w-auto px-8 py-4 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all border-none flex items-center justify-center gap-2"
          >
            <span>ابدأ صناعة المحتوى مجاناً</span>
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </Button>
          <Button
            onClick={() => {
              const el = document.getElementById('features')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            variant="secondary"
            className="w-full sm:w-auto px-8 py-4 text-xs font-black rounded-xl transition-all border-slate-800 text-slate-300 flex items-center justify-center gap-2"
          >
            <span>استكشف الميزات والترسانة</span>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  )
}
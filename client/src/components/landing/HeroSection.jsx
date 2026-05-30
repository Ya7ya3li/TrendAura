import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'

/**
 * TrendAura Landing Hero Section
 * Captures user attention with premium gradient titles and immediate conversion anchors.
 */
export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative w-full py-20 md:py-32 bg-white overflow-hidden text-center dir-rtl select-none">
      {/* التوهجات النيونية الخلفية لتعزيز أبعاد الثيم الفاتح الفاخر */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 to-purple-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* شارة التميز المجهرية بالأعلى */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100/60 mb-6 animate-fade-in">
          ✦ مدعوم بأحدث تقنيات التحليل السلوكي للذكاء الاصطناعي
        </span>

        {/* العنوان السيادي الملوكي الخارق */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight md:leading-none mb-6 animate-scale-up">
          حوّل أفكارك البسيطة إلى <br className="hidden md:block" />
          <span className="text-gradient-premium">سيناريوهات فيروسية</span> تحصد الملايين
        </h1>

        {/* الوصف التسويقي الجذاب */}
        <p className="text-xs md:text-sm font-bold text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in">
          منصة TrendAura تدمج ذكاء السلوك الجماهيري مع خوارزميات السوشيال ميديا لتصيغ لك خطافات بصرية ونصوصاً خارقة تمنع التمرير وتضمن أعلى معدلات البقاء والانتشار للفيديو.
        </p>

        {/* أزرار التفاعل واتخاذ الإجراء السريع */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-up">
          <Button
            onClick={() => navigate('/register')}
            variant="primary"
            className="w-full sm:w-auto px-8 py-4 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl transition-all"
          >
            ابدأ صناعة المحتوى مجاناً 🚀
          </Button>
          <Button
            onClick={() => {
              const el = document.getElementById('features')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            variant="secondary"
            className="w-full sm:w-auto px-8 py-4 text-xs font-black rounded-xl transition-all"
          >
            استكشف الميزات والترسانة ⚡
          </Button>
        </div>
      </div>
    </section>
  )
}
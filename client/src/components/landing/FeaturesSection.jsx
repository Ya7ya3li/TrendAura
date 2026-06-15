import React from 'react'
import GlowCard from '../common/GlowCard.jsx'

/**
 * TrendAura Product Core Capabilities Matrix Section - Pure SVG Optimized
 */
export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'هندسة خطافات نفسية خارقة',
      desc: 'صياغة مقدمات فيديوهات (Hooks) تمنع إصبع المشاهد من التمرير في أول 3 ثوانٍ وتجبره على البقاء والاندماج الكامل.'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'محرك  viral Engine النفسي المتقدم',
      desc: 'تحليل البنية السلوكية للجماهير وتضمين محفزات الرغبة والفضول بداخل النص لزيادة احتمالية المشاركة العضوية.'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      ),
      title: 'مؤشرات أداء الـ AI Score',
      desc: 'حساب دقيق لنسب قوة السيناريو وتقدير منحنى بقاء واحتفاظ الجمهور بالثواني الحقيقية قبل خطوة النشر الفعلي.'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0" />
        </svg>
      ),
      title: 'تحديد أوقات النشر المثالية',
      desc: 'توقيتات ذكية مبنية على رصد نشاط الفئات المستهدفة لضمان دخول المقطع فوراً في دفق الـ Explore العالمي.'
    }
  ]

  return (
    <section id="features" className="w-full py-20 bg-slate-950 border-t border-slate-900 text-right dir-rtl select-none relative">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* ترويسة وقنوات قسم الميزات */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-white tracking-tight md:text-3xl">
            أدوات مصقولة بعناية لاكتساح خوارزميات السوشيال ميديا
          </h2>
          <p className="text-[11px] font-bold text-slate-500 mt-2 max-w-md mx-auto leading-normal">
            نغطي كامل دورة صناعة الفيديوهات المليونية المربحة بالذكاء الاصطناعي في واجهة نظام واحدة مستقرة.
          </p>
        </div>

        {/* شبكة عرض كروت الميزات الأربعة الفاخرة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <GlowCard key={idx} className="p-6 bg-slate-900/40 border-slate-900 hover:border-blue-500/20 flex flex-col items-start text-right rounded-3xl">
              <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 shadow-inner">
                {feat.icon}
              </div>
              <h4 className="text-xs font-black text-white tracking-tight mb-2">
                {feat.title}
              </h4>
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                {feat.desc}
              </p>
            </GlowCard>
          ))}
        </div>

      </div>
    </section>
  )
}
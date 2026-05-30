import React from 'react'
import GlowCard from '../common/GlowCard'

/**
 * TrendAura Product Core Capabilities Matrix Section
 */
export default function FeaturesSection() {
  const features = [
    {
      icon: '🧠',
      title: 'هندسة خطافات نفسية الخارقة',
      desc: 'صياغة مقدمات فيديوهات (Hooks) تمنع إصبع المشاهد من التمرير في أول 3 ثوانٍ وتجبره على البقاء.'
    },
    {
      icon: '🚀',
      title: 'محرك الفايرال النفسي المتقدم',
      desc: 'تحليل البنية السلوكية للجماهير وتضمين محفزات الرغبة والفضول بداخل النص لزيادة احتمالية المشاركة.'
    },
    {
      icon: '📊',
      title: 'مؤشرات أداء الـ AI Score',
      desc: 'حساب دقيق لنسب قوة السيناريو وتقدير منحنى بقاء واحتفاظ الجمهور بالثواني قبل النشر الفعلي.'
    },
    {
      icon: '⏰',
      title: 'تحديد أوقات النشر المثالية',
      desc: 'توقيتات ذكية مبنية على رصد نشاط الفئات المستهدفة لضمان دخول المقطع فوراً في دفق الـ Explore.'
    }
  ]

  return (
    <section id="features" className="w-full py-20 bg-slate-50/50 text-right dir-rtl select-none relative">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* ترويسة وعناوين قسم الميزات */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight md:text-3xl">
            أدوات مصقولة بعناية لاكتساح خوارزميات السوشيال ميديا
          </h2>
          <p className="text-[11px] font-bold text-slate-400 mt-2 max-w-md mx-auto leading-normal">
            نغطي كامل دورة صناعة الفيديوهات المليونية المربحة بالذكاء الاصطناعي في واجهة واحدة.
          </p>
        </div>

        {/* شبكة عرض كروت الميزات الأربعة الفاخرة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <GlowCard key={idx} className="p-6 border-slate-100/70 hover:border-blue-500/10 flex flex-col items-start text-right">
              <div className="w-11 h-11 rounded-xl bg-blue-50/80 border text-base flex items-center justify-center mb-4 shadow-2xs">
                {feat.icon}
              </div>
              <h4 className="text-xs font-black text-slate-900 tracking-tight mb-2">
                {feat.title}
              </h4>
              <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </GlowCard>
          ))}
        </div>

      </div>
    </section>
  )
}
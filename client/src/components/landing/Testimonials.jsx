import React from 'react'
import GlowCard from '../common/GlowCard'

/**
 * TrendAura Creator Success Stories & Testimonials Matrix
 */
export default function Testimonials() {
  const reviews = [
    {
      name: 'عبدالمحسن العتيبي',
      handle: '@p_abdul',
      avatar: 'ع',
      role: 'صانع محتوى تقني (1.2M متابع)',
      text: 'منصة TrendAura غيرت طريقة كتابتي للسكريبتات تماماً! الخطافات النفسية المقترحة رفعت نسبة الاحتفاظ بالجمهور عندي من 35% إلى 72%، وأول فيديو طبقته ضرب 3 مليون مشاهدة في يومين.'
    },
    {
      name: 'سارة الشمري',
      handle: '@sara_creatives',
      avatar: 'س',
      role: 'خبير تسويق رقمي وصناعة محتوى',
      text: 'أعظم ميزة هي محرك الفايرال النفسي وحساب الـ AI Score. صرت أعرف قوة الفيديو ومشاكله قبل ما أنشره وأضيع عليه وقت المونتاج. باقة Viral Engine تستحق كل ريال.'
    },
    {
      name: 'عمر القحطاني',
      handle: '@omar_vlogs',
      avatar: 'ع',
      role: 'ستوري تيلر ومنتج فيديوهات',
      text: 'كنت أعاني من العقم الإبداعي في بداية الفيديوهات، الحين بضغطة زر أكتب الفكرة ويطلع لي سكريبت مقسم وجاهز مع الهاشتاقات الساخنة وأوقات النشر بدقة مذهلة.'
    }
  ]

  return (
    <section className="w-full py-20 bg-white text-right dir-rtl select-none">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-black bg-purple-50 text-purple-600 border border-purple-100/60 px-3 py-1 rounded-full uppercase tracking-wider">
            💬 مجتمع المبدعين والنخبة
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight md:text-3xl mt-4">
            ماذا يقول نخبة صناع المحتوى عن TrendAura؟
          </h2>
        </div>

        {/* شبكة عرض التقييمات الثلاثية الأنيقة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((rev, idx) => (
            <GlowCard key={idx} className="p-6 border-slate-100/80 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed italic mb-6">
                  " {rev.text} "
                </p>
              </div>

              {/* هوية وبيانات صانع المحتوى أسفل الكرت */}
              <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center border shrink-0">
                  {rev.avatar}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-slate-800 truncate">{rev.name}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5 truncate font-sans">{rev.role}</span>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>

      </div>
    </section>
  )
}
import React from 'react'
import GlowCard from '../common/GlowCard.jsx'

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
      text: 'أعظم ميزة هي محرك Viral Engine النفسي وحساب الـ AI Score. صرت أعرف قوة الفيديو ومشاكله قبل ما أنشره وأضيع عليه وقت المونتاج. باقة Viral Engine تستحق كل ريال.'
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
    <section className="w-full py-20 bg-slate-950 border-t border-slate-900 text-right dir-rtl select-none">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16 flex flex-col items-center">
          {/* محول الرموز الـ SVG لكبسولة مجتمع النخبة */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>مجتمع المبدعين</span>
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight md:text-3xl mt-4">
            ماذا يقول  صناع المحتوى عن  TrendAura
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((rev, idx) => (
            <GlowCard key={idx} className="p-6 bg-slate-900/40 border-slate-900 flex flex-col justify-between rounded-3xl">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 leading-relaxed italic mb-6">
                  " {rev.text} "
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-900 pt-4">
                <div className="w-9 h-9 rounded-full bg-slate-950 text-slate-400 font-black text-xs border border-slate-800 flex items-center justify-center shrink-0 font-sans">
                  {rev.avatar}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-white truncate">{rev.name}</span>
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 truncate font-sans">{rev.role}</span>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>

      </div>
    </section>
  )
}
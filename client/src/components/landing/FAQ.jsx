import React, { useState } from 'react'

/**
 * TrendAura Dynamic Accordion FAQ Component
 */
export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  const qaPairs = [
    {
      q: 'كيف تساعدني المنصة على زيادة مشاهدات الفيديوهات القصيرة؟',
      a: 'المنصة تعتمد على خوارزميات ذكاء اصطناعي مدربة على تحليل السلوك الجماهيري المليوني. تقوم بصياغة مقدمات (Hooks) خاطفة ومثيرة للاهتمام تمنع المشاهد من التمرير في أول 3 ثوانٍ، وهو العامل الأساسي الذي يجعل خوارزميات تيك توك تدفع بمقطعك لصفحة الـ Explore.'
    },
    {
      q: 'هل استخدام السيناريوهات المولدة آمن على حساباتي الرسمية؟',
      a: 'آمن وموثوق بنسبة 100%. المنصة تولد لك نصوصاً وأفكاراً ومؤشرات بشرية إبداعية ومصقولة بالكامل، ولا تتدخل في حسابك بشكل آلي أو تنتهك سياسات مجتمعات منصات التواصل الاجتماعي.'
    },
    {
      q: 'هل يمكنني إلغاء اشتراكي المالي أو ترقية باقتي في أي وقت؟',
      a: 'بكل تأكيد، لا توجد أي عقود إلزامية. يمكنك الترقية، التخفيض، أو إلغاء تجديد الاشتراك تلقائياً ماليًا في أي وقت كلياً وبضغطة زر واحدة مباشرة من خلال صفحة إدارة الفوترة والاشتراكات ببروفايلك المحمي.'
    },
    {
      q: 'ما هي بوابات وطرق الدفع المدعومة داخل السعودية والخليج؟',
      a: 'نحن نستخدم بوابة دفع ميسر (Moyasar Gateway) السعودية المعتمدة والمطابقة لأعلى معايير الأمان السيبراني. ندعم الدفع عبر مدى (Mada)، بطاقات الفيزا والماستركارد، وحسابات Apple Pay لضمان معالجة مالية فورية وآمنة.'
    }
  ]

  return (
    <section className="w-full py-20 bg-slate-950 border-t border-slate-900 text-right dir-rtl select-none">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-white tracking-tight md:text-3xl">
            الأسئلة الشائعة وحلول النظام
          </h2>
          <p className="text-[11px] font-bold text-slate-500 mt-1">
            كل ما تود معرفته عن ترسانة هندسة النصوص واشتراكات المبدعين النخبة
          </p>
        </div>

        <div className="space-y-3">
          {qaPairs.map((item, idx) => {
            const isOpen = activeIndex === idx
            return (
              <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden transition-all shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-right font-black text-xs text-white hover:bg-slate-900/80 transition-colors border-none"
                >
                  <span className="tracking-tight leading-relaxed">{item.q}</span>
                  {/* تحويل الرمز النصي بلس إلى SVG هندسي متحرك بمرونة */}
                  <span className={`w-4 h-4 text-blue-500 transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-900' : 'max-h-0'}`}>
                  <p className="p-5 text-[11px] font-semibold text-slate-400 leading-relaxed bg-slate-950/40">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
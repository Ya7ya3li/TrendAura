import React, { useState } from 'react'

/**
 * TrendAura Dynamic Accordion FAQ Component
 */
export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  const qaPairs = [
    {
      q: 'كيف تساعدني المنصة على زيادة مشاهدات الفيديوهات؟',
      a: 'المنصة تعتمد على خوارزميات ذكاء اصطناعي مدربة على تحليل السلوك الجماهيري المليوني. تقوم بصياغة مقدمات (Hooks) خاطفة ومثيرة للاهتمام تمنع المشاهد من التمرير في أول 3 ثوانٍ، وهو العامل الأساسي الذي يجعل خوارزميات تيك توك وسوشيال ميديا تدفع بمقطعك لصفحة الـ Explore.'
    },
    {
      q: 'هل استخدام السيناريوهات المولدة آمن على حساباتي الرسمية؟',
      a: 'آمن بنسبة 100%. المنصة تولد لك نصوصاً وأفكاراً ومؤشرات بشرية إبداعية ومصقولة بالكامل، ولا تتدخل في حسابك بشكل آلي أو تنتهك سياسات مجتمعات منصات التواصل الاجتماعي.'
    },
    {
      q: 'هل يمكنني إلغاء اشتراكي أو ترقية باقتي في أي وقت؟',
      a: 'بكل تأكيد، لا توجد أي عقود إلزامية. يمكنك الترقية، التخفيض، أو إلغاء تجديد الاشتراك تلقائياً ماليًا في أي وقت كلياً وبضغطة زر واحدة مباشرة من خلال صفحة إدارة الفوترة والاشتراكات ببروفايلك.'
    },
    {
      q: 'ما هي بوابات وطرق الدفع المدعومة داخل السعودية والخليج؟',
      a: 'نحن نستخدم بوابة دفع ميسر (Moyasar Gateway) السعودية المعتمدة والمطابقة لأعلى معايير الأمان السيبراني. ندعم الدفع عبر مدى (Mada)، بطاقات الفيزا والماستركارد، وحسابات Apple Pay لضمان معالجة مالية فورية وآمنة.'
    }
  ]

  return (
    <section className="w-full py-20 bg-slate-50/50 text-right dir-rtl select-none">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight md:text-3xl">
            الأسئلة الشائعة وحلول النظام
          </h2>
          <p className="text-[11px] font-bold text-slate-400 mt-1">
            كل ما تود معرفته عن ترسانة هندسة النصوص والاشتراكات
          </p>
        </div>

        {/* قائمة الأسئلة التفاعلية القابلة للفتح والإغلاق */}
        <div className="space-y-3">
          {qaPairs.map((item, idx) => {
            const isOpen = activeIndex === idx
            return (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-right font-black text-xs text-slate-800 hover:bg-slate-50/60 transition-colors"
                >
                  <span className="tracking-tight leading-snug">{item.q}</span>
                  <span className={`text-sm text-blue-600 font-sans transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                    ＋
                  </span>
                </button>
                
                {/* كتلة الإجابة المنزلقة */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-50' : 'max-h-0'}`}>
                  <p className="p-5 text-[11px] font-semibold text-slate-400 leading-relaxed bg-slate-50/30">
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
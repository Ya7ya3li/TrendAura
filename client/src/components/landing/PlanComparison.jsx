import React from 'react'

/**
 * TrendAura Marketing Landing Grid Comparison Matrix - V2 Premium Adaptive Edition
 */
export default function PlanComparison() {
  const specs = [
    { name: 'رصيد السكريبتات اليومي المتاح', free: '5 طلبات', pro: '100 طلب', viral: '♾️ غير محدود كلياً' },
    { name: 'خوارزميات الهندسة النفسية والخطافات', free: 'الأساسية فقط', pro: 'المتقدمة الشاملة', viral: 'الكاملة الحصرية الملوكية' },
    { name: 'مؤشر تقييم الذكاء الاصطناعي (AI Score)', free: false, pro: false, viral: true },
    { name: 'منحنى احتفاظ وبقاء المشاهد (Retention)', free: false, pro: false, viral: true },
    { name: 'أولوية المعالجة على خطوط الخوادم', free: 'قياسية عادية', pro: 'سريعة جداً', viral: 'أولوية VIP فائقة فورية' }
  ]

  return (
    <div className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-[32px] p-6 shadow-2xl text-right dir-rtl select-none font-sans mt-16 max-w-5xl mx-auto transition-colors duration-300">
      <div className="text-center mb-8">
        <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-tight">جدول المقارنة البنيوي للميزات الفنية</h3>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1"># شفافية كاملة لاختيار الباقة التي تفجر أرقام مشاهدات قناتك</p>
      </div>

      <div className="w-full overflow-x-auto scrollbar-none">
        <table className="w-full text-right text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 dark:text-slate-500 text-[10px] uppercase">
              <th className="pb-4 text-right font-black">القدرات الفنية</th>
              <th className="pb-4 font-black">الخطة الحرة</th>
              <th className="pb-4 text-blue-600 dark:text-blue-500 font-black">باقة Pro VIP</th>
              <th className="pb-4 text-purple-600 dark:text-purple-400 font-black">Viral Engine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60">
            {specs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="py-4 font-black text-slate-900 dark:text-white text-right">{spec.name}</td>
                
                {/* عمود الخطة الحرة */}
                <td className="py-4 font-black">
                  {typeof spec.free === 'boolean' ? (
                    spec.free ? (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    )
                  ) : spec.free}
                </td>

                {/* عمود خطة برو */}
                <td className="py-4 text-slate-800 dark:text-slate-300 font-black">
                  {typeof spec.pro === 'boolean' ? (
                    spec.pro ? (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    )
                  ) : spec.pro}
                </td>

                {/* عمود خطة فايرال إنجين */}
                <td className="py-4 text-purple-600 dark:text-purple-400 font-black">
                  {typeof spec.viral === 'boolean' ? (
                    spec.viral ? (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    )
                  ) : spec.viral}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
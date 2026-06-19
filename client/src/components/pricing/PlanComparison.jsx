import React from 'react'

/**
 * TrendAura Standalone Feature Comparison Matrix Sheet - V2 Elite Adaptive Edition
 */
export default function PlanComparison() {
  const comparisonSpecs = [
    { name: 'رصيد التوكنز التراكمي المتاح للعمليات', free: '5 طلبات / يومياً', pro: '100 طلب / شهرياً', viral: '♾️ غير محدود كلياً' },
    { name: 'محرك الخطافات والمقدمات النفسية الخاطفة', free: 'المستوى الأساسي', pro: 'المستوى المتقدم', viral: 'وصول للترسانة كاملة 🧠' },
    { name: 'تحليل السكريبت وحساب الـ AI Score', free: false, pro: false, viral: true },
    { name: 'منحنى احتفاظ وبقاء المشاهد (Retention Curve)', free: false, pro: false, viral: true },
    { name: 'سرعة الاستجابة والتوليد على الخوادم', free: 'سرعة قياسية', pro: 'سرعة فائقة مضاعفة', viral: 'أولوية معالجة VIP' },
    { name: 'قنوات الدعم الفني المباشر وحل مشكلات الاتصال', free: 'البريد الإلكتروني', pro: 'دعم فني ممتاز', viral: 'دعم مباشر 24/7' }
  ]

  return (
    <div className="w-full bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[28px] p-5 shadow-2xl text-right dir-rtl select-none font-sans mt-12 animate-fade-in transition-colors duration-300">

      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800/60">
        <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
        <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-tight">جدول المقارنة الفنية والامتيازات الشاملة</h3>
      </div>

      <div className="w-full overflow-x-auto scrollbar-none">
        <table className="w-full text-right text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-50 text-[10px] uppercase">
              <th className="pb-3 text-right font-black">المواصفات والقدرات</th>
              <th className="pb-3 font-black">الخطة الحرة</th>
              <th className="pb-3 text-blue-600 dark:text-blue-500 font-black">Pro VIP</th>
              <th className="pb-3 text-purple-600 dark:text-purple-400 font-black">Viral Engine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40">
            {comparisonSpecs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors">
                <td className="py-3.5 font-black text-slate-900 dark:text-white text-right">{spec.name}</td>

                {/* الخطة الحرة */}
                <td className="py-3.5 text-slate-400 dark:text-slate-500">
                  {spec.free === false ? (
                    <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : spec.free}
                </td>

                {/* خطة برو دبل فيب */}
                <td className="py-3.5 text-slate-800 dark:text-slate-300 font-black">
                  {spec.pro === false ? (
                    <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : spec.pro}
                </td>

                {/* خطة محرك viral engine الاستراتيجي */}
                <td className="py-3.5 text-purple-600 dark:text-purple-400 font-black">
                  {spec.viral === true ? (
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
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
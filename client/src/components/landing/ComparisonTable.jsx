import React from 'react'

/**
 * TrendAura Absolute Subscription Tier Competency Comparison Matrix
 */
export default function ComparisonTable() {
  const rows = [
    { feature: 'حصص التوليد اليومية للسيناريوهات', free: '5 توليدات', pro: '100 توليد', viral: 'لا محدود كلياً ♾️' },
    { feature: 'محرك الخطافات النفسية والمقدمات الخارقة', free: 'أساسي فقط', pro: 'احترافي متقدم', viral: 'ترسانة كاملة 🧠' },
    { feature: 'حساب مؤشرات أداء الـ AI Score', free: false, pro: false, viral: true },
    { feature: 'منحنى بقاء واحتفاظ الجماهير (Retention)', free: false, pro: false, viral: true },
    { feature: 'استخراج علامات الهاشتاق وأوقات النشر المثالية', free: 'محدود جداً', pro: 'كامل البيانات', viral: '⚡ فوري ومحدث حياً' },
    { feature: 'سرعة المعالجة على خوادم الذكاء الاصطناعي', free: 'سرعة عادية', pro: 'سرعة فائقة', viral: 'أولوية فورية VIP' },
    { feature: 'قنوات الدعم المباشر الفني وحل المشكلات', free: 'عبر البريد', pro: 'دعم ممتاز', viral: 'دعم مباشر 24/7' }
  ]

  return (
    <section className="w-full py-16 bg-slate-950 border-t border-slate-900 text-right dir-rtl select-none">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-xs font-black tracking-tight text-center mb-8 uppercase tracking-wider text-slate-500">
          📊 مقارنة الصلاحيات والقدرات البرمجية الشاملة للخطط التجارية
        </h3>

        <div className="w-full bg-slate-900/20 border border-slate-900 rounded-3xl p-5 shadow-inner overflow-x-auto">
          <table className="w-full text-right text-[11px] font-bold text-slate-400 whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 text-[10px] uppercase">
                <th className="pb-3 text-right">الميزة التقنية</th>
                <th className="pb-3">المجانية</th> {/* تصحيح الإملاء من المممانية */}
                <th className="pb-3 text-blue-500">Pro VIP</th>
                <th className="pb-3 text-purple-400">Viral Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                  <td className="py-3.5 text-white font-black text-right">{row.feature}</td>
                  <td className="py-3.5 text-slate-500">
                    {row.free === false ? (
                      <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : row.free}
                  </td>
                  <td className="py-3.5 text-slate-300 font-black">
                    {row.pro === false ? (
                      <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : row.pro}
                  </td>
                  <td className="py-3.5 text-purple-400 font-black">
                    {row.viral === true ? (
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : row.viral}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
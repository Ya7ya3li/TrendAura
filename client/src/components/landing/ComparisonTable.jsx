import React from 'react'

/**
 * TrendAura Absolute Subscription Tier Competency Comparison Matrix
 */
export default function ComparisonTable() {
  const rows = [
    { feature: 'حصص التوليد اليومية للسيناريوهات', free: '5 توليدات', pro: '100 توليد', viral: 'لا محدود كلياً ♾️' },
    { feature: 'محرك الخطافات النفسية والمقدمات الخارقة', free: 'أساسي فقط', pro: 'احترافي متقدم', viral: 'ترسانة كاملة 🧠' },
    { feature: 'حساب مؤشرات أداء الـ AI Score', free: '❌ غير متاح', pro: '❌ غير متاح', viral: '✅ مدعوم بالكامل' },
    { feature: 'منحنى بقاء واحتفاظ الجماهير (Retention)', free: '❌ غير متاح', pro: '❌ غير متاح', viral: '✅ مدعوم بالكامل' },
    { feature: 'استخراج علامات الهاشتاق وأوقات النشر المثالية', free: 'محدود جداً', freeColor: 'text-slate-400', pro: '✅ كامل البيانات', viral: '⚡ فوري ومحدث حياً' },
    { feature: 'سرعة المعالجة على خوادم الذكاء الاصطناعي', free: 'سرعة عادية', pro: 'سرعة فائقة', viral: 'أولوية فورية VIP 🚀' },
    { feature: 'قنوات الدعم المباشر الفني وحل المشكلات', free: 'عبر البريد', pro: 'دعم ممتاز', viral: 'دعم مباشر 24/7 🎧' }
  ]

  return (
    <section className="w-full py-16 bg-slate-50/50 text-right dir-rtl select-none">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-xs font-black text-slate-800 tracking-tight text-center mb-8 uppercase tracking-wider text-slate-400">
          📊 مقارنة الصلاحيات والقدرات البرمجية الشاملة للخطط
        </h3>

        <div className="w-full bg-white border border-slate-100 rounded-3xl p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-right text-[11px] font-bold text-slate-600 whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase">
                <th className="pb-3 text-right">الميزة التقنية</th>
                <th className="pb-3">الممجانية</th>
                <th className="pb-3 text-blue-600">Pro VIP</th>
                <th className="pb-3 text-purple-600">Viral Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 text-slate-900 font-black text-right">{row.feature}</td>
                  <td className="py-3.5 text-slate-400">{row.free}</td>
                  <td className="py-3.5 text-slate-700 font-black">{row.pro}</td>
                  <td className="py-3.5 text-purple-700 font-black">{row.viral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
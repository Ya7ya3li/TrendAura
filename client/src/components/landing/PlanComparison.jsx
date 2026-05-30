import React from 'react'

/**
 * TrendAura Marketing Landing Grid Comparison Matrix
 * Resolves Vite pre-transform error for page entry allocations.
 */
export default function PlanComparison() {
  const specs = [
    { name: 'رصيد السكريبتات اليومي', free: '5 طلبات', pro: '100 طلب', viral: '♾️ غير محدود' },
    { name: 'خوارزميات الهندسة النفسية والخطافات', free: 'الأساسية', pro: 'المتقدمة', viral: 'الكاملة الحصرية' },
    { name: 'مؤشر تقييم الذكاء الاصطناعي (AI Score)', free: '❌ غير مدرج', pro: '❌ غير مدرج', viral: '✅ مدعوم لحظياً' },
    { name: 'منحنى احتفاظ وبقاء المشاهد', free: '❌ غير مدرج', pro: '❌ غير مدرج', viral: '✅ مدعوم لحظياً' },
    { name: 'أولوية المعالجة على الخوادم', free: 'قياسية', pro: 'سريعة جداً', viral: 'أولوية VIP فائقة' }
  ]

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[32px] p-6 shadow-xl shadow-slate-200/30 text-right dir-rtl select-none font-sans mt-16 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xs font-black text-slate-900 tracking-tight">جدول المقارنة الشامل للميزات</h3>
        <p className="text-[10px] font-bold text-slate-400 mt-1">شفافية كاملة لاختيار الباقة التي تفجر أرقام مشاهداتك</p>
      </div>

      <div className="w-full overflow-x-auto scrollbar-none">
        <table className="w-full text-right text-[11px] font-bold text-slate-600 whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase">
              <th className="pb-4 text-right">القدرات الفنية</th>
              <th className="pb-4">الخطة الحرة</th>
              <th className="pb-4 text-blue-600">باقة Pro VIP</th>
              <th className="pb-4 text-purple-600">Viral Engine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {specs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                <td className="py-4 font-black text-slate-800 text-right">{spec.name}</td>
                <td className="py-4 text-slate-400">{spec.free}</td>
                <td className="py-4 text-slate-700 font-black">{spec.pro}</td>
                <td className="py-4 text-purple-700 font-black">{spec.viral}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
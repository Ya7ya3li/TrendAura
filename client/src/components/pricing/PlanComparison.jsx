import React from 'react'

/**
 * TrendAura Standalone Feature Comparison Matrix Sheet
 */
export default function PlanComparison() {
  const comparisonSpecs = [
    { name: 'رصيد التوكنز التراكمي المتاح', free: '5 طلبات / يومياً', pro: '100 طلب / شهرياً', viral: '♾️ غير محدود كلياً' },
    { name: 'محرك الخطافات والمقدمات النفسية الخاطفة', free: 'المستوى الأساسي', pro: 'المستوى المتقدم', viral: 'وصول للترسانة كاملة 🧠' },
    { name: 'تحليل السكريبت وحساب الـ AI Score', free: '❌ غير مدرج', pro: '❌ غير مدرج', viral: '✅ مدعوم لحظياً' },
    { name: 'منحنى احتفاظ وبقاء المشاهد (Retention Curve)', free: '❌ غير مدرج', pro: '❌ غير مدرج', viral: '✅ مدعوم لحظياً' },
    { name: 'سرعة الاستجابة والتوليد على الخوادم', free: 'سرعة قياسية', pro: 'سرعة فائقة مضاعفة', viral: 'أولوية معالجة VIP ⚡' },
    { name: 'قنوات الدعم الفني المباشر وحل مشكلات الاتصال', free: 'البريد الإلكتروني', pro: 'دعم فني ممتاز', viral: 'دعم مباشر 24/7 🎧' }
  ]

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[28px] p-5 shadow-xl shadow-slate-200/40 text-right dir-rtl select-none font-sans mt-12 animate-fade-in">
      
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-50">
        <span className="text-sm">📊</span>
        <h3 className="text-xs font-black text-slate-800 tracking-tight">جدول المقارنة الفنية والامتيازات</h3>
      </div>

      <div className="w-full overflow-x-auto scrollbar-none">
        <table className="w-full text-right text-[11px] font-bold text-slate-600 whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase">
              <th className="pb-3 text-right">المواصفات والقدرات</th>
              <th className="pb-3">المجانية</th>
              <th className="pb-3 text-blue-600">Pro VIP</th>
              <th className="pb-3 text-purple-600">Viral Engine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {comparisonSpecs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 font-black text-slate-800 text-right">{spec.name}</td>
                <td className="py-3.5 text-slate-400">{spec.free}</td>
                <td className="py-3.5 text-slate-700 font-black">{spec.pro}</td>
                <td className="py-3.5 text-purple-700 font-black">{spec.viral}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
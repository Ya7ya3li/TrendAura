import React from 'react'

/**
 * TrendAura Live Token Quota Tracker Component
 */
export default function UsageStats({ used = 0, total = 5 }) {
  const percentage = Math.min((used / total) * 100, 100)
  const isDanger = percentage >= 80

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[24px] p-4 shadow-sm text-right dir-rtl select-none font-sans">
      <div className="flex items-center justify-between gap-4 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
        <span>استهلاك الكوتا اليومية للذكاء الاصطناعي</span>
        <span className="text-slate-300 font-mono">{used} / {total} توليد</span>
      </div>

      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isDanger 
              ? 'bg-gradient-to-r from-rose-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[9px] font-bold text-slate-500 mt-2 leading-tight">
        {isDanger 
          ? '⚠️ قاربت حصتك المتاحة على الانتهاء، يرجى ترقية الحساب الحقيقي لضمان استمرارية الصياغة المليونية.' 
          : '✦ يتم تصفير وإعادة شحن هذا العداد أوتوماتيكياً كل 24 ساعة لخدمة حسابك.'}
      </p>
    </div>
  )
}
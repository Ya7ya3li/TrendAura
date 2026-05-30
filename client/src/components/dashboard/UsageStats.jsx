import React from 'react'

/**
 * TrendAura Live Token Quota Tracker Component
 */
export default function UsageStats({ used = 0, total = 5 }) {
  const percentage = Math.min((used / total) * 100, 100)
  const isDanger = percentage >= 80

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm text-right dir-rtl select-none font-sans">
      <div className="flex items-center justify-between gap-4 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
        <span>استهلاك الحصة اليومية</span>
        <span className="text-slate-700 font-mono">{used} / {total} توليد</span>
      </div>

      {/* شريط التقدم القياسي الملون لنسب الاستهلاك */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isDanger 
              ? 'bg-gradient-to-r from-rose-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[9px] font-bold text-slate-400 mt-2 leading-tight">
        {isDanger 
          ? '⚠️ قاربت حصتك المجانية على الانتهاء، يرجى الترقية لضمان استمرارية المعالجة.' 
          : '✦ يتم تصفير وإعادة شحن هذا العداد تلقائياً كل 24 ساعة.'}
      </p>
    </div>
  )
}
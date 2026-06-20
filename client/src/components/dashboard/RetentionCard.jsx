import React from 'react'

export default function RetentionCard({ retentionRate = 80 }) {
  // تحديد اللون حسب النسبة
  const isHigh = retentionRate >= 85;
  const isMedium = retentionRate >= 65 && retentionRate < 85;

  const statusColorClass = isHigh
    ? 'text-emerald-500 dark:text-emerald-400'
    : isMedium
      ? 'text-blue-500 dark:text-blue-400'
      : 'text-amber-500 dark:text-amber-400';

  const statusBgClass = isHigh
    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
    : isMedium
      ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400'
      : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400';

  return (
    <div className="w-full bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[28px] p-5 shadow-sm dark:shadow-xl text-right dir-rtl select-none animate-scale-up transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
        <svg className={`w-4 h-4 ${statusColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-tight transition-colors">منحنى بقاء المشاهدين التقديري</h3>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 transition-colors">نسبة البقاء المتوقعة</span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 font-sans transition-colors">{retentionRate}%</h2>
        </div>
        <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black border transition-colors ${statusBgClass}`}>
          {isHigh ? 'أعلى من المتوسط العالمي ✨' : isMedium ? 'معدل بقاء جيد جداً 👍' : 'يحتاج خطاف أقوى ⚠️'}
        </span>
      </div>

      <div className="w-full h-12 flex items-end gap-1 pt-2">
        {/* رسم المنحنى بشكل ديناميكي ينتهي بالنسبة الفعلية */}
        {[95, 90, 85, 82, 80, 78, 75, 72, 70, (retentionRate + 5), retentionRate].map((val, idx) => (
          <div key={idx} className="flex-1 bg-slate-100 dark:bg-slate-950/40 rounded-t-md relative group h-full flex items-end transition-colors">
            <div
              className={`w-full rounded-t-md transition-all duration-700 ease-out bg-gradient-to-t ${isHigh ? 'from-emerald-400 to-emerald-500' : isMedium ? 'from-blue-500 to-indigo-500' : 'from-amber-400 to-amber-500'}`}
              style={{ height: `${Math.min(100, Math.max(10, val))}%` }}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between items-center text-[8px] font-black text-slate-500 mt-2 font-sans transition-colors">
        <span>0:00 (الخطاف)</span>
        <span>0:15 (المنتصف)</span>
        <span>0:30 (النهاية)</span>
      </div>
    </div>
  )
}
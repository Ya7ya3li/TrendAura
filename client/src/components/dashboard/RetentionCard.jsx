import React from 'react'

/**
 * TrendAura AI Audience Retention Curve Analytics Card
 */
export default function RetentionCard({ retentionRate = 80 }) {
  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[28px] p-5 shadow-xl text-right dir-rtl select-none animate-scale-up">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800/50">
        <span className="text-sm">📈</span>
        <h3 className="text-xs font-black text-white tracking-tight">منحنى بقاء المشاهدين التقديري</h3>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500">نسبة البقاء المتوقعة</span>
          <h2 className="text-xl font-black text-white mt-1 font-sans">{retentionRate}%</h2>
        </div>
        <span className="px-2.5 py-1 rounded-xl text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          أعلى من المتوسط العالمي ✨
        </span>
      </div>

      {/* خط تخطيطي بياني مرن يمثل رحلة المشاهد بداخل الفيديو */}
      <div className="w-full h-12 flex items-end gap-1 pt-2">
        {[95, 92, 88, 85, 89, 84, 88, 82, 80, 85, retentionRate].map((val, idx) => (
          <div key={idx} className="flex-1 bg-slate-950/40 rounded-t-md relative group h-full flex items-end">
            <div 
              className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-md group-hover:from-purple-500 transition-all"
              style={{ height: `${val}%` }}
            />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[8px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-slate-800">
              {val}%
            </span>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between items-center text-[8px] font-black text-slate-500 mt-2 font-sans">
        <span>0:00 (الخطاف)</span>
        <span>0:15 (المنتصف)</span>
        <span>0:30 (النهاية)</span>
      </div>
    </div>
  )
}
import React from 'react'
import CopyButton from '../common/CopyButton.jsx'

export default function ScriptCard({ hook, script, cta, hookStrength, ctaRating }) {
  const displayHook = hook || 'أفكار التوليد تظهر هنا فور ضغط الزر... '
  const displayScript = script || 'اكتب فكرتك بالأعلى ليقوم الذكاء الاصطناعي بنسج السيناريو الكامل .'
  const fullScriptText = hook ? `${hook}\n\n${script}\n\n${cta || ''}` : `${displayHook}\n\n${displayScript}`

  return (
    <div className="w-full bg-white dark:bg-[#160f30]/40 border border-slate-200 dark:border-[#1f1438] rounded-[28px] p-5 shadow-sm dark:shadow-black/40 text-slate-800 dark:text-white text-right dir-rtl flex flex-col h-full select-none animate-fade-in transition-all duration-300">

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f1438]/50 pb-3 mb-4 shrink-0 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-base"> </span>
          <h3 className="text-xs font-black tracking-tight">السكريبت المقترح </h3>
        </div>
        <span className={`text-[9px] font-black border px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all ${hook
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
            : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-800'
          }`}>
          <span className={`w-1 h-1 rounded-full ${hook ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`} />
          {hook ? 'جاهز ومحفوظ تلقائياً ✨' : 'في انتظار الفكرة'}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-none pr-0.5 text-[11px] leading-relaxed">
        <div className="p-3 rounded-xl border bg-slate-50 dark:bg-[#0d071d]/60 border-slate-200 dark:border-[#1f1438]/80 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <span className="block text-[9px] font-black text-blue-600 dark:text-cyan-400 transition-colors">المقدمة (Hook)</span>
            {hookStrength && <span className="text-[8px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">تقييم: {hookStrength}</span>}
          </div>
          <p className="font-bold leading-relaxed text-slate-700 dark:text-slate-200 transition-colors">{displayHook}</p>
        </div>

        <div className="p-3 rounded-xl border bg-slate-50 dark:bg-[#0d071d]/60 border-slate-200 dark:border-[#1f1438]/80 transition-all duration-300">
          <span className="block text-[9px] font-black mb-1 text-purple-600 dark:text-purple-400 transition-colors">المحتوى السينمائي (Body)</span>
          <p className="font-bold leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">{displayScript}</p>
        </div>

        {cta && (
          <div className="p-3 rounded-xl border bg-slate-50 dark:bg-[#0d071d]/60 border-slate-200 dark:border-[#1f1438]/80 transition-all duration-300">
            <div className="flex justify-between items-center mb-1">
              <span className="block text-[9px] font-black text-pink-600 dark:text-pink-400 transition-colors">الخاتمة ونداء الإجراء (CTA)</span>
              {ctaRating && <span className="text-[8px] bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-bold">تقييم: {ctaRating}</span>}
            </div>
            <p className="font-bold text-slate-700 dark:text-slate-300 transition-colors">{cta}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 dark:border-[#1f1438]/50 pt-3 mt-4 shrink-0 transition-colors">
        <CopyButton text={fullScriptText} label="نسخ السكريبت" />
      </div>

    </div>
  )
}
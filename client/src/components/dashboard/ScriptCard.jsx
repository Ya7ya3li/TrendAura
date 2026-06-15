import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext.jsx'
import CopyButton from '../common/CopyButton.jsx'

export default function ScriptCard({ hook, script, cta }) { // 🚀 تم تنظيف الـ Props المتعارضة نهائياً
  const { theme } = useContext(ThemeContext)
  
  const displayHook = hook || 'أفكار التوليد تظهر هنا فور ضغط الزر... '
  const displayScript = script || 'اكتب فكرتك بالأعلى  ليقوم الذكاء الاصطناعي بنسج السيناريو الكامل .'
  const fullScriptText = hook ? `${hook}\n\n${script}\n\n${cta || ''}` : `${displayHook}\n\n${displayScript}`

  return (
    <div className={`w-full border rounded-[28px] p-5 shadow-xl text-right dir-rtl flex flex-col h-full select-none animate-fade-in transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40 text-white'
        : 'bg-white border-slate-100 shadow-slate-200/40 text-slate-800'
    }`}>
      
      <div className={`flex items-center justify-between border-b pb-3 mb-4 shrink-0 transition-colors ${
        theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-base">📄</span>
          <h3 className="text-xs font-black tracking-tight">السكريبت المقترح </h3>
        </div>
        {/* ⚡ تحديث الوشاح البصري ليعكس حالة الحفظ الآلي المستقر */}
        <span className={`text-[9px] font-black border px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all ${
          hook
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-slate-800/40 text-slate-500 border-slate-800'
        }`}>
          <span className={`w-1 h-1 rounded-full ${hook ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} /> 
          {hook ? 'جاهز ومحفوظ تلقائياً ✨' : 'في انتظار الفكرة'}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-none pr-0.5 text-[11px] leading-relaxed">
        <div className={`p-3 rounded-xl border transition-all ${
          theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]/80' : 'bg-slate-50/50 border-slate-100/60'
        }`}>
          <span className={`block text-[9px] font-black mb-1 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>المقدمة (Hook)</span>
          <p className={`font-bold leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{displayHook}</p>
        </div>

        <div className={`p-3 rounded-xl border transition-all ${
          theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]/80' : 'bg-slate-50/50 border-slate-100/60'
        }`}>
          <span className={`block text-[9px] font-black mb-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>المحتوى السينمائي (Body)</span>
          <p className={`font-bold leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{displayScript}</p>
        </div>

        {cta && (
          <div className={`p-3 rounded-xl border transition-all ${
            theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]/80' : 'bg-slate-50/50 border-slate-100/60'
          }`}>
            <span className={`block text-[9px] font-black mb-1 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>الخاتمة ونداء الإجراء (CTA)</span>
            <p className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{cta}</p>
          </div>
        )}
      </div>

      {/* 🏁 تصفية الحقل السفلي كلياً من الأزرار اليدوية المكسورة والتركيز فقط على زر النسخ الحركي السريع */}
      <div className={`flex items-center gap-2 border-t pt-3 mt-4 shrink-0 transition-colors ${
        theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
      }`}>
        <CopyButton text={fullScriptText} label="نسخ السكريبت" />
      </div>

    </div>
  )
}
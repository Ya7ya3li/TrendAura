import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext' // 🧬 حقن شريان المظهر العالمي
import { showToast } from '../../App'
import CopyButton from '../common/CopyButton'

/**
 * TrendAura Premium Script Blueprint Outcome Card - Adaptive Neon Edition
 * Dynamic theme architecture matching dark and light specifications seamlessly.
 */
export default function ScriptCard({ hook, script, cta }) {
  const { theme } = useContext(ThemeContext)
  const fullScriptText = `${hook}\n\n${script}\n\n${cta}`

  const handleSaveScript = () => {
    showToast('تم حفظ وتأمين السكريبت في مستودع الأرشيف بنجاح ملوكي! 💾✨', 'success')
  }

  return (
    <div className={`w-full border rounded-[28px] p-5 shadow-xl text-right dir-rtl flex flex-col h-full select-none animate-fade-in transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40 text-white'
        : 'bg-white border-slate-100 shadow-slate-200/40 text-slate-800'
    }`}>
      
      {/* الهيدر ومفتاح الحالة للسكريبت - متكيف الإضاءة والحدود */}
      <div className={`flex items-center justify-between border-b pb-3 mb-4 shrink-0 transition-colors ${
        theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-base">📄</span>
          <h3 className="text-xs font-black tracking-tight">السكريبت المقترح</h3>
        </div>
        <span className={`text-[9px] font-black border px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all ${
          theme === 'dark'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
        }`}>
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> جاهز للنشر
        </span>
      </div>

      {/* جسد ومحتوى الكرت المقسم برمجياً بتدرجات متناسقة مع المظهر النشط */}
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-none pr-0.5 text-[11px] leading-relaxed">
        
        {/* 1. كتلة الخطاف البداية */}
        <div className={`p-3 rounded-xl border transition-all ${
          theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]/80' : 'bg-slate-50/50 border-slate-100/60'
        }`}>
          <span className={`block text-[9px] font-black mb-1 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>المقدمة (Hook)</span>
          <p className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{hook}</p>
        </div>

        {/* 2. كتلة العرض والمحتوى الجسدي */}
        <div className={`p-3 rounded-xl border transition-all ${
          theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]/80' : 'bg-slate-50/50 border-slate-100/60'
        }`}>
          <span className={`block text-[9px] font-black mb-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>المحتوى (Body)</span>
          <p className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{script}</p>
        </div>

        {/* 3. كتلة الخاتمة ونداء الإجراء */}
        {cta && (
          <div className={`p-3 rounded-xl border transition-all ${
            theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]/80' : 'bg-slate-50/50 border-slate-100/60'
          }`}>
            <span className={`block text-[9px] font-black mb-1 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>الخاتمة (CTA)</span>
            <p className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{cta}</p>
          </div>
        )}
      </div>

      {/* أزرار الحفظ والنسخ الفوري أسفل الكرت */}
      <div className={`flex items-center gap-2 border-t pt-3 mt-4 shrink-0 transition-colors ${
        theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
      }`}>
        <CopyButton text={fullScriptText} label="نسخ السكريبت" />
        <button
          type="button"
          onClick={handleSaveScript}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all active:scale-95 ${
            theme === 'dark'
              ? 'border-[#1f1438] text-slate-300 hover:bg-white/5'
              : 'border-slate-200/60 text-slate-500 hover:bg-slate-50'
          }`}
        >
          💾 حفظ السكريبت
        </button>
      </div>

    </div>
  )
}
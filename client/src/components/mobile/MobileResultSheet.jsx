import React from 'react'
import CopyButton from '../common/CopyButton.jsx'

export default function MobileResultSheet({ isOpen, onClose, hook, script, hashtags = [] }) {
  if (!isOpen) return null

  const fullText = `${hook}\n\n${script}\n\n${hashtags.join(' ')}`

  return (
    <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center dir-rtl text-right">
      
      {/* جدار التعتيم الزجاجي الخلفي */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* صندوق المحتوى المحدث القابل للنسخ والنسج الكامل */}
      <div className="relative bg-white dark:bg-slate-950 w-full max-h-[85vh] rounded-t-[28px] p-5 flex flex-col shadow-2xl z-10 border-t border-slate-200 dark:border-slate-800 animate-slide-up pb-safe text-slate-900 dark:text-white select-text">
        
        {/* مقبض السحب البصري */}
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4 shrink-0" onClick={onClose} />

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-4 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xs font-black text-slate-900 dark:text-white">السيناريو الجاهز للنشر</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-500 dark:text-slate-400 font-black text-[10px] px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors active:scale-95 select-none"
          >
            إغلاق اللوحة
          </button>
        </div>

        {/* كتل النصوص مجهزة بالكامل بـ select-text لضمان حرية السحب والإلصاق باللمس */}
        <div className="flex-1 overflow-y-auto pr-0.5 mb-4 space-y-4 text-[11px] leading-relaxed scrollbar-none select-text">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/60 select-text">
            <span className="block text-[9px] font-black text-blue-600 dark:text-blue-400 mb-1 select-none">المقدمة الخاطفة (Hook)</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed select-text">{hook}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/60 select-text">
            <span className="block text-[9px] font-black text-purple-600 dark:text-purple-400 mb-1 select-none">العرض والسيناريو الشامل (Body)</span>
            <p className="font-bold text-slate-800 dark:text-slate-300 leading-relaxed select-text">{script}</p>
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 font-sans font-black text-blue-600 dark:text-blue-400 select-text">
              {hashtags.map((tag, idx) => (
                <span key={idx} className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800/60 text-[10px] select-text">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center gap-2 shrink-0 select-none">
          <CopyButton text={fullText} label="نسخ النص بالكامل" />
        </div>

      </div>
    </div>
  )
}
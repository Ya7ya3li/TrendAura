import React from 'react'
import CopyButton from '../common/CopyButton.jsx'

/**
 * TrendAura Mobile Bottom-Sheet Result Presentation Sheet - Premium SVG Edition
 */
export default function MobileResultSheet({ isOpen, onClose, hook, script, hashtags = [] }) {
  if (!isOpen) return null

  const fullText = `${hook}\n\n${script}\n\n${hashtags.join(' ')}`

  return (
    <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center select-none dir-rtl text-right">
      
      {/* جدار الإغلاق والتعتيم الزجاجي الخلفي المعزز */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* ورقة وصندوق المحتوى المنبثق لأعلى بتوافق لوني فخم */}
      <div className="relative bg-slate-950 w-full max-h-[85vh] rounded-t-[28px] p-5 flex flex-col shadow-2xl z-10 border-t border-slate-800/80 animate-slide-up pb-safe">
        
        {/* مقبض السحب البصري المجهري بأعلى الورقة */}
        <div className="w-10 h-1 bg-slate-800 rounded-full mx-auto mb-4 shrink-0" onClick={onClose} />

        {/* هيدر ترويسة الورقة محول لـ SVG بالكامل */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xs font-black text-white">السيناريو الجاهز للنشر</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 font-black text-[10px] px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg transition-colors active:bg-slate-800"
          >
            إغلاق اللوحة
          </button>
        </div>

        {/* الكتل النصية الداخلية المصقولة والداعمة للتمرير الانسيابي ناعم الحركة */}
        <div className="flex-1 overflow-y-auto pr-0.5 mb-4 space-y-4 text-[11px] leading-relaxed scrollbar-none">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
            <span className="block text-[9px] font-black text-blue-400 mb-1">المقدمة الخاطفة (Hook)</span>
            <p className="font-bold text-slate-200 leading-relaxed">{hook}</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
            <span className="block text-[9px] font-black text-purple-400 mb-1">العرض والسيناريو الشامل (Body)</span>
            <p className="font-bold text-slate-300 leading-relaxed">{script}</p>
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 font-sans font-black text-blue-400">
              {hashtags.map((tag, idx) => (
                <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800/60 text-[10px]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* أزرار الإجراء السريع بأسفل الورقة مع دعم الـ Safe Padding للجوالات الحديثة */}
        <div className="w-full pt-3 border-t border-slate-900 flex items-center gap-2 shrink-0">
          <CopyButton text={fullText} label="نسخ النص بالكامل" />
        </div>

      </div>
    </div>
  )
}
import React from 'react'
import CopyButton from '../common/CopyButton'

/**
 * TrendAura Mobile Bottom-Sheet Result Presentation Sheet
 */
export default function MobileResultSheet({ isOpen, onClose, hook, script, hashtags = [] }) {
  if (!isOpen) return null

  const fullText = `${hook}\n\n${script}\n\n${hashtags.join(' ')}`

  return (
    <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center select-none dir-rtl text-right">
      
      {/* جدار الإغلاق والتعتيم الزجاجي الخلفي */}
      <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* ورقة وصندوق المحتوى المنبثق لأعلى */}
      <div className="relative bg-white w-full max-h-[85vh] rounded-t-[28px] p-5 flex flex-col shadow-2xl z-10 border-t border-slate-100 animate-slide-up pb-safe-padding">
        
        {/* مقبض السحب البصري المجهري بأعلى الورقة */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 shrink-0" onClick={onClose} />

        {/* هيدر ترويسة الورقة */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4 shrink-0">
          <h3 className="text-xs font-black text-slate-900">✨ السيناريو الجاهز للنشر</h3>
          <button onClick={onClose} className="text-slate-400 font-bold text-[10px] px-2 py-1 bg-slate-50 border rounded-lg active-touch">إغلاق</button>
        </div>

        {/* الكتل النصية القابلة للتمرير الداخلي للسكريبت */}
        <div className="flex-1 overflow-y-auto scrollbar-none space-y-4 text-[11px] leading-relaxed pr-0.5 mb-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="block text-[9px] font-black text-blue-600 mb-1">المقدمة الخاطفة</span>
            <p className="font-bold text-slate-700">{hook}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="block text-[9px] font-black text-purple-600 mb-1">العرض والسيناريو</span>
            <p className="font-bold text-slate-600">{script}</p>
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 font-sans font-black text-blue-500">
              {hashtags.map((tag, idx) => <span key={idx}>{tag}</span>)}
            </div>
          )}
        </div>

        {/* أزرار الإجراء السريع بأسفل الورقة */}
        <div className="w-full pt-3 border-t border-slate-50 flex items-center gap-2 shrink-0 mobile-safe-padding">
          <CopyButton text={fullText} label="نسخ النص بالكامل" />
        </div>

      </div>
    </div>
  )
}
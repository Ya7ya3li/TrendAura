import React from 'react'

/**
 * TrendAura Empty Fallback Board
 * Renders structured illustrations when data matrices return empty vectors.
 */
export default function EmptyState({ icon = '📂', title = 'المستودع فارغ حالياً', message = 'لا توجد عناصر لعرضها في هذه اللوحة الحركية.', actionText, onAction }) {
  return (
    <div className="w-full py-12 px-6 border border-dashed border-slate-200 rounded-3xl bg-white text-center flex flex-col items-center justify-center select-none animate-scale-up dir-rtl">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 border flex items-center justify-center text-xl mb-4 shadow-2xs">
        {icon}
      </div>
      <h3 className="text-xs font-black text-slate-800 mb-1">{title}</h3>
      <p className="text-[10px] font-semibold text-slate-400 max-w-sm leading-relaxed mb-6">
        {message}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl text-[10px] font-black bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 shadow-xs active:scale-95 transform transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
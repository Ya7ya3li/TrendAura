import React from 'react'

/**
 * TrendAura Empty Fallback Board - Dual Theme Edition
 */
export default function EmptyState({ icon, title = 'المستودع فارغ حالياً', message = 'لا توجد عناصر لعرضها في هذه اللوحة الحركية.', actionText, onAction }) {
  return (
    <div className="w-full py-12 px-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/20 text-center flex flex-col items-center justify-center select-none animate-scale-up dir-rtl transition-colors duration-300">
      
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xl mb-4 shadow-sm dark:shadow-inner shrink-0 transition-colors">
        {icon || (
          <svg className="w-6 h-6 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      
      <h3 className="text-xs font-black text-slate-900 dark:text-white mb-1.5 transition-colors">{title}</h3>
      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-6 transition-colors">
        {message}
      </p>
      
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl text-[10px] font-black bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/30 shadow-sm active:scale-95 transform transition-all outline-none"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
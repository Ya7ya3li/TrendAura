import React, { useEffect } from 'react'

/**
 * TrendAura Blur Screen Overlay Modal - Pure SVG Edition
 * Blocks background scroll metrics while listening for structural dismissal tokens.
 */
export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all dir-rtl text-right select-none">
      <div className="fixed inset-0 bg-transparent" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative z-10 animate-scale-up transform transition-all">
        
        {/* الهيدر العلوي للنافذة مع زر إغلاق بصيغة SVG ناصعة */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
          <h3 className="text-xs font-black text-white tracking-tight">{title || 'تنبيه النظام التكتيكي'}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 flex items-center justify-center active:scale-90 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="w-full text-slate-300">{children}</div>
      </div>
    </div>
  )
}
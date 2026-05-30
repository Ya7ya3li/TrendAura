import React, { useEffect } from 'react'

/**
 * TrendAura Blur Screen Overlay Modal
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
    <div className="fixed inset-0 bg-slate-950/10 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all dir-rtl text-right select-none">
      <div className="fixed inset-0 bg-transparent" onClick={onClose} />
      <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full shadow-2xl relative z-10 animate-scale-up transform transition-all">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">{title || 'تنبيه النظام'}</h3>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-50 border hover:bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
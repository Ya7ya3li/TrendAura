import React, { useState } from 'react'

/**
 * TrendAura Smart Copy Trigger - Dual Theme Edition
 */
export default function CopyButton({ text, label = "نسخ النص" }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all duration-300 flex items-center gap-1.5 active:scale-95 outline-none ${
        copied 
          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' 
          : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
      <span>{copied ? 'تم النسخ بالكامل!' : label}</span>
    </button>
  )
}
import React, { useState } from 'react'

/**
 * TrendAura Smart Copy Trigger
 * Copies target strings to navigator buffer with momentary layout state feedback.
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
      className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
        copied 
          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
          : 'bg-slate-50 text-slate-500 border-slate-200/60 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      <span>{copied ? '✅' : '📋'}</span>
      <span>{copied ? 'تم النسخ!' : label}</span>
    </button>
  )
}
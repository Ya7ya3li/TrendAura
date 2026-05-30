import React from 'react'
import Button from '../common/Button'

/**
 * TrendAura Mobile-First Touch Optimized Prompt Aggregator
 */
export default function MobileGenerator({ prompt, setPrompt, loading, onGenerate }) {
  return (
    <div className="w-full bg-white border border-slate-100 rounded-[24px] p-4 shadow-md text-right dir-rtl select-none md:hidden">
      
      <div className="w-full relative mb-3">
        <textarea
          value={prompt}
          onChange={(e) => e.target.value.length <= 500 && setPrompt(e.target.value)}
          placeholder="اكتب فكرتك البرّاقة هنا والمس توليد..."
          disabled={loading}
          className="w-full bg-slate-50/70 text-slate-800 placeholder-slate-300 p-3 pb-8 rounded-xl border border-slate-200/50 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all min-h-[95px] resize-none"
        />
        <span className="absolute left-3 bottom-2 text-[9px] font-bold text-slate-300 font-sans">
          {prompt?.length || 0}/500
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-slate-400">✦ أسلوب ذكي مكثف</span>
        <Button
          onClick={onGenerate}
          loading={loading}
          variant="primary"
          className="bg-blue-600 text-white font-black px-5 py-2.5 rounded-xl text-[10px] shadow-sm shrink-0 active-touch"
        >
          توليد فوري ✦
        </Button>
      </div>

    </div>
  )
}
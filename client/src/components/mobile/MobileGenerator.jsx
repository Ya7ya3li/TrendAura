import React from 'react'
import Button from '../common/Button.jsx'

/**
 * TrendAura Mobile-First Touch Optimized Prompt Aggregator
 */
export default function MobileGenerator({ prompt, setPrompt, loading, onGenerate }) {
  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[24px] p-4 shadow-xl text-right dir-rtl select-none md:hidden animate-scale-up">
      
      <div className="w-full relative mb-3">
        <textarea
          value={prompt}
          onChange={(e) => e.target.value.length <= 500 && setPrompt(e.target.value)}
          placeholder="اكتب فكرتك البرّاقة هنا والمس توليد فوراً..."
          disabled={loading}
          className="w-full bg-slate-950/60 text-slate-200 placeholder-slate-600 p-3 pb-8 rounded-xl border border-slate-800 text-xs font-bold outline-none focus:border-blue-500 transition-all min-h-[95px] resize-none leading-relaxed"
        />
        <span className="absolute left-3 bottom-2 text-[9px] font-bold text-slate-600 font-sans">
          {prompt?.length || 0}/500
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* استبدال الرمز النصي بأيقونة SVG احترافية ناصعة للبرق الذكي */}
        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
          <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>أسلوب توليد ذكي مكثف</span>
        </div>

        <Button
          onClick={onGenerate}
          loading={loading}
          variant="primary"
          className="bg-blue-600 text-white font-black px-5 py-2.5 rounded-xl text-[10px] shadow-lg shadow-blue-500/10 shrink-0 border-none flex items-center gap-1.5"
        >
          <span>توليد فوري</span>
        </Button>
      </div>

    </div>
  )
}
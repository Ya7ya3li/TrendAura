import React, { useState } from 'react'
import Button from '../common/Button.jsx'

export default function GeneratorBox({ prompt, setPrompt, loading, onGenerate }) {
  const [activeChip, setActiveChip] = useState('تحفيزي')
  const chips = ['تحفيزي', 'تعليمي', 'قصير', ' تفاصيل']

  return (
    <div className="w-full bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[28px] p-5 shadow-sm dark:shadow-xl text-right dir-rtl select-none animate-scale-up transition-colors duration-300">

      <div className="relative w-full mb-4">
        <textarea
          value={prompt}
          onChange={(e) => e.target.value.length <= 500 && setPrompt(e.target.value)}
          placeholder="اكتب فكرتك هنا ودع الذكاء الاصطناعي يتكفل بصياغة الـ Hook والسيناريو..."
          disabled={loading}
          className="w-full bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 pr-4 pl-4 pt-4 pb-10 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all min-h-[110px] resize-none text-xs font-bold leading-relaxed"
        />
        <span className="absolute left-4 bottom-3 text-[10px] font-bold text-slate-400 dark:text-slate-600 font-sans transition-colors">
          {prompt?.length || 0}/500
        </span>
      </div>

      <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveChip(chip)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all border ${activeChip === chip
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-200 dark:border-blue-500/30'
                  : 'bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <Button
          onClick={() => onGenerate(activeChip)} // 👑 هنا التعديل: نمرر الأسلوب للـ Hook
          loading={loading}
          variant="primary"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-6 py-2.5 rounded-xl text-[11px] hover:from-blue-700 shadow-lg shadow-blue-500/20 shrink-0 border-none"
        >
          توليد السكريبت ✦
        </Button>
      </div>
    </div>
  )
}
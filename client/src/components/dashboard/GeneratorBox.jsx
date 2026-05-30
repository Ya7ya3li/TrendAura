import React, { useState } from 'react'
import Button from '../common/Button'

/**
 * TrendAura Core Prompt Input Console
 * Replicates the exact input container, micro-chips, and trigger from image_43.png.
 */
export default function GeneratorBox({ prompt, setPrompt, loading, onGenerate }) {
  const [activeChip, setActiveChip] = useState('تحفيزي')
  const chips = ['تحفيزي', 'تعليمي', 'قصير', '📝 تفاصيل']

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[28px] p-5 shadow-xl shadow-slate-200/40 text-right dir-rtl select-none animate-scale-up">
      
      {/* حقل الإدخال والكتابة الرئيسي */}
      <div className="relative w-full mb-4">
        <span className="absolute right-4 top-4 text-slate-400 text-sm">📎</span>
        <textarea
          value={prompt}
          onChange={(e) => e.target.value.length <= 500 && setPrompt(e.target.value)}
          placeholder="اكتب فكرتك هنا..."
          disabled={loading}
          className="w-full bg-slate-50/50 text-slate-800 placeholder-slate-300 pr-11 pl-4 pt-4 pb-10 rounded-2xl border border-slate-200/60 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all min-h-[110px] resize-none"
        />
        {/* عداد الحروف المجهري الأسفل */}
        <span className="absolute left-4 bottom-3 text-[10px] font-bold text-slate-300 font-sans">
          {prompt?.length || 0}/500
        </span>
      </div>

      {/* شريط الخيارات والأزرار التفاعلية المجهرية أسفل الحقل */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveChip(chip)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all border ${
                activeChip === chip
                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                  : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* زر التوليد الملوكي الكبير بنقاط توهج نيون */}
        <Button
          onClick={onGenerate}
          loading={loading}
          variant="primary"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-6 py-2.5 rounded-xl text-[11px] hover:from-blue-700 shadow-md shadow-blue-100 shrink-0"
        >
          توليد السكريبت ✦
        </Button>
      </div>

    </div>
  )
}
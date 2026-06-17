import React from 'react'
import CopyButton from '../common/CopyButton.jsx'

export default function HashtagsCard({ hashtags = [] }) {
  const displayTags = hashtags && hashtags.length > 0 ? hashtags : ['#fyp', '#viral', '#foryou', '#fypシ', '#اكسبلور', '#ترند', '#الشعب_الصيني_ماله_حل', '#صناعة_محتوى', '#ذكاء_اصطناعي', '#ترند_جديد']
  const hashtagsString = displayTags.join(' ')

  return (
    <div className="w-full bg-white dark:bg-[#160f30]/40 border border-slate-200 dark:border-[#1f1438] rounded-[28px] p-5 shadow-sm dark:shadow-black/40 text-slate-900 dark:text-white select-none flex flex-col justify-between animate-fade-in transition-colors duration-300">
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-[#1f1438]/50 transition-colors">
          <span className="text-sm font-black text-blue-600 dark:text-cyan-400 transition-colors">#</span>
          <h3 className="text-xs font-black tracking-tight">هاشتاقات ترند مقترحة</h3>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-black font-sans mb-5">
          {displayTags.map((tag, idx) => (
            <span 
              key={idx} 
              className="transition-colors cursor-pointer px-2.5 py-1 rounded-xl border bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-200 dark:hover:border-cyan-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-[#1f1438]/50 transition-colors">
        <CopyButton text={hashtagsString} label="نسخ الهاشتاقات" />
      </div>
    </div>
  )
}
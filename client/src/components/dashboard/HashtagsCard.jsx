import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext.jsx'
import CopyButton from '../common/CopyButton.jsx'

export default function HashtagsCard({ hashtags = [] }) {
  const { theme } = useContext(ThemeContext)
  
  // تأمين مصفوفة الفالباك في حال كان التوليد في أوله ولم يفرز السيرفر الهاشتاقات بعد
  const displayTags = hashtags && hashtags.length > 0 ? hashtags : ['#fyp', '#viral', '#صناعة_محتوى']
  const hashtagsString = displayTags.join(' ')

  return (
    <div className={`w-full border rounded-[28px] p-5 shadow-xl select-none flex flex-col justify-between animate-fade-in transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40'
        : 'bg-white border-slate-100 shadow-slate-200/40'
    }`}>
      <div>
        <div className={`flex items-center gap-2 mb-4 pb-2 border-b transition-colors ${
          theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
        }`}>
          <span className={`text-sm font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>#</span>
          <h3 className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>هاشتاقات ترند مقترحة</h3>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-black font-sans mb-5">
          {displayTags.map((tag, idx) => (
            <span 
              key={idx} 
              className={`transition-colors cursor-pointer px-2.5 py-1 rounded-xl border ${
                theme === 'dark' 
                  ? 'text-slate-300 hover:text-cyan-400 bg-slate-950/40 border-slate-800/80' 
                  : 'text-slate-500 hover:text-blue-600 bg-slate-50 border-slate-100'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={`pt-2 border-t transition-colors ${
        theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
      }`}>
        <CopyButton text={hashtagsString} label="نسخ الهاشتاقات" />
      </div>
    </div>
  )
}
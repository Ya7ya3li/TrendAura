import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext' // 🧬 حقن شريان المظهر العالمي
import CopyButton from '../common/CopyButton'

/**
 * TrendAura Hashtags Discovery Matrix Card - Adaptive Neon Edition
 * Dynamic styling framework reacting to dark and light global color states instantly.
 */
export default function HashtagsCard({ hashtags = [] }) {
  const { theme } = useContext(ThemeContext)
  const hashtagsString = hashtags.join(' ')

  return (
    <div className={`w-full border rounded-[28px] p-5 shadow-xl select-none flex flex-col justify-between animate-fade-in transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40'
        : 'bg-white border-slate-100 shadow-slate-200/40'
    }`}>
      <div>
        {/* الترويسة العلوية للهاشتاقات */}
        <div className={`flex items-center gap-2 mb-4 pb-2 border-b transition-colors ${
          theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
        }`}>
          <span className={`text-sm font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>#</span>
          <h3 className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>هاشتاقات ترند</h3>
        </div>

        {/* قائمة الأوسمة والهاشتاقات الحية - تتوهج بالسيبرانية التفاعلية */}
        <div className="flex flex-col gap-1.5 text-[11px] font-black font-sans mb-5">
          {hashtags.map((tag, idx) => (
            <span 
              key={idx} 
              className={`transition-colors cursor-pointer block ${
                theme === 'dark' 
                  ? 'text-slate-300 hover:text-cyan-400 drop-shadow-[0_0_2px_rgba(34,211,238,0.2)]' 
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* خط التذييل وزر النسخ الموحد */}
      <div className={`pt-2 border-t transition-colors ${
        theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
      }`}>
        <CopyButton text={hashtagsString} label="نسخ الهاشتاقات" />
      </div>
    </div>
  )
}
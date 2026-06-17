import React from 'react'

export default function ViralIdeasCard({ customIdeas = [] }) {
  const displayIdeas = customIdeas || []

  return (
    <div className="w-full bg-white dark:bg-[#160f30]/40 border border-slate-200 dark:border-[#1f1438] rounded-[28px] p-5 shadow-sm dark:shadow-black/40 text-slate-900 dark:text-white select-none flex flex-col justify-between animate-fade-in transition-colors duration-300">
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-[#1f1438]/50 transition-colors">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-xs font-black tracking-tight">أفكار ترند حية</h3>
        </div>

        {displayIdeas.length > 0 ? (
          <div className="space-y-3 text-[11px] font-bold text-slate-600 dark:text-slate-400 transition-colors">
            {displayIdeas.map((idea, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <span className="text-[9px] text-blue-500 dark:text-purple-500 mt-0.5 transition-colors">•</span>
                <p className="leading-relaxed">{idea}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[10px] font-bold text-slate-400 dark:text-slate-500 animate-pulse transition-colors">
            بانتظار كتابة فكرتك وتوليد الأفكار الحقيقية من السيرفر... ✨
          </div>
        )}
      </div>
    </div>
  )
}
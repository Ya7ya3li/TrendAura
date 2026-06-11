import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext.jsx'

export default function ViralIdeasCard({ customIdeas = [] }) {
  const { theme } = useContext(ThemeContext)
  const displayIdeas = customIdeas || []

  return (
    <div className={`w-full border rounded-[28px] p-5 shadow-xl select-none flex flex-col justify-between animate-fade-in transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40 text-white'
        : 'bg-white border-slate-100 shadow-slate-200/40 text-slate-800'
    }`}>
      <div>
        <div className={`flex items-center gap-2 mb-4 pb-2 border-b transition-colors ${
          theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
        }`}>
          <span className="text-sm text-amber-500">💡</span>
          <h3 className="text-xs font-black tracking-tight">أفكار ترند حية</h3>
        </div>

        {/* 🛡️ فحص حقيقي: إذا رجعت أفكار من السيرفر يعرضها، وغير كذا يظهر حالة انتظار صادقة */}
        {displayIdeas.length > 0 ? (
          <div className="space-y-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {displayIdeas.map((idea, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <span className="text-[9px] text-slate-300 dark:text-purple-500 mt-0.5">•</span>
                <p className="leading-relaxed">{idea}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[10px] font-bold text-slate-400 dark:text-slate-500 animate-pulse">
            بانتظار كتابة فكرتك وتوليد الأفكار الحقيقية من السيرفر... ✨
          </div>
        )}
      </div>
    </div>
  )
}
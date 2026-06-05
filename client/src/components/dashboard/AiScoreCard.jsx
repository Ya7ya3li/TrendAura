import React from 'react'

/**
 * TrendAura Core AI Script Viral Potential Scoring Gauge
 */
export default function AiScoreCard({ score = 85 }) {
  // حساب محيط الدائرة البرمجية للمؤشر بدقة
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[28px] p-5 shadow-xl text-right dir-rtl select-none flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-tight">AI Score Matrix</span>
        </div>
        <h3 className="text-xs font-black text-white tracking-tight leading-snug">نقاط كسر الخوارزمية المتوقعة</h3>
        <p className="text-[10px] font-semibold text-slate-400 mt-1 leading-normal">النص يحتوي على محفزات سيكولوجية تضمن بقاء المشاهد وتفاعل الخوارزمية.</p>
      </div>

      {/* حلقة الرسم البياني الدائرية المجهرية الفاخرة للرقم */}
      <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r={radius} className="text-slate-800/40" strokeWidth="6" stroke="currentColor" fill="transparent" />
          <circle 
            cx="40" 
            cy="40" 
            r={radius} 
            className="text-blue-500 transition-all duration-500 ease-out drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" 
            strokeWidth="6" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            stroke="currentColor" 
            fill="transparent" 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-white font-sans tracking-tight">{score}</span>
          <span className="text-[8px] font-black text-slate-500 -mt-0.5">100/</span>
        </div>
      </div>
    </div>
  )
}
import React, { useState } from 'react'

export default function BestTimeCard({ customTimes = [] }) {
  const [showCalendar, setShowCalendar] = useState(false)

  const defaultTimes = [
    { hour: 'الساعة 10:00 صباحاً', power: 3 },
    { hour: 'الساعة 1:00 ظهراً', power: 4 },
    { hour: 'الساعة 6:00 مساءً', power: 5 },
    { hour: 'الساعة 9:00 مساءً', power: 4 }
  ]
  const displayTimes = customTimes && customTimes.length > 0 ? customTimes : defaultTimes

  const weeklyReport = [
    { day: 'السبت', bestHour: '06:00 مساءً', rate: '94%' },
    { day: 'الأحد', bestHour: '09:00 مساءً', rate: '88%' },
    { day: 'الاثنين', bestHour: '01:00 ظهراً', rate: '75%' },
    { day: 'الثلاثاء', bestHour: '06:00 مساءً', rate: '82%' },
    { day: 'الأربعاء', bestHour: '10:00 صباحاً', rate: '89%' },
    { day: 'الخميس', bestHour: '08:00 مساءً', rate: '97%' },
    { day: 'الجمعة', bestHour: '04:00 مساءً', rate: '99%' }
  ]

  return (
    <>
      <div className="w-full bg-white dark:bg-[#160f30]/40 border border-slate-200 dark:border-[#1f1438] rounded-[28px] p-5 shadow-sm dark:shadow-black/40 text-slate-900 dark:text-white select-none animate-scale-up transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-[#1f1438]/50 transition-colors">
          <svg className="w-4 h-4 text-blue-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xs font-black tracking-tight">أوقات النشر المثالية</h3>
        </div>

        <div className="space-y-3.5 mb-5 text-[11px] font-bold text-slate-600 dark:text-slate-400 transition-colors">
          {displayTimes.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="tracking-tight text-slate-800 dark:text-slate-200 transition-colors">{item.hour}</span>
              
              <div className="flex items-end gap-0.5 h-3">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-sm transition-all ${
                      bar <= (item.power || 4)
                        ? 'bg-blue-500 dark:bg-cyan-400 dark:drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]'
                        : 'bg-slate-200 dark:bg-[#23184a]'
                    }`}
                    style={{ height: `${bar * 20}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowCalendar(true)}
          className="w-full border border-slate-200 dark:border-[#1f1438] bg-slate-50 dark:bg-[#0d071d] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-cyan-400 rounded-xl py-2 text-[10px] font-black flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>تحليل وتقويم مواعيد النشر</span>
        </button>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-colors" onClick={() => setShowCalendar(false)} />
          
          <div className="relative w-full max-w-md border border-slate-200 dark:border-[#1f1438] bg-white dark:bg-[#0d071d]/95 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl transition-all animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1f1438]/50 mb-4 transition-colors">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div className="flex flex-col text-right">
                  <h4 className="text-xs font-black">مصفوفة المواعيد الشهرية العالمية</h4>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 transition-colors">مزامنة أوتوماتيكية مع ذروة نشاط قنواتك اليوم</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCalendar(false)}
                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-500 flex items-center justify-center text-xs font-bold transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2.5 text-right dir-rtl">
              <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {weeklyReport.map((report, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-[#1f1438]/60 bg-slate-50 dark:bg-[#160f30]/40 transition-colors"
                  >
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 transition-colors">{report.day}</span>
                    <div className="flex items-center gap-4 text-[11px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400 font-sans transition-colors">{report.bestHour}</span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 transition-colors">{report.rate} كفاءة</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowCalendar(false)}
              className="w-full mt-5 py-3 bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-white font-black text-[11px] rounded-xl transition-all active:scale-95 shadow-md shadow-blue-500/20"
            >
              إغلاق نافذة التحليل ✦
            </button>
          </div>
        </div>
      )}
    </>
  )
}
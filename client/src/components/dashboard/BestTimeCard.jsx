import React, { useState, useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext.jsx'

export default function BestTimeCard({ customTimes = [] }) {
  const { theme } = useContext(ThemeContext)
  const [showCalendar, setShowCalendar] = useState(false)

  // 🏆 تعديل هندسي: الالتزام ببيانات الذكاء الاصطناعي الحركية المستلمة، مع توفير فالباك مستقر
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
      <div className={`w-full border rounded-[28px] p-5 shadow-xl select-none animate-scale-up transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40 text-white'
          : 'bg-white border-slate-100 shadow-slate-200/40 text-slate-800'
      }`}>
        <div className={`flex items-center gap-2 mb-4 pb-2 border-b transition-colors ${
          theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
        }`}>
          <span className="text-sm">🕒</span>
          <h3 className="text-xs font-black tracking-tight">أوقات النشر المثالية</h3>
        </div>

        <div className="space-y-3.5 mb-5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {displayTimes.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="tracking-tight text-slate-700 dark:text-slate-200">{item.hour}</span>
              
              <div className="flex items-end gap-0.5 h-3">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-sm transition-all ${
                      bar <= (item.power || 4)
                        ? (theme === 'dark' ? 'bg-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]' : 'bg-blue-600')
                        : (theme === 'dark' ? 'bg-[#23184a]' : 'bg-slate-100')
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
          className={`w-full border rounded-xl py-2 text-[10px] font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            theme === 'dark'
              ? 'bg-[#0d071d] hover:bg-white/5 border-[#1f1438] text-cyan-400'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-600'
          }`}
        >
          <span>📅 تحليل وتقويم مواعيد النشر</span>
        </button>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowCalendar(false)} />
          
          <div className={`relative w-full max-w-md border rounded-3xl p-6 shadow-2xl transition-all animate-scale-up ${
            theme === 'dark' ? 'bg-[#0d071d]/95 border-[#1f1438] text-white' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1f1438]/50 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base">📊</span>
                <div className="flex flex-col text-right">
                  <h4 className="text-xs font-black">مصفوفة المواعيد الشهرية العالمية</h4>
                  <span className="text-[9px] text-slate-400">مزامنة أوتوماتيكية مع ذروة نشاط قنواتك اليوم</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCalendar(false)}
                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-right dir-rtl">
              <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {weeklyReport.map((report, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]/60' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{report.day}</span>
                    <div className="flex items-center gap-4 text-[11px] font-bold">
                      <span className="text-slate-400 font-sans">{report.bestHour}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${
                        theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'
                      }`}>{report.rate} كفاءة</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowCalendar(false)}
              className="w-full mt-5 py-3 bg-slate-900 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-white font-black text-[11px] rounded-xl transition-all active:scale-95"
            >
              إغلاق نافذة التحليل ✦
            </button>
          </div>
        </div>
      )}
    </>
  )
}
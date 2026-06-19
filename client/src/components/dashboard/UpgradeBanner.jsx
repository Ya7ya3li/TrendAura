import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

export default function UpgradeBanner() {
  const navigate = useNavigate()

  return (
    <div className="w-full bg-indigo-50 dark:bg-gradient-to-r dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-blue-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-right dir-rtl select-none animate-fade-in transition-colors duration-300">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 text-amber-500 animate-bounce shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.4L22 9.6l-5.6 5.4 1.3 7.8-6.1-3.2-6.1 3.2 1.3-7.8L1 9.6l7.6-.2L12 2z" />
        </svg>
        <div className="flex flex-col">
          <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-tight transition-colors">ضاعف مشاهداتك 10 مرات وافتح محرك viral engine الاستراتيجي!</h4>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">اشترك في باقات صُنّاع النخبة وفجّر أرقام حساباتك بذكاء خوارزمي متمم.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(ROUTES.PRICING)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] rounded-xl shadow-md shadow-blue-500/20 tracking-wide transition-all active:scale-95 shrink-0 border-none outline-none"
      >
        اكتشف الباقات  ⚡
      </button>
    </div>
  )
}
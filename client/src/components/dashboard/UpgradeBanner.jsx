import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

export default function UpgradeBanner() {
  const navigate = useNavigate() // 🏆 سحق الهارد ريلود

  return (
    <div className="w-full bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-right dir-rtl select-none animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-xl animate-bounce">👑</span>
        <div className="flex flex-col">
          <h4 className="text-xs font-black text-white tracking-tight">ضاعف مشاهداتك 10 مرات وافتح محرك الفايرال الاستراتيجي!</h4>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">اشترك في باقات صُنّاع النخبة وفجّر أرقام حساباتك بذكاء خوارزمي متمم.</p>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => navigate(ROUTES.PRICING)} // الانتقال النظيف فائق السرعة
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] rounded-xl shadow-lg shadow-blue-500/20 tracking-wide transition-all active:scale-95 shrink-0 border-none"
      >
        اكتشف الباقات  ⚡
      </button>
    </div>
  )
}
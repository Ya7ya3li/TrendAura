import React from 'react'

/**
 * TrendAura Dynamic In-App Conversion Upgrade Banner Strip
 */
export default function UpgradeBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-right dir-rtl select-none animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-xl animate-bounce">👑</span>
        <div className="flex flex-col">
          <h4 className="text-xs font-black text-slate-900 tracking-tight">ضاعف مشاهداتك 10 مرات وافتح محرك الفايرال!</h4>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">اشترك في باقات Pro VIP وفجّر أرقام حساباتك بذكاء خوارزمي متكامل.</p>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => window.location.href = '/pricing'}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] rounded-xl shadow-md shadow-blue-100 tracking-wide transition-all active:scale-95 shrink-0"
      >
        اكتشف الباقات والأسعار ⚡
      </button>
    </div>
  )
}
import React from 'react'
import UpgradeButton from './UpgradeButton.jsx'

/**
 * TrendAura Premium Cyberpunk Pricing Panel - V2 Elite Image Match Edition
 */
// 🏆 1. استقبال دالة النقر المركزية وحالة الـ Loading من ملف الأسعار الرئيسي
export default function PricingCard({ plan, isCurrent, userId, onSubscribe, isLoading }) {
  const planId = plan.id?.toLowerCase()?.trim()
  const isViral = planId === 'viral_engine' || planId === 'viral engine'
  const isPro = planId === 'pro'
  const isFree = planId === 'free'

  let cardStyle = "bg-[#111625]/90 border-slate-800 text-white"
  if (isViral) {
    cardStyle = "bg-[#111625]/95 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.25)] text-white relative z-10 scale-[1.02] md:-translate-y-1"
  } else if (isPro) {
    cardStyle = "bg-[#111625]/95 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.25)] text-white relative z-10"
  } else {
    cardStyle = "bg-[#111625]/60 border-slate-800/80 text-white opacity-95"
  }

  return (
    <div className={`rounded-[28px] p-6 flex flex-col justify-between border transition-all duration-300 relative select-none text-right dir-rtl ${cardStyle}`}>
      
      {/* ⚡ اللافتات العلوية المضيئة المدمجة */}
      {isViral && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-black text-[9px] px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-rose-600/30 whitespace-nowrap flex items-center gap-1.5">
          <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM12 14a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>اختيار صناع المحتوى </span>
        </div>
      )}

      {isPro && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-[9px] px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-600/30 whitespace-nowrap flex items-center gap-1.5">
          <svg className="w-3 h-3 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span>الأكثر شعبية </span>
        </div>
      )}

      <div>
        {/* شارات الحالة الدائرية المضيئة */}
        <div className="flex items-center justify-center gap-2 mb-4 mt-2">
          {isViral && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] shrink-0" />}
          {isPro && <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)] shrink-0" />}
          {isFree && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] shrink-0" />}
          
          <h3 className="text-sm font-black tracking-tight text-white">
            {plan.name}
          </h3>
        </div>

        <div className="text-center mb-2">
          <span className="text-4xl font-black font-sans tracking-tight text-white block">
            {plan.price}
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1 block">
            {plan.currency || 'ريال'} / {plan.period || 'شهر'}
          </span>
        </div>

        <p className="text-[10px] font-semibold text-slate-400 text-center leading-relaxed mb-5 min-h-[32px] px-2">
          {plan.desc}
        </p>

        <div className="border-t border-slate-800/50 my-4" />

        <div className="mb-6">
          <ul className="space-y-3 text-[10px] font-bold text-right">
            {plan.features?.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-normal">
                <svg className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isViral ? 'text-rose-500' : isPro ? 'text-blue-400' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300 font-medium">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-2 shrink-0">
        {/* 🏆 2. تمرير دالة التشغيل وحالة الـ Loading لزر الترقية الفعلي */}
        <UpgradeButton
          planId={plan.id}
          price={plan.price}
          userId={userId}
          isCurrent={isCurrent}
          customText={plan.buttonText}
          onClick={() => onSubscribe(plan)} // حقن دالة البوب أب والـ Polling
          loading={isLoading} // حقن حالة التحميل النيون
        />
      </div>
    </div>
  )
}
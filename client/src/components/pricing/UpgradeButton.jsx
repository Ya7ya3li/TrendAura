import React from 'react'

/**
 * TrendAura Contextual Commercial Upgrade Trigger - V2 Premium Dynamic Styling (Controlled Edition)
 */
export default function UpgradeButton({ planId, price, isCurrent, customText, onClick, loading }) {
  const cleanPlanId = planId?.toLowerCase()?.trim()
  
  // 🛡️ صمام أمان تلقائي: رصد إذا كان الكرت الحالي يخص الباقة المجانية الأساسية
  const isFreePlan = cleanPlanId === 'free' || cleanPlanId === 'free_tier'

  return (
    <button
      type="button"
      // الزر يعطل إذا كان هناك تحميل، أو إذا كانت الباقة الحالية للمستخدم، أو إذا كان كرت الباقة المجانية
      disabled={loading || isCurrent || isFreePlan}
      onClick={isFreePlan ? undefined : onClick} 
      className={`w-full py-3 px-5 rounded-xl text-[10px] font-black transition-all duration-200 transform flex items-center justify-center gap-2 select-none border-none outline-none ${
        isCurrent
          ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
          : isFreePlan
            ? 'bg-slate-900/60 text-slate-500 border border-slate-800/40 cursor-not-allowed opacity-40' // ستايل مطفي نيون يتناسب مع وضع الـ Cyberpunk للباقة الحرة
            : cleanPlanId === 'viral_engine' || cleanPlanId === 'viral engine'
              ? 'bg-gradient-to-r from-rose-600 to-orange-500 hover:opacity-95 text-white shadow-lg shadow-rose-950/40 active:scale-[0.98]'
              : cleanPlanId === 'pro'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-blue-950/40 active:scale-[0.98]'
                : 'bg-slate-700 hover:bg-slate-600 text-white shadow-md active:scale-[0.98]'
      }`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>جاري التهيئة.</span>
        </>
      ) : isCurrent ? (
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>الخطّة الفعّالة</span>
        </span>
      ) : isFreePlan ? (
        // 🏆 النص المخصص الفخم للباقة الافتراضية
        <span>الباقة الأساسية الحرة ✦</span>
      ) : (
        <span>{customText || 'اشترك الآن '}</span>
      )}
    </button>
  )
}
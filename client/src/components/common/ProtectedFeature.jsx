import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

/**
 * TrendAura SaaS Immersive Protected Feature Portal
 * يفحص رتب الباقات بالملي ويحظر المميزات المتقدمة بلمسة كابوس النيون الضبابي
 */
export default function ProtectedFeature({ currentPlan = 'free', minRequiredPlan = 'pro', featureName = 'الميزة المتقدمة', children }) {
  const navigate = useNavigate()
  
  const userPlanClean = String(currentPlan || 'free').toLowerCase().trim()
  const reqPlanClean = String(minRequiredPlan || 'pro').toLowerCase().trim()

  // ميزان قياس رتب الباقات داخلياً لضمان صفر تداخل أو تخطي برمجائي
  const getPlanTierLocal = (plan) => {
    if (plan === 'viral_engine' || plan === 'viral engine') return 3
    if (plan === 'pro') return 2
    return 1 // free
  }

  const userTier = getPlanTierLocal(userPlanClean)
  const requiredTier = getPlanTierLocal(reqPlanClean)

  // فتح الميزة فوراً للعملاء المصرح لهم
  if (userTier >= requiredTier) {
    return <>{children}</>
  }

  return (
    <div className="relative border border-slate-200 dark:border-slate-800 rounded-[28px] overflow-hidden bg-slate-50 dark:bg-slate-900/10 p-2 min-h-[220px] flex items-center justify-center select-none group transition-all duration-300 shadow-inner">
      
      {/* غطاء ضبابي عميق يعزل الأرقام والبيانات الحقيقية في الخلفية لمنع استهلاكها */}
      <div className="w-full h-full opacity-5 dark:opacity-10 blur-xl pointer-events-none filter select-none">
        {children}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 animate-scale-up">
        {/* قفل النيون المضيء */}
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-950/20 shrink-0 mb-3 border-none animate-neon-pulse">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-tight mb-1">فتح ترسانة {featureName}</h4>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 max-w-[240px] leading-normal mb-4">
          هذه الأدوات الاستراتيجية والتحليلات العميقة متاحة حصرياً لمشتركي خطة <span className="text-purple-500 uppercase font-black">{reqPlanClean}</span> وما فوق.
        </p>
        
        <button
          type="button"
          onClick={() => navigate(ROUTES.PRICING)}
          className="px-5 py-2.5 rounded-xl text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 transform transition-all outline-none border-none flex items-center gap-1.5 select-none cursor-pointer"
        >
          <span>ترقية باقة حسابك الآن</span>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  )
}
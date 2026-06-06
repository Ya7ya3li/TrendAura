import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlanTier } from '../../constants/plans.js'
import { ROUTES } from '../../constants/routes.js'

export default function ProtectedFeature({ currentPlan = 'free', minRequiredPlan = 'pro', featureName = 'الميزة المتقدمة', children }) {
  const navigate = useNavigate()
  
  const userPlanClean = (currentPlan || 'free').toLowerCase().trim()
  const reqPlanClean = (minRequiredPlan || 'pro').toLowerCase().trim()

  const userTier = getPlanTier(userPlanClean)
  const requiredTier = getPlanTier(reqPlanClean)

  // فتح الميزة فورا إذا كان مستوى باقة العميل أكبر أو يساوي المستوى المطلوب
  if (userTier >= requiredTier) {
    return <>{children}</>
  }

  return (
    <div className="relative border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900/10 p-2 min-h-[240px] flex items-center justify-center select-none group transition-all duration-300 shadow-inner">
      
      {/* غطاء ضبابي يعزل محتويات الميزة المتقدمة بالكامل لمنع استهلاكها */}
      <div className="w-full h-full opacity-5 dark:opacity-10 blur-xl pointer-events-none filter select-none">
        {children}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 animate-scale-up">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-950/20 shrink-0 mb-3 border-none animate-neon-pulse">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
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
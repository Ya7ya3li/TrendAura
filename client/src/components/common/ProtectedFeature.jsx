import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlanTier } from '../../constants/plans.js'
import { ROUTES } from '../../constants/routes.js' // ربط مليمتر مع الـ ROUTES الموحدة

/**
 * TrendAura Core Feature Gateway Guardian - Pure SVG & useNavigate Wired Edition
 * Masks illegal views dynamically using soft blurs and prompt overlays.
 */
export default function ProtectedFeature({ currentPlan = 'free', minRequiredPlan = 'pro', featureName = 'الميزة', children }) {
  const navigate = useNavigate() // 🏆 سحق الهارد ريلود من الجذور
  const userTier = getPlanTier(currentPlan)
  const requiredTier = getPlanTier(minRequiredPlan)

  if (userTier >= requiredTier) {
    return <>{children}</>
  }

  return (
    <div className="relative border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/10 p-1 min-h-[220px] flex items-center justify-center select-none group">
      {/* غطاء ضبابي عميق يعزل محتوى الميزة غير المصرح بها أوتوماتيكياً */}
      <div className="w-full h-full opacity-10 blur-lg pointer-events-none filter transition-all select-none">
        {children}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 animate-scale-up">
        {/* أيقونة تاج ملكية معالجة بالـ SVG بالكامل بديلاً للإيموجي */}
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-950 shrink-0 mb-3 border-none">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h4 className="text-xs font-black text-white tracking-tight mb-1">فتح ترسانة {featureName}</h4>
        <p className="text-[10px] font-bold text-slate-500 max-w-[240px] leading-normal mb-4">
          هذه الأدوات الاستراتيجية المتقدمة متاحة حصرياً لمشتركي باقات {minRequiredPlan.toUpperCase()} وما فوق.
        </p>
        
        <button
          type="button"
          onClick={() => navigate(ROUTES.PRICING)} // قفزة سريعة ونظيفة عبر بيئة الراوتر
          className="px-5 py-2.5 rounded-xl text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 transform transition-all outline-none border-none flex items-center gap-1.5"
        >
          <span>ترقية الحساب الآن</span>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  )
}
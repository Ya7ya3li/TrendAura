import React from 'react'
import { getPlanTier } from '../../constants/plans'

/**
 * TrendAura Core Feature Gateway Guardian
 * Masks illegal views dynamically using soft blurs and prompt overlays.
 */
export default function ProtectedFeature({ currentPlan = 'free', minRequiredPlan = 'pro', featureName = 'الميزة', children }) {
  const userTier = getPlanTier(currentPlan)
  const requiredTier = getPlanTier(minRequiredPlan)

  if (userTier >= requiredTier) {
    return <>{children}</>
  }

  return (
    <div className="relative border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/50 p-1 min-h-[200px] flex items-center justify-center select-none group">
      <div className="w-full h-full opacity-20 blur-md pointer-events-none filter transition-all">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 animate-scale-up">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center text-lg mb-3 shadow-md shadow-purple-100">
          👑
        </div>
        <h4 className="text-xs font-black text-slate-900 tracking-tight mb-1">فتح ميزة {featureName}</h4>
        <p className="text-[10px] font-bold text-slate-400 max-w-[240px] leading-normal mb-4">
          هذه الترسانة متاحة حصرياً لمشتركي باقات {minRequiredPlan.toUpperCase()} وما فوق.
        </p>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="px-5 py-2.5 rounded-xl text-[10px] font-black bg-slate-900 hover:bg-slate-800 text-white shadow-lg active:scale-95 transform transition-all"
        >
          ترقية الحساب الآن ⚡
        </button>
      </div>
    </div>
  )
}
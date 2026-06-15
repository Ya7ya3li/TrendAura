import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { AuthContext } from '../../context/AuthContext.jsx' 
import { getPlanTier } from "../../constants/plans.jsx"; 

export default function ProtectedFeature({ minRequiredPlan = 'pro', featureName = 'الميزة المتقدمة', children }) {
  const navigate = useNavigate()
  const { profile, loading } = useContext(AuthContext) 

  if (loading) {
    return (
      <div className="w-full min-h-[220px] flex items-center justify-center border border-slate-200/40 dark:border-slate-800/40 rounded-[28px] bg-slate-50/5 dark:bg-slate-900/5">
        <div className="text-center p-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 animate-pulse">
          جاري فحص صلاحيات الباقة ...
        </div>
      </div>
    )
  }

  const userTier = getPlanTier(profile?.plan || 'free')
  const requiredTier = getPlanTier(minRequiredPlan)

  if (userTier >= requiredTier) {
    return <>{children}</>
  }

  return (
    <div className="relative border border-slate-200 dark:border-slate-800/80 rounded-[28px] overflow-hidden bg-slate-50/30 dark:bg-slate-950/40 min-h-[230px] flex items-center justify-center select-none group transition-all duration-300 shadow-xl backdrop-blur-[2px]">
      <div className="w-full h-full opacity-10 dark:opacity-20 blur-[6px] pointer-events-none filter select-none transition-all duration-300 group-hover:blur-[8px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80 dark:via-slate-900/10 dark:to-slate-950/90">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0 mb-3 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <svg className="w-5 h-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1 tracking-tight flex items-center gap-1">
          <span>فتح ترسانة {featureName}</span>
          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.439.81-.439.98 0l2.112 5.372 5.8 1.13c.484.094.678.687.319 1.042l-4.148 4.043 1.055 5.753c.088.48-.413.844-.829.563L12 17.75l-5.119 3.252c-.416.28-.917-.083-.829-.563l1.055-5.753-4.148-4.042c-.359-.355-.165-.948.319-1.042l5.8-1.13 2.112-5.372z" />
          </svg>
        </h4>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 max-w-[220px] mb-4 leading-relaxed">
          هذه الأدوات الحصرية متاحة فقط لمشتركي خطة <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase font-black">{minRequiredPlan}</span> فما فوق.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.PRICING || '/pricing')}
          className="px-5 py-2.5 rounded-xl text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 active:scale-95 transition-all cursor-pointer z-20 flex items-center gap-1.5"
        >
          <span>ترقية باقة حسابك الآن</span>
          <svg className="w-3.5 h-3.5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
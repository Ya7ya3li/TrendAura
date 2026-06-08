import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { AuthContext } from '../../context/AuthContext.jsx' // 1. استيراد سياق الهوية

export default function ProtectedFeature({ minRequiredPlan = 'pro', featureName = 'الميزة المتقدمة', children }) {
  const navigate = useNavigate()
  const { profile, loading } = useContext(AuthContext) // 2. جلب بيانات البروفايل وحالة التحميل

  // 3. حماية النظام من "سباق البيانات": انتظر حتى ينتهي السيرفر من تأكيد الهوية
  if (loading) {
    return <div className="text-center p-4 text-xs text-slate-400">جاري فحص صلاحيات الباقة...</div>
  }

  // تنظيف وقراءة الباقة الحقيقية القادمة من قاعدة البيانات سوبابيس
  const userPlanClean = String(profile?.plan || 'free').toLowerCase().trim()
  const reqPlanClean = String(minRequiredPlan || 'pro').toLowerCase().trim()

  const getPlanTierLocal = (plan) => {
    if (plan === 'viral_engine' || plan === 'viral engine') return 3
    if (plan === 'pro') return 2
    return 1 // free
  }

  const userTier = getPlanTierLocal(userPlanClean)
  const requiredTier = getPlanTierLocal(reqPlanClean)

  // فتح الميزة فوراً إذا كانت باقة المستخدم أعلى أو تساوي الباقة المطلوبة
  if (userTier >= requiredTier) {
    return <>{children}</>
  }

  return (
    <div className="relative border border-slate-200 dark:border-slate-800 rounded-[28px] overflow-hidden bg-slate-50 dark:bg-slate-900/10 p-2 min-h-[220px] flex items-center justify-center select-none group transition-all duration-300 shadow-inner">
      {/* 4. إضافة pointer-events-none هنا لمنع الطبقة الضبابية من حجب أزرار الجوال والمسارات الأخرى */}
      <div className="w-full h-full opacity-5 dark:opacity-10 blur-xl pointer-events-none filter select-none">
        {children}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shrink-0 mb-3">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">فتح ترسانة {featureName}</h4>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 max-w-[240px] mb-4">
          هذه الأدوات متاحة حصرياً لمشتركي خطة <span className="text-purple-500 uppercase font-black">{reqPlanClean}</span>.
        </p>
        
        <button
          type="button"
          onClick={() => navigate(ROUTES.PRICING)}
          className="px-5 py-2.5 rounded-xl text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg active:scale-95 transition-all cursor-pointer z-20"
        >
          <span>ترقية باقة حسابك الآن</span>
        </button>
      </div>
    </div>
  )
}
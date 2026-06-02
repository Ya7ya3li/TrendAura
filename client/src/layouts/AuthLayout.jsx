import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

/**
 * TrendAura Authentication Guard Layout - Clean Production Edition
 * Completely eradicated the full-screen blocking loader to prevent infinite hang crashes.
 */
export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext)

  // 🛡️ إذا اكتمل الفحص وتبين وجود جلسة نشطة، قذف فوري وتلقائي للداخل لمنع الازدواجية
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  // 🔥 تم سحق ومسح شاشة "جاري فحص النطاق الأمني" بالكامل بناءً على طلبك لمنع أي تعليق للأبد

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 dir-rtl text-right font-sans selection:bg-blue-100 relative overflow-hidden">
      
      {/* خط معالجة علوي مجهري ذكي يشتغل فقط في الخلفية أثناء التحميل دون حجب التحكم أو النوافذ */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse z-50" />
      )}

      {/* الخلفيات النيونية المستقرة بصرياً */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none select-none z-0" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none select-none z-0" />
      
      {/* الحاوية المركزية للمدخلات - تفتح وتظهر فوراً للعميل بدون أي بوابات حظر */}
      <div className="w-full max-w-md relative z-10 animate-scale-up">
        <Outlet />
      </div>

    </div>
  )
}
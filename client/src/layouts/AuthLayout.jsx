import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/common/Loader'

/**
 * TrendAura Authentication Guard Layout (Bulletproof Edition)
 * يضمن انسيابية العبور التلقائي ويمنع تكدس الشاشات اللانهائي
 */
export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext)

  // 🛡️ إذا اكتمل الفحص وتبين وجود جلسة نشطة، قذف فوري وتلقائي للداخل لمنع الازدواجية
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  // شاشة الفحص المؤقتة: لا تعرض إلا إذا كانت عملية جلب البيانات الابتدائية جارية فعلياً
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader label="جاري فحص النطاق الأمني لـ TrendAura..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 dir-rtl text-right font-sans selection:bg-blue-100 relative overflow-hidden">
      
      {/* الخلفيات النيونية المستقرة بصرياً */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none select-none z-0" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none select-none z-0" />
      
      {/* الحاوية المركزية المستقرة للمدخلات */}
      <div className="w-full max-w-md relative z-10 animate-scale-up">
        <Outlet />
      </div>

    </div>
  )
}
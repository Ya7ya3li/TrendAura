import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/common/Loader'

/**
 * TrendAura Authentication Guard Layout
 * Centers auth grids and automatically redirects active user sessions to prevent double logins.
 */
export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext)

  // 🛡️ إذا كان المستخدم يملك جلسة نشطة بالفعل، نقوم بنقله مباشرة للداخل لحماية المسار
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader label="جاري فحص الجلسة الأمنية..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 dir-rtl text-right font-sans selection:bg-blue-100 relative overflow-hidden">
      
      {/* التوهجات النيونية الخلفية العميقة المتوافقة مع الثيم الفاتح الفاخر */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none select-none z-0" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none select-none z-0" />
      
      {/* كبسولة استقبال المحتوى التوجيهي الداخلي */}
      <div className="w-full max-w-md relative z-10 animate-scale-up">
        <Outlet />
      </div>

    </div>
  )
}
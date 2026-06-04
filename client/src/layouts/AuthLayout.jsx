import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ROUTES } from '../constants/routes'

export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext)

  // 🛡️ القذف التلقائي والفوري للداخل في حال رصد مستخدم مصادق عليه سلفاً لمنع الازدواجية واستهلاك التوكنات
  if (!loading && user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 dir-rtl text-right font-sans selection:bg-blue-500/30 relative overflow-hidden">
      
      {/* خط المعالجة المجهري الفاخر أثناء التحميل الخلفي المستقر */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 animate-pulse z-50" />
      )}

      {/* الهالات الضوئية النيونية المستقرة لبيئة المصادقة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-5 left-5 w-[250px] h-[250px] bg-purple-600/5 rounded-full blur-[90px] pointer-events-none select-none z-0" />
      
      {/* الحاوية المركزية للنماذج - تفتح للعميل بسلاسة مطلقة */}
      <div className="w-full max-w-md relative z-10 animate-scale-up">
        <Outlet />
      </div>

    </div>
  )
}
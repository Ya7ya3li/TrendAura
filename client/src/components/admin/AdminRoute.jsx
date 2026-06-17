import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ROUTES } from '../../constants/routes.js'

export default function AdminRoute() {
    const { profile, loading } = useContext(AuthContext)
    const [isReady, setIsReady] = useState(false)

    // ⏱️ الحارس بيصبر ثانية ونص لحد ما السيرفر يرسل الرتبة
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    // شاشة تحميل مؤقتة عشان ما يطردك والبيانات لسه بالطريق
    if (loading || !isReady) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0F1117] text-white">
                <p className="animate-pulse text-emerald-400 font-bold text-lg">
                    🛡️ جاري التحقق من التصاريح الفيدرالية...
                </p>
            </div>
        )
    }

    // الحين الحارس متأكد 100% إن البيانات وصلت، بيفحص رتبتك:
    if (!profile || profile.role !== 'super_owner') {
        console.error("⛔ تم الطرد بشكل نهائي! الرتبة بعد الانتظار هي:", profile?.role)
        return <Navigate to={ROUTES.DASHBOARD || '/dashboard'} replace />
    }

    // ✅ الباب انفتح لك
    return <Outlet />
}
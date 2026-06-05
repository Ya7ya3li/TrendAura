import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'
import Button from '../components/common/Button.jsx'

export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  
  const planName = searchParams.get('plan') || 'Pro VIP'

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVerifying(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 text-center dir-rtl select-none font-sans relative z-10">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-fade-in">
        
        {verifying ? (
          <div className="py-10 text-xs font-bold text-slate-400 animate-pulse">
            جاري فحص وتأكيد المعاملة البنكية من البنك المركزي...
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              ✓
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">تهانينا الحارة! 🎉</h2>
            <p className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-xl inline-block mt-2">
              تم تفعيل {planName.toUpperCase()} بنجاح ملوكي واثق
            </p>
            
            <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mt-4 mb-6">
              تم شحن حسابك وترقية سقف قيودك بالملي حياً. استمتع بكامل أدوات المحرك الفايرال الاستراتيجي الآن واكتسح المشاهدات.
            </p>

            <div className="space-y-3">
              <Button onClick={() => navigate(ROUTES.DASHBOARD)} variant="primary" className="w-full py-3 text-xs bg-blue-600 hover:bg-blue-700">
                دخول لوحة التحكم 🏠
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
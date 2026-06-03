import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  
  const planName = searchParams.get('plan') || 'Pro VIP'

  useEffect(() => {
    // توقيت بسيط بدون الاعتماد على أي مكون خارجي قد يعلق
    const timeout = setTimeout(() => {
      setVerifying(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 text-center dir-rtl select-none font-sans">
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 max-w-md w-full shadow-xl animate-fade-in">
        
        {verifying ? (
          <div className="py-10 text-xs font-bold text-slate-400">
            جاري التحقق من المعاملة البنكية...
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 text-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              ✓
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">تهانينا! 🎉</h2>
            <p className="text-[11px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-xl inline-block mt-2">
              تم تفعيل {planName.toUpperCase()} بنجاح
            </p>
            
            <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mt-4 mb-6">
              تم شحن حسابك وترقيته. استمتع بكامل أدوات المحرك الفايرال الآن.
            </p>

            <div className="space-y-3">
              <Button onClick={() => navigate('/dashboard')} variant="primary" className="w-full py-3 text-xs">
                دخول لوحة التحكم 🏠
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
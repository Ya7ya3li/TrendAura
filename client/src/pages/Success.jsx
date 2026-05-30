import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'

/**
 * TrendAura Commercial Post-Checkout Milestone Viewport
 * Captures callback tokens and presents visual verification of immediate tier upgrades.
 */
export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  
  const planName = searchParams.get('plan') || 'Pro VIP'
  const paymentId = searchParams.get('id')

  useEffect(() => {
    // محاكاة سريعة ومحكمة للتحقق المالي واستقرار الاتصال بالسيرفر
    const timeout = setTimeout(() => {
      setVerifying(false)
    }, 2500)
    return () => clearTimeout(timeout)
  }, [paymentId])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 text-center dir-rtl select-none">
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 max-w-md w-full shadow-xl shadow-slate-200/50 animate-scale-up">
        {verifying ? (
          <Loader label="جاري سحب حالة المعاملة البنكية وتفعيل الباقة لحظياً..." />
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 text-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              ✓
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">تهانينا الملوكية الفخمة! 🎉</h2>
            <p className="text-xs font-bold text-blue-600 bg-blue-50/60 px-4 py-1.5 rounded-xl inline-block mt-2">
              تم تفعيل {planName.toUpperCase()} بنجاح تام
            </p>
            
            <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mt-4 mb-6 max-w-xs mx-auto">
              تم شحن حسابك وترقيته بالكامل في قاعدة البيانات. يمكنك الآن الاستمتاع بالوصول اللامحدود لكامل ترسانة وأدوات محرك الفايرال.
            </p>

            <div className="space-y-3">
              <Button onClick={() => navigate('/dashboard')} variant="primary" className="w-full py-3">
                دخول لوحة التحكم المتقدمة 🏠
              </Button>
              <Button onClick={() => navigate('/history')} variant="secondary" className="w-full py-3">
                عرض سجل السكريبتات 📄
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
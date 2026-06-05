import React, { useState } from 'react'
import { paymentService } from '../../services/paymentService.js'
import { showToast } from '../../App.jsx'

/**
 * TrendAura Contextual Commercial Upgrade Trigger - V2 Premium Dynamic Styling
 */
export default function UpgradeButton({ planId, price, userId, isCurrent, customText }) {
  const [loading, setLoading] = useState(false)
  const cleanPlanId = planId?.toLowerCase()?.trim()

  const handleCheckout = async () => {
    if (isCurrent) return

    if (price === '0' || price === 0) {
      if (typeof showToast === 'function') {
        showToast('أنت بالفعل تستمتع بالباقة الحرة الافتراضية لحسابك مبدئياً 🚀', 'info')
      }
      return
    }

    setLoading(true)
    try {
      if (typeof showToast === 'function') {
        showToast('جاري الاتصال المباشر بالبوابة المصرفية وتأمين الفاتورة المعتمدة... 💳', 'info')
      }
      const response = await paymentService.createInvoice(price, planId, userId)
      
      if (response && response.success && response.checkoutUrl) {
        // التحويل الخارجي لصفحة السداد الآمنة لميسر خروجاً من نظام السيرفر الحقيقي المكتمل
        window.location.href = response.checkoutUrl
      } else {
        throw new Error(response?.error || 'فشلت عملية إنشاء الجلسة المالية وحظر رابط البوابة')
      }
    } catch (error) {
      console.error('❌ [UpgradeButton Checkout Failure]:', error.message)
      if (typeof showToast === 'function') {
        showToast('فشل تأمين وحقن رابط الدفع لميسر، يرجى إعادة المحاولة لاحقاً', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      disabled={loading || isCurrent}
      onClick={handleCheckout}
      className={`w-full py-3 px-5 rounded-xl text-[10px] font-black transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2 select-none disabled:opacity-40 disabled:pointer-events-none border-none outline-none ${
        isCurrent
          ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
          : cleanPlanId === 'viral_engine'
            ? 'bg-gradient-to-r from-rose-600 to-orange-500 hover:opacity-95 text-white shadow-lg shadow-rose-950/40'
            : cleanPlanId === 'pro'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-blue-950/40'
              : 'bg-slate-700 hover:bg-slate-600 text-white shadow-md'
      }`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>جاري تهيئة البوابة الأمنية المالية...</span>
        </>
      ) : isCurrent ? (
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>خطة حسابك الفعّالة حياً حالياً</span>
        </span>
      ) : (
        <span>{customText || 'اشترك في باقة النخبة الآن ⚡'}</span>
      )}
    </button>
  )
}
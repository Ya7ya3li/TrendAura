import React, { useState } from 'react'
import { paymentService } from '../../services/paymentService'
import { showToast } from '../../App'

/**
 * TrendAura Contextual Commercial Upgrade Trigger - V2 Premium Dynamic Styling
 * Synchronized to lock into the luxury dark cyberpunk container profiles.
 */
export default function UpgradeButton({ planId, price, userId, isCurrent, customText }) {
  const [loading, setLoading] = useState(false)
  const cleanPlanId = planId?.toLowerCase()?.trim()

  const handleCheckout = async () => {
    if (isCurrent) return

    if (price === '0' || price === 0) {
      showToast('أنت بالفعل تستمتع بالباقة الحرة الافتراضية 🚀', 'info')
      return
    }

    setLoading(true)
    try {
      showToast('جاري الاتصال بالبوابة المصرفية وتأمين الفاتورة... 💳', 'info')
      const response = await paymentService.createInvoice(price, planId, userId)
      
      if (response && response.success && response.checkoutUrl) {
        window.location.href = response.checkoutUrl
      } else {
        throw new Error(response?.error || 'فشلت عملية إنشاء الجلسة المالية')
      }
    } catch (error) {
      console.error('❌ [UpgradeButton Checkout Failure]:', error.message)
      showToast('فشل تأمين رابط الدفع، يرجى المحاولة مرة أخرى لاحقاً', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      disabled={loading || isCurrent}
      onClick={handleCheckout}
      className={`w-full py-3 px-5 rounded-xl text-[10px] font-black transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2 select-none disabled:opacity-40 disabled:pointer-events-none ${
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
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          <span>جاري فتح البوابة الأمنية...</span>
        </>
      ) : isCurrent ? (
        <span>✓ خطتك الفعّالة حالياً</span>
      ) : (
        <span>{customText || 'اشترك الآن ⚡'}</span>
      )}
    </button>
  )
}
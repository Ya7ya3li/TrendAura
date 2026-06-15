import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import Button from '../common/Button.jsx'

/**
 * TrendAura Conversion Ingestion Hero CTA Section Overlay
 */
export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="w-full py-16 md:py-24 bg-slate-950 border-t border-slate-900 text-center dir-rtl select-none relative overflow-hidden">
      {/* هالة النيون الخلفية للثيم الداكن الاحترافي لـ TrendAura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-black text-white tracking-tight mb-4 leading-tight">
          جاهز لتصعد للترند المليوني وتكتسح المشاهدات؟
        </h2>
        <p className="text-xs md:text-sm font-bold text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
          انضم الآن لآلاف صناع المحتوى المحترفين والمسوقين الرقميين الذين يعتمدون على قوة ذكاء TrendAura في صناعة سكريبتات فيروسية تتصدر قوائم التوصية وتخترق الخوارزميات.
        </p>

        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4">
          <Button
            onClick={() => navigate(ROUTES.REGISTER)} // سحق تسريب الرابط النصي
            variant="purple"
            className="w-full sm:w-auto px-8 py-3.5 text-xs font-black rounded-xl shadow-xl shadow-purple-900/20 border-none flex items-center justify-center gap-2 text-white"
          >
            <span>ابدأ رحلة الانتشار Viral Engine مجاناً</span>
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </Button>
        </div>
        
        <p className="text-[10px] font-black text-slate-600 mt-5 tracking-wide font-sans">
          ✦ لا يتطلب أي بطاقة ائتمانية لتفعيل الخطة المجانية الافتراضية المتاحة لحسابك الجديد
        </p>
      </div>
    </section>
  )
}
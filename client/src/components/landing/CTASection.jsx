import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'

/**
 * TrendAura Conversion Ingestion Hero CTA Section Overlay
 */
export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="w-full py-16 md:py-24 bg-white text-center dir-rtl select-none relative overflow-hidden">
      {/* شبكة توهجات دائرية خلفية ناعمة فخمة للثيم الفاتح */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
          جاهز لتصعد للترند وتكتسح المشاهدات؟
        </h2>
        <p className="text-xs md:text-sm font-bold text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
          انضم الآن لآلاف صناع المحتوى المحترفين والمسوقين الرقميين الذين يعتمدون على قوة ذكاء TrendAura في صناعة سكريبتات فيروسية تتصدر قوائم التوصية.
        </p>

        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => navigate('/register')}
            variant="purple"
            className="w-full sm:w-auto px-8 py-3.5 text-xs font-black rounded-xl shadow-lg shadow-purple-100"
          >
            ابدأ رحلة الانتشار الفايرال مجاناً 🚀
          </Button>
        </div>
        
        <p className="text-[10px] font-black text-slate-300 mt-4 tracking-wide font-sans">
          ✦ لا يتطلب بطاقة ائتمانية لتفعيل الخطة المجانية الافتراضية
        </p>
      </div>
    </section>
  )
}
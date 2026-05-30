import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom' // 🚀 استدعاء محرك التنقل الحركي لربط العودة
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext' // 🧬 استدعاء شريان المظهر العالمي
import { PLANS } from '../constants/plans'
import PricingCard from '../components/pricing/PricingCard'
import SectionTitle from '../components/common/SectionTitle'

/**
 * TrendAura Commercial Tier Pricing Directory Viewport - V2 Master Edition
 * Adaptive layout showcasing premium subscription blocks synced with global token distribution specs.
 * Enhanced with a royal return bridge to the operational dashboard hub.
 */
export default function Pricing() {
  const navigate = useNavigate()
  const { profile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const currentPlanId = profile?.plan || 'free'

  return (
    <div className={`w-full max-w-6xl mx-auto select-none dir-rtl text-right animate-fade-in transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      
      {/* 👑 شريط التحكم العلوي المضاف: يحتوي على زر الرجوع الملوكي والخطّي المفرغ */}
      <div className="flex justify-start mb-6 animate-fade-in">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all active:scale-95 border ${
            theme === 'dark'
              ? 'bg-[#160f30]/40 border-[#1f1438] text-cyan-400 hover:bg-white/5 shadow-md shadow-black/20'
              : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100 shadow-sm'
          }`}
        >
          {/* أيقونة السهم المفرغة المتناسقة Line Art Arrow */}
          <svg className="w-4 h-4 transform rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <span>الرجوع إلى لوحة التحكم ✦</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <SectionTitle title="خطط واشتراكات النخبة" subtitle="اختر خطة القوة المناسبة لطموحك واكتسح خوارزميات تيك توك وسوشيال ميديا اليوم" badge="باقات الترقية" />
      </div>

      {/* شبكة عرض كروت الأسعار القياسية الثلاثة الفاخرة بعد تحديث الثوابت */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrent={currentPlanId.toLowerCase().trim() === plan.id.toLowerCase().trim()}
            userId={profile?.id}
          />
        ))}
      </div>

      {/* كرت أمان بوابات الدفع الميسر الفخم */}
      <div className={`mt-12 p-6 border rounded-3xl text-center max-w-2xl mx-auto transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-slate-50 border-slate-100'
      }`}>
        <h4 className="text-xs font-black text-slate-800 dark:text-white mb-1">🛡️ ضمان أمان وسلامة المدفوعات</h4>
        <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
          جميع المعاملات المالية مشفرة ومؤمنة بالكامل بنسبة 100% عبر بوابات دفع ميسر السعودية المعتمدة والمطابقة لمعايير الأمن السيبراني ومؤسسة النقد.
        </p>
      </div>
    </div>
  )
}
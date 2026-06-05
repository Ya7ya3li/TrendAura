import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { PLANS } from '../constants/plans.js'
import { ROUTES } from '../constants/routes.js'
import PricingCard from '../components/pricing/PricingCard.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'

export default function Pricing() {
  const navigate = useNavigate()
  const { profile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  
  const currentPlanId = profile?.plan?.toLowerCase()?.trim() || 'free'

  return (
    <div className={`w-full max-w-6xl mx-auto select-none dir-rtl text-right animate-fade-in pb-12 transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      
      {/* زر الرجوع لمنع الهارد ريلود */}
      <div className="flex justify-start mb-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all active:scale-95 border ${
            theme === 'dark'
              ? 'bg-slate-900/40 border-slate-800 text-cyan-400 hover:bg-slate-900/80'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          الرجوع إلى لوحة التحكم
        </button>
      </div>

      <div className="text-center mb-10">
        <SectionTitle 
          title="خطط واشتراكات النخبة" 
          subtitle="اختر خطة القوة المناسبة لطموحك واكتسح خوارزميات تيك توك اليوم" 
          badge="باقات الترقية" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch px-4">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrent={currentPlanId === plan.id}
            userId={profile?.id}
          />
        ))}
      </div>

      <div className={`mt-12 p-6 border rounded-3xl text-center max-w-2xl mx-auto transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
      }`}>
        <h4 className="text-xs font-black mb-1">🛡️ ضمان أمان المدفوعات السيادية</h4>
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
          جميع المعاملات مشفرة ومؤمنة بالكامل عبر بوابات دفع ميسر (Moyasar Key Engine) المعتمدة سعودياً لبناء SaaS موثوق.
        </p>
      </div>
    </div>
  )
}
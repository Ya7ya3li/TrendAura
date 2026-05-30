import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext' // 🧬 حقن شريان المظهر الملوكي المضاف
import Button from '../common/Button'

/**
 * TrendAura Dashboard Settings Billing Summary Module - V2 Adaptive Neon Edition
 * Completely refactored with strict dynamic theme states to absorb dark and light contexts perfectly.
 */
export default function SubscriptionSettings() {
  const { profile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const userPlan = profile?.plan || 'free'
  const isUpgraded = userPlan.toLowerCase().trim() !== 'free'

  return (
    <div className={`space-y-6 text-right dir-rtl select-none animate-scale-up font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      <div>
        <h3 className="text-xs font-black tracking-tight mb-1">الخطة المالية والترخيص الحسابي</h3>
        <p className="text-[10px] font-bold text-slate-400">مراجعة سريعة لرتبة اشتراكك الحالي وتتبع فواتير بوابة الدفع السعودية ميسر.</p>
      </div>

      {/* لوحة استعراض رتبة الرخصة الحالية بمؤشرات نيون ناصعة ومتفاعلة مع الثيمين */}
      <div className={`w-full border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]' : 'bg-slate-50 border-slate-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 text-white text-xl flex items-center justify-center shadow-md shadow-blue-500/20 animate-pulse shrink-0">
            👑
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-tight">باقة الحساب النشطة:</span>
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase font-mono ${
                theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-blue-600 text-white'
              }`}>
                {userPlan.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-1 leading-normal">
              {isUpgraded 
                ? '✅ حسابك مفعّل وصالح بالكامل للوصول لترسانة التحليلات الشاملة وحقن أوامر الـ Viral Engine.' 
                : '⚠️ أنت تستخدم النسخة الحرة المحدودة؛ قم بالترقية الآن لكسر أسقف التوليد الخوارزمية.'}
            </p>
          </div>
        </div>

        {/* زر التوجيه والدفع الفوري المتناسق */}
        <Button
          onClick={() => navigate(isUpgraded ? '/pricing' : '/pricing')}
          variant={isUpgraded ? 'secondary' : 'primary'}
          className={`w-full sm:w-auto px-5 py-2.5 text-[10px] font-black rounded-xl shrink-0 ${
            theme === 'dark' && isUpgraded ? 'border-[#1f1438] text-slate-300 hover:bg-white/5' : ''
          }`}
        >
          {isUpgraded ? '💳 مراجعة خطط وباقات الترقية' : '🚀 ترقية الباقة الآن'}
        </Button>
      </div>

      {/* قطاع إحصائيات الاستهلاك المجهري المريح للعين والمتأقلم لونياً */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl text-[11px] font-bold">
        <div className={`p-4 rounded-xl border shadow-xs transition-all ${
          theme === 'dark' ? 'bg-[#0d071d]/40 border-[#1f1438]' : 'bg-white border-slate-100'
        }`}>
          <span className="block text-[9px] font-black text-slate-400 mb-1">الرصيد المتاح حالياً</span>
          <p className="font-black">120 <span className={`text-[9px] font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>توكن معالجة نشط</span></p>
        </div>
        <div className={`p-4 rounded-xl border shadow-xs transition-all ${
          theme === 'dark' ? 'bg-[#0d071d]/40 border-[#1f1438]' : 'bg-white border-slate-100'
        }`}>
          <span className="block text-[9px] font-black text-slate-400 mb-1">دورة التجديد القادمة</span>
          <p className="text-slate-500 dark:text-slate-300 font-black">تجديد تلقائي شهري دوري مفعّل</p>
        </div>
      </div>
    </div>
  )
}
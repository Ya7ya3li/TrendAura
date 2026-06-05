import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ThemeContext } from '../../context/ThemeContext.jsx'
import { ROUTES } from '../../constants/routes.js' // ربط مليمتر مع الـ ROUTES الموحدة
import Button from '../common/Button.jsx'

export default function SubscriptionSettings() {
  const { profile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const userPlan = profile?.plan || 'free'
  const isUpgraded = userPlan.toLowerCase().trim() !== 'free'

  return (
    <div className={`space-y-6 text-right dir-rtl select-none font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-200'
    }`}>
      <div>
        <h3 className="text-xs font-black tracking-tight mb-1">الخطة المالية والترخيص الحسابي</h3>
        <p className="text-[10px] font-bold text-slate-500">مراجعة سريعة لرتبة اشتراكك الحالي وتتبع محفوظات فواتير بوابة الدفع السعودية ميسر المعتمدة.</p>
      </div>

      {/* لوحة نيون معتمة زجاجية خالية من الرموز العشوائية البدائية */}
      <div className={`w-full border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438]' : 'bg-slate-900/40 border-slate-800'
      }`}>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-950 shrink-0">
            <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-tight">باقة الحساب الحركية الحالية:</span>
              <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase font-sans bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {userPlan.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 mt-1 leading-normal max-w-md">
              {isUpgraded 
                ? 'الحساب مفعّل وصالح بالكامل لتجاوز القيود والوصول لترسانة التحليلات الشاملة وحقن أوامر الـ Viral Engine.' 
                : 'أنت تستخدم النسخة الحرة المحدودة؛ قم بالترقية الآن لكسر أسقف التوليد الخوارزمية وحصاد المشاهدات.'}
            </p>
          </div>
        </div>

        {/* 🏆 تم سحق ثغرة الرابط النصي الصلب وربطه بالـ ROUTES المعتمد */}
        <Button
          onClick={() => navigate(ROUTES.PRICING)} 
          variant={isUpgraded ? 'secondary' : 'primary'}
          className="w-full sm:w-auto px-5 py-2.5 text-[10px] font-black rounded-xl shrink-0 border-slate-800"
        >
          {isUpgraded ? '💳 مراجعة باقات النخبة والتراخيص' : '🚀 ترقية باقة حسابك الآن'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl text-[11px] font-bold">
        <div className="p-4 rounded-xl border bg-slate-950/40 border-slate-800 shadow-sm text-right">
          <span className="block text-[9px] font-black text-slate-550 mb-1">رصيد التوكنز المتاح حالياً</span>
          <p className="font-black text-white">{(profile?.tokens ?? 0).toLocaleString()} <span className="text-[9px] font-bold text-cyan-400 font-sans">توكن معالجة نشط</span></p>
        </div>
        <div className="p-4 rounded-xl border bg-slate-950/40 border-slate-800 shadow-sm text-right">
          <span className="block text-[9px] font-black text-slate-550 mb-1">دورة التجديد والفوترة القادمة</span>
          <p className="text-slate-400 font-black">نظام التجديد الشهري التلقائي مفعّل عبر ميسر</p>
        </div>
      </div>
    </div>
  )
}
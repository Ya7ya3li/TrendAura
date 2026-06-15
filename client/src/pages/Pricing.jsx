import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { PLANS } from '../constants/plans.jsx'
import { ROUTES } from '../constants/routes.js'
import PricingCard from '../components/pricing/PricingCard.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'

// 🏆 حقن الاستيرادات الخارجية لإدارة الدفع والتحقق السحابي
import { paymentService } from '../services/paymentService.js'
import { showToast } from '../App.jsx'
import { supabase } from '../config/supabase.js'

export default function Pricing() {
  const navigate = useNavigate()
  // 🏆 التعديل الأول: جلب دالة setProfile من الـ Context لتحديث حالة الموقع حياً
  const { profile, setProfile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  
  // 💸 إدارة حالة التحميل لكل باقة بشكل منفصل
  const [loadingPlan, setLoadingPlan] = useState(null)
  
  const currentPlanId = profile?.plan?.toLowerCase()?.trim() || 'free'

  // 🚀 دالة الدفع المركزية مع ميزة الـ Polling والـ Logging الذكي
  const handleSubscribe = async (plan) => {
    if (!profile?.id) {
      if (typeof showToast === 'function') showToast('يرجى تسجيل الدخول أولاً 🔐', 'error')
      return
    }

    if (currentPlanId === plan.id.toLowerCase().trim()) {
      if (typeof showToast === 'function') showToast('أنت مشترك بالفعل في هذه الباقة', 'info')
      return
    }

    // 🛡️ تأمين النافذة الفورية لكسر حاجب النوافذ (Popup Blocker)
    const paymentWindow = window.open('about:blank', 'moyasar_payment', 'width=600,height=750,scrollbars=yes,resizable=yes')
    if (paymentWindow) {
      paymentWindow.document.write('<h3 style="text-align:center;font-family:sans-serif;color:#64748b;margin-top:40%;">جاري تأمين اتصالك ببوابة ميسر...</h3>')
    }

    setLoadingPlan(plan.id)
    try {
      const response = await paymentService.createInvoice(
        plan.price,
        plan.id,
        profile.id,
        plan.tokensReward
      )

      if (response && response.invoiceUrl && paymentWindow) {
        // توجيه النافذة للبنك
        paymentWindow.location.href = response.invoiceUrl
        
        // 📡 رصد الـ Webhook عبر قاعدة البيانات كل 2 ثانية
        const pollInterval = setInterval(async () => {
          try {
            // 🏆 التعديل الثاني: استعلام سوبابيس صار يجلب كامل البيانات (*) وليس الـ plan فقط
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', profile.id)
              .single()

            const serverPlan = (updatedProfile?.plan || 'free').toLowerCase().trim()
            const expectedPlan = plan.id.toLowerCase().trim()

            // 🔍 طباعة الـ Logging التكتيكي الذي طلبته لمتابعة الرصد حياً
            console.log('🔍 Server Plan:', serverPlan, 'Expected:', expectedPlan)

            if (serverPlan === expectedPlan) {
              clearInterval(pollInterval)
              
              // 🏆 التعديل الثالث: حقن البيانات الجديدة فوراً في ذاكرة التطبيق لتظهر الباقة والتوكنز حياً بدون ريفريش
              if (updatedProfile) {
                setProfile(updatedProfile)
              }

              paymentWindow.close() // إغلاق نافذة البنك تلقائياً
              
              if (typeof showToast === 'function') {
                showToast(`تم تفعيل اشتراكك في باقة ${plan.name} بنجاح 🎉🚀`, 'success')
              }
              setTimeout(() => navigate(ROUTES.DASHBOARD || '/dashboard'), 1500)
            }
          } catch (dbErr) {
            console.error('Polling DB Error:', dbErr)
          }

          // صمام أمان: لو العميل قفل النافذة بنفسه نقتل المؤقت
          if (paymentWindow.closed) {
            clearInterval(pollInterval)
          }
        }, 2000)

        // إنهاء الفحص تلقائياً بعد 5 دقائق حمايةً للموارد
        setTimeout(() => clearInterval(pollInterval), 300000)

      } else {
        throw new Error('لم نتمكن من جلب رابط الفاتورة من السيرفر.')
      }
    } catch (err) {
      console.error('Checkout Error:', err.message)
      if (paymentWindow) paymentWindow.close()
      if (typeof showToast === 'function') {
        showToast(err.message || 'فشل الاتصال ببوابة الدفع', 'error')
      }
    } finally {
      setLoadingPlan(null)
    }
  }

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

      {/* 🏆 تمرير الدوال الجديدة والـ Loading لـ PricingCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch px-4">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrent={currentPlanId === plan.id.toLowerCase().trim()}
            userId={profile?.id}
            onSubscribe={handleSubscribe}
            isLoading={loadingPlan === plan.id}
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
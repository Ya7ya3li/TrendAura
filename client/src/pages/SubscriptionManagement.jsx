import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { supabase } from '../config/supabase.js'
import { PLANS } from '../constants/plans.js'
import { paymentService } from '../services/paymentService.js'
import SectionTitle from '../components/common/SectionTitle.jsx'
import Button from '../components/common/Button.jsx'
import { showToast } from '../App.jsx'

export default function SubscriptionManagement() {
  const { profile, setProfile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const activePlanId = (profile?.plan || 'free').toLowerCase().trim()
  const activePlan = PLANS.find(p => p.id === activePlanId) || PLANS[0]
  const isFree = activePlanId === 'free'
  const isViralEngine = activePlanId === 'viral_engine'

  // 🏆 جلب بيانات الباقات ديناميكياً من ملف الثوابت لمنع تضارب الأسعار ومضاعفتها
  const proPlanInfo = PLANS.find(p => p.id === 'pro') || { price: 29, tokensReward: 50000 }
  const viralPlanInfo = PLANS.find(p => p.id === 'viral_engine') || { price: 69, tokensReward: 200000 }

  // 🏆 جعل دالة جلب الفواتير مركزية ليمكن استدعاؤها لحظياً فور نجاح الدفع
  const loadBilling = async () => {
    if (!profile?.id) return
    try {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      setInvoices(data || [])
    } catch (err) {
      console.error('Invoice fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile?.id) loadBilling()
  }, [profile])

  // 🚀 تفعيل آلية الـ Popup والـ Polling الذكية لمنع الضرب المزدوج وتحديث الذاكرة لحظياً
  const triggerMoyasarCheckout = async (amount, planId, tokensCount) => {
    const paymentWindow = window.open('about:blank', 'moyasar_payment', 'width=600,height=750,scrollbars=yes,resizable=yes')
    if (paymentWindow) {
      paymentWindow.document.write('<h3 style="text-align:center;font-family:sans-serif;color:#64748b;margin-top:40%;">جاري تأمين اتصالك ببوابة ميسر...</h3>')
    }

    setPaymentLoading(true)
    try {
      const res = await paymentService.createInvoice(amount, planId, profile.id, tokensCount)
      if (res && res.invoiceUrl && paymentWindow) {
        paymentWindow.location.href = res.invoiceUrl

        // 📡 إطلاق رصد سوبابيس كل 2 ثانية
        const pollInterval = setInterval(async () => {
          try {
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', profile.id)
              .single()

            const serverPlan = (updatedProfile?.plan || 'free').toLowerCase().trim()
            const isTokenBooster = planId === 'token_booster'

            // شرط تحقق العملية: إما زيادة التوكنز في حال الشحن السريع أو مطابقة اسم الباقة
            const conditionMet = isTokenBooster 
              ? (updatedProfile?.tokens > profile?.tokens)
              : (serverPlan === planId.toLowerCase().trim())

            if (conditionMet) {
              clearInterval(pollInterval)
              if (updatedProfile) setProfile(updatedProfile) // تحديث الـ Context فوراً local State
              
              // 🏆 الضربة القاضية: إعادة سحب سجل الكشوفات فوراً لكي تظهر الفاتورة بالجدول بدون ريفريش
              await loadBilling() 

              paymentWindow.close() // إغلاق البوب أب تلقائياً
              
              if (typeof showToast === 'function') {
                showToast(isTokenBooster ? 'تم شحن محفظة التوكنز بنجاح! 🚀' : 'تمت ترقية باقتك بنجاح حياً! 🔥', 'success')
              }
            }
          } catch (dbErr) {
            console.error('Polling Error:', dbErr)
          }

          if (paymentWindow.closed) clearInterval(pollInterval)
        }, 2000)

        setTimeout(() => clearInterval(pollInterval), 300000)
      } else {
        if (paymentWindow) paymentWindow.close()
        throw new Error("رابط الدفع مفقود")
      }
    } catch (err) {
      if (paymentWindow) paymentWindow.close()
      if (typeof showToast === 'function') {
        showToast('فشل تأمين رابط دفع ميسر، يرجى إعادة المحاولة', 'error')
      }
    } finally {
      setPaymentLoading(false)
    }
  }

  // 🔒 دالة الإلغاء الآمنة والمباشرة عبر سوبابيس لإنهاء عطل زر الإلغاء القديم
  const handleCancelSubscription = async () => {
    const confirmCancel = window.confirm('هل أنت متأكد من إلغاء اشتراكك الحالي؟ ستفقد جميع ميزات النخبة فوراً وتعود للباقة المجانية.')
    if (!confirmCancel) return

    setPaymentLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: 'free', 
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', profile?.id)

      if (error) throw error

      // تحديث الـ Context محلياً وإعادة سحب الكشوفات
      setProfile(prev => ({ ...prev, plan: 'free', subscription_status: 'cancelled' }))
      await loadBilling()

      if (typeof showToast === 'function') showToast('تم إلغاء الاشتراك بنجاح وعودتك للباقة الحرة 💳', 'success')
    } catch (err) {
      if (typeof showToast === 'function') showToast(err.message || 'حدث خطأ أثناء إلغاء الاشتراك', 'error')
    } finally {
      setPaymentLoading(false)
    }
  }

  const copyReferralLink = () => {
    const link = `https://trendaura.com/register?ref=${profile?.id || 'aura'}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    if (typeof showToast === 'function') showToast('تم نسخ رابط الإحالة بنجاح 🎁', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const cardClass = "bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[32px] p-6 shadow-xl text-right transition-colors duration-300"

  return (
    <div className={`w-full max-w-5xl mx-auto p-4 md:p-6 font-sans select-none pb-24 md:pb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <SectionTitle title="إدارة الاشتراك والفوترة " subtitle="بوابات الفوترة، حزم شحن التوكنز، ونظام المكافآت " badge="Enterprise Billing" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* كرت الباقة النشطة */}
        <div className={`${cardClass} border-l-4 border-l-blue-600 dark:border-l-cyan-500 relative overflow-hidden`}>
          <div className="absolute top-0 left-0 bg-blue-500/10 px-4 py-1 rounded-bl-2xl text-[9px] font-black font-sans text-blue-600 dark:text-cyan-400">STATUS: LIVE</div>
          <p className="text-[10px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest">الباقة والاشتراك الحالي</p>
          <h2 className="text-2xl font-black mt-2 mb-1 text-slate-900 dark:text-white">{activePlan.name}</h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-6 font-semibold">تمنحك الباقة صلاحيات تكتيكية متطورة ومقيدة بحصانة خطتك.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            {isFree ? (
              <Button onClick={() => triggerMoyasarCheckout(proPlanInfo.price, 'pro', proPlanInfo.tokensReward || 50000)} loading={paymentLoading} className="w-full text-[10px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                اشترك الآن في Pro VIP ✦
              </Button>
            ) : (
              <>
                <Button onClick={handleCancelSubscription} loading={paymentLoading} variant="secondary" className="w-full text-[10px] bg-transparent border-slate-200 dark:border-slate-800 text-rose-500 font-bold hover:bg-rose-500/5">
                  إلغاء الاشتراك الحالي
                </Button>
                {!isViralEngine && (
                  <Button onClick={() => triggerMoyasarCheckout(viralPlanInfo.price, 'viral_engine', viralPlanInfo.tokensReward || 200000)} loading={paymentLoading} className="w-full text-[10px] font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                    ترقية إلى VIRAL ENGINE 🔥
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* كرت محفظة التوكنز */}
        <div className={`${cardClass} border-r-4 border-r-indigo-600 dark:border-r-pink-500 flex flex-col justify-between`}>
          <div>
            <p className="text-[10px] font-black text-indigo-600 dark:text-pink-400 uppercase tracking-widest">محفظة التوكنز </p>
            <h2 className="text-3xl font-black mt-2 text-slate-900 dark:text-white font-sans">{(profile?.tokens || 0).toLocaleString()} <span className="text-xs text-slate-400">توكن متوفر</span></h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">تستهلك المنظومة 10 توكنز فقط لكل سكريبت تيك توك فايرال يتم صياغته.</p>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-800 dark:text-slate-200"> حزمة شحن سريعة </span>
              <span className="text-[11px] font-sans font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">49 ريال فقط</span>
            </div>
            <Button onClick={() => triggerMoyasarCheckout(49, 'token_booster', 50000)} loading={paymentLoading} className="w-full text-[10px] font-black bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-all flex items-center justify-center gap-2">
              شحن 50,000 توكن إضافي  
            </Button>
          </div>
        </div>
      </div>

      {/* برنامج نظام الإحالة */}
      <div className={`${cardClass} mb-8 border-t-4 border-t-emerald-500`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md font-sans">Viral Network Growth</span>
            <h3 className="text-sm font-black mt-1 text-slate-900 dark:text-white">برنامج نظام الإحالة</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">شارك رابط إحالتك الفريد؛ وعند تسجيل أي مستخدم جديد عن طريقك يحصل الطرفان على <span className="text-emerald-500 font-bold">500 توكن مجاني مجاناً فوراً</span> شحناً للمحفظة!</p>
          </div>
          <button 
            onClick={copyReferralLink}
            className="w-full md:w-auto px-5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-2xl text-[10px] font-black hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <span>{copied ? 'تم النسخ!' : 'نسخ رابط الإحالة'}</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 00-2 2v12a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* سجل الفواتير */}
      <div className={cardClass}>
        <h3 className="text-xs font-black mb-6 text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span>سجل الكشوفات والفواتير</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
        </h3>
        {loading ? (
          <p className="text-slate-400 text-[10px] animate-pulse">جاري سحب الكشوفات من الحاوية السحابية...</p>
        ) : invoices.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-600 text-[10px] py-4 text-center">لا توجد عمليات فواتير مسجلة لحسابك حتى الآن.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-right text-[10px]">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60">
                  <th className="pb-3 font-black">رقم المعاملة السحابية</th>
                  <th className="pb-3 font-black">التاريخ</th>
                  <th className="pb-3 font-black">الباقة المستهدفة</th>
                  <th className="pb-3 font-black">المبلغ المستقطع</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-all font-medium">
                    <td className="py-4 font-mono text-blue-600 dark:text-cyan-400">{inv.payment_id}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400 font-sans">{new Date(inv.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-4"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 font-bold uppercase">{inv.plan || 'PRO'}</span></td>
                    <td className="py-4 font-black text-slate-900 dark:text-white font-sans">{inv.amount} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
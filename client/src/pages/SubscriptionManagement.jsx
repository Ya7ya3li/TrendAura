import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { supabase } from '../config/supabase.js'
import { PLANS } from '../constants/plans.jsx'
import { paymentService } from '../services/paymentService.js'
import SectionTitle from '../components/common/SectionTitle.jsx'
import Button from '../components/common/Button.jsx'
import { showToast } from '../App.jsx'

export default function SubscriptionManagement() {
  const { profile, setProfile } = useContext(AuthContext)

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const activePlanId = (profile?.plan || 'free').toLowerCase().trim()
  const activePlan = PLANS.find(p => p.id === activePlanId) || PLANS[0]
  const isFree = activePlanId === 'free'
  const isViralEngine = activePlanId === 'viral_engine'

  const proPlanInfo = PLANS.find(p => p.id === 'pro') || { price: 29, tokensReward: 1000 }
  const viralPlanInfo = PLANS.find(p => p.id === 'viral_engine') || { price: 69, tokensReward: 10000 }

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

  const triggerMoyasarCheckout = async (amount, planId, tokensCount) => {
    const paymentWindow = window.open('about:blank', 'moyasar_payment', 'width=600,height=750,scrollbars=yes,resizable=yes')
    if (paymentWindow) {
      paymentWindow.document.write('<h3 style="text-align:center;font-family:sans-serif;color:#64748b;margin-top:40%;">جاري تأمين اتصالك ببوابة ميسر...</h3>')
    }

    setPaymentLoading(true)
    try {
      const res = await paymentService.createInvoice(amount, planId, profile.id, tokensCount)
      if (res && (res.invoiceUrl || res.checkoutUrl) && paymentWindow) {
        paymentWindow.location.href = res.invoiceUrl || res.checkoutUrl

        const pollInterval = setInterval(async () => {
          try {
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', profile.id)
              .single()

            const serverPlan = (updatedProfile?.plan || 'free').toLowerCase().trim()
            const isTokenBooster = planId === 'token_booster'

            const conditionMet = isTokenBooster
              ? (updatedProfile?.tokens > profile?.tokens)
              : (serverPlan === planId.toLowerCase().trim())

            if (conditionMet) {
              clearInterval(pollInterval)
              if (updatedProfile) setProfile(updatedProfile)
              await loadBilling()
              paymentWindow.close()

              if (typeof showToast === 'function') {
                showToast(isTokenBooster ? 'تم شحن محفظة التوكنز بنجاح!' : 'تمت ترقية باقتك بنجاح حياً!', 'success')
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
        showToast('فشل تأمين رابط الدفع، يرجى إعادة المحاولة', 'error')
      }
    } finally {
      setPaymentLoading(false)
    }
  }

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

      setProfile(prev => ({ ...prev, plan: 'free', subscription_status: 'cancelled' }))
      await loadBilling()

      if (typeof showToast === 'function') showToast('تم إلغاء الاشتراك بنجاح وعودتك للباقة الحرة', 'success')
    } catch (err) {
      if (typeof showToast === 'function') showToast(err.message || 'حدث خطأ أثناء إلغاء الاشتراك', 'error')
    } finally {
      setProfile(prev => ({ ...prev, plan: 'free', subscription_status: 'cancelled' }))
      setPaymentLoading(false)
    }
  }

  const copyReferralLink = () => {
    const link = `https://trendaura.com/register?ref=${profile?.id || 'aura'}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    if (typeof showToast === 'function') showToast('تم نسخ رابط الإحالة بنجاح', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  // استخدام الظلال الناعمة للفاتح والعميقة للداكن
  const cardClass = "bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[32px] p-6 shadow-sm dark:shadow-xl text-right transition-colors duration-300"

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 font-sans select-none pb-24 md:pb-6 text-slate-900 dark:text-white transition-colors duration-300">
      <SectionTitle title="إدارة الاشتراك والفوترة" subtitle="بوابات الفوترة، حزم شحن التوكنز، ونظام المكافآت" badge="Enterprise Billing" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`${cardClass} border-l-4 border-l-blue-600 dark:border-l-cyan-500 relative overflow-hidden`}>
          <div className="absolute top-0 left-0 bg-blue-50 dark:bg-blue-500/10 px-4 py-1 rounded-bl-2xl text-[9px] font-black font-sans text-blue-600 dark:text-cyan-400 transition-colors">STATUS: LIVE</div>
          <p className="text-[10px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest transition-colors">الباقة والاشتراك الحالي</p>
          <h2 className="text-2xl font-black mt-2 mb-1 text-slate-900 dark:text-white transition-colors">{activePlan.name}</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 mb-6 font-semibold transition-colors">تمنحك الباقة صلاحيات تكتيكية متطورة  .</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            {isFree ? (
              <Button onClick={() => triggerMoyasarCheckout(proPlanInfo.price, 'pro', proPlanInfo.tokensReward || 1000)} loading={paymentLoading} className="w-full text-[10px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center justify-center gap-1.5 border-none">
                <span>اشترك الآن في Pro VIP</span>
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15L15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancelSubscription}
                  loading={paymentLoading}
                  variant="danger"
                  className="w-full text-[10px] !bg-rose-50 dark:!bg-rose-500/10 !border-rose-200 dark:!border-rose-500/30 !text-rose-600 dark:!text-rose-400 font-bold hover:!bg-rose-100 dark:hover:!bg-rose-600 hover:!text-rose-700 dark:hover:!text-white transition-all"
                >
                  إلغاء الاشتراك الحالي
                </Button>
                {!isViralEngine && (
                  <Button onClick={() => triggerMoyasarCheckout(viralPlanInfo.price, 'viral_engine', viralPlanInfo.tokensReward || 10000)} loading={paymentLoading} className="w-full text-[10px] font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md flex items-center justify-center gap-1.5 border-none">
                    <span>ترقية إلى VIRAL ENGINE</span>
                    <svg className="w-3.5 h-3.5 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.25 8.25 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                    </svg>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className={`${cardClass} border-r-4 border-r-indigo-600 dark:border-r-pink-500 flex flex-col justify-between`}>
          <div>
            <p className="text-[10px] font-black text-indigo-600 dark:text-pink-400 uppercase tracking-widest transition-colors">محفظة التوكنز </p>
            <h2 className="text-3xl font-black mt-2 text-slate-900 dark:text-white font-sans transition-colors">{Number(profile?.tokens || 0).toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400">توكن متوفر</span></h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1 font-semibold transition-colors">تستهلك المنظومة 10 توكنز فقط لكل سكريبت </p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 transition-colors"> حزمة شحن سريعة </span>
              <span className="text-[11px] font-sans font-black text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg transition-colors">29 ريال فقط</span>
            </div>
            <Button
              onClick={() => triggerMoyasarCheckout(29, 'token_booster', 5000)}
              loading={paymentLoading}
              className="w-full text-[10px] font-black !bg-slate-900 !text-white dark:!bg-white dark:!text-slate-900 hover:!bg-slate-800 dark:hover:!bg-slate-200 border-none transition-all flex items-center justify-center gap-1.5"
            >
              <span>شحن 5,000 توكن إضافي</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className={`${cardClass} mb-8 border-t-4 border-t-emerald-500`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md font-sans transition-colors">Viral Network Growth</span>
            <h3 className="text-sm font-black mt-1 text-slate-900 dark:text-white transition-colors">برنامج نظام الإحالة</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 transition-colors">شارك رابط إحالتك الفريد؛ وعند تسجيل أي مستخدم جديد عن طريقك يحصل الطرفان على <span className="text-emerald-600 dark:text-emerald-500 font-bold transition-colors">500 توكن مجاني فوراً</span> شحناً للمحفظة!</p>
          </div>
          <button
            onClick={copyReferralLink}
            className="w-full md:w-auto px-5 py-3 !bg-slate-100 dark:!bg-slate-900 border !border-slate-300 dark:!border-slate-800 !text-slate-800 dark:!text-slate-300 rounded-2xl text-[10px] font-black hover:!border-emerald-500 dark:hover:!border-emerald-500 hover:!text-emerald-600 dark:hover:!text-emerald-400 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <span>{copied ? 'تم النسخ!' : 'نسخ رابط الإحالة'}</span>
            {copied ? (
              <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 transition-all duration-300 scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2h-6a2 2 0 01-2-2V5z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-xs font-black mb-6 text-slate-800 dark:text-slate-300 flex items-center gap-2 transition-colors">
          <span>سجل الكشوفات والفواتير</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
        </h3>
        {loading ? (
          <p className="text-slate-400 text-[10px] animate-pulse">جاري سحب الكشوفات من الحاوية السحابية...</p>
        ) : invoices.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-[10px] py-4 text-center transition-colors">لا توجد عمليات فواتير مسجلة لحسابك حتى الآن.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-right text-[10px]">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/60 transition-colors">
                  <th className="pb-3 font-black">رقم المعاملة السحابية</th>
                  <th className="pb-3 font-black">التاريخ</th>
                  <th className="pb-3 font-black">الباقة المستهدفة</th>
                  <th className="pb-3 font-black">المبلغ المستقطع</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-all font-medium">
                    <td className="py-4 font-mono text-blue-600 dark:text-cyan-400 transition-colors">{inv.payment_id}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400 font-sans transition-colors">{new Date(inv.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-4"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 font-bold uppercase transition-colors">{inv.plan_type || 'PRO'}</span></td>
                    <td className="py-4 font-black text-slate-900 dark:text-white font-sans transition-colors">{inv.amount} SAR</td>
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
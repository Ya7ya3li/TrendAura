import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { SubscriptionContext } from '../context/SubscriptionContext'
import { ThemeContext } from '../context/ThemeContext'
import { supabase } from '../config/supabase'
import { PLANS } from '../constants/plans'
import SectionTitle from '../components/common/SectionTitle'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { showToast } from '../App'

export default function SubscriptionManagement() {
  const { profile, setProfile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { claimDailyReward } = useContext(SubscriptionContext)
  
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [dailyClaimed, setDailyClaimed] = useState(false)
  
  // حالات إدارة نافذة الدفع الوهمية لميسر
  const [showMoyasarModal, setShowMoyasarModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const userPlan = profile?.plan || 'free'
  const isUpgraded = userPlan.toLowerCase().trim() !== 'free'
  const activeTokensCount = profile?.tokens ?? 0

  // جعل الرابط ديناميكياً يتكيف تلقائياً مع السيرفر الحي أو المحلي على حد سواء
  const userReferralCode = profile?.referral_code || `TA-${profile?.id?.substring(0, 5).toUpperCase()}`
  const referralLink = `${window.location.origin}/register?ref=${userReferralCode}`

  useEffect(() => {
    // التحقق المستقر من حالة الهدية اليومية بناءً على تاريخ السيرفر لمنع التصفير العشوائي
    if (profile?.last_login_date) {
      const today = new Date().toISOString().split('T')[0]
      setDailyClaimed(profile.last_login_date === today)
    }

    const loadBillingStatements = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', profile?.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setInvoices(data || [])
      } catch (err) {
        console.error('❌ [SubscriptionManagement Invoice Fetch Error]:', err.message)
      } finally {
        setLoading(false)
      }
    }

    if (profile?.id) loadBillingStatements()
  }, [profile])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    showToast('تم نسخ رابط الإحالة الفريد الخاص بك! شاركه واكسب التوكنز 🚀', 'success')
  }

  const handleDailyClick = async () => {
    if (dailyClaimed) return
    await claimDailyReward()
    setDailyClaimed(true)
  }

  // فتح بوابة الدفع الوهمية لميسر
  const openCheckout = (planConfig) => {
    if (planConfig.id === userPlan) {
      showToast('أنت مشترك بالفعل في هذه الباقة يا قائد 👑', 'warning')
      return
    }
    setSelectedPlan(planConfig)
    setShowMoyasarModal(true)
  }

  // خوارزمية تنفيذ السداد ومزامنة ترقية الباقة السحابية حياً 100%
  const executeMockPayment = async () => {
    if (!profile?.id || !selectedPlan) return
    setPaymentLoading(true)
    
    try {
      const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase()
      const updatedTokens = activeTokensCount + selectedPlan.tokensReward
      
      // 1. تحديث جدول البروفايل بالخطة الجديدة ورصيد توكنز الترقية الضخم
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan: selectedPlan.id,
          subscription_status: 'active',
          tokens: updatedTokens
        })
        .eq('id', profile.id)

      if (profileError) throw profileError

      // 2. حقن سجل الفاتورة والمقبوضات المالية حياً لتظهر بالجدول فورا
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert([
          {
            user_id: profile.id,
            payment_id: mockPaymentId,
            plan_type: selectedPlan.name,
            amount: parseFloat(selectedPlan.price),
            created_at: new Date().toISOString()
          }
        ])

      if (invoiceError) throw invoiceError

      // 3. تحديث الحالة المركزية للفرونت إند لتستجيب كافة شاشات وميزات المنصة للحالة الجديدة فوراً
      setProfile(prev => ({
        ...prev,
        plan: selectedPlan.id,
        subscription_status: 'active',
        tokens: updatedTokens
      }))

      // تحديث قائمة الفواتير محلياً للعرض الفوري النظيف
      setInvoices(prev => [
        {
          id: mockPaymentId,
          payment_id: mockPaymentId,
          plan_type: selectedPlan.name,
          amount: parseFloat(selectedPlan.price),
          created_at: new Date().toISOString()
        },
        ...prev
      ])

      showToast(`تمت محاكاة بوابة ميسر بنجاح! مبروك ترقية حسابك إلى ${selectedPlan.name} 💳🔥`, 'success')
      setShowMoyasarModal(false)
    } catch (err) {
      console.error('❌ [Mock Checkout Pipeline Crash]:', err.message)
      showToast('فشلت معالجة عملية السداد السحابية', 'error')
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-5xl mx-auto select-none dir-rtl text-right animate-fade-in font-sans pb-12 transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      <SectionTitle title="إدارة الحساب ماليًا والفوترة" subtitle="تتبع حركة عمليات السداد الأخيرة، واطلع على رصيد وفواتير اشتراك باقتك" badge="الفوترة والاشتراك" />

      {/* لوحة الباقة الحالية النشطة */}
      <div className={`w-full border rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-slate-50 border-slate-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 text-white text-xl flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            👑
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-tight">باقة الحساب النشطة حالياً:</span>
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase font-mono ${
                theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-900 text-white'
              }`}>
                {userPlan.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-2">
              {isUpgraded 
                ? '✅ رتبة الترخيص مفعّلة؛ تم فك القيود البرمجية عن التوليد وتنشيط كامل أدوات الترسانة الرادارية لـ TrendAura.' 
                : '⚠️ حسابك الحالي مقيد بحدود الباقة الحرة؛ اختر باقة من الأسفل لتجربة الدفع الفوري الفعال.'}
            </p>
          </div>
        </div>
        {isUpgraded && (
          <Button variant="danger" className="w-full sm:w-auto text-[10px] py-2 px-4 shrink-0" onClick={() => {
            setProfile(prev => ({ ...prev, plan: 'free', subscription_status: 'inactive' }));
            showToast('تمت إعادة حسابك إلى الباقة المجانية لتسهيل إعادة اختبار الترقية 🔄', 'info');
          }}>
            تصفير والعودة للمجانية للـ Test
          </Button>
        )}
      </div>

      {/* رصيد التوكنز */}
      <div className={`border rounded-3xl p-6 mb-8 shadow-sm transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#160f30]/20 border-[#1f1438]' : 'bg-white border-slate-100'
      }`}>
        <span className="text-[9px] font-black bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-purple-300 px-2 py-1 rounded-md">رصيد التوكنز التراكمي النشط للحساب الحقيقي</span>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-3">
          {activeTokensCount.toLocaleString()} <span className="text-xs text-blue-600 dark:text-cyan-400 font-bold">توكن معالجة متاح للضخ</span>
        </h2>
      </div>

      {/* قطاع ترقية الباقات الحية الفعالة ومحاكاة ميسر */}
      <h3 className="text-xs font-black text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">🚀 اضغط للاشتراك الفوري واختبار تفعيل ميزات الخطط (Moyasar Simulation)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
        {PLANS.map((p) => {
          const isCurrent = userPlan === p.id;
          return (
            <div key={p.id} className={`border p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
              isCurrent ? 'border-blue-500 ring-2 ring-blue-500/10' : ''
            } ${theme === 'dark' ? 'bg-[#160f30]/30 border-[#1f1438]' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">{p.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">{p.price}</span>
                  <span className="text-[10px] text-slate-400">{p.currency} / {p.period}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                <ul className="mt-4 space-y-2 border-t border-slate-50 dark:border-[#1f1438]/40 pt-3">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="text-[9px] font-bold text-slate-500 dark:text-slate-300 flex items-center gap-1.5">
                      ✨ {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => openCheckout(p)}
                disabled={isCurrent || p.id === 'free'}
                className={`w-full mt-6 py-2.5 text-[10px] font-black rounded-xl transition-all ${
                  isCurrent 
                    ? 'bg-emerald-500 text-white cursor-default'
                    : p.id === 'free' ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white active:scale-95'
                }`}
              >
                {isCurrent ? '✓ باقتك الحالية نشطة' : p.buttonText}
              </button>
            </div>
          )
        })}
      </div>

      {/* لوحة المهام الميكروية: المكافأة اليومية ورابط الإحالة الحقيقي */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`border p-5 rounded-3xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#160f30]/20 border-[#1f1438]' : 'bg-slate-50 border-slate-100'}`}>
          <div>
            <span className="text-sm">🎁</span>
            <h4 className="text-xs font-black mt-1 text-slate-800 dark:text-white">المكافأة اليومية الدورية</h4>
            <p className="text-[9px] font-bold text-slate-400 mt-1 leading-relaxed">اضغط لشحن حسابك بـ 2 توكنز إضافية حية ومزامنتها فورياً بالسيرفر.</p>
          </div>
          <button
            onClick={handleDailyClick}
            disabled={dailyClaimed}
            className={`w-full mt-4 py-2 text-[10px] font-black rounded-xl transition-all ${
              dailyClaimed 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 active:scale-95'
            }`}
          >
            {dailyClaimed ? '✓ تم حصد مكافأة اليوم بنجاح' : 'امتصاص 2 توكنز مجانية ⚡'}
          </button>
        </div>

        <div className={`border p-5 rounded-3xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#160f30]/20 border-[#1f1438]' : 'bg-slate-50 border-slate-100'}`}>
          <div>
            <span className="text-sm">👥</span>
            <h4 className="text-xs font-black mt-1 text-slate-800 dark:text-white">نظام الإحالة التراكمي النظيف</h4>
            <p className="text-[9px] font-bold text-slate-400 mt-1 leading-relaxed">شارك الرابط وعزز رصيدك التراكمي فور تسجيل أي قائد من طرفك.</p>
          </div>
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="flex-1 bg-white dark:bg-[#05020c] border border-slate-200 dark:border-[#1f1438] text-[9px] px-2 py-1.5 rounded-lg outline-none font-mono text-slate-400 truncate text-left"
            />
            <button onClick={copyReferralLink} className="bg-slate-900 text-white px-4 text-[10px] font-black rounded-lg hover:bg-slate-800 shrink-0">نسخ رابط الدعوة</button>
          </div>
        </div>
      </div>

      {/* جدول الفواتير */}
      <div className={`border rounded-3xl p-6 shadow-sm ${theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'}`}>
        <h3 className="text-xs font-black text-slate-800 dark:text-white mb-4">📄 سجل المقبوضات المالية وفواتير سداد بوابة ميسر الأخيرة</h3>
        {loading ? (
          <Loader label="جاري مطابقة القيود المالية وحصر الفواتير الحية..." />
        ) : invoices.length === 0 ? (
          <p className="text-[11px] font-bold text-slate-400 text-center py-6">لا توجد عمليات دفع أو فواتير بنكية مسجلة لحسابك حالياً.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs font-bold text-slate-600 text-right">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#1f1438]/50 text-slate-400 text-[10px] uppercase">
                  <th className="pb-3">رقم الفاتورة البنكية</th>
                  <th className="pb-3">التاريخ</th>
                  <th className="pb-3">الباقة المفعّلة</th>
                  <th className="pb-3">المبلغ المستقطع</th>
                  <th className="pb-3">حالة القيد الدولي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-[#1f1438]/20 text-slate-700 dark:text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                    <td className="py-3 font-mono text-[10px] text-slate-400">{inv.payment_id}</td>
                    <td className="py-3 text-[11px]">{new Date(inv.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-black">{inv.plan_type}</td>
                    <td className="py-3 text-blue-600 dark:text-cyan-400 font-black">{inv.amount} SAR</td>
                    <td className="py-3"><span className="text-[9px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md">Paid مدفوعة بالكامل</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🌌 نافذة محاكاة بوابة ميسر الاحترافية العائمة (Premium Moyasar Mock Iframe Overlay) */}
      {showMoyasarModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0d071d] w-full max-w-md rounded-[32px] border border-slate-100 dark:border-[#1f1438] shadow-2xl p-6 relative animate-scale-up text-right">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f1438]/60 pb-4 mb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>💳</span> بوابة دفع ميسر الآمنة | Moyasar Gateway
              </h3>
              <button onClick={() => setShowMoyasarModal(false)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold">✕</button>
            </div>
            
            <div className="bg-slate-50 dark:bg-[#160f30]/40 p-4 rounded-2xl mb-4 border border-slate-100 dark:border-[#1f1438]/50">
              <p className="text-[10px] font-bold text-slate-400">الباقة المطلوبة:</p>
              <p className="text-xs font-black text-slate-800 dark:text-white mt-1">{selectedPlan.name}</p>
              <p className="text-xs font-black text-blue-600 dark:text-cyan-400 mt-2">{selectedPlan.price} SAR <span className="text-[9px] text-slate-400 font-normal">/ شامل الضريبة</span></p>
            </div>

            {/* عناصر كرت الفيزا والمدى لمحاكاة شركات الدفع العالمية */}
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-slate-400">رقم البطاقة الائتمانية (محاكاة الاختبار)</label>
                <input type="text" readOnly value="4000 1234 5678 9010" className="w-full bg-slate-50 dark:bg-[#05020c] border border-slate-200 dark:border-[#1f1438] py-2.5 px-3 rounded-xl text-xs font-mono tracking-widest text-slate-500 dir-ltr text-left" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-400">تاريخ الانتهاء</label>
                  <input type="text" readOnly value="12 / 2029" className="w-full bg-slate-50 dark:bg-[#05020c] border border-slate-200 dark:border-[#1f1438] py-2.5 px-3 rounded-xl text-xs font-mono text-slate-500 text-center dir-ltr" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400">الرمز السري CVV</label>
                  <input type="text" readOnly value="***" className="w-full bg-slate-50 dark:bg-[#05020c] border border-slate-200 dark:border-[#1f1438] py-2.5 px-3 rounded-xl text-xs font-mono text-slate-500 text-center" />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 dark:border-[#1f1438]/60 pt-4 flex flex-col gap-2">
              <button
                onClick={executeMockPayment}
                disabled={paymentLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-2"
              >
                {paymentLoading ? 'جاري معالجة القيود المصرفية وتأمين التوكنز...' : 'تأكيد عملية السداد الوهمي الآمن ⚡💳'}
              </button>
              <button onClick={() => setShowMoyasarModal(false)} className="w-full py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 text-[10px] font-black rounded-xl hover:opacity-90">إلغاء الطلب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
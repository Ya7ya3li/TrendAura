import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { SubscriptionContext } from '../context/SubscriptionContext'
import { ThemeContext } from '../context/ThemeContext' // 🧬 استدعاء المظهر للمزامنة اللونية
import { supabase } from '../config/supabase'
import SectionTitle from '../components/common/SectionTitle'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { showToast } from '../App'

/**
 * TrendAura Billing Statements and Token Telemetry Matrix Dashboard Page - V2 Central Financial Hub
 * Upgraded to integrate active plan parameters, token scopes, and micro-transaction ledger views.
 */
export default function SubscriptionManagement() {
  const { profile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { claimDailyReward, buyTopUpBundle } = useContext(SubscriptionContext)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [dailyClaimed, setDailyClaimed] = useState(false)

  const userPlan = profile?.plan || 'free'
  const isUpgraded = userPlan.toLowerCase().trim() !== 'free'
  const activeTokensCount = profile?.tokens ?? 120

  const userReferralCode = profile?.referral_code || `TA-${profile?.id?.substring(0, 5).toUpperCase() || 'YAHYA'}`
  const referralLink = `http://localhost:3000/register?ref=${userReferralCode}`

  useEffect(() => {
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
        console.error('❌ [SubscriptionManagement Invoice Fetch Failure]:', err.message)
      } finally { // 🎯 تم التطهير هنا وإعادتها إلى أصلها الهندسي الصحيح
        setLoading(false)
      }
    }

    if (profile?.id) loadBillingStatements()
  }, [profile])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    showToast('تم نسخ رابط الإحالة الفريد الخاص بك! شاركه واكسب التوكنز 🚀', 'success')
  }

  const handleDailyClick = () => {
    if (dailyClaimed) return
    claimDailyReward()
    setDailyClaimed(true)
  }

  return (
    <div className={`w-full max-w-5xl mx-auto select-none dir-rtl text-right animate-fade-in font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      <SectionTitle title="إدارة الحساب ماليًا والفوترة" subtitle="تتبع حركة عمليات السداد الأخيرة، واطلع على رصيد وفواتير اشتراك باقتك" badge="الفوترة والاشتراك" />

      {/* 💳 اللوحة المدمجة والسيادية: الخطة المالية الحالية ورتبة الترخيص المالي المنقولة بالكامل */}
      <div className={`w-full border rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-slate-50 border-slate-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 text-white text-xl flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse shrink-0">
            👑
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-tight">باقة الحساب النشطة حالياً:</span>
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase font-mono ${
                theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-blue-600 text-white'
              }`}>
                {userPlan.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-1.5 leading-normal">
              {isUpgraded 
                ? '✅ حسابك مفعّل بالكامل وصالح للوصول لترسانة التحليلات الشاملة وحقن أوامر الـ Viral Engine بدون حدود.' 
                : '⚠️ أنت تستخدم النسخة الحرة المحدودة؛ الباقة الحية الحالية مخزنة ومحمية هنا في إدارة الاشتراك.'}
            </p>
          </div>
        </div>
        <Button variant="danger" className="w-full sm:w-auto text-[10px] py-2 px-4 shrink-0" onClick={() => showToast('يرجى مراسلة الدعم الفني لتعديل الفواتير البنكية.', 'info')}>
          إلغاء التجديد التلقائي
        </Button>
      </div>

      {/* 📊 الرصيد التراكمي للتوكنز والمكافآت */}
      <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <div className={`border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#160f30]/20 border-[#1f1438]' : 'bg-white border-slate-100'
        }`}>
          <div>
            <span className="text-[9px] font-black bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-purple-300 px-2 py-0.5 rounded-md">رصيد التوكنز التراكمي المتاح للحساب</span>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-2">
              {activeTokensCount} <span className="text-xs text-blue-600 dark:text-cyan-400">توكن معالجة متوفر</span>
            </h2>
          </div>
          <p className="text-[9px] font-bold text-slate-400 leading-normal border-t border-slate-50 dark:border-[#1f1438]/40 pt-3 mt-4">
            تتم إعادة ضبط وتصفير حسابك المجاني تلقائياً مع بداية كل دورة فوترة شهرية جديدة بناءً على شروط الباقة المربوطة ✦
          </p>
        </div>
      </div>

      {/* 🚀 مصفوفة الإستراتيجيات الثلاث لشحن وتجميع التوكنز */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
        <div className={`border p-5 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#160f30]/30 border-[#1f1438]' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <div>
            <span className="text-sm">🎁</span>
            <h4 className="text-xs font-black mt-2 text-slate-800 dark:text-white">المكافأة اليومية النشطة</h4>
            <p className="text-[9px] font-bold text-slate-400 mt-1 leading-relaxed">سجل دخولك يومياً واضغط على الزر لشحن رصيدك بـ 2 توكنز مجانية لضمان استمرارية إنتاجك.</p>
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
            {dailyClaimed ? '✓ تم استلام هدية اليوم' : 'امتصاص 2 توكنز مجانية ⚡'}
          </button>
        </div>

        <div className={`border p-5 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#160f30]/30 border-[#1f1438]' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <div>
            <span className="text-sm">👥</span>
            <h4 className="text-xs font-black mt-2 text-slate-800 dark:text-white">شارك الرابط واكسب +30</h4>
            <p className="text-[9px] font-bold text-slate-400 mt-1 leading-relaxed">انسخ رابط دعوتك الفريد؛ وأي شخص يسجل حساب جديد عن طريقك يحصل هو على 50 وأنت تكسب 30 توكن فوراً!</p>
          </div>
          <div className="mt-3 flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="flex-1 bg-white dark:bg-[#05020c] border border-slate-200 dark:border-[#1f1438] text-[9px] px-2 py-1.5 rounded-lg outline-none font-mono text-slate-400 truncate text-left"
            />
            <button onClick={copyReferralLink} className="bg-slate-900 text-white px-3 text-[10px] font-black rounded-lg hover:bg-slate-800 shrink-0">نسخ</button>
          </div>
        </div>

        <div className={`border p-5 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#160f30]/30 border-[#1f1438]' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <div>
            <span className="text-sm">💳</span>
            <h4 className="text-xs font-black mt-2 text-slate-800 dark:text-white">حزمة الشحن السريع الطارئ</h4>
            <p className="text-[9px] font-bold text-slate-400 mt-1 leading-relaxed">انفذت توكنز باقتك قبل نهاية الفوترة؟ اشحن رصيدك فوراً بحزمة طوارئ سريعة واستكمل أعمالك بدون توقف.</p>
          </div>
          <button
            onClick={() => buyTopUpBundle(100)}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all active:scale-95 shadow-sm shadow-blue-100 dark:shadow-none"
          >
            شراء 100 توكن طارئ / 19 ريال ⚡
          </button>
        </div>
      </div>

      {/* 📄 سجل الفواتير والمقبوضات المالية */}
      <div className={`border rounded-3xl p-6 shadow-sm transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'
      }`}>
        <h3 className="text-xs font-black text-slate-800 dark:text-white mb-4">📄 سجل الفواتير والمقبوضات المالية الأخيرة</h3>
        {loading ? (
          <Loader label="جاري تجميع البيانات المالية وتدقيق الدفعات الحية..." />
        ) : invoices.length === 0 ? (
          <p className="text-[11px] font-bold text-slate-400 text-center py-6">لا توجد عمليات دفع أو فواتير بنكية مسجلة لحسابك حالياً.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs font-bold text-slate-600 text-right">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#1f1438]/50 text-slate-400 text-[10px] uppercase">
                  <th className="pb-3">رقم العملية</th>
                  <th className="pb-3">التاريخ</th>
                  <th className="pb-3">الباقة المستهدفة</th>
                  <th className="pb-3">المبلغ المدفوع</th>
                  <th className="pb-3">الحالة البنكية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-[#1f1438]/20 text-slate-700 dark:text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                    <td className="py-3 font-mono text-[10px] text-slate-400">{inv.payment_id?.substring(0, 10)}...</td>
                    <td className="py-3 text-[11px]">{new Date(inv.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-black">{inv.plan_type}</td>
                    <td className="py-3 text-blue-600 dark:text-cyan-400 font-black">{inv.amount} SAR</td>
                    <td className="py-3"><span className="text-[9px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md">Paid مدفوعة</span></td>
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
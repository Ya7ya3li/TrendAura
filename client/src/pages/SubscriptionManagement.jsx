import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { SubscriptionContext } from '../context/SubscriptionContext'
import { ThemeContext } from '../context/ThemeContext'
import { supabase } from '../config/supabase'
import { PLANS } from '../constants/plans'
import SectionTitle from '../components/common/SectionTitle'
import Button from '../components/common/Button'
import { showToast } from '../App'

export default function SubscriptionManagement() {
  const { profile, setProfile } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { claimDailyReward } = useContext(SubscriptionContext)
  
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [dailyClaimed, setDailyClaimed] = useState(false)
  const [showMoyasarModal, setShowMoyasarModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const userPlan = profile?.plan?.toLowerCase()?.trim() || 'free'
  const activeTokensCount = profile?.tokens ?? 0
  const referralLink = `${window.location.origin}/register?ref=${profile?.referral_code || profile?.id?.substring(0, 5).toUpperCase()}`

  useEffect(() => {
    if (profile?.last_login_date) {
      setDailyClaimed(profile.last_login_date === new Date().toISOString().split('T')[0])
    }
    const loadBillingStatements = async () => {
      try {
        const { data } = await supabase.from('invoices').select('*').eq('user_id', profile?.id).order('created_at', { ascending: false })
        setInvoices(data || [])
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    if (profile?.id) loadBillingStatements()
  }, [profile])

  const executeMockPayment = async () => {
    if (!profile?.id || !selectedPlan) return
    setPaymentLoading(true)
    try {
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`
      const updatedTokens = activeTokensCount + selectedPlan.tokensReward
      await supabase.from('profiles').update({ plan: selectedPlan.id, tokens: updatedTokens }).eq('id', profile.id)
      const newInvoice = { user_id: profile.id, payment_id: mockPaymentId, plan_type: selectedPlan.name, amount: parseFloat(selectedPlan.price), created_at: new Date().toISOString() }
      await supabase.from('invoices').insert([newInvoice])
      setProfile(prev => ({ ...prev, plan: selectedPlan.id, tokens: updatedTokens }))
      setInvoices(prev => [newInvoice, ...prev])
      showToast(`تم الترقية إلى ${selectedPlan.name} بنجاح!`, 'success')
      setShowMoyasarModal(false)
    } catch (err) { showToast('فشل السداد', 'error') } finally { setPaymentLoading(false) }
  }

  return (
    <div className={`w-full max-w-5xl mx-auto p-4 md:p-6 font-sans ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
      <SectionTitle title="إدارة الحساب المالي" subtitle="الفوترة والمكافآت" badge="لوحة التحكم" />
      
      {/* الرصيد */}
      <div className={`border rounded-3xl p-8 mb-8 ${theme === 'dark' ? 'bg-[#160f30]/40 border-white/10' : 'bg-white border-slate-100'}`}>
        <p className="text-[10px] font-bold text-slate-400">رصيد التوكنز الحالي</p>
        <h2 className="text-4xl font-black mt-2">{activeTokensCount.toLocaleString()}</h2>
      </div>

      {/* الباقات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PLANS.map(plan => (
          <div key={plan.id} className={`p-6 rounded-3xl border ${userPlan === plan.id ? 'border-blue-500 bg-blue-50/5' : 'bg-white border-slate-100'}`}>
            <h4 className="text-sm font-black mb-2 text-slate-800">{plan.name}</h4>
            <p className="text-2xl font-black mb-6 text-slate-900">{plan.price} <span className="text-xs font-normal">ر.س</span></p>
            <Button onClick={() => { setSelectedPlan(plan); setShowMoyasarModal(true); }} disabled={userPlan === plan.id} className="w-full">
              {userPlan === plan.id ? 'الباقة الحالية' : plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* الإحالة والمكافآت */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-3xl border border-slate-100 bg-white">
          <h4 className="text-xs font-black text-slate-800 mb-4">المكافأة اليومية</h4>
          <Button onClick={async () => { await claimDailyReward(); setDailyClaimed(true); }} disabled={dailyClaimed} className="w-full">
            {dailyClaimed ? 'تم الحصد ✅' : 'امتصاص 2 توكنز ⚡'}
          </Button>
        </div>
        <div className="p-6 rounded-3xl border border-slate-100 bg-white">
          <h4 className="text-xs font-black text-slate-800 mb-4">رابط الإحالة</h4>
          <div className="flex gap-2">
            <input readOnly value={referralLink} className="text-[10px] bg-slate-50 p-2 rounded-lg flex-1 border border-slate-100" />
            <Button onClick={() => navigator.clipboard.writeText(referralLink)} variant="secondary">نسخ</Button>
          </div>
        </div>
      </div>

      {/* سجل الفواتير */}
      <div className="border border-slate-100 rounded-3xl p-6 bg-white">
        <h3 className="text-xs font-black text-slate-800 mb-4">سجل العمليات</h3>
        {loading ? <p className="text-[10px] text-slate-400">جاري التحميل...</p> : 
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[10px] text-slate-800">
              <thead><tr className="border-b"><th className="pb-2">رقم العملية</th><th className="pb-2">الباقة</th><th className="pb-2">القيمة</th></tr></thead>
              <tbody>{invoices.map(inv => <tr key={inv.id} className="border-b"><td className="py-3 font-mono">{inv.payment_id}</td><td>{inv.plan_type}</td><td>{inv.amount} SAR</td></tr>)}</tbody>
            </table>
          </div>
        }
      </div>

      {/* مودال السداد */}
      {showMoyasarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[32px] max-w-sm w-full text-center">
            <h3 className="font-black text-lg mb-4 text-slate-900">تأكيد عملية السداد</h3>
            <Button onClick={executeMockPayment} loading={paymentLoading} className="w-full">تأكيد الآن ⚡</Button>
            <Button onClick={() => setShowMoyasarModal(false)} variant="secondary" className="w-full mt-2">إلغاء</Button>
          </div>
        </div>
      )}
    </div>
  )
}
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

  const userPlan = profile?.plan || 'free'
  const isUpgraded = userPlan.toLowerCase().trim() !== 'free'
  const activeTokensCount = profile?.tokens ?? 0
  const userReferralCode = profile?.referral_code || `TA-${profile?.id?.substring(0, 5).toUpperCase()}`
  const referralLink = `${window.location.origin}/register?ref=${userReferralCode}`

  useEffect(() => {
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
        console.error('❌ [Invoice Fetch Error]:', err.message)
      } finally {
        setLoading(false)
      }
    }

    if (profile?.id) loadBillingStatements()
  }, [profile])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    showToast('تم نسخ رابط الإحالة!', 'success')
  }

  const handleDailyClick = async () => {
    if (dailyClaimed) return
    await claimDailyReward()
    setDailyClaimed(true)
  }

  const openCheckout = (planConfig) => {
    if (planConfig.id === userPlan) {
      showToast('أنت مشترك بالفعل في هذه الباقة', 'warning')
      return
    }
    setSelectedPlan(planConfig)
    setShowMoyasarModal(true)
  }

  const executeMockPayment = async () => {
    if (!profile?.id || !selectedPlan) return
    setPaymentLoading(true)
    
    try {
      const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase()
      const updatedTokens = activeTokensCount + selectedPlan.tokensReward
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan: selectedPlan.id,
          subscription_status: 'active',
          tokens: updatedTokens
        })
        .eq('id', profile.id)

      if (profileError) throw profileError

      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert([{
          user_id: profile.id,
          payment_id: mockPaymentId,
          plan_type: selectedPlan.name,
          amount: parseFloat(selectedPlan.price),
          created_at: new Date().toISOString()
        }])

      if (invoiceError) throw invoiceError

      setProfile(prev => ({
        ...prev,
        plan: selectedPlan.id,
        subscription_status: 'active',
        tokens: updatedTokens
      }))

      setInvoices(prev => [{
        id: mockPaymentId,
        payment_id: mockPaymentId,
        plan_type: selectedPlan.name,
        amount: parseFloat(selectedPlan.price),
        created_at: new Date().toISOString()
      }, ...prev])

      showToast(`مبروك ترقية حسابك إلى ${selectedPlan.name}`, 'success')
      setShowMoyasarModal(false)
    } catch (err) {
      console.error('Error:', err.message)
      showToast('فشل السداد', 'error')
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-5xl mx-auto select-none dir-rtl text-right font-sans pb-12 transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      <SectionTitle title="إدارة الحساب" subtitle="تتبع عمليات السداد" badge="الفوترة" />

      {/* الرصيد */}
      <div className={`border rounded-3xl p-6 mb-8 ${theme === 'dark' ? 'bg-[#160f30]/20' : 'bg-white'}`}>
        <h2 className="text-3xl font-black">{activeTokensCount.toLocaleString()} <span className="text-xs">توكن متاح</span></h2>
      </div>

      {/* الفواتير */}
      <div className={`border rounded-3xl p-6 ${theme === 'dark' ? 'bg-[#160f30]/40' : 'bg-white'}`}>
        <h3 className="text-xs font-black mb-4">سجل الفواتير</h3>
        {loading ? (
          <div className="text-xs text-slate-400">جاري تحميل الفواتير...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs font-bold text-right">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3">رقم الفاتورة</th>
                  <th className="pb-3">التاريخ</th>
                  <th className="pb-3">الباقة</th>
                  <th className="pb-3">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-3 font-mono">{inv.payment_id}</td>
                    <td className="py-3">{new Date(inv.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3">{inv.plan_type}</td>
                    <td className="py-3 text-blue-600">{inv.amount} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showMoyasarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white p-6 rounded-[32px] max-w-sm w-full">
                <h3 className="text-sm font-black mb-4">تأكيد عملية السداد</h3>
                <button onClick={executeMockPayment} disabled={paymentLoading} className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-black">
                  {paymentLoading ? 'جاري المعالجة...' : 'تأكيد السداد'}
                </button>
                <button onClick={() => setShowMoyasarModal(false)} className="w-full py-2 mt-2 text-[10px] font-black text-slate-400">إلغاء</button>
            </div>
        </div>
      )}
    </div>
  )
}
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

  const handleDailyClick = async () => {
    if (dailyClaimed) return
    await claimDailyReward()
    setDailyClaimed(true)
  }

  const openCheckout = (plan) => {
    if (plan.id === userPlan) {
      showToast('أنت مشترك بالفعل في هذه الباقة يا قائد 👑', 'warning')
      return
    }
    setSelectedPlan(plan)
    setShowMoyasarModal(true)
  }

  const executeMockPayment = async () => {
    if (!profile?.id || !selectedPlan) return
    setPaymentLoading(true)
    
    try {
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`
      const updatedTokens = activeTokensCount + selectedPlan.tokensReward
      
      // 1. تحديث البروفايل في السيرفر
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan: selectedPlan.id,
          tokens: updatedTokens
        })
        .eq('id', profile.id)

      if (profileError) throw profileError

      // 2. تسجيل الفاتورة
      const newInvoice = {
        user_id: profile.id,
        payment_id: mockPaymentId,
        plan_type: selectedPlan.name,
        amount: parseFloat(selectedPlan.price),
        created_at: new Date().toISOString()
      }

      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert([newInvoice])

      if (invoiceError) throw invoiceError

      // 3. تحديث الـ State فورياً
      setProfile(prev => ({ ...prev, plan: selectedPlan.id, tokens: updatedTokens }))
      setInvoices(prev => [newInvoice, ...prev])

      showToast(`تم الترقية إلى ${selectedPlan.name} بنجاح! 💳🔥`, 'success')
      setShowMoyasarModal(false)
    } catch (err) {
      console.error('❌ [Payment Error]:', err)
      showToast('حدث خطأ أثناء معالجة السداد', 'error')
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-5xl mx-auto p-6 font-sans ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
      <SectionTitle title="إدارة الاشتراك" subtitle="تحكم في باقتك واستعرض فواتيرك" badge="الفوترة" />
      
      {/* عرض الباقات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {PLANS.map(plan => (
          <div key={plan.id} className="border p-6 rounded-3xl bg-white shadow-sm">
            <h4 className="text-sm font-black mb-2">{plan.name}</h4>
            <p className="text-2xl font-black mb-4">{plan.price} <span className="text-xs font-normal">ريال</span></p>
            <Button onClick={() => openCheckout(plan)} disabled={userPlan === plan.id} className="w-full">
              {userPlan === plan.id ? 'الباقة الحالية' : plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* مودال ميسر */}
      {showMoyasarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[32px] max-w-sm w-full text-center">
            <h3 className="font-black text-lg mb-4">تأكيد السداد التجريبي</h3>
            <Button onClick={executeMockPayment} loading={paymentLoading} className="w-full">
              تأكيد الدفع ⚡
            </Button>
            <Button onClick={() => setShowMoyasarModal(false)} variant="secondary" className="w-full mt-2">إلغاء</Button>
          </div>
        </div>
      )}
    </div>
  )
}
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
  
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const activePlan = PLANS.find(p => p.id === (profile?.plan || 'free')) || PLANS[0]
  const isFree = activePlan.id === 'free'

  useEffect(() => {
    const loadBilling = async () => {
      const { data } = await supabase.from('invoices').select('*').eq('user_id', profile?.id).order('created_at', { ascending: false })
      setInvoices(data || [])
      setLoading(false)
    }
    if (profile?.id) loadBilling()
  }, [profile])

  const handleAction = async (action) => {
    setPaymentLoading(true)
    try {
      if (action === 'cancel') {
        await supabase.from('profiles').update({ plan: 'free' }).eq('id', profile.id)
        setProfile(prev => ({ ...prev, plan: 'free' }))
        showToast('تم إلغاء الاشتراك بنجاح', 'success')
      } else if (action === 'add_tokens') {
        const newTokens = (profile.tokens || 0) + 1000
        await supabase.from('profiles').update({ tokens: newTokens }).eq('id', profile.id)
        setProfile(prev => ({ ...prev, tokens: newTokens }))
        showToast('تم إضافة 1000 توكنز لرصيدك', 'success')
      }
    } catch (err) { showToast('حدث خطأ', 'error') } finally { setPaymentLoading(false) }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <SectionTitle title="إدارة الاشتراك" subtitle="تحكم في باقتك الحالية وإعدادات الفوترة" badge="الإعدادات" />

      {/* لوحة الحالة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400">الباقة الحالية</p>
          <h2 className="text-2xl font-black mt-1 mb-4">{activePlan.name}</h2>
          <div className="flex gap-2">
            {!isFree && <Button onClick={() => handleAction('cancel')} variant="secondary" className="w-full text-[10px]">إلغاء الاشتراك</Button>}
            <Button className="w-full text-[10px]">ترقية الباقة</Button>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400">رصيد التوكنز</p>
            <h2 className="text-2xl font-black mt-1">{(profile?.tokens || 0).toLocaleString()}</h2>
          </div>
          <Button onClick={() => handleAction('add_tokens')} loading={paymentLoading} className="w-full text-[10px] mt-4">شراء توكنز إضافية ⚡</Button>
        </div>
      </div>

      {/* سجل الفواتير */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black mb-4">سجل الفواتير</h3>
        {loading ? <p>جاري التحميل...</p> : (
          <table className="w-full text-right text-[10px]">
            <thead className="text-slate-400"><tr className="border-b"><th className="pb-2">رقم العملية</th><th className="pb-2">التاريخ</th><th className="pb-2">المبلغ</th></tr></thead>
            <tbody>{invoices.map(inv => <tr key={inv.id} className="border-b"><td className="py-3">{inv.payment_id}</td><td className="py-3">{new Date(inv.created_at).toLocaleDateString()}</td><td className="py-3">{inv.amount} SAR</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}
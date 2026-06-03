import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
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

  // Neon Glassmorphism Classes
  const cardClass = "bg-[#0d071d]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl";

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <SectionTitle title="إدارة الاشتراك" subtitle="لوحة التحكم النيونيّة لبياناتك المالية" badge="Premium Control" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* كرت الباقة */}
        <div className={`${cardClass} border-l-4 border-l-cyan-400`}>
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">الباقة النشطة</p>
          <h2 className="text-2xl font-black mt-2 mb-6">{activePlan.name}</h2>
          <div className="flex gap-3">
            {!isFree && <Button onClick={() => handleAction('cancel')} variant="secondary" className="w-full text-[10px] bg-transparent border-white/20">إلغاء</Button>}
            <Button className="w-full text-[10px] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">ترقية الباقة</Button>
          </div>
        </div>
        
        {/* كرت التوكنز */}
        <div className={`${cardClass} border-r-4 border-r-pink-500 flex flex-col justify-between`}>
          <div>
            <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">رصيد التوكنز</p>
            <h2 className="text-3xl font-black mt-2">{(profile?.tokens || 0).toLocaleString()}</h2>
          </div>
          <Button onClick={() => handleAction('add_tokens')} loading={paymentLoading} className="w-full text-[10px] mt-6 bg-white text-black hover:bg-slate-200">
            شراء توكنز إضافية ⚡
          </Button>
        </div>
      </div>

      {/* سجل الفواتير */}
      <div className={`${cardClass}`}>
        <h3 className="text-xs font-black mb-6 text-slate-300">سجل الفواتير التاريخي</h3>
        {loading ? <p className="text-slate-500">جاري التحميل...</p> : (
          <table className="w-full text-right text-[10px]">
            <thead className="text-slate-500"><tr className="border-b border-white/5"><th className="pb-3">رقم العملية</th><th className="pb-3">التاريخ</th><th className="pb-3">المبلغ</th></tr></thead>
            <tbody>{invoices.map(inv => <tr key={inv.id} className="border-b border-white/5"><td className="py-4 font-mono text-cyan-300">{inv.payment_id}</td><td className="py-4 text-slate-300">{new Date(inv.created_at).toLocaleDateString()}</td><td className="py-4 font-bold">{inv.amount} SAR</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}
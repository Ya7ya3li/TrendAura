import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { supabase } from '../config/supabase.js'
import { PLANS } from '../constants/plans.js'
import SectionTitle from '../components/common/SectionTitle.jsx'
import Button from '../components/common/Button.jsx'
import { showToast } from '../App.jsx'

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
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
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
        if (typeof showToast === 'function') showToast('تم إلغاء الاشتراك بنجاح رجعي', 'success')
      } else if (action === 'add_tokens') {
        const newTokens = (profile.tokens || 0) + 1000
        await supabase.from('profiles').update({ tokens: newTokens }).eq('id', profile.id)
        setProfile(prev => ({ ...prev, tokens: newTokens }))
        if (typeof showToast === 'function') showToast('تم إضافة 1000 توكنز لرصيدك الحقيقي', 'success')
      }
    } catch (err) { 
      if (typeof showToast === 'function') showToast('حدث خطأ في المزامنة', 'error') 
    } finally { 
      setPaymentLoading(false) 
    }
  }

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[32px] p-8 shadow-2xl"

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <SectionTitle title="إدارة الاشتراك والفوترة" subtitle="لوحة التحكم لبيانات الباقات والمحفوظات المالية" badge="Premium Control" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`${cardClass} border-l-4 border-l-cyan-500`}>
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">الباقة النشطة</p>
          <h2 className="text-2xl font-black mt-2 mb-6 text-white">{activePlan.name}</h2>
          <div className="flex gap-3">
            {!isFree && <Button onClick={() => handleAction('cancel')} variant="secondary" className="w-full text-[10px] bg-transparent border-slate-800">إلغاء الباقة</Button>}
            <Button className="w-full text-[10px] bg-gradient-to-r from-blue-600 to-indigo-600">ترقية الخطة حياً</Button>
          </div>
        </div>
        
        <div className={`${cardClass} border-r-4 border-r-pink-500 flex flex-col justify-between`}>
          <div>
            <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">رصيد التوكنز الحقيقي</p>
            <h2 className="text-3xl font-black mt-2 text-white">{(profile?.tokens || 0).toLocaleString()}</h2>
          </div>
          <Button onClick={() => handleAction('add_tokens')} loading={paymentLoading} className="w-full text-[10px] mt-6 bg-white text-slate-950 hover:bg-slate-100">
            شراء حزمة توكنز إضافية ⚡
          </Button>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-xs font-black mb-6 text-slate-300">سجل الفواتير التاريخي المعزز</h3>
        {loading ? <p className="text-slate-500 text-xs">جاري التحميل المعياري...</p> : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-right text-[10px]">
              <nav className="text-slate-500 border-b border-slate-800/60"><tr className="text-slate-400"><th className="pb-3">رقم العملية</th><th className="pb-3">التاريخ</th><th className="pb-3">المبلغ المستقطع</th></tr></nav>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-slate-800/40 hover:bg-slate-900/20 transition-all">
                    <td className="py-4 font-mono text-cyan-400">{inv.payment_id}</td>
                    <td className="py-4 text-slate-400">{new Date(inv.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-4 font-bold text-white">{inv.amount} SAR</td>
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
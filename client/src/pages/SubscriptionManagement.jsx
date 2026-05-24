import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import Sidebar from '../components/Sidebar'

export default function SubscriptionManagement() {
  const [plan, setPlan] = useState('free')

  useEffect(() => {
    fetchUserPlan()
  }, [])

  const fetchUserPlan = async () => {
    const { data: authData } = await supabase.auth.getUser()
    if (authData?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', authData.user.id)
        .maybeSingle()
      if (data?.plan) setPlan(data.plan.toLowerCase().trim())
    }
  }

  return (
    <div className="layout" style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ flexGrow: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* كرت إدارة الاشتراك الفخم النيون */}
        <div style={{
          backgroundColor: '#090e1a',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '24px',
          padding: '35px',
          width: '100%',
          maxWidth: '550px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(168, 85, 247, 0.15)',
          textAlign: 'right',
          direction: 'rtl'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💳</span> باقة الاشتراك
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 30px 0' }}>إدارة تفاصيل خطتك الحالية والدفع</p>
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '25px' }}></div>

          <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>الخطة الحالية:</span>
            <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '8px' }}>
              {plan === 'free' ? '🌱 الباقة المجانية' : plan === 'pro' ? '🚀 الباقة الاحترافية PRO' : '⚡ محرك الفايرال الخارق'}
            </span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            حالة التجديد: <span style={{ color: plan === 'free' ? '#64748b' : '#10b981' }}>{plan === 'free' ? 'غير نشط' : 'تجديد تلقائي نشط'}</span>
          </p>
        </div>

      </main>
    </div>
  )
}
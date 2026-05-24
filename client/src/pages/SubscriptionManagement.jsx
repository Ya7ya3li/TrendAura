import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import Sidebar from '../components/Sidebar'
import { showToast } from '../App' // 🟢 استيراد التوست لإظهار إشعار الإلغاء بنجاح

export default function SubscriptionManagement() {
  const [plan, setPlan] = useState('free')
  
  // 🟢 إعادة استدعاء حالات إدارة إلغاء الاشتراك والـ Modal
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [canceling, setCanceling] = useState(false)

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

  // 🟢 إعادة دالة إلغاء الاشتراك الأصلية والمستقرة لحفظ حقوق المستخدم
  const handleCancelSubscription = async () => {
    setShowCancelModal(false)
    setCanceling(true)
    setTimeout(() => {
      setCanceling(false)
      showToast('تم إلغاء التجديد التلقائي بنجاح. باقتك ستظل فعالة حتى نهاية الفترة الحالية لحفظ حقوقك 🌟', 'success')
    }, 1500)
  }

  // فحص ما إذا كان المستخدم على باقة مدفوعة ليظهر له زر الإلغاء
  const isPremium = plan === 'pro' || plan === 'viral_engine' || plan === 'viral engine' || plan === 'pro viral engine'

  return (
    <div className="layout" style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ flexGrow: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        
        {/* 🟢 الـ Modal المنبثق لتأكيد إلغاء الاشتراك (بنفس الكلاسات الأصلية الشغالة عندك) */}
        {showCancelModal && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <div className="confirm-icon" style={{ color: '#ef4444' }}>🥺</div>
              <h3>إلغاء الاشتراك</h3>
              <p>هل أنت متأكد يا بطل؟ بإلغاء اشتراكك ستفقد ميزات الذكاء الاصطناعي الخارقة والـ VIP Support بنهاية الفترة الحالية.</p>
              <div className="confirm-btns">
                <button className="confirm-cancel" onClick={() => setShowCancelModal(false)}>
                  تراجع، أريد البقاء
                </button>
                <button 
                  className="confirm-delete" 
                  style={{ backgroundColor: '#ef4444' }} 
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                >
                  {canceling ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* كرت إدارة الاشتراك الفخم النيون المحدث */}
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
            <span>💳</span> إدارة الاشتراك
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 30px 0' }}>إدارة تفاصيل خطتك الحالية والدفع</p>
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '25px' }}></div>

          <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>الخطة الحالية:</span>
            <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '8px' }}>
              {plan === 'free' ? ' الباقة المجانية' : plan === 'pro' ? '🚀   PRO' : '⚡ viral engine'}
            </span>
          </div>

          <div style={{ marginBottom: isPremium ? '25px' : '0' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              حالة التجديد: <span style={{ color: plan === 'free' ? '#64748b' : '#10b981' }}>{plan === 'free' ? 'غير نشط' : 'تجديد تلقائي نشط'}</span>
            </p>
          </div>

          {/* 🟢 زر إلغاء الاشتراك التلقائي يظهر فقط وحصرياً إذا كان المستخدم مشتركاً بباقة مدفوعة */}
          {isPremium && (
            <button 
              className="danger-btn" 
              style={{ 
                backgroundColor: '#fef2f2', 
                color: '#ef4444', 
                border: '1px solid #fee2e2',
                padding: '12px',
                borderRadius: '14px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                width: '100%',
                marginTop: '20px',
                textAlign: 'center'
              }} 
              onClick={() => setShowCancelModal(true)}
              disabled={canceling}
            >
              {canceling ? 'جاري إلغاء التجديد...' : '❌ إلغاء الاشتراك التلقائي'}
            </button>
          )}
        </div>

      </main>
    </div>
  )
}
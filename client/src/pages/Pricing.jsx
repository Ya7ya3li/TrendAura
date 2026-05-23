import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import { plans } from '../utils/plans' // 🟢 استدعاء مسمى صحيح ومؤمن بالأقواس الحاصرة
import axiosInstance from 'axios' 
import toast from 'react-hot-toast' 

const showToast = (message, type) => {
  if (type === 'error') {
    toast.error(message, { style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' } })
  } else {
    toast.success(message, { style: { background: '#1e293b', color: '#fff', border: '1px solid #22c55e' } })
  }
}

export default function Pricing() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', data.user.id)
          .maybeSingle()
        
        if (profile?.plan) {
          setCurrentPlan(profile.plan.toLowerCase().trim())
        }
      }
    }
    checkUser()
  }, [])

  const handleSubscribe = async (planType) => {
    if (!user) {
      navigate('/login')
      return
    }

    localStorage.setItem('selectedPlan', planType)
    setLoading(true)

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axiosInstance.post(`${backendUrl}/api/payment/checkout`, {
        userId: user.id,
        planType: planType
      })

      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url
      } else {
        showToast('حدث خطأ أثناء تهيئة بوابة الدفع، يرجى المحاولة لاحقاً.', 'error')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      showToast('فشل الاتصال بخادم الدفع.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const isPlanActive = (planId) => {
    const cleanPlan = currentPlan?.toLowerCase()?.trim()
    if (planId === 'viral_engine') {
      return cleanPlan === 'viral_engine' || cleanPlan === 'viral engine' || cleanPlan === 'pro viral engine' || cleanPlan === 'pro_viral'
    }
    if (planId === 'pro') return cleanPlan === 'pro'
    if (planId === 'free') return cleanPlan === 'free' || !cleanPlan || cleanPlan === ''
    return false
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '40px 20px', direction: 'rtl', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '1200px', margin: '0 auto 20px auto', width: '100%' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#94a3b8',
            padding: '10px 22px',
            borderRadius: '14px', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
            e.currentTarget.style.color = '#f8fafc'
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
            e.currentTarget.style.color = '#94a3b8'
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <span>➡️</span>
          <span>العودة للوحة التحكم</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '15px' }}>
          اختر خطتك للنجاح
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          انطلق بـ TrendAura وحوّل أفكارك إلى مشاهدات ملايين
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: '30px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        {plans.map((plan) => {
          const active = isPlanActive(plan.id)
          
          return (
            <div 
              key={plan.id} 
              style={{
                backgroundColor: '#1e293b',
                border: `1px solid ${plan.borderColor}`,
                boxShadow: plan.glow,
                borderRadius: '24px',
                padding: '40px 30px',
                width: '100%',
                maxWidth: '350px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                zIndex: plan.popular ? 10 : 1,
                boxSizing: 'border-box'
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.popular ? 'linear-gradient(to right, #ff416c, #ff4b2b)' : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: '#fff',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '15px' }}>{plan.name}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '5px' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '900', color: '#f8fafc' }}>{plan.price}</span>
                  <span style={{ fontSize: '1rem', color: '#94a3b8' }}>ريال / شهر</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '15px', lineHeight: '1.5', minHeight: '45px' }}>
                  {plan.desc}
                </p>
              </div>

              <div style={{ height: '1px', background: '#334155', marginBottom: '30px', width: '100%' }}></div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flexGrow: 1 }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.4', textAlign: 'right' }}>
                    <div style={{ background: plan.popular ? 'rgba(236, 72, 153, 0.12)' : 'rgba(59, 130, 246, 0.12)', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', flexShrink: 0 }}>
                      <span style={{ color: plan.popular ? '#ec4899' : '#3b82f6', fontSize: '1rem' }}>✓</span>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.id !== 'free' ? handleSubscribe(plan.id) : null}
                disabled={active || loading || plan.id === 'free'}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: (active || plan.id === 'free') ? 'default' : 'pointer',
                  background: active 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : (plan.id === 'free' ? 'rgba(255,255,255,0.02)' : (plan.popular ? 'linear-gradient(to right, #ff4b2b, #ff416c)' : '#2563eb')),
                  color: active ? '#22c55e' : (plan.id === 'free' ? '#475569' : '#fff'),
                  border: active ? '1px solid #22c55e' : (plan.id === 'free' ? '1px solid rgba(255,255,255,0.05)' : 'none'), 
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {active ? `خطتك الحالية ✅` : plan.id === 'free' ? 'باقة مجانية' : `اشترك الآن 💎`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
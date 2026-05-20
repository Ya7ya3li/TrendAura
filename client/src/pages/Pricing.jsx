import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import axios from 'axios'

export default function Pricing() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentPlan, setCurrentPlan] = useState('FREE')
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
          setCurrentPlan(profile.plan.toUpperCase())
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

    // 🟢 السطر السحري: نحفظ اسم الباقة المحددة في ذاكرة المتصفح لتسترجعه صفحة Success بأمان
    localStorage.setItem('selectedPlan', planType)

    setLoading(true)
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await axios.post(`${backendUrl}/api/payment/checkout`, {
        userId: user.id,
        planType: planType 
      })

      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url
      } else {
        alert('حدث خطأ أثناء تهيئة بوابة الدفع، يرجى المحاولة لاحقاً.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('فشل الاتصال بخادم الدفع.')
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      id: 'FREE',
      name: 'الباقة المجانية',
      price: '0',
      icon: '🌱',
      features: ['إنشاء سكريبتات محدودة يومياً', 'الوصول للأدوات الأساسية', 'دعم عبر البريد الإلكتروني'],
      buttonText: 'باقتك الحالية',
      action: null,
      disabled: true,
      popular: false
    },
    {
      id: 'PRO',
      name: 'اشتراك PRO',
      price: '49', 
      icon: '💎',
      features: ['إنشاء سكريبتات غير محدودة', 'ذكاء اصطناعي متقدم وسريع', 'دعم مباشر 24/7 عبر تليجرام', 'بدون إعلانات'],
      buttonText: currentPlan === 'PRO' ? 'باقتك الحالية' : 'اشترك الآن 💎',
      action: () => handleSubscribe('pro'),
      disabled: currentPlan === 'PRO' || loading,
      popular: false
    },
    {
      id: 'VIRAL_ENGINE',
      name: 'Viral Engine 🚀',
      price: '99', 
      icon: '🔥',
      features: ['كل مميزات باقة PRO', 'أدوات تحليل تريندات التيك توك الحصرية', 'أولوية قصوى في معالجة البيانات', 'أفكار محتوى فيروسي متجددة يومياً'],
      buttonText: currentPlan === 'VIRAL_ENGINE' ? 'باقتك الحالية' : 'امتلك المحرك الفيروسي 🚀',
      action: () => handleSubscribe('viral_engine'),
      disabled: currentPlan === 'VIRAL_ENGINE' || loading,
      popular: true
    }
  ]

  return (
    <div className="pricing-container" style={{ padding: '40px 20px', direction: 'rtl', textAlgin: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>اختر خطتك للنجاح على تيك توك</h1>
        <p style={{ color: '#666' }}>انطلق بـ TrendAura وحوّل أفكارك إلى مشاهدات ملايين</p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`pricing-card ${plan.popular ? 'popular-card' : ''}`}
            style={{
              background: '#fff',
              border: plan.popular ? '2px solid #fe2c55' : '1px solid #eee',
              borderRadius: '16px',
              padding: '30px',
              width: '320px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'between'
            }}
          >
            {plan.popular && (
              <span style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fe2c55',
                color: '#fff',
                padding: '4px 15px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                الأكثر طلباً 🔥
              </span>
            )}

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{plan.icon}</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{plan.name}</h2>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111' }}>
                {plan.price} <span style={{ fontSize: '1rem', color: '#666', fontWeight: 'normal' }}>ريال / شهرياً</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flexGrow: 1 }}>
              {plan.features.map((feature, idx) => (
                <li key={idx} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#443' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={plan.action}
              disabled={plan.disabled}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: plan.disabled ? 'not-allowed' : 'pointer',
                background: plan.disabled ? '#f5f5f5' : plan.popular ? '#fe2c55' : '#111',
                color: plan.disabled ? '#999' : '#fff',
                transition: 'all 0.2s ease'
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
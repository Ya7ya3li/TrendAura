import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import Sidebar from '../components/Sidebar'
import { showToast } from '../App' // 👈 استيراد دالة التوست الخاصة بموقعك

export default function Pricing() {
  const [loading, setLoading] = useState(null) // null لمعرفة أي زر انضغط
  const [plan, setPlan] = useState('free')
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkPlan()
  }, [])

  const checkPlan = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return
    setUser(userData.user)

    const { data } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userData.user.id)
      .maybeSingle()

    // القيم المتوقعة من الداتابيس: 'free', 'pro', 'pro_viral'
    setPlan(data?.plan || 'free')
  }

  // إرسال targetPlan إلى الباك إند
  const subscribe = async (targetPlan) => {
    if (!user) {
      showToast('سجّل دخول أولاً للاشتراك في الباقات', 'warning') // 👈 استبدال الـ alert بتوست احترافي
      setTimeout(() => { window.location.href = '/login' }, 1500)
      return
    }
    setLoading(targetPlan) // تحديد أي باقة يتم تحميلها الآن
    
    try {
      // 🚀 تم تصحيح المسار إلى الـ Endpoint المخصصة للدفع بالكامل
      const res = await fetch('https://trendaura-production-06c0.up.railway.app/api/ai/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: user.email, 
            userId: user.id, 
            planType: targetPlan 
        }) 
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (error) {
      console.error('Error with checkout:', error)
      showToast('حدث خطأ أثناء تحويلك لصفحة الدفع، يرجى المحاولة لاحقاً.', 'error') // 👈 استبدال الـ alert بتوست الاحترافي المتوهج
    }
    
    setLoading(null)
  }

  // التحقق من حالة الباقات
  const isPro = plan?.toLowerCase() === 'pro'
  const isProViral = plan?.toLowerCase() === 'pro_viral'

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">

        <div className="pricing-header">
          <h1>اختر خطتك 🚀</h1>
          <p>طوّر محتواك وضاعف مشاهداتك مع TrendAura</p>
        </div>

        {(isPro || isProViral) && (
          <div className="pro-active-banner">
            🎉 أنت الآن على خطة {isPro ? 'Pro' : 'Pro Viral Engine'} — استمتع بكل المميزات!
          </div>
        )}

        <div className="pricing-wrapper">

          {/* 🟢 الباقة المجانية */}
          <div className={`pricing-card-new ${plan === 'free' ? 'active-plan-card' : ''}`}>
            <div className="pricing-top">
              <span className="plan-name-badge free-badge">مجاني</span>
              <h2 className="plan-title">Free</h2>
              <div className="plan-price">
                <span className="price-big">0</span>
                <span className="price-small">ريال / شهر</span>
              </div>
              <p className="plan-desc">مناسب للمبتدئين وتجربة المنصة</p>
            </div>

            <div className="plan-divider" />

            <ul className="plan-features-new">
              <li><span className="feat-icon yes">✓</span> 5 توليدات يومياً</li>
              <li><span className="feat-icon yes">✓</span> أفكار محتوى أساسية</li>
              <li><span className="feat-icon yes">✓</span> هاشتاقات جاهزة</li>
              <li><span className="feat-icon yes">✓</span> سكربتات قصيرة محدودة</li>
              <li><span className="feat-icon yes">✓</span> تجربة المحرك الأساسي</li>
              <li><span className="feat-icon no">✕</span> بدون حفظ دائم</li>
            </ul>

            <button className="plan-btn-free" disabled>
              {plan === 'free' ? 'خطتك الحالية' : 'مجاني دائماً'}
            </button>
          </div>

          {/* 🔵 باقة Pro */}
          <div className={`pricing-card-new pro-card-new ${isPro ? 'active-plan-card' : ''}`}>
            <div className="pro-glow" />

            <div className="pricing-top">
              <span className="plan-name-badge pro-badge-new">🔥 الأكثر شعبية</span>
              <h2 className="plan-title">Pro</h2>
              <div className="plan-price">
                <span className="price-big">29</span>
                <span className="price-small">ريال / شهر</span>
              </div>
              <p className="plan-desc">للمحترفين الذين يريدون النمو بسرعة</p>
            </div>

            <div className="plan-divider" />

            <ul className="plan-features-new">
              <li><span className="feat-icon yes">✓</span> توليد غير محدود</li>
              <li><span className="feat-icon yes">✓</span> Hooks احترافية</li>
              <li><span className="feat-icon yes">✓</span> سكربتات قصيرة جاهزة</li>
              <li><span className="feat-icon yes">✓</span> عناوين تجذب المشاهدات</li>
              <li><span className="feat-icon yes">✓</span> تحسين جودة السكربت</li>
              <li><span className="feat-icon yes">✓</span> أولوية في التوليد</li>
              <li><span className="feat-icon yes">✓</span> حفظ السكربتات</li>
              <li><span className="feat-icon yes">✓</span> دعم VIP 24/7</li>
            </ul>

            {isPro ? (
              <button className="plan-btn-pro" disabled>
                ✅ خطتك الحالية
              </button>
            ) : (
              <button 
                className="plan-btn-pro" 
                onClick={() => subscribe('pro')} 
                disabled={loading !== null}
              >
                {loading === 'pro' ? '⏳ جاري التحويل...' : '🚀 اشترك بـ 29 ريال'}
              </button>
            )}
          </div>

          {/* 🔴 باقة Pro Viral Engine */}
          <div className={`pricing-card-new viral-card-new ${isProViral ? 'active-plan-card' : ''}`} style={{ borderColor: '#ff4d4d' }}>
            <div className="viral-glow" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at top right, rgba(255, 77, 77, 0.15), transparent)', pointerEvents: 'none' }} />

            <div className="pricing-top">
              <span className="plan-name-badge" style={{ background: 'linear-gradient(90deg, #ff4d4d, #ff8080)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                ⚡ اختيار صناع المحتوى
              </span>
              <h2 className="plan-title">Viral Engine</h2>
              <div className="plan-price">
                <span className="price-big">69</span>
                <span className="price-small">ريال / شهر</span>
              </div>
              <p className="plan-desc">القوة القصوى للانتشار السريع والـ Viral</p>
            </div>

            <div className="plan-divider" />

            <ul className="plan-features-new">
              <li><span className="feat-icon yes">✓</span> <strong>جميع ميزات Pro</strong></li>
              <li><span className="feat-icon yes">✓</span> أفكار Viral قوية 🚀</li>
              <li><span className="feat-icon yes">✓</span> تحليل قابلية الانتشار</li>
              <li><span className="feat-icon yes">✓</span> سكربتات 60 ثانية احترافية</li>
              <li><span className="feat-icon yes">✓</span> أسلوب ترندي لجميع المنصات</li>
              <li><span className="feat-icon yes">✓</span> نسخ متعددة لنفس الفكرة</li>
              <li><span className="feat-icon yes">✓</span> تحسين معدل البقاء (Retention)</li>
              <li><span className="feat-icon yes">✓</span> أولوية قصوى في التوليد ⚡</li>
            </ul>

            {isProViral ? (
              <button className="plan-btn-pro" disabled style={{ background: '#333' }}>
                ✅ خطتك الحالية
              </button>
            ) : (
              <button 
                className="plan-btn-pro" 
                onClick={() => subscribe('pro_viral')} 
                disabled={loading !== null}
                style={{ background: 'linear-gradient(90deg, #ff4d4d, #e60000)' }}
              >
                {loading === 'pro_viral' ? '⏳ جاري التحويل...' : '⚡ اشترك بـ 69 ريال'}
              </button>
            )}
            
            <p className="plan-note">يمكنك الإلغاء في أي وقت</p>
          </div>

        </div>

      </main>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import Sidebar from '../components/Sidebar'

export default function Pricing() {
  const [loading, setLoading] = useState(false)
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

    setPlan(data?.plan || 'free')
  }

  const subscribe = async () => {
    if (!user) {
      alert('سجّل دخول أولاً')
      return
    }
    setLoading(true)
    const res = await fetch('https://trendaura-production-06c0.up.railway.app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, userId: user.id })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setLoading(false)
  }

  const isPro = plan?.toUpperCase() === 'PRO'

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">

        <div className="pricing-header">
          <h1>اختر خطتك 🚀</h1>
          <p>ابدأ مجاناً وطوّر تجربتك مع TrendAura Pro</p>
        </div>

        {isPro && (
          <div className="pro-active-banner">
            🎉 أنت الآن على خطة Pro — استمتع بكل المميزات!
          </div>
        )}

        <div className="pricing-wrapper">

          {/* Free */}
          <div className="pricing-card-new">
            <div className="pricing-top">
              <span className="plan-name-badge free-badge">مجاني</span>
              <h2 className="plan-title">Free</h2>
              <div className="plan-price">
                <span className="price-big">0</span>
                <span className="price-small">ريال / شهر</span>
              </div>
              <p className="plan-desc">مثالي للبداية وتجربة المنصة</p>
            </div>

            <div className="plan-divider" />

            <ul className="plan-features-new">
              <li><span className="feat-icon yes">✓</span> 5 سكربتات شهرياً</li>
              <li><span className="feat-icon yes">✓</span> ترندات AI</li>
              <li><span className="feat-icon yes">✓</span> هاشتاقات AI</li>
              <li><span className="feat-icon yes">✓</span> تصدير PDF</li>
              <li><span className="feat-icon no">✕</span> سكربتات غير محدودة</li>
              <li><span className="feat-icon no">✕</span> أولوية في التوليد</li>
              <li><span className="feat-icon no">✕</span> دعم مباشر</li>
            </ul>

            <button className="plan-btn-free" disabled>
              خطتك الحالية
            </button>
          </div>

          {/* Pro */}
          <div className="pricing-card-new pro-card-new">
            <div className="pro-glow" />

            <div className="pricing-top">
              <span className="plan-name-badge pro-badge-new">⭐ الأكثر شعبية</span>
              <h2 className="plan-title">Pro</h2>
              <div className="plan-price">
                <span className="price-big">49</span>
                <span className="price-small">ريال / شهر</span>
              </div>
              <p className="plan-desc">للمحترفين الذين يريدون النمو بسرعة</p>
            </div>

            <div className="plan-divider" />

            <ul className="plan-features-new">
              <li><span className="feat-icon yes">✓</span> سكربتات غير محدودة 🔥</li>
              <li><span className="feat-icon yes">✓</span> ترندات AI محدّثة لحظياً</li>
              <li><span className="feat-icon yes">✓</span> هاشتاقات AI ذكية محدثه</li>
              <li><span className="feat-icon yes">✓</span> تصدير PDF غير محدود</li>
              <li><span className="feat-icon yes">✓</span> أولوية في التوليد ⚡</li>
              <li><span className="feat-icon yes">✓</span> دعم مباشر 24/7</li>
              <li><span className="feat-icon yes">✓</span> ميزات حصرية قادمة 🚀</li>
            </ul>

            {isPro ? (
              <button className="plan-btn-pro" disabled>
                ✅ أنت الان مشترك
              </button>
            ) : (
              <button className="plan-btn-pro" onClick={subscribe} disabled={loading}>
                {loading ? '⏳ جاري التحويل...' : '🚀 اشترك الحين — 49 ريال'}
              </button>
            )}

            <p className="plan-note">يمكنك الإلغاء في أي وقت</p>
          </div>

        </div>

      </main>
    </div>
  )
}
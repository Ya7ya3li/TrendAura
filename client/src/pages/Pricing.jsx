import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import Sidebar from '../components/Sidebar'
import { showToast } from '../App'

export default function Pricing() {
  const [loading, setLoading] = useState(null)
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

  const subscribe = async (targetPlan) => {
    if (!user) {
      showToast('سجّل دخول أولاً للاشتراك في الباقات', 'warning')
      setTimeout(() => { window.location.href = '/login' }, 1500)
      return
    }
    setLoading(targetPlan)
    
    try {
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
      showToast('حدث خطأ أثناء تحويلك لصفحة الدفع، يرجى المحاولة لاحقاً.', 'error')
    }
    
    setLoading(null)
  }

  const isPro = plan?.toLowerCase() === 'pro'
  const isProViral = plan?.toLowerCase() === 'pro_viral'

  return (
    <div className="layout" style={{ backgroundColor: '#0a0b10', color: '#ffffff', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '40px 20px' }}>

        <div className="pricing-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px', color: '#ffffff' }}>اختر خطتك المتميزة 🚀</h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>طوّر محتواك وضاعف مشاهداتك بقوة الذكاء الاصطناعي مع TrendAura</p>
        </div>

        {(isPro || isProViral) && (
          <div className="pro-active-banner" style={{ background: 'linear-gradient(90deg, #10b981, #059669)', color: '#fff', padding: '12px 24px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', marginBottom: '30px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}>
            🎉 أنت الآن مشترك في باقة {isPro ? 'Pro' : 'Viral Engine'} — استمتع بكافة المميزات الحصرية!
          </div>
        )}

        <div className="pricing-wrapper" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>

          {/* 🟢 الباقة المجانية - FREE */}
          <div className={`pricing-card-new ${plan === 'free' ? 'active-plan-card' : ''}`} style={{ background: '#11131e', border: plan === 'free' ? '2px solid #10b981' : '1px solid #23263b', borderRadius: '24px', padding: '35px 25px', width: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div className="pricing-top">
              <span className="plan-name-badge free-badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>خطة مجانية</span>
              <h2 className="plan-title" style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '15px', marginBottom: '5px', color: '#ffffff' }}>Free</h2>
              <div className="plan-price" style={{ margin: '15px 0' }}>
                <span className="price-big" style={{ fontSize: '42px', fontWeight: 'extrabold', color: '#ffffff' }}>0</span>
                <span className="price-small" style={{ color: '#94a3b8', marginRight: '5px' }}>ريال / شهر</span>
              </div>
              <p className="plan-desc" style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>مناسب للمبتدئين لاستكشاف وتجربة الأدوات الأساسية</p>
            </div>

            <div className="plan-divider" style={{ height: '1px', background: '#23263b', margin: '20px 0' }} />

            <ul className="plan-features-new" style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px', direction: 'rtl', textAlign: 'right' }}>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> 5 توليدات يومياً للسكربتات</li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> أفكار محتوى وأدوات أساسية</li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> هاشتاقات ترندية جاهزة</li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> تجربة المحرك والذكاء الأساسي</li>
              <li style={{ color: '#64748b' }}><span className="feat-icon no" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✕</span> بدون ميزة الحفظ الدائم بالسيرفر</li>
            </ul>

            <button className="plan-btn-free" disabled style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#64748b', fontWeight: 'bold', cursor: 'not-allowed' }}>
              {plan === 'free' ? '✅ خطتك الحالية (Free)' : 'مجاني دائماً'}
            </button>
          </div>

          {/* 🔵 باقة المحترفين - PRO */}
          <div className={`pricing-card-new pro-card-new ${isPro ? 'active-plan-card' : ''}`} style={{ background: '#11131e', border: isPro ? '2px solid #10b981' : '1px solid #23263b', borderRadius: '24px', padding: '35px 25px', width: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.05)' }}>
            {/* 🌟 تم تعديل التوهج هنا ليكون إضاءة خلفية ناعمة دائرية بدون مربع يشوه المنظر */}
            <div className="pro-glow" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '24px', background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.08), transparent 60%)', pointerEvents: 'none' }} />

            <div className="pricing-top">
              <span className="plan-name-badge pro-badge-new" style={{ background: 'linear-gradient(90deg, #10b981, #059669)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>🔥 الأكثر شعبية</span>
              <h2 className="plan-title" style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '15px', marginBottom: '5px', color: '#ffffff' }}>Pro</h2>
              <div className="plan-price" style={{ margin: '15px 0' }}>
                <span className="price-big" style={{ fontSize: '42px', fontWeight: 'extrabold', color: '#ffffff' }}>29</span>
                <span className="price-small" style={{ color: '#94a3b8', marginRight: '5px' }}>ريال / شهر</span>
              </div>
              <p className="plan-desc" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>لصناع المحتوى الطموحين لتسريع النمو والانتشار</p>
            </div>

            <div className="plan-divider" style={{ height: '1px', background: '#23263b', margin: '20px 0' }} />

            <ul className="plan-features-new" style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px', direction: 'rtl', textAlign: 'right' }}>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> <strong>توليد ذكي غير محدود</strong></li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> قلّابات (Hooks) احترافية خاطفة</li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> عناوين مثيرة لرفع نسبة النقر</li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> تحسين جودة السكربت وصياغته</li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> mيزة حفظ وإدارة السكربتات</li>
              <li><span className="feat-icon yes" style={{ color: '#10b981', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> دعم فني24/7 سريع ومتكامل</li>
            </ul>

            {isPro ? (
              <button className="plan-btn-pro" disabled style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 'bold', cursor: 'not-allowed' }}>
                ✅ خطتك الحالية (Pro)
              </button>
            ) : (
              <button 
                className="plan-btn-pro" 
                onClick={() => subscribe('pro')} 
                disabled={loading !== null}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: '#10b981', color: '#000000', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
              >
                {loading === 'pro' ? '⏳ جاري التحويل...' : '🚀 اشترك في Pro بـ 29 ريال'}
              </button>
            )}
          </div>

          {/* 🔴 باقة المحرك الفيروسي - VIRAL ENGINE */}
          <div className={`pricing-card-new viral-card-new ${isProViral ? 'active-plan-card' : ''}`} style={{ background: '#11131e', border: isProViral ? '2px solid #ef4444' : '1px solid #23263b', borderRadius: '24px', padding: '35px 25px', width: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            {/* 🌟 تم تلطيف التوهج هنا أيضاً ليكون انسيابي وناعم متناسق مع البرو */}
            <div className="viral-glow" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '24px', background: 'radial-gradient(circle at 50% 20%, rgba(255, 77, 77, 0.08), transparent 60%)', pointerEvents: 'none' }} />

            <div className="pricing-top">
              <span className="plan-name-badge" style={{ background: 'linear-gradient(90deg, #ff4d4d, #ff8080)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>⚡ الخيار الأقوى والمميز</span>
              <h2 className="plan-title" style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '15px', marginBottom: '5px', color: '#ffffff' }}>Viral Engine</h2>
              <div className="plan-price" style={{ margin: '15px 0' }}>
                <span className="price-big" style={{ fontSize: '42px', fontWeight: 'extrabold', color: '#ffffff' }}>69</span>
                <span className="price-small" style={{ color: '#94a3b8', marginRight: '5px' }}>ريال / شهر</span>
              </div>
              <p className="plan-desc" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>الترسانة الكاملة لصناعة محتوى مليوني متصدر للمشهد</p>
            </div>

            <div className="plan-divider" style={{ height: '1px', background: '#23263b', margin: '20px 0' }} />

            <ul className="plan-features-new" style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px', direction: 'rtl', textAlign: 'right' }}>
              <li><span className="feat-icon yes" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> <strong>تشمل جميع ميزات اشتراك Pro</strong></li>
              <li><span className="feat-icon yes" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> محرك أفكار الـ Viral المتفجر 🚀</li>
              <li><span className="feat-icon yes" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> تحليل فوري لقابلية الانتشار السريع</li>
              <li><span className="feat-icon yes" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> صياغة سيناريوهات 60 ثانية متكاملة</li>
              <li><span className="feat-icon yes" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> تحسين ذكي لمعدل البقاء والاحتفاظ</li>
              <li><span className="feat-icon yes" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> توليد عدة زوايا وأفكار لنفس الموضوع</li>
              <li><span className="feat-icon yes" style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 'bold' }}>✓</span> <strong>دعم فني VIP 24/7 مع أولوية قصوى ⚡</strong></li>
            </ul>

            {isProViral ? (
              <button className="plan-btn-pro" disabled style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 'bold', cursor: 'not-allowed' }}>
                ✅ خطتك الحالية (Viral Engine)
              </button>
            ) : (
              <button 
                className="plan-btn-pro" 
                onClick={() => subscribe('pro_viral')} 
                disabled={loading !== null}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(90deg, #ff4d4d, #e60000)', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}
              >
                {loading === 'pro_viral' ? '⏳ جاري التحويل...' : '⚡ اشترك في Viral Engine بـ 69 ريال'}
              </button>
            )}
            
            <p className="plan-note" style={{ color: '#64748b', fontSize: '11px', textAlign: 'center', marginTop: '10px' }}>يمكنك إلغاء الاشتراك أو التعديل في أي وقت</p>
          </div>

        </div>

      </main>
    </div>
  )
}
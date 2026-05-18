import { showToast } from '../App'
import { useState } from 'react'
import { supabase } from '../config/supabase'
import { useNavigate } from 'react-router-dom'
// 1️⃣ استيراد المكون الرسمي لزر قوقل
import { GoogleLogin } from '@react-oauth/google'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

  // 2️⃣ دالة معالجة الدخول الناجح عبر قوقل
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      const token = credentialResponse.credential
      
      // هنا نقوم بتمرير الـ ID Token القادم من جوجل إلى Supabase مباشرة ليتحقق منه ويفتح الجلسة
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: token,
      })

      if (error) throw error

      // إذا كان مستخدم جديد، نتأكد من إضافة بياناته في جدول الـ profiles
      if (data?.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: data.user.user_metadata.full_name || data.user.user_metadata.name,
          email: data.user.email
        })
      }

      showToast('أهلاً بك في TrendAura 🎉', 'success')
      setTimeout(() => navigate('/'), 1000)
    } catch (error) {
      console.error(error)
      showToast('فشل تسجيل الدخول عبر قوقل', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    showToast('حدث خطأ أثناء الاتصال بقوقل', 'error')
  }

  // 3️⃣ دالة إرسال رابط استعادة كلمة المرور
  const handleForgotPassword = async () => {
    if (!email) {
      showToast('يرجى كتابة بريدك الإلكتروني أولاً في الخانة المخصصة', 'warning')
      return
    }
    
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`, // سينقله لصفحة الإعدادات ليعيد تعيينها هناك لو أحببت
    })

    if (error) {
      showToast('فشل إرسال رابط الاستعادة', 'error')
    } else {
      showToast('تم إرسال رابط إعادة تعيين كلمة المرور إلى إيميلك ✉️', 'success')
    }
    setLoading(false)
  }

  const handleAuth = async () => {
    if (!email || !password) {
      showToast('أدخل الإيميل وكلمة المرور', 'warning')
      return
    }
    if (mode === 'signup' && !name) {
      showToast('أدخل اسمك الكامل', 'warning')
      return
    }

    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })

      if (error) {
        showToast('فشل إنشاء الحساب — جرب إيميل آخر', 'error')
      } else {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: name,
          email: email
        })
        showToast('تم إنشاء الحساب — سجّل دخول الان', 'success')
        setMode('login')
      }

    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        showToast('الإيميل أو كلمة المرور خاطئة', 'error')
      } else {
        showToast('أهلاً بك في TrendAura 🎉', 'success')
        setTimeout(() => navigate('/'), 1000)
      }
    }

    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>TrendAura</h1>
          <p>{mode === 'login' ? 'أهلاً بعودتك ' : 'إنشاء حساب جديد ✨'}</p>
        </div>

        <div className="login-form">
          {mode === 'signup' && (
            <div className="input-group">
              <span className="input-icon"> </span>
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-group">
            <span className="input-icon"> </span>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon"> </span>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            />
          </div>

          {/* رابط نسيت كلمة المرور (يظهر في وضع الدخول فقط) */}
          {mode === 'login' && (
            <div className="forgot-password-link" style={{ textAlign: 'left', marginBottom: '15px' }}>
              <span 
                onClick={handleForgotPassword} 
                style={{ cursor: 'pointer', color: '#7c3aed', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                نسيت كلمة المرور؟
              </span>
            </div>
          )}

          <button onClick={handleAuth} disabled={loading}>
            {loading
              ? 'جاري المعالجة...'
              : mode === 'login'
              ? '🔑 تسجيل الدخول'
              : '✅ إنشاء الحساب'}
          </button>

          {/* 4️⃣ فاصل جمالي بين الدخول العادي ودخول قوقل */}
          <div className="divider" style={{ margin: '15px 0', textRendering: 'geometricPrecision', color: '#aaa', fontSize: '0.9rem', textAlign: 'center' }}>
            أو
          </div>

          {/* 5️⃣ زر قوقل الدائري الفخم والمتناسق مع التصميم */}
          <div className="google-auth-btn" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="circle"
              theme="outline"
              size="large"
            />
          </div>

          <div className="switch-auth" style={{ marginTop: '20px' }}>
            {mode === 'login' ? (
              <p>ليس لديك حساب؟ <span onClick={() => setMode('signup')}>إنشاء حساب</span></p>
            ) : (
              <p>لديك حساب؟ <span onClick={() => setMode('login')}>تسجيل الدخول</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
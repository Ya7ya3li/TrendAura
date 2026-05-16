import { showToast } from '../App'
import { useState } from 'react'
import { supabase } from '../config/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

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

          <button onClick={handleAuth} disabled={loading}>
            {loading
              ? 'جاري المعالجة...'
              : mode === 'login'
              ? '🔑 تسجيل الدخول'
              : '✅ إنشاء الحساب'}
          </button>

          <div className="switch-auth">
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
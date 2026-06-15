import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import { ROUTES } from '../constants/routes.js'
import { showToast } from '../App.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    }
    checkUser()
  }, [navigate])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      if (typeof showToast === 'function') showToast('أدخل البريد الإلكتروني وكلمة المرور', 'warning')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })
      
      if (error) throw error

      if (typeof showToast === 'function') showToast('مرحباً بعودتك! تم الدخول بنجاح', 'success')
      navigate(ROUTES.DASHBOARD, { replace: true })
      
    } catch (error) {
      console.error('Login Error:', error.message)
      if (typeof showToast === 'function') showToast(error.message || 'فشل تسجيل الدخول', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      if (typeof showToast === 'function') showToast('جاري الاتصال بـ Google...', 'info')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${ROUTES.DASHBOARD}`
        }
      })
      
      if (error) throw error
      
    } catch (error) {
      console.error('Google OAuth Error:', error.message)
      if (typeof showToast === 'function') showToast('فشل الاتصال بـ Google', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-right dir-rtl select-none font-sans relative z-10">
      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex justify-center items-center gap-2.5 mb-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
            TA
          </div>
          <h2 className="text-lg font-black text-white">
            Trend<span className="text-blue-500">Aura</span>
          </h2>
        </div>
        <h3 className="text-center text-sm font-black text-slate-300">
          تسجيل الدخول للحصن الداخلي
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800/80 rounded-[28px] sm:px-10">
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-5 py-3 px-4 inline-flex justify-center items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 text-xs font-black text-slate-300 hover:bg-slate-900 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.222 2.104 15.52 1 12.24 1c-6.077 0-11 4.923-11 11s4.923 11 11 11c6.34 0 10.564-4.426 10.564-10.75 0-.726-.077-1.282-.175-1.665H12.24z"/>
            </svg>
            الدخول المباشر عبر Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold text-slate-500"><span className="bg-[#130b24] px-3">أو من خلال البريد</span></div>
          </div>

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 text-slate-200 px-4 py-3 rounded-xl border border-slate-800 text-xs font-bold outline-none focus:border-blue-500 transition-all text-left dir-ltr"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400">كلمة المرور</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 text-slate-200 pl-12 pr-4 py-3 rounded-xl border border-slate-800 text-xs font-bold outline-none focus:border-blue-500 transition-all text-left dir-ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {/* ⚡️ استبدال الإيموجيات بأيقونات SVG برميوم ملساء ومطابقة لصفحة الـ Register بالملي */}
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>جاري التحقق الفيدرالي...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
            <p className="text-[10px] font-bold text-slate-500">
              ليس لديك حساب مبدع؟{' '}
              <Link to={ROUTES.REGISTER} className="text-cyan-400 hover:text-cyan-300 font-black transition-colors">
                أنشئ حسابك الآن
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
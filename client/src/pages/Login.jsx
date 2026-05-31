import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { showToast } from '../App'
import { supabase } from '../config/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      showToast('يا قائد، فضلاً أدخل البريد الإلكتروني وكلمة المرور أولاً ⚠️', 'warning')
      return
    }

    setLoading(true)
    try {
      showToast('جاري التحقق من الهوية الرقمية وتأمين الجلسة... ✦', 'info')
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })
      if (error) throw error

      showToast('مرحباً بعودتك يا ملك الخوارزميات! تم الدخول بنجاح 👑', 'success')
      // ❌ تم حذف window.location.href من هنا لترك الحارس المركزي في الـ Context يتولى النقل الآمن
    } catch (error) {
      console.error('❌ [Login Critical Failure]:', error.message)
      showToast(error.message || 'فشلت عملية تسجيل الدخول، يرجى مراجعة البيانات', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      showToast('جاري الاتصال بخوادم جوجل الآمنة... 🚀', 'info')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // ✅ التعديل الذهبي: التوجيه للأصل المجرد ليتمكن سوبابيس من التقاط التوكن أولاً
          redirectTo: window.location.origin, 
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('❌ [Google OAuth Failure]:', error.message)
      showToast('فشل الاتصال ببوابة جوجل الرقمية', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-right dir-rtl select-none font-sans animate-fade-in">
      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex justify-center items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 text-white text-base font-black flex items-center justify-center shadow-lg shadow-blue-100 animate-scale-up">
            ▲
          </div>
          <h2 className="text-lg font-black text-slate-900 font-sans tracking-tight">
            Trend<span className="text-blue-600">Aura</span>
          </h2>
        </div>
        <h3 className="text-center text-sm font-black text-slate-800 tracking-tight">
          تسجيل الدخول لبوابة المعالجة السلوكية
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md animate-scale-up">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 border border-slate-100 rounded-[28px] sm:px-10">
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-5 py-3 px-4 inline-flex justify-center items-center gap-3 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-98 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.222 2.104 15.52 1 12.24 1c-6.077 0-11 4.923-11 11s4.923 11 11 11c6.34 0 10.564-4.426 10.564-10.75 0-.726-.077-1.282-.175-1.665H12.24z"/>
            </svg>
            الدخول السريع عبر حساب جوجل
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold text-slate-400"><span className="bg-white px-3">أو عبر البريد الإلكتروني</span></div>
          </div>

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-500">البريد الإلكتروني</label>
              <div className="relative w-full">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 text-slate-800 pr-10 pl-4 py-3 rounded-xl border border-slate-200/60 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all font-sans text-left dir-ltr"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500">كلمة المرور</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('الميزة ستتوفر قريباً ✉️', 'info'); }} className="text-[9px] font-black text-blue-600 hover:text-blue-700 transition-colors">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative w-full">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-slate-800 pr-10 pl-12 py-3 rounded-xl border border-slate-200/60 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors text-[11px] font-bold"
                >
                  {showPassword ? '🔒' : '👁️'}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all duration-150 transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'جاري فحص التراخيص...' : 'تسجيل الدخول الفوري ⚡'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-slate-50 pt-4">
            <p className="text-[10px] font-bold text-slate-400">
              ليس لديك حساب حتى الآن؟{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-black transition-colors">
                أنشئ حسابك الملوكي الآن
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
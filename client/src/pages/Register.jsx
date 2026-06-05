import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import { ROUTES } from '../constants/routes.js'
import { showToast } from '../App.jsx'

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      if (typeof showToast === 'function') showToast('فضلاً املأ جميع الحقول المطلوبة أولاً ⚠️', 'warning')
      return
    }

    if (password.length < 6) {
      if (typeof showToast === 'function') showToast('كلمة المرور يجب أن تكون من 6 خانات أو أكثر 🔒', 'warning')
      return
    }

    setLoading(true)
    try {
      if (typeof showToast === 'function') showToast('جاري تشييد حسابك في قاعدة البيانات... ✦', 'info')
      
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim()
          }
        }
      })

      if (error) throw error

      if (typeof showToast === 'function') showToast('تم إنشاء الحساب بنجاح ملوكي! 👑', 'success')
      navigate(ROUTES.DASHBOARD)

    } catch (error) {
      console.error('❌ [Register Critical Failure]:', error.message)
      if (typeof showToast === 'function') showToast(error.message || 'حدث خطأ أثناء الاتصال بالخادم', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-right dir-rtl select-none font-sans animate-fade-in relative z-10">
      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex justify-center items-center gap-2.5 mb-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">
            TA
          </div>
          <h2 className="text-lg font-black text-white tracking-tight">
            Trend<span className="text-blue-500">Aura</span>
          </h2>
        </div>
        <h3 className="text-center text-sm font-black text-slate-300 tracking-tight">
          امتلك ترسانة صناعة السكريبتات الفيروسية اليوم
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md animate-scale-up">
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800/80 rounded-[28px] sm:px-10">
          
          <form className="space-y-5" onSubmit={handleRegisterSubmit}>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400">الاسم الكريم</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="عبدالله محمد"
                className="w-full bg-slate-950 text-slate-200 px-4 py-3 rounded-xl border border-slate-800 text-xs font-bold outline-none focus:border-blue-500 transition-all"
              />
            </div>

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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                >
                  {showPassword ? '🔒' : '👁️'}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>جاري تشييد الحصن...</span>
                  </>
                ) : (
                  <span>إنشاء حسابك الحركي الآن 👑</span>
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
            <p className="text-[10px] font-bold text-slate-500">
              لديك حساب بالفعل؟{' '}
              <Link to={ROUTES.LOGIN} className="text-cyan-400 hover:text-cyan-300 font-black transition-colors">
                تسجيل الدخول  
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
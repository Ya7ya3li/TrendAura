import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { showToast } from '../App'
import { supabase } from '../config/supabase' // 🏆 استيراد محرك سوبابيس الحقيقي

/**
 * TrendAura World-Class Register Page - V2 Live Production
 * Enforces real-time Supabase signups with instant auto-login execution.
 */
export default function Register() {
  const navigate = useNavigate()
  const { loginSystem } = useContext(AuthContext) || {}

  // الحالات الافتراضية للمدخلات
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // 👁️ حالة إظهار أو إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false)

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    // فحص أولي للمدخلات
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      showToast('  فضلاً املأ جميع الحقول المطلوبة أولاً ⚠️', 'warning')
      return
    }

    if (password.length < 6) {
      showToast('كلمة المرور يجب أن تكون من 6 خانات أو أكثر 🔒', 'warning')
      return
    }

    setLoading(true)
    try {
      showToast('جاري تهيئة حسابك الجديد في قاعدة البيانات... ✦', 'info')
      
      // 🏆 قذيفة الاتصال الحقيقي بالسيرفر لإنشاء الحساب حياً
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          // حقن الاسم الكريم بداخل الميتاداتا ليلقطه الـ Profile تلقائياً
          data: {
            full_name: fullName.trim()
          }
        }
      })

      if (error) throw error

      showToast('تم إنشاء الحساب بنجاح! أهلاً بك    👑', 'success')
      
      // طالما خيار تأكيد الإيميل OFF، سوبابيس يشحن الجلسة فوراً، ونقذفك مباشرة للداخل!
      navigate('/dashboard')

    } catch (error) {
      console.error('❌ [Register Critical Failure]:', error.message)
      showToast(error.message || 'حدث خطأ أثناء الاتصال بالخادم ', 'error')
    } finally {
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
          امتلك منصة صناعة السكريبتات الفيروسية اليوم
        </h3>
        <p className="text-center text-[10px] font-bold text-slate-400 mt-1">
          انضم لأكثر من 10,000+ مسوق وصانع محتوى محترف عالمياً
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md animate-scale-up">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 border border-slate-100 rounded-[28px] sm:px-10">
          
          <form className="space-y-5" onSubmit={handleRegisterSubmit}>
            
            {/* 1. حقل الاسم بالكامل */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-500">الاسم الكريم</label>
              <div className="relative w-full">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">👤</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="     "
                  className="w-full bg-slate-50 text-slate-800 pr-10 pl-4 py-3 rounded-xl border border-slate-200/60 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* 2. حقل البريد الإلكتروني */}
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

            {/* 3. حقل كلمة المرور */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-500">كلمة المرور </label>
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

            {/* زر الإرسال وإنشاء الحساب */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all duration-150 transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>جاري تشييد الحصن...</span>
                  </>
                ) : (
                  <span>إنشاء حساب الآن 👑</span>
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 text-center border-t border-slate-50 pt-4">
            <p className="text-[10px] font-bold text-slate-400">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-black transition-colors">
                تسجيل الدخول  
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
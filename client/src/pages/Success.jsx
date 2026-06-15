import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'
import Button from '../components/common/Button.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { supabase } from '../config/supabase.js'

export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  const { user, setProfile } = useContext(AuthContext)
  
  const planName = searchParams.get('plan') || 'Pro VIP'

  useEffect(() => {
    let isMounted = true

    const verifyAndRefreshStatus = async () => {
      try {
        // انتظار 3 ثوانٍ لضمان وصول إشارة الـ Webhook وتحديث قاعدة البيانات أولاً بالحسبة التراكمية
        await new Promise(resolve => setTimeout(resolve, 3000))

        if (user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

          if (data && !error && isMounted) {
            setProfile(data)
            console.log('🎉 [Success Status Sync]: تم تحديث باقة الحساب والرصيد التراكمي بنجاح ملوكي:', data.plan)
          }
        }
      } catch (err) {
        console.error('❌ [Success Verification Error]:', err)
      } finally { // ✅ تم إصلاح الكلمة هنا بالملي لتصبح مدعومة برمجياً
        if (isMounted) setRefiningStatus()
      }
    }

    const setRefiningStatus = () => {
      setVerifying(false)
    }

    verifyAndRefreshStatus()

    return () => {
      isMounted = false
    }
  }, [user, setProfile])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 text-center dir-rtl select-none font-sans relative z-10">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
        
        {verifying ? (
          <div className="py-10 text-xs font-bold text-slate-400 animate-pulse flex flex-col items-center gap-3">
            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري فحص وتأكيد المعاملة البنكية وتفعيل المميزات وشحن التوكنات ملوكيًا...</span>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <span>تهانينا الحارة!</span>
              <svg className="w-5 h-5 text-amber-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </h2>

            <p className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-xl inline-block mt-3">
              تم تفعيل {planName.toUpperCase()} بنجاح ملوكي واثق
            </p>
            
            <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mt-4 mb-6">
              تم شحن حسابك بالتوكنات التراكمية وترقية سقف قيودك بالملي حياً. استمتع بكامل أدوات المحرك الفايرال الاستراتيجي الآن واكتسح المشاهدات.
            </p>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate(ROUTES.DASHBOARD)} 
                variant="primary" 
                className="w-full py-3.5 text-xs bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 font-black rounded-xl shadow-lg shadow-blue-500/10"
              >
                <span>دخول لوحة التحكم</span>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
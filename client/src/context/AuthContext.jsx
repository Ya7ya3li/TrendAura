import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

/**
 * TrendAura Authentication Provider - V2 Enterprise Certified
 * Engineered to eliminate Rollup deployment mismatches and secure persistent session memory.
 */
// 🏆 التعديل الهندسي: تحويل التصدير إلى Named Export ليطابق الاستيراد بداخل App.jsx تماماً ويسحق خطأ Vercel
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (currentUser) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (error) throw error

        return (
          data || {
            id: currentUser.id,
            full_name: currentUser.email?.split('@')[0] || 'قائد تريند أورا',
            plan: 'free',
            tokens: 5000 // حقن القيمة الابتدائية للتوكنز كخط دفاع لمنع تصفير الرصيد
          }
        )
      } catch (err) {
        console.error('❌ [AuthContext Profile Sync Error]:', err.message)
        return {
          id: currentUser.id,
          full_name: currentUser.email,
          plan: 'free',
          tokens: 0
        }
      }
    }

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!mounted) return

        const currentUser = session?.user || null
        setUser(currentUser)

        if (currentUser) {
          const p = await fetchProfile(currentUser)
          if (mounted) setProfile(p)
        } else {
          if (mounted) setProfile(null)
        }
      } catch (err) {
        console.error('❌ [AuthContext Initialization Error]:', err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // إطلاق عملية الفحص الاستباقي الفوري
    init()

    // تسمع مركزي تفاعلي مستقر طوال دورة حياة التطبيق
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔒 [Core Auth Event Production]: ${event}`)
        const currentUser = session?.user || null
        
        if (!mounted) return

        setUser(currentUser)

        if (currentUser) {
          const p = await fetchProfile(currentUser)
          if (mounted) setProfile(p)
        } else {
          if (mounted) setProfile(null)
        }
        
        if (mounted) setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, []) // 🛡️ مصفوفة فارغة تماماً لقطع دابر الـ Infinite Loop وضمان استقرار الجلسة في السيرفر الحي

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      setProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}
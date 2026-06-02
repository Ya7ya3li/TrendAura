import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

/**
 * TrendAura Authentication Provider - V2 Enterprise Certified
 * Infused with URL hash-detection matrix to completely destroy OAuth routing race conditions.
 */
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

        // 🛡️ دمج أمني: إذا وجدنا السطر بداخل قاعدة البيانات، نضمن تدعيمه ببيانات الحساب الحية
        if (data) {
          return {
            ...data,
            email: data.email || currentUser.email,
            avatar_url: data.avatar_url || currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture
          }
        }

        // ⚡ خيار احتياطي ذكي ومتكامل يمنع ظهور بيانات وهمية أو قديمة في الواجهات
        return {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'قائد تريند أورا',
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
          plan: 'free',
          tokens: 5000
        }
      } catch (err) {
        console.error('❌ [AuthContext Profile Sync Error]:', err.message)
        // عبور آمن ومكتمل الأركان عند حدوث أخطاء شبكة أو حماية
        return {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
          plan: 'free',
          tokens: 5000 // نثبت التوكن دفاعياً لحين استقرار الشبكة
        }
      }
    }

    const initAuthSystem = async () => {
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
        console.error('❌ [AuthContext Session Init Error]:', err.message)
      } finally {
        const hasOAuthHash = window.location.hash.includes('access_token') || window.location.hash.includes('error');
        if (mounted && !hasOAuthHash) {
          setLoading(false)
        }
      }
    }

    initAuthSystem()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log(`🔒 [Core Auth Event Node]: ${event}`)
        const currentUser = session?.user || null
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
  }, [])

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
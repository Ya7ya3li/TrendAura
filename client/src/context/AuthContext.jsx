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

        return (
          data || {
            id: currentUser.id,
            full_name: currentUser.email?.split('@')[0] || 'قائد تريند أورا',
            plan: 'free',
            tokens: 5000
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
        // 🛡️ التعديل العبقري: إذا كان الرابط يحتوي على توكن قوقل (hash)، لا تغلق اللودر أبداً! 
        // اترك المستمع المركزي بالأسفل يعالجه أولاً لكي لا يطردك الراوتر لصفحة الـ Login ويضيع التوكن.
        const hasOAuthHash = window.location.hash.includes('access_token') || window.location.hash.includes('error');
        if (mounted && !hasOAuthHash) {
          setLoading(false)
        }
      }
    }

    // إطلاق التحقق الابتدائي
    initAuthSystem()

    // 🔒 المستمع المركزي لأحداث الحساب: هو الوحيد المخول بإغلاق اللودر عند التقاط توكن قوقل
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
        
        // قفل اللودر هنا دائماً لأن سوبابيس التقط الـ Token وفك التشفير حياً بنجاح!
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
import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

/**
 * TrendAura Authentication Provider - V3 Production Shield
 * Standardized OAuth sequence to eliminate the INITIAL_SESSION router race condition.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // 🛡️ حارس الوقت الأمني: لو علق سيرفر قوقل أو سوبابيس لأي سبب، يقفل اللودر تلقائياً بعد 4 ثوانٍ لمنع تجميد الشاشة
    const safetyTimer = setTimeout(() => {
      if (mounted && loading) {
        console.log('🛡️ [Safety Timeout Triggered]: Force closing loader')
        setLoading(false)
      }
    }, 4000)

    const fetchProfile = async (currentUser) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (error) throw error

        if (data) {
          return {
            ...data,
            email: data.email || currentUser.email,
            avatar_url: data.avatar_url || currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture
          }
        }

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
        return {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
          plan: 'free',
          tokens: 5000
        }
      }
    }

    const initAuthSystem = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        const currentUser = session?.user || null
        if (currentUser) {
          setUser(currentUser)
          const p = await fetchProfile(currentUser)
          if (mounted) setProfile(p)
          if (mounted) setLoading(false)
        }
      } catch (err) {
        console.error('❌ [AuthContext Session Init Error]:', err.message)
      } finally {
        // فحص وجود توكن قوقل أو كود المصادقة في الرابط الحالي
        const hasOAuthHash = window.location.hash.includes('access_token') || 
                             window.location.hash.includes('id_token') ||
                             window.location.search.includes('code=');
        
        // لا نغلق اللودر أبداً إذا كان هناك توكن قوقل جاري معالجته في الرابط
        if (mounted && !hasOAuthHash && !user) {
          setLoading(false)
        }
      }
    }

    initAuthSystem()

    // 🔒 المستمع المركزي لأحداث الحساب
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log(`🔒 [Core Auth Event Node]: ${event}`)
        const currentUser = session?.user || null
        
        const hasOAuthHash = window.location.hash.includes('access_token') || 
                             window.location.hash.includes('id_token') ||
                             window.location.search.includes('code=');

        if (currentUser) {
          setUser(currentUser)
          const p = await fetchProfile(currentUser)
          if (mounted) setProfile(p)
          if (mounted) setLoading(false)
          clearTimeout(safetyTimer) // إلغاء التايمر الأمني فور نجاح الدخول
        } else {
          setUser(null)
          setProfile(null)
          
          // 🛑 هنا المفتاح الكوني: إذا كانت الجلسة فارغة ولكن الرابط يحتوي على توكن قوقل،
          // نرفض إغلاق اللودر تماماً ونتركه true لينتظر التقاط حدث SIGNED_IN الفعلي
          if (!hasOAuthHash) {
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
      clearTimeout(safetyTimer)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider;
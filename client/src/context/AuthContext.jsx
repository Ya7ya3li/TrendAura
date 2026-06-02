import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

/**
 * TrendAura Authentication Provider - V2 Enterprise Certified
 * Completely cleanses lifecycle dependency arrays to eradicate unmount-loops during profile syncs.
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
        if (mounted) setLoading(false)
      }
    }

    // تشغيل الفحص الاستباقي الفوري عند الإقلاع
    initAuthSystem()

    // الاستماع المركزي لأحداث الحساب السحابي بدون التسبب في حلقات إعادة تحميل
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
  }, []) // مصفوفة فارغة تماماً تضمن التشغيل لمرة واحدة فقط وعدم الانهيار عند تحديث التوكنز

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
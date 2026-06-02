import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // 🛡️ حارس الوقت الأمني: 8 ثوانٍ (أطول للـ OAuth)
    const safetyTimer = setTimeout(() => {
      if (mounted && loading) {
        console.log('🛡️ [Safety Timeout]: Closing loader')
        setLoading(false)
      }
    }, 8000)

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

        // إنشاء بروفايل جديد للمستخدم الجديد
        const newProfile = {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'مستخدم',
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
          plan: 'free',
          tokens: 5000
        }

        // حفظه في Supabase
        await supabase.from('profiles').insert([newProfile])
        return newProfile
      } catch (err) {
        console.error('❌ Profile Error:', err.message)
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
        // التحقق من الجلسة الحالية
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          const p = await fetchProfile(session.user)
          if (mounted) setProfile(p)
          if (mounted) setLoading(false)
          clearTimeout(safetyTimer)
        }
      } catch (err) {
        console.error('❌ Init Error:', err.message)
      }
    }

    initAuthSystem()

    // 🔒 المستمع الأساسي لتغيرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log(`🔒 Auth Event: ${event}`)

        if (session?.user) {
          setUser(session.user)
          const p = await fetchProfile(session.user)
          if (mounted) setProfile(p)
          if (mounted) setLoading(false)
          clearTimeout(safetyTimer)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          if (mounted) setLoading(false)
          clearTimeout(safetyTimer)
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

export default AuthProvider
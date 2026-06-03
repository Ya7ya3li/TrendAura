import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId, email, metadata) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (data) return data

      // إنشاء بروفايل جديد إذا لم يوجد
      const newProfile = {
        id: userId,
        full_name: metadata?.full_name || metadata?.name || email?.split('@')[0] || 'مستخدم جديد',
        email: email,
        avatar_url: metadata?.avatar_url || metadata?.picture || null,
        plan: 'free',
        tokens: 5000
      }

      await supabase.from('profiles').insert([newProfile])
      return newProfile
    } catch (err) {
      console.error('❌ Profile Error:', err.message)
      return null
    }
  }

  useEffect(() => {
    // 1. جلب الجلسة الأولية
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
        setProfile(p)
      }
      setLoading(false)
    })

    // 2. الاستماع لأي تغير في الحالة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
        setProfile(p)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
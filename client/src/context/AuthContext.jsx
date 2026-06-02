import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const safetyTimer = setTimeout(() => {
      if (mounted && loading) setLoading(false)
    }, 8000)

    const fetchProfile = async (currentUser) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url, plan, tokens')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (error) throw error
        if (data) return data

        const newProfile = {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'مستخدم',
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
          plan: 'free',
          tokens: 5000
        }

        await supabase.from('profiles').insert([newProfile])
        return newProfile
      } catch (err) {
        console.error('❌ Profile Fetch Error:', err.message)
        return null
      }
    }

    const initAuthSystem = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          const p = await fetchProfile(session.user)
          if (mounted) {
            setProfile(p)
            setLoading(false)
            clearTimeout(safetyTimer)
          }
        } else {
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
      }
    }

    initAuthSystem()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          const p = await fetchProfile(session.user)
          if (mounted) {
            setProfile(p)
            setLoading(false)
            clearTimeout(safetyTimer)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          if (mounted) setLoading(false)
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
    <AuthContext.Provider value={{ 
      user, 
      // التعديل الجوهري هنا: نضمن دائماً وجود كائن آمن حتى لا ينهار الكود (id: null)
      profile: profile || { id: null, full_name: 'جاري التحميل...', tokens: 0, plan: 'free' }, 
      setProfile, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
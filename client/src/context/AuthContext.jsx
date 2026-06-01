import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (userId, email) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      return (
        data || {
          id: userId,
          full_name: email,
          plan: 'free',
          tokens: 0
        }
      )
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      const currentUser = session?.user || null

      if (!mounted) return

      setUser(currentUser)

      if (currentUser) {
        const p = await fetchProfile(currentUser.id, currentUser.email)
        setProfile(p)
      } else {
        setProfile(null)
      }

      setLoading(false)
    }

    init()

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null

        setUser(currentUser)

        if (currentUser) {
          const p = await fetchProfile(currentUser.id, currentUser.email)
          setProfile(p)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      data?.subscription?.unsubscribe?.()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile: null, // 🚫 مهم: منع التعديل الخارجي
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
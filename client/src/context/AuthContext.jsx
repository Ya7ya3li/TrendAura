import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (user) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return (
        data || {
          id: user.id,
          full_name: user.email,
          plan: 'free',
          tokens: 0
        }
      )
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!mounted) return

      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        const p = await fetchProfile(currentUser)
        setProfile(p)
      } else {
        setProfile(null)
      }

      setLoading(false)
      setInitialized(true)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!initialized) return

        const currentUser = session?.user || null
        setUser(currentUser)

        if (currentUser) {
          const p = await fetchProfile(currentUser)
          setProfile(p)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [initialized])

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
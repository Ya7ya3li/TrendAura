import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return

        const currentUser = session?.user ?? null

        setUser(currentUser)

        setProfile({
          id: currentUser?.id || null,
          full_name:
            currentUser?.user_metadata?.full_name ||
            currentUser?.email ||
            'Guest',
          plan: 'free',
        })
      } catch (err) {
        console.error(err)

        setUser(null)

        setProfile({
          id: null,
          full_name: 'Guest',
          plan: 'free',
        })
      } finally {
        setLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null

      setUser(currentUser)

      setProfile({
        id: currentUser?.id || null,
        full_name:
          currentUser?.user_metadata?.full_name ||
          currentUser?.email ||
          'Guest',
        plan: 'free',
      })

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const loginSystem = (fakeUser) => {
    setUser(fakeUser)

    setProfile({
      id: fakeUser?.id,
      full_name: fakeUser?.email,
      plan: 'free',
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginSystem,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (!mounted) return

        const currentUser = session?.user || null

        setUser(currentUser)

        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()

          setProfile(
            profileData || {
              id: currentUser.id,
              full_name: currentUser.email,
              plan: 'free',
              tokens: 0
            }
          )
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null

        setUser(currentUser)

        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()

          setProfile(
            profileData || {
              id: currentUser.id,
              full_name: currentUser.email,
              plan: 'free',
              tokens: 0
            }
          )
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
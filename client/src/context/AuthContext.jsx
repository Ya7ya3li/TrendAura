import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        const currentUser = data?.user

        if (currentUser && mounted) {
          setUser(currentUser)
          await fetchUserProfile(currentUser.id)
        }
      } catch (err) {
        console.error(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initialize()

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user

      console.log('AUTH EVENT:', event)

      if (event === 'SIGNED_IN' && currentUser) {
        setUser(currentUser)
        await fetchUserProfile(currentUser.id)

        if (
          window.location.pathname === '/login' ||
          window.location.pathname === '/'
        ) {
          window.location.href = '/dashboard'
        }
      }

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      data.subscription?.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
      }
    } catch (err) {
      console.error('Profile error:', err.message)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
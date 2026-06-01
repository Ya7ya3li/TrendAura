import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // محرك مفرّد وآمن لإدارة التدفق الرقمي للجلسات
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔒 [Core Auth Event]: ${event}`)
      
      if (session?.user) {
        setUser(session.user)
        // تمرير كائن المستخدم مباشرة لتجنب فخ الـ State Closure
        await fetchUserProfile(session.user.id, session.user)
        
        if (event === 'SIGNED_IN') {
          if (window.location.pathname === '/login' || window.location.pathname === '/') {
            navigate('/dashboard', { replace: true })
          }
        }
      } else {
        setUser(null)
        setProfile(null)
        if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/settings')) {
          navigate('/login', { replace: true })
        }
      }
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [navigate])

  const fetchUserProfile = async (userId, currentUser) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error

      // إذا كان المستخدم جديداً، ننشئ له سطر قياسي آمن في قاعدة البيانات
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId, 
              full_name: currentUser?.user_metadata?.full_name || 'قائد تريند أورا',
              plan: 'free',
              tokens: 5000,
              subscription_status: 'inactive'
            }
          ])
          .select()
          .single()
        
        if (createError) throw createError
        data = newProfile
      }

      setProfile(data)
    } catch (err) {
      console.error('❌ [Critical Profile Anchor Error]:', err.message)
      // خط دفاع احتياطي لمنع انهيار الواجهة (Graceful Degradation)
      setProfile({ id: userId, plan: 'free', tokens: 1000, full_name: 'مستخدم تريند أورا', subscription_status: 'inactive' })
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      localStorage.clear()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('❌ [Auth Logout Exception]:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading, logout, refetchProfile: () => fetchUserProfile(user?.id, user) }}>
      {children}
    </AuthContext.Provider>
  )
}
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
    const initializeAuth = async () => {
      try {
        // ✅ استخدام getUser الآمنة بدلاً من getSession لمنع تصادم وتكرار سحب توكن الـ PKCE
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        if (error) throw error
        
        if (authUser) {
          setUser(authUser)
          await fetchUserProfile(authUser.id)
        }
      } catch (err) {
        console.warn('ℹ️ [AuthContext Initialization]: لا توجد جلسة نشطة حالياً.')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // ⚡ التسمع المركزي للأحداث والتحويل التلقائي النظيف بعد استقرار الجلسة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔒 [Auth Event Triggered]: ${event}`)
      
      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
        
        if (event === 'SIGNED_IN') {
          if (window.location.pathname === '/login' || window.location.pathname === '/') {
            navigate('/dashboard', { replace: true }) // توجيه داخلي مرن وبتر السجل القديم
          }
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [navigate])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error
      if (data) {
        const localAvatar = localStorage.getItem('trendaura_user_avatar')
        const localName = localStorage.getItem('trendaura_user_name')
        setProfile({
          ...data,
          full_name: localName || data.full_name,
          avatar_url: localAvatar || data.avatar_url
        })
      }
    } catch (err) {
      console.error('❌ [AuthContext Profile Fetch Error]:', err.message)
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
    <AuthContext.Provider value={{ user, profile, setProfile, loading, logout, refetchProfile: () => fetchUserProfile(user?.id) }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
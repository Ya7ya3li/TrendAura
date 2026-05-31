import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        }
      } catch (err) {
        console.error('❌ [AuthContext Initialization Crash]:', err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // ⚡ التسمع الفوري واللحظي للتنقل الآمن بناءً على فكرتك الذكية
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔒 [Auth Event Triggered]: ${event}`)
      
      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
        
        // ✅ التعديل الحاسم: إذا كان الحدث دخول ناجح وثابت، ننقله فوراً للوحة التحكم بأمان
        if (event === 'SIGNED_IN') {
          // نتحقق إذا كنا واقفين في صفحة اللوجن حالياً لمنع التكرار اللانهائي
          if (window.location.pathname === '/login' || window.location.pathname === '/') {
            window.location.href = '/dashboard'
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
  }, [])

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
      window.location.href = '/login'
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
import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase.js'

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

      const newProfile = {
        id: userId,
        full_name: metadata?.full_name || metadata?.name || email?.split('@')[0] || 'مستخدم جديد',
        email: email,
        avatar_url: metadata?.avatar_url || metadata?.picture || null,
        plan: 'free',
        tokens: 5000
      }

      const { data: insertedData, error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()

      return insertError ? newProfile : insertedData
    } catch (err) {
      console.error('❌ [Profile Sync Failure]:', err.message)
      return null
    }
  }

  // 🚀 دالة تسجيل الخروج الفورية لضمان الاستجابة اللحظية
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      console.error('❌ [Logout Signout Exception]:', err.message)
    }
  }

  useEffect(() => {
    let active = true

    // 🏆 1. الفحص الفوري والمباشر للجلسة عند أول مَونت للموقع لكسر تعليق الشاشة
    const syncAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && active) {
          setUser(session.user)
          const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
          if (active && p) setProfile(p)
        } else if (active) {
          setUser(null)
          setProfile(null)
        }
      } catch (e) {
        console.error("❌ [Auth Sync Error]:", e)
      } finally {
        // 🔥 صمام الأمان الخارق: يضمن فك شاشة التحميل فوراً في المَونت المستقر مهما حدث
        if (active) setLoading(false)
      }
    }

    syncAuth()

    // 📡 2. المراقبة المستمرة لتعقب عمليات تسجيل الدخول والخروج اللاحقة بسلاسة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return

      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
        if (active && p) setProfile(p)
      } else {
        setUser(null)
        setProfile(null)
      }
      
      if (active) setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      setProfile, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
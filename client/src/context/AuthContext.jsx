import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

/**
 * TrendAura Global Security & Identity Provider - Reactive Edition
 * Manages Supabase authentication events and exposes setProfile for responsive global state orchestration.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. فحص استباقي لحظي لوجود جلسة نشطة عند إقلاع المتصفح
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

    // 2. التسمع الفوري واللحظي لأي تغير أمني في الجلسة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔒 [Auth Event Triggered]: ${event}`)
      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
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

  // دالة جلب بيانات البروفايل مع دمج دفاعي للتفضيلات المحلية لمنع الوميض أو المسح
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

  // دالة تسجيل الخروج الكلي وتطهير كاش العميل
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
    // ⚡ تم حقن setProfile هنا بذكاء لتمكين صفحة الإعدادات من إرسال التحديثات لجميع كتل الموقع لحظياً
    <AuthContext.Provider value={{ user, profile, setProfile, loading, logout, refetchProfile: () => fetchUserProfile(user?.id) }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
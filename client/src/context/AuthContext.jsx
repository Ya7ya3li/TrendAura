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

  const logout = async () => {
    try {
      // 1. تسجيل الخروج من سوبابيس وتصفير الذاكرة المحلية
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      
      // 2. 🚀 الطرد التكتيكي الفوري لصفحة تسجيل الدخول وتنظيف المتصفح كلياً لمنع كراش كروت البرو
      window.location.href = '/login'
    } catch (err) {
      console.error('❌ [Logout Signout Exception]:', err.message)
    }
  }

  useEffect(() => {
    let active = true

    // 🏆 هندسة موحدة: الاعتماد الكلي على دالة سوبابيس المركزية لمنع سباق البيانات والتكرار
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          if (active) setUser(session.user)
          const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
          if (active && p) setProfile(p)
        } else {
          if (active) {
            setUser(null)
            setProfile(null)
          }
        }
      } catch (error) {
        console.error("❌ [Auth Transition Failure]:", error)
      } finally {
        // 🛡️ صمام الأمان المطلق: اللودر سيغلق حتماً ويتحول لـ false في كل الحالات (زائر أو مشترك)
        if (active) setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
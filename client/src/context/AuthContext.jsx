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

      // هندسة بروفايل جديد متكامل البيانات في حال عدم العثور عليه
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
      console.error('❌ [Profile Synchronization Failure]:', err.message)
      return null
    }
  }

  useEffect(() => {
    let active = true

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && active) {
          setUser(session.user)
          // 🚀 تشغيل الجلب بالخلفية لضمان إقلاع صاروخي فوري دون حجب التحكم
          fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
            .then(p => {
              if (active && p) setProfile(p)
            })
        }
      } catch (e) {
        console.error("❌ [Auth Initialization Fatal Error]:", e)
      } finally {
        if (active) setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (active) setUser(session.user)
        fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
          .then(p => {
            if (active && p) setProfile(p)
          })
      } else {
        if (active) {
          setUser(null)
          setProfile(null)
        }
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile: profile || { id: null, full_name: 'جاري جلب البيانات...', tokens: 0, plan: 'free' }, 
      setProfile, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
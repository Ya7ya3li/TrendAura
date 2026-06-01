import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

/**
 * TrendAura Core Authentication Provider (Enterprise Production-Grade)
 * Engineered with safe pre-flight checks to guarantee zero loading-state freezes in distributed environments.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    // ⚡ الفحص الاستباقي المضمون (Pre-flight Safe Check)
    // يضمن كسر حالة التحميل وتحديث الواجهة حتى لو تسببت سرعة خوادم الإنتاج في إسقاط حدث التسمع الأول
    const preFlightAuthCheck = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (isMounted) {
          if (session?.user) {
            setUser(session.user)
            await fetchUserProfile(session.user.id, session.user)
          } else {
            setUser(null)
            setProfile(null)
          }
        }
      } catch (err) {
        console.error('❌ [Auth Pre-flight Exception]:', err.message)
      } finally {
        if (isMounted) setLoading(false) // ضمان سرمدي لإغلاق اللودر وعدم تعليق المستخدم
      }
    }

    // إطلاق الفحص الفوري بالتوازي مع تركيب المستمع المركزي
    preFlightAuthCheck()

    // 📡 التسمع التفاعلي المركزي لدورة حياة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔒 [Core Auth Event Triggered]: ${event}`)
      if (!isMounted) return

      try {
        if (session?.user) {
          setUser(session.user)
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
      } catch (error) {
        console.error('❌ [Auth Event Processing Error]:', error.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [navigate])

  const fetchUserProfile = async (userId, currentUser) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error

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
      console.error('❌ [Profile Synchronization Crash]:', err.message)
      // حماية معمارية احتياطية (Fallback Mechanism) لمنع سقوط الشاشات الداخلية
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
      console.error('❌ [Auth SignOut Exception]:', err.message)
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
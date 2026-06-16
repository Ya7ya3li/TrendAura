import React, { createContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../config/supabase.js'

export const AuthContext = createContext(null)

// كاش الرام التكتيكي لمنع تكرار طلبات قاعدة البيانات
const profileCache = new Map()

// قفل الأمان الصارم لمنع الطلبات المتزامنة في نفس الأجزاء من الثانية
const profileLock = new Set()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [initialized, setInitialized] = useState(false) // العلم الحتمي الحاسم

  // حارس التقفيل القطعي لمنع تضارب الأحداث وإطفاء شاشة الحجب مرة واحدة للأبد
  const initGateTriggered = useRef(false)

  /**
   * 📁 دالة جلب البروفايل الذكية والمحمية بالـ Cache والـ Locking
   */
  const fetchProfile = async (userId, email, metadata) => {
    if (profileCache.has(userId)) return profileCache.get(userId)
    if (profileLock.has(userId)) return profileCache.get(userId)
    
    profileLock.add(userId)
    console.log("🔬 [Profile]: PROFILE FETCH START ➔ ID:", userId)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error("❌ [Profile Supabase Error]:", error.message)
        return null
      }

      if (data) {
        console.log("🔬 [Profile]: PROFILE FETCH END (Data Found) ✔")
        profileCache.set(userId, data)
        return data
      }

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

      if (insertError) {
        console.error("❌ [Profile Insert Error]:", insertError.message)
        return newProfile
      }

      console.log("🔬 [Profile]: PROFILE FETCH END (New Created) ✔")
      const finalProfile = insertedData || newProfile
      profileCache.set(userId, finalProfile)
      return finalProfile
    } catch (err) {
      console.error('❌ [Profile Engine Fatal Crash]:', err)
      return null
    } finally {
      profileLock.delete(userId)
    }
  }

  /**
   * 🚪 دالة تسجيل الخروج النظيف وتطهير الكاش المتوافق مع سوبابيس v2
   */
  const logout = async () => {
    try {
      if (user?.id) {
        profileCache.delete(user.id)
        profileLock.delete(user.id)
      }
      initGateTriggered.current = false
      await supabase.auth.signOut() // القفل الصحيح للـ API
      setUser(null)
      setProfile(null)
      window.location.href = '/login'
    } catch (err) {
      console.error('❌ [Logout Exception]:', err.message)
    }
  }

  /**
   * 🧠 محرك البث المركزي المطلق (Pure Event-Driven Model)
   */
  useEffect(() => {
    let active = true

    // فحص خلفي صامت وسريع كـ Backup دون تجميد أو حجب الـ UI
    supabase.auth.getSession().then(({ data }) => {
      if (active && data?.session?.user && !initGateTriggered.current) {
        const session = data.session
        setUser(session.user)
        fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
          .then(p => { if (active && p) setProfile(p) })
      }
    }).catch(() => {})

    // المصدر الصافي والوحيد للتحكم بالـ UI gating
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        setUser(session.user)

        fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
          .then(profileData => {
            if (active && profileData) {
              // 🎯 تم إبادة سطر فرض توكنز الميتاداتا المكسورة هنا، والاعتماد كلياً على جدول السيرفر
              setProfile(profileData)
            }
          })
          .catch(err => console.error("❌ [Non-blocking Profile Error]:", err))
      } 
      
      else if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
        setUser(null)
        setProfile(null)
      }

      // 🎯 [الحسم الهندسي]: تفعيل بوابة العبور فوراً عند أول إشارة حية لكسر جدار الحجب للأبد
      if (!initGateTriggered.current) {
        initGateTriggered.current = true
        setInitialized(true)
      }
    })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  return (
    // نمرر loading بقيمة معكوسة لـ initialized لضمان توافق الهوكات مثل useAiGenerator دون تعديلها
    <AuthContext.Provider value={{ user, profile, setProfile, logout, loading: !initialized, initialized }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
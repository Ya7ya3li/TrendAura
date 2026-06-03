import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId, email, metadata) => {
    // 1. منع استدعاء القاعدة إذا كان لدينا بروفايل بالفعل في الـ State (لحل مشكلة الـ Loop)
    if (profile && profile.id === userId) return profile;

    console.log("🔍 [Auth] جارٍ جلب بروفايل للمستخدم:", userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      console.log("📊 [Auth] نتيجة البحث من سوبابيس:", data);

      if (data) return data

           // إنشاء بروفايل جديد إذا لم يوجد
      const newProfile = {
        id: userId,
        full_name: metadata?.full_name || metadata?.name || email?.split('@')[0] || 'مستخدم جديد',
        email: email,
        avatar_url: metadata?.avatar_url || metadata?.picture || null,
        plan: 'free',
        tokens: 5000
      }

      const { error: insertError } = await supabase.from('profiles').insert([newProfile])
      if (insertError) {
        console.error('❌ [Auth] خطأ في إنشاء البروفايل:', insertError.message);
        return null;
      }
      
      return newProfile
    } catch (err) {
      console.error('❌ [Auth] خطأ عام:', err.message)
      return null
    }
  }

  useEffect(() => {
    // جلب الجلسة الأولية
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
        setProfile(p)
      }
      setLoading(false)
    })

    // الاستماع لأي تغير
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
        setProfile(p)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile: profile || { id: null, full_name: 'جاري التحميل...', tokens: 0, plan: 'free' }, 
      setProfile, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
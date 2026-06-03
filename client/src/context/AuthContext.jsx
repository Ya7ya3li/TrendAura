import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

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

      await supabase.from('profiles').insert([newProfile])
      return newProfile
    } catch (err) {
      console.error('❌ Profile Error:', err.message)
      return null
    }
  }

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // تنفيذ البروفايل في الخلفية دون حظر الإقلاع
          fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
            .then(p => { if (active) setProfile(p) });
        }
      } catch (e) {
        console.error("Auth Init Error:", e);
      } finally {
        if (active) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
          .then(p => { if (active) setProfile(p) });
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

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
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [plan, setPlan] = useState('FREE')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getUser()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        getProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setPlan('FREE')
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      setUser(data.user)
      getProfile(data.user.id)
    }
  }

  const getProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, plan')
      .eq('id', userId)
      .maybeSingle()
    if (data) {
      setProfile(data)
      setPlan(data?.plan ? data.plan.toLowerCase() : 'free')
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isPremium = plan === 'pro' || plan === 'pro viral engine' || plan === 'viral_engine'

  const links = [
    { to: '/', label: 'الرئيسية', icon: '🏠' },
    { to: '/history', label: 'السكريبتات', icon: '📋' },
    { to: '/pricing', label: 'الاشتراكات', icon: '💎' },
    { to: '/settings', label: 'الإعدادات', icon: '⚙️' },
    ...(isPremium ? [{ to: 'https://t.me/y33_w', label: 'دعم مباشر 24/7', icon: '💬', external: true }] : [])
  ]

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'مستخدم'
  const avatarLetter = displayName?.charAt(0)?.toUpperCase()

  // تحديد الكلمة المعروضة على الزر الموف تحت بالظبط حسب حالتك الحالية
  const displayPlanBadge = plan === 'pro' ? 'PRO ✨' : (plan === 'pro viral engine' || plan === 'viral_engine' ? 'VIRAL 🚀' : 'FREE')

  return (
    <>
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        {open ? '✕' : '☰'}
      </button>

      <div className={`overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`sidebar ${open ? 'open' : ''}`} style={{ background: '#1e293b' }}>
        <div>
          <div className="logo" style={{ color: '#38bdf8', fontSize: '1.8rem', fontWeight: 'bold', padding: '20px', textAlign: 'center' }}>TrendAura</div>
          <nav className="sidebar-menu">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          {user ? (
            <div className="user-box">
              {/* زر الباقة المتوهج والموف نفس صورتك بالملي */}
              <div className="plan-banner-side" style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff', padding: '8px', borderRadius: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px'
              }}>
                {displayPlanBadge}
              </div>
              <div className="user-info">
                <div className="user-avatar-circle">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="avatar" /> : avatarLetter}
                </div>
                <div className="user-details">
                  <span className="user-name">{displayName}</span>
                  <span className="user-email-small">{user.email}</span>
                </div>
              </div>
              <button className="logout-btn" onClick={logout}>🚪 تسجيل الخروج</button>
            </div>
          ) : (
            <Link to="/login" className="login-side-btn" onClick={() => setOpen(false)}>👤 تسجيل الدخول</Link>
          )}
        </div>
      </aside>
    </>
  )
}
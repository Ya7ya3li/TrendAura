import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import { AuthContext } from '../../context/AuthContext'
import { SIDEBAR_ITEMS } from '../../constants/sidebarItems'

export default function Sidebar() {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  // أضفنا loading هنا لمراقبة حالة الجلب من سوبابيس
  const { profile, loading } = useContext(AuthContext)

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  // إذا كان loading هو true، لا تظهر "مستخدم جديد"، أظهر هيكل تحميل أو فراغ
  if (loading) {
    return (
      <aside className={`hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 p-5 border-r ${
        theme === 'dark' ? 'bg-[#0d071d]/95 border-[#1f1438]' : 'bg-white border-slate-100'
      }`}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
        </div>
      </aside>
    )
  }

  const userPlan = (profile?.plan || 'free').toLowerCase().trim()
  const displayToken = `TA-${profile?.id ? profile.id.substring(0, 4).toUpperCase() : '----'}-••••`

  return (
    <aside className={`hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 text-right dir-rtl font-sans p-5 backdrop-blur-xl border-r select-none transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-[#0d071d]/95 border-[#1f1438] shadow-2xl shadow-black/80'
        : 'bg-white border-slate-100 shadow-sm shadow-slate-100'
    }`}>
      
      {/* الشعار */}
      <div className={`flex items-center gap-2.5 px-2 py-3 mb-6 border-b ${theme === 'dark' ? 'border-[#1f1438]/60' : 'border-slate-50'}`}>
        <div className={`w-8 h-8 rounded-xl text-white text-xs font-black flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-tr from-cyan-500 to-pink-500' : 'bg-gradient-to-tr from-blue-600 to-pink-500'}`}>▲</div>
        <span className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Trend<span className={theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}>Aura</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {SIDEBAR_ITEMS && SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-xs font-black transition-all ${
              isActive 
                ? (theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white')
                : (theme === 'dark' ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
            }`}
          >
            {item.icon}
            <span className="tracking-tight text-[11px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* كرت الهوية */}
      <div className={`mb-3 p-3 rounded-2xl border ${theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-slate-50 border-slate-100/70'}`}>
        <div className="flex items-center gap-3 w-full">
          <div className={`w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center border ${theme === 'dark' ? 'border-cyan-500/30 bg-[#0d071d]' : 'border-slate-200 bg-white'}`}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black">{profile?.full_name?.charAt(0) || 'U'}</span>
            )}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1 text-right">
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
              {userPlan === 'viral_engine' ? '🔴 Viral Engine' : userPlan === 'pro' ? '🟢 PRO' : '⚪️ FREE'}
            </span>
            <span className="text-xs font-black truncate text-slate-900 dark:text-white">
              {profile?.full_name || 'مرحباً بك'}
            </span>
            <span className={`text-[9px] font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}`}>
              ⚡ رصيدك: {profile?.tokens ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className={`pt-3 border-t ${theme === 'dark' ? 'border-[#1f1438]/60' : 'border-slate-50'}`}>
        <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-xs font-black text-rose-500 hover:bg-rose-500/10 text-right">
          <span>🚪</span>
          <span className="tracking-tight text-[11px]">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
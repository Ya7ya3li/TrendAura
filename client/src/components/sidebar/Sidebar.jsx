import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import { SIDEBAR_ITEMS } from '../../constants/sidebarItems.js'
import { ROUTES } from '../../constants/routes.js'

export default function Sidebar() {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const { profile, loading, logout } = useContext(AuthContext)

  const handleLogoutClick = async () => {
    try {
      if (typeof logout === 'function') {
        await logout()
      }
      localStorage.clear()
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <aside className={`hidden md:flex flex-col w-64 h-screen fixed right-0 top-0 z-30 p-5 border-l ${
        theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'
      }`}>
        <div className="animate-pulse space-y-5">
          <div className="h-10 bg-slate-800 rounded-xl w-full" />
          <div className="h-40 bg-slate-800 rounded-2xl w-full" />
        </div>
      </aside>
    )
  }

  const userPlan = (profile?.plan || 'free').toLowerCase().trim()

  return (
    <aside className={`hidden md:flex flex-col w-64 h-screen fixed right-0 top-0 z-30 text-right dir-rtl font-sans p-5 backdrop-blur-xl border-l select-none transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-slate-950 border-slate-900/60 shadow-2xl shadow-black/60'
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      <div className={`flex items-center gap-2.5 px-2 py-3 mb-6 border-b ${theme === 'dark' ? 'border-slate-900' : 'border-slate-100'}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
          Trend<span className="text-blue-500 dark:text-cyan-400">Aura</span>
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {SIDEBAR_ITEMS && SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-xs font-black transition-all ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="w-4 h-4 shrink-0">{item.icon}</span>
            <span className="tracking-tight text-[11px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className={`mb-3 p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-3 w-full">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black text-slate-700 dark:text-white font-sans">{profile?.full_name?.charAt(0) || 'U'}</span>
            )}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1 text-right">
            <span className={`text-[8px] font-black uppercase tracking-wider ${userPlan === 'viral_engine' ? 'text-rose-400' : userPlan === 'pro' ? 'text-cyan-400' : 'text-slate-400'}`}>
              {userPlan === 'viral_engine' ? '🔴 Viral Engine' : userPlan === 'pro' ? '🟢 PRO' : '⚪️ FREE'}
            </span>
            <span className="text-xs font-black truncate text-slate-900 dark:text-white">
              {profile?.full_name || 'مرحباً بك'}
            </span>
            <span className="text-[9px] font-bold text-blue-600 dark:text-cyan-400 mt-0.5 font-sans">
              ⚡ رصيدك: {profile?.tokens ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className={`pt-3 border-t ${theme === 'dark' ? 'border-slate-900' : 'border-slate-100'}`}>
        <button 
          type="button"
          onClick={handleLogoutClick} 
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-xs font-black text-rose-500 hover:bg-rose-500/10 text-right transition-colors"
        >
          <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="tracking-tight text-[11px]">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
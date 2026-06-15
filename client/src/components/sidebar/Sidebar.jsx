import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
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

  const userPlan = (profile?.plan || 'free').toLowerCase().trim()

  // 🚀 هندسة عناصر القائمة الجانبية بأيقونات SVG نقية وحقن زر الإدارة المفقود فوق الإعدادات
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'لوحة التحكم',
      path: ROUTES.DASHBOARD,
      show: true,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      id: 'history',
      name: ' السكريبتات المحفوظة',
      path: ROUTES.HISTORY,
      show: userPlan !== 'free', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-4a2 2 0 002-2h12a2 2 0 002 2v4a2 2 0 01-2 2H5z" />
        </svg>
      )
    },
    {
      id: 'pricing',
      name: 'الباقات والأسعار',
      path: ROUTES.PRICING,
      show: true,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'subscription',
      name: 'إدارة الاشتراك والفوترة',
      path: ROUTES.SUBSCRIPTION || '/subscription', // استدعاء الراوت الملوكي مع غطاء حماية لو لم يُعرف
      show: true, // يظهر للجميع للوصول لنظام الإحالة وشحن المحفظة
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'settings',
      name: 'الإعدادات ',
      path: ROUTES.SETTINGS,
      show: true,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'support',
      name: 'دعم المشتركين 24/7',
      path: '/support', 
      show: userPlan !== 'free', 
      icon: (
        /* 🎧 أيقونة سماعة الدعم الفني الملوكية الهندسية الصافية */
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9M3 14h3a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-5zm13 2a2 2 0 012-2h3v5a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3zm-5 5h-1a4 4 0 01-4-4" />
        </svg>
      )
    }
  ]

  if (loading) {
    return (
      <aside className={`hidden md:flex flex-col w-64 h-screen fixed right-0 top-0 z-30 p-5 border-l ${
        theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'
      }`}>
        <div className="animate-pulse space-y-5">
          <div className="h-10 bg-slate-800 dark:bg-slate-900 rounded-xl w-full" />
          <div className="h-40 bg-slate-800 dark:bg-slate-900 rounded-2xl w-full" />
        </div>
      </aside>
    )
  }

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
        {navigationItems.filter(item => item.show).map((item) => (
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
            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider">
              <svg className={`w-2 h-2 shrink-0 ${userPlan === 'viral_engine' ? 'text-rose-500 animate-pulse' : userPlan === 'pro' ? 'text-cyan-400' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              <span className={userPlan === 'viral_engine' ? 'text-rose-400' : userPlan === 'pro' ? 'text-cyan-400' : 'text-slate-400'}>
                {userPlan === 'viral_engine' ? 'Viral Engine' : userPlan === 'pro' ? 'PRO VIP' : 'FREE'}
              </span>
            </span>
            <span className="text-xs font-black truncate text-slate-900 dark:text-white mt-0.5">
              {profile?.full_name || 'مرحباً بك'}
            </span>
            <span className="text-[9px] font-bold text-blue-600 dark:text-cyan-400 mt-0.5 font-sans flex items-center gap-1">
              <svg className="w-2.5 h-2.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              رصيدك: {Number(profile?.tokens ?? 0).toLocaleString()}
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
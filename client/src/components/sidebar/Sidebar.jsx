import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import { AuthContext } from '../../context/AuthContext'
import { SIDEBAR_ITEMS } from '../../constants/sidebarItems'

/**
 * TrendAura Premium Left-Aligned Sidebar - Fixed Identity Edition
 * Now fully synchronized with Supabase profile state.
 */
export default function Sidebar() {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const { profile } = useContext(AuthContext)

  // قراءة الحالة من البروفايل مباشرة
  const userPlan = (profile?.plan || 'free').toLowerCase().trim()
  
  // توليد التوكن (بما أنه عرضي ولا نحتاجه من الـ localStorage)
  const displayToken = `TA-${profile?.id ? profile.id.substring(0, 4).toUpperCase() : 'MOCK'}-••••`

  // بيانات الهوية (تعتمد حصرياً على البروفايل القادم من القاعدة)
  const currentName = profile?.full_name || 'مستخدم جديد'
  const currentAvatar = profile?.avatar_url

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  const showPremiumSupport = userPlan !== 'free'

  return (
    <aside className={`hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 text-right dir-rtl font-sans p-5 backdrop-blur-xl border-r select-none transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-[#0d071d]/95 border-[#1f1438] shadow-2xl shadow-black/80'
        : 'bg-white border-slate-100 shadow-sm shadow-slate-100'
    }`}>
      
      {/* الشعار */}
      <div className={`flex items-center gap-2.5 px-2 py-3 mb-6 border-b transition-colors duration-300 ${
        theme === 'dark' ? 'border-[#1f1438]/60' : 'border-slate-50'
      }`}>
        <div className={`w-8 h-8 rounded-xl text-white text-xs font-black flex items-center justify-center transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
            : 'bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 shadow-md shadow-blue-100'
        }`}>
          ▲
        </div>
        <span className={`text-sm font-black tracking-tight transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-slate-800'
        }`}>
          Trend<span className={`transition-all duration-300 ${
            theme === 'dark' ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]' : 'text-blue-600'
          }`}>Aura</span>
        </span>
      </div>

      {/* قائمة الروابط */}
      <nav className="flex-1 space-y-2">
        {SIDEBAR_ITEMS && SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => {
              const baseClasses = "flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-xs font-black transition-all duration-250 border "
              if (isActive) {
                return baseClasses + (theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-lg shadow-purple-600/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20')
              }
              return baseClasses + (theme === 'dark'
                ? 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900')
            }}
          >
            <span className="transition-transform duration-200">{item.icon}</span>
            <span className="tracking-tight text-[11px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* الدعم الفني */}
      {showPremiumSupport && (
        <a href="https://wa.me/YOUR_SUPPORT_NUMBER" target="_blank" rel="noreferrer" className={`flex items-center gap-3.5 px-4 py-3 mb-2 rounded-[18px] text-xs font-black transition-all border animate-fade-in ${
          theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10' : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/50'
        }`}>
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span className="tracking-tight text-[11px]">الدعم الفني VIP 24/7</span>
        </a>
      )}

      {/* كرت الهوية */}
      <div className={`mb-3 p-3 rounded-2xl border transition-all duration-300 flex flex-col gap-2.5 ${
        theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438] text-white' : 'bg-slate-50 border-slate-100/70 text-slate-800'
      }`}>
        <div className="flex items-center gap-3 w-full">
          <div className={`w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center border font-black text-xs shrink-0 ${
            theme === 'dark' ? 'border-cyan-500/30 bg-[#0d071d]' : 'border-slate-200 bg-white text-blue-600'
          }`}>
            {currentAvatar ? (
              <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              currentName.substring(0, 1)
            )}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1 text-right">
            <span className={`text-[8px] font-black uppercase tracking-wider mb-0.5 ${
              userPlan === 'viral_engine' ? 'text-rose-400' : userPlan === 'pro' ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              {userPlan === 'viral_engine' ? '🔴 Viral Engine' : userPlan === 'pro' ? '🟢 PRO Member' : '⚪️ FREE Tier'}
            </span>
            <span className="text-xs font-black truncate text-slate-900 dark:text-white">{currentName}</span>
            <span className={`text-[9px] font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}`}>
              ⚡ رصيدك: {profile?.tokens || 0}
            </span>
          </div>
        </div>
        <div className={`text-center text-[8px] font-mono font-bold py-1.5 rounded-lg border ${
          theme === 'dark' ? 'border-[#1f1438]/60 text-purple-300 bg-[#05020c]/40' : 'border-slate-200/60 text-slate-500 bg-white'
        }`}>
          {displayToken}
        </div>
      </div>

      {/* تسجيل الخروج */}
      <div className={`pt-3 border-t ${theme === 'dark' ? 'border-[#1f1438]/60' : 'border-slate-50'}`}>
        <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-xs font-black text-rose-500 hover:bg-rose-500/10 text-right">
          <span>🚪</span>
          <span className="tracking-tight text-[11px]">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
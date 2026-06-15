import React from 'react'
import useAuth from '../../hooks/useAuth.js'
import useSubscription from '../../hooks/useSubscription.js'

/**
 * TrendAura User Profile Monitor Card - Pure SVG Edition
 */
export default function UserProfileCard() {
  const { profile, logout } = useAuth()
  const { plan } = useSubscription()

  const userEmail = profile?.email || 'صانع محتوى'
  const userName = profile?.full_name || 'مبدع تريند اورا'
  const userPlan = (profile?.plan || plan || 'free').toLowerCase().trim()
  const initialLetter = userName.charAt(0).toUpperCase()

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 select-none text-right dir-rtl">
      
      {/* قطاع معالجة واستعراض الصورة الشخصية من سوبابيس */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-sm font-sans">{initialLetter}</span>
          )}
        </div>

        {/* معلومات الحساب الشخصي */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-black text-white truncate leading-none mb-1">
            {userName}
          </span>
          <span className="text-[10px] font-bold text-slate-500 truncate leading-none font-sans mb-1">
            {userEmail}
          </span>
          {/* ⚡ حقن رصيد التوكنز التراكمي لايف أسفل الإيميل مباشرة بأعلى دقة سحب للأرقام */}
          <span className="text-[10px] font-black text-cyan-400 mt-1 flex items-center gap-1 leading-none font-sans">
            <svg className="w-2.5 h-2.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{Number(profile?.tokens ?? 0).toLocaleString()} توكن</span>
          </span>
        </div>
      </div>

      {/* - شريط حالة رتبة الباقة الحالية */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-black select-none">
        <span className="text-slate-500">باقة حسابك الحركي:</span>
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wide uppercase ${
          userPlan === 'viral_engine'
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : userPlan === 'pro'
            ? 'bg-blue-500/10 text-cyan-400 border border-blue-500/20'
            : 'bg-slate-800 text-slate-400 border border-slate-700/60'
        }`}>
          {userPlan === 'viral_engine' ? '⚡ VIRAL ENGINE' : userPlan === 'pro' ? '🟢 PRO VIP' : '⚪️ FREE'}
        </span>
      </div>

      {/* زر تسجيل الخروج المحول بالكامل لأيقونات الـ SVG الملوكية */}
      <button
        type="button"
        onClick={logout}
        className="w-full mt-1 py-2 rounded-xl text-[10px] font-black text-rose-400 bg-rose-500/5 hover:bg-rose-600 hover:text-white border border-rose-500/10 transition-all duration-300 text-center flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>تسجيل الخروج الآمن</span>
      </button>

    </div>
  )
}
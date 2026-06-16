import React from 'react'
import useAuth from '../../hooks/useAuth.js'
import useSubscription from '../../hooks/useSubscription.js'

/**
 * TrendAura User Profile Monitor Card - Dual Theme Edition
 */
export default function UserProfileCard() {
  const { profile, logout } = useAuth()
  const { plan } = useSubscription()

  const userEmail = profile?.email || 'صانع محتوى'
  const userName = profile?.full_name || 'مبدع تريند اورا'
  const userPlan = (profile?.plan || plan || 'free').toLowerCase().trim()
  const initialLetter = userName.charAt(0).toUpperCase()

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 select-none text-right dir-rtl transition-colors duration-300">
      
      {/* قطاع معالجة واستعراض الصورة الشخصية من سوبابيس */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 shadow-inner transition-colors">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-sm font-sans">{initialLetter}</span>
          )}
        </div>

        {/* معلومات الحساب الشخصي */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-black text-slate-900 dark:text-white truncate leading-none mb-1 transition-colors">
            {userName}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate leading-none font-sans mb-1 transition-colors">
            {userEmail}
          </span>
          {/* ⚡ حقن رصيد التوكنز التراكمي لايف */}
          <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400 mt-1 flex items-center gap-1 leading-none font-sans transition-colors">
            <svg className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{Number(profile?.tokens ?? 0).toLocaleString()} توكن</span>
          </span>
        </div>
      </div>

      {/* - شريط حالة رتبة الباقة الحالية */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[10px] font-black select-none transition-colors">
        <span className="text-slate-600 dark:text-slate-500 transition-colors">باقة حسابك :</span>
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wide uppercase transition-colors ${
          userPlan === 'viral_engine'
            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
            : userPlan === 'pro'
            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
        }`}>
          {userPlan === 'viral_engine' ? '⚡ VIRAL ENGINE' : userPlan === 'pro' ? '🟢 PRO VIP' : '⚪️ FREE'}
        </span>
      </div>

      {/* زر تسجيل الخروج المحول بالكامل لأيقونات الـ SVG الملوكية */}
      <button
        type="button"
        onClick={logout}
        className="w-full mt-1 py-2 rounded-xl text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/5 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white dark:hover:text-white border border-rose-200 dark:border-rose-500/10 transition-all duration-300 text-center flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>تسجيل الخروج </span>
      </button>

    </div>
  )
}
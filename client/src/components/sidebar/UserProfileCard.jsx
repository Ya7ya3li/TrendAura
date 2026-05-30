import React from 'react'
import useAuth from '../../hooks/useAuth'
import useSubscription from '../../hooks/useSubscription'

/**
 * TrendAura User Profile Monitor Card
 * Renders user meta statistics and active plan badges inside the navigation matrix.
 */
export default function UserProfileCard() {
  const { profile, logout } = useAuth()
  const { plan } = useSubscription()

  const userEmail = profile?.email || 'صانع محتوى'
  const userName = profile?.full_name || 'مبدع تريند اورا'
  
  // اشتقاق الحرف الأول لتهيئة الصورة الافتراضية الدائرية الفخمة بنقاء
  const initialLetter = userName.charAt(0).toUpperCase()

  return (
    <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 select-none text-right dir-rtl">
      
      {/* قطاع الهوية والبيانات الشخصية المصغرة */}
      <div className="flex items-center gap-3 min-w-0">
        
        {/* قطاع معالجة واستعراض الصورة الشخصية لحساب صانع المحتوى */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center shrink-0 border shadow-inner">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-sm">{initialLetter}</span>
          )}
        </div>

        {/* معلومات الاسم والبريد المتقلص تلقائياً لمنع تشوه التصميم */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-black text-slate-800 truncate leading-none mb-1">
            {userName}
          </span>
          <span className="text-[10px] font-bold text-slate-400 truncate leading-none">
            {userEmail}
          </span>
        </div>

      </div>

      {/* شريط حالة رتبة حساب صانع المحتوى والمطابقة الكاملة للباقات المدفوعة والمجانية */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100/70 text-[10px] font-black select-none">
        <span className="text-slate-400">باقة حسابك:</span>
        <span className={`px-2.5 py-1 rounded-lg tracking-wide uppercase ${
          plan === 'free' || !plan
            ? 'bg-slate-200/60 text-slate-600'
            : plan === 'pro'
            ? 'bg-blue-50 text-blue-600 border border-blue-100/40'
            : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xs'
        }`}>
          {plan === 'free' || !plan ? 'مجانية' : plan === 'pro' ? '🚀 PRO' : '⚡ VIRAL'}
        </span>
      </div>

      {/* زر تسجيل الخروج الانفصالي المباشر */}
      <button
        onClick={logout}
        className="w-full mt-1 py-2 rounded-xl text-[10px] font-black text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100/40 transition-all duration-200 text-center flex items-center justify-center gap-1 active:scale-[0.98]"
      >
        <span>🚪</span>
        <span>تسجيل الخروج الآمن من الحساب</span>
      </button>

    </div>
  )
}
import React, { useState, useRef, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { supabase } from '../../config/supabase.js'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const { profile } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // ⏱️ تثبيت وقت دخول الجلسة الحالي لإشعار تسجيل الدخول الثابت
  const [sessionTime] = useState(() => new Date().toISOString())

  // 📡 دالة تحويل التواريخ بصيغة نسبية خفيفة وسريعة
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'الآن'
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    
    if (diffMins < 1) return 'الآن ⚡'
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    return past.toLocaleDateString('ar-SA')
  }

  // 🎨 رندرة أيقونات SVG النقية بالكامل متناسقة مع النصوص بدون إيموجي
  const renderNotificationIcon = (type) => {
    const baseClass = "w-4 h-4 shrink-0"
    switch (type) {
      case 'token':
        return (
          <svg className={`${baseClass} text-emerald-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'plan':
        return (
          <svg className={`${baseClass} text-amber-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
          </svg>
        )
      case 'script':
        return (
          <svg className={`${baseClass} text-purple-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'name':
        return (
          <svg className={`${baseClass} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'avatar':
        return (
          <svg className={`${baseClass} text-pink-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" />
            <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        )
      default: // أيقونة تسجيل الدخول (Shield/Check)
        return (
          <svg className={`${baseClass} text-blue-600 dark:text-cyan-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
    }
  }

  // 📡 جلب البيانات الأولية + الاستماع اللحظي للجدول المركزي الجديد
  useEffect(() => {
    if (!profile?.id) return

    let realtimeChannel = null

    const fetchNotifications = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(4) // نأخذ 4 فقط لنترك مكاناً لإشعار تسجيل الدخول

        // ⚡ هندسة إشعار تسجيل الدخول الجلسي ليكون ثابتاً ومحمياً بالقمة عند الريفريش
        const loginWelcome = {
          id: `sys-login-${sessionTime.slice(0, 16)}`,
          text: `تم تسجيل الدخول بنجاح اهلا بك`,
          created_at: sessionTime,
          type: 'login',
          is_read: true
        }

        setNotifications([loginWelcome, ...(data || [])].slice(0, 5))

        // 🚀 الربط اللحظي العالمي المستقر
        const channelId = `live-notifs-${profile.id}-${Math.random().toString(36).slice(2, 7)}`
        realtimeChannel = supabase
          .channel(channelId)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
            (payload) => {
              // الإشعار اللحظي الجديد ينزل فوراً في القمة حياً
              setNotifications(prev => [payload.new, ...prev].slice(0, 5))
            }
          )
          .subscribe()

      } catch (err) {
        console.error('❌ [Notification Fetch/Realtime Error]:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    return () => {
      if (realtimeChannel) supabase.removeChannel(realtimeChannel)
    }
  }, [profile?.id])

  const hasNew = notifications.some(n => !n.is_read)

  const markAllAsRead = async () => {
    if (notifications.length === 0 || !hasNew) return
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', profile.id)
        .eq('is_read', false)
    } catch (err) {
      console.error('❌ [Failed to update read status]:', err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative select-none font-sans" ref={dropdownRef}>
      
      {/* زر الجرس التفاعلي */}
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) markAllAsRead(); }}
        className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative active:scale-95"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {hasNew && (
          <span className="absolute top-2 left-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-950 animate-pulse" />
        )}
      </button>

      {/* لوحة القائمة المنسدلة للإشعارات */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 animate-scale-up text-right dir-rtl">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 dark:text-white">مركز تنبيهات المنظومة</span>
            <span className="text-[8px] font-black text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/10 px-2 py-0.5 rounded-md uppercase font-sans">Live System</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-900 max-h-64 overflow-y-auto scrollbar-none">
            {loading ? (
              <p className="text-slate-400 dark:text-slate-600 text-[10px] py-6 text-center animate-pulse">جاري سحب التحركات الحية...</p>
            ) : notifications.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-600 text-[10px] py-6 text-center">لا توجد تنبيهات مسجلة لحسابك حالياً.</p>
            ) : (
              notifications.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-start gap-3 cursor-pointer ${
                    !item.is_read && item.type !== 'login' ? 'bg-blue-500/5 dark:bg-cyan-500/5' : 'bg-transparent'
                  }`}
                >
                  <div className="mt-0.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg shrink-0">
                    {renderNotificationIcon(item.type)}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-600 font-sans">{formatRelativeTime(item.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-900 text-center">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 rounded-lg text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
            >
              إغلاق لوحة الإشعارات
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
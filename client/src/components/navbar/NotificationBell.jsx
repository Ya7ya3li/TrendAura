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

 // 🎨 رندرة أيقونات SVG النقية بالكامل (الإصدار المحدث v2 - زوايا ناعمة 100%)
  const renderNotificationIcon = (type) => {
    // استخدمنا سماكة 1.5 لضمان عدم تداخل الخطوط في المقاسات الصغيرة
    const baseClass = "w-4 h-4 shrink-0"
    const strokeW = "1.5"

    switch (type) {
      case 'token':
        // أيقونة التوكن (العملة/الرصيد) - محدثة
        return (
          <svg className={`${baseClass} text-emerald-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'plan':
        // أيقونة الباقة (البرتقالية المشرشرة) - محدثة وناعمة
        return (
          <svg className={`${baseClass} text-amber-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        )
      case 'script':
        // أيقونة السكريبت (الملف/المستند) - محدثة
        return (
          <svg className={`${baseClass} text-purple-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        )
      case 'name':
        // أيقونة تغيير الاسم/البيانات - محدثة
        return (
          <svg className={`${baseClass} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
          </svg>
        )
      case 'avatar':
        // أيقونة تغيير الصورة الشخصية - محدثة
        return (
          <svg className={`${baseClass} text-pink-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        )
      default: 
        // أيقونة تسجيل الدخول (الدرع والصح) - محدثة وناعمة جداً
        return (
          <svg className={`${baseClass} text-blue-600 dark:text-cyan-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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
            <span className="text-xs font-black text-slate-900 dark:text-white">مركز التنبيهات </span>
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
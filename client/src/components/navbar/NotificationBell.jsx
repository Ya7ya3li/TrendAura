import React, { useState, useRef, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { supabase } from '../../config/supabase.js'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { profile } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const [sessionTime] = useState(() => new Date().toISOString())

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

  const renderNotificationIcon = (type) => {
    const baseClass = "w-4 h-4 shrink-0"
    const strokeW = "1.5"

    switch (type) {
      // 📢 أيقونة البث العام (الجديدة)
      case 'broadcast':
        return (
          <svg className={`${baseClass} text-rose-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
          </svg>
        )
      case 'token':
        return <svg className={`${baseClass} text-emerald-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      case 'plan':
        return <svg className={`${baseClass} text-amber-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
      case 'script':
        return <svg className={`${baseClass} text-purple-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
      default:
        return <svg className={`${baseClass} text-blue-600 dark:text-cyan-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
    }
  }

  // ترتيب وعرض محتوى الإشعار سواء كان عادي أو بث عام
  const getNotificationContent = (item) => {
    if (item.type === 'broadcast') {
      return (
        <>
          <p className="text-[11px] font-black text-rose-600 dark:text-rose-400 mb-0.5">{item.title}</p>
          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{item.message}</p>
        </>
      )
    }
    return <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{item.text || item.message}</p>
  }

  useEffect(() => {
    if (!profile?.id) return

    let realtimeChannel = null

    const fetchNotifications = async () => {
      try {
        // 👑 التعديل السحري 1: جلب الإشعارات الشخصية (أو) البث العام معاً
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${profile.id},type.eq.broadcast`)
          .order('created_at', { ascending: false })
          .limit(10)

        // جلب الإشعارات العامة التي سبق للمستخدم قراءتها من ذاكرة جهازه
        const readBroadcasts = JSON.parse(localStorage.getItem(`read_broadcasts_${profile.id}`) || '[]')

        // معالجة حالة القراءة لكل إشعار
        const formattedData = (data || []).map(n => ({
          ...n,
          // إذا كان بث عام، نشيك هل تم حفظ الآي دي حقه في جهاز المستخدم
          is_read: n.type === 'broadcast' ? readBroadcasts.includes(n.id) : n.is_read
        }))

        const loginWelcome = {
          id: `sys-login-${sessionTime.slice(0, 16)}`,
          text: `تم تسجيل الدخول بنجاح، أهلاً بك يا ${profile.full_name?.split(' ')[0] || 'بطل'}`,
          created_at: sessionTime,
          type: 'login',
          is_read: true
        }

        setNotifications([loginWelcome, ...formattedData].slice(0, 6))

        // 👑 التعديل السحري 2: فتح الرادار اللحظي لالتقاط البث العام فوراً
        const channelId = `live-notifs-${profile.id}-${Math.random().toString(36).slice(2, 7)}`
        realtimeChannel = supabase
          .channel(channelId)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications' }, // شلنا الفلتر من هنا عشان يلقط كل شيء
            (payload) => {
              // ونفلتر هنا: إذا كان شخصي أو بث عام نزله للمستخدم
              if (payload.new.user_id === profile.id || payload.new.type === 'broadcast') {
                const newNotif = {
                  ...payload.new,
                  is_read: false // الإشعار اللحظي الجديد دائماً غير مقروء
                }
                setNotifications(prev => [newNotif, ...prev].slice(0, 6))
              }
            }
          )
          .subscribe()

      } catch (err) {
        console.error('❌ [Notification Fetch Error]:', err)
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

    // حفظ البثوث العامة الجديدة كمقروءة في جهاز المستخدم الحالي فقط
    const readBroadcasts = JSON.parse(localStorage.getItem(`read_broadcasts_${profile.id}`) || '[]')
    const newBroadcastsIds = notifications.filter(n => n.type === 'broadcast' && !n.is_read).map(n => n.id)

    if (newBroadcastsIds.length > 0) {
      localStorage.setItem(`read_broadcasts_${profile.id}`, JSON.stringify([...readBroadcasts, ...newBroadcastsIds]))
    }

    // تحديث الواجهة فوراً
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))

    // تحديث الإشعارات الشخصية في قاعدة البيانات
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

      {/* زر الجرس התفاعلي */}
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllAsRead(); }}
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
            <span className="text-xs font-black text-slate-900 dark:text-white">مركز التنبيهات</span>
            <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10 px-2 py-0.5 rounded-md uppercase font-sans animate-pulse">Live System</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-900 max-h-72 overflow-y-auto scrollbar-none">
            {loading ? (
              <p className="text-slate-400 dark:text-slate-600 text-[10px] py-6 text-center animate-pulse">جاري سحب التحركات الحية...</p>
            ) : notifications.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-600 text-[10px] py-6 text-center">لا توجد تنبيهات مسجلة لحسابك حالياً.</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-start gap-3 cursor-pointer ${!item.is_read && item.type !== 'login' ? 'bg-blue-500/5 dark:bg-cyan-500/5' : 'bg-transparent'
                    }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${item.type === 'broadcast' ? 'bg-rose-500/10' : 'bg-slate-100 dark:bg-slate-900'}`}>
                    {renderNotificationIcon(item.type)}
                  </div>

                  <div className="flex flex-col gap-0.5 w-full">
                    {getNotificationContent(item)}
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-600 font-sans mt-1">{formatRelativeTime(item.created_at)}</span>
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
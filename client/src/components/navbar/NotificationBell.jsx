import React, { useState, useRef, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { supabase } from '../../config/supabase.js'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const { profile } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // ⏱️ تثبيت وقت دخول الجلسة الحالي
  const [sessionTime] = useState(() => new Date().toISOString())

  // 💾 جلب المعرفات المقروءة مسبقاً من الذاكرة المحلية
  const [readIds, setReadIds] = useState(() => {
    return JSON.parse(localStorage.getItem('trendaura_read_notifs') || '[]')
  })

  // 📡 دالة تحويل التواريخ بصيغة نسبية خفيفة
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

  // 🎨 دالة رندرة أيقونات SVG ديناميكياً بحسب نوع الإشعار لمنع استخدام الإيموجي
  const renderNotificationIcon = (type) => {
    const baseClass = "w-4 h-4 shrink-0"
    
    switch (type) {
      case 'token': // أيقونة شحن المحفظة والعملات (Coins)
        return (
          <svg className={`${baseClass} text-emerald-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'plan': // أيقونة الترقية والباقات السيادية (Crown/Badge)
        return (
          <svg className={`${baseClass} text-amber-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        )
      case 'script': // أيقونة توليد محرك الذكاء الاصطناعي (Sparkles/Flame Effect)
        return (
          <svg className={`${baseClass} text-purple-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'name': // أيقونة تعديل الاسم المعرف الشخصي (User Card)
        return (
          <svg className={`${baseClass} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'avatar': // أيقونة الصورة الشخصية والعدسة (Camera)
        return (
          <svg className={`${baseClass} text-pink-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" />
            <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        )
      default: // أيقونة تسجيل الدخول والنظام الأساسي (Shield/Check)
        return (
          <svg className={`${baseClass} text-blue-600 dark:text-cyan-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
    }
  }

  // 📡 سحب العمليات وصياغتها نصوصاً نقية بدون إيموجيز
  useEffect(() => {
    const fetchLiveNotifications = async () => {
      if (!profile?.id) return

      try {
        const { data: invoiceData } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(2)

        const { data: historyData } = await supabase
          .from('history')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(2)

        // الفواتير والاشتراكات
        const formattedInvoices = (invoiceData || []).map(inv => {
          const id = `inv-${inv.id}`
          const isToken = inv.plan_type?.toUpperCase() === 'TOKEN_BOOSTER'
          return {
            id,
            text: isToken 
              ? `تم شحن محفظتك بـ 50,000 توكن إضافي بنجاح`
              : `تم تفعيل اشتراكك في (${inv.plan_type || 'PRO'}) بنجاح`,
            created_at: inv.created_at,
            type: isToken ? 'token' : 'plan',
            isNew: !readIds.includes(id)
          }
        })

        // السكريبتات
        const formattedHistory = (historyData || []).map(hist => {
          const id = `hist-${hist.id}`
          return {
            id,
            text: `تم صياغة سكريبت بنجاح حول: ${hist.topic || hist.prompt || 'فكرتك المخصصة'}`,
            created_at: hist.created_at,
            type: 'script',
            isNew: !readIds.includes(id)
          }
        })

        // البروفايل
        const profileLogs = []
        if (profile.updated_at) {
          const nameId = `name-${profile.id}-${profile.updated_at}`
          const avatarId = `avatar-${profile.id}-${profile.updated_at}`

          profileLogs.push({
            id: nameId,
            text: `تم تغيير اسمك بنجاح`,
            created_at: profile.updated_at,
            type: 'name',
            isNew: !readIds.includes(nameId)
          })

          profileLogs.push({
            id: avatarId,
            text: `تم تغيير صورتك الشخصية بنجاح`,
            created_at: profile.updated_at,
            type: 'avatar',
            isNew: !readIds.includes(avatarId)
          })
        }

        // تسجيل الدخول
        const loginWelcomeId = `sys-login-${sessionTime.slice(0, 16)}`
        const loginWelcome = {
          id: loginWelcomeId,
          text: `تم تسجيل الدخول بنجاح اهلا بك`,
          created_at: sessionTime,
          type: 'login',
          isNew: !readIds.includes(loginWelcomeId)
        }

        const combinedNotifs = [...formattedInvoices, ...formattedHistory, ...profileLogs]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        setNotifications([loginWelcome, ...combinedNotifs].slice(0, 5))
      } catch (err) {
        console.error('❌ [Notification System Failure]:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveNotifications()
  }, [profile, readIds])

  const hasNew = notifications.some(n => n.isNew)

  const markAllAsRead = () => {
    const currentIds = notifications.map(n => n.id)
    const updatedReadIds = Array.from(new Set([...readIds, ...currentIds]))
    setReadIds(updatedReadIds)
    localStorage.setItem('trendaura_read_notifs', JSON.stringify(updatedReadIds))
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })))
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
      
      {/* زر الأيقونة التفاعلي */}
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
                    item.isNew ? 'bg-blue-500/5 dark:bg-cyan-500/5' : 'bg-transparent'
                  }`}
                >
                  {/* 🏆 حقن أيقونة الـ SVG ديناميكياً هنا بدلاً من الإيموجي الجامد */}
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
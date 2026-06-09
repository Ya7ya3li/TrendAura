import React, { useState, useRef, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { supabase } from '../../config/supabase.js'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  // 🏆 إدارة الحالات السحابية للإشعارات والتحميل
  const { profile } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // 📡 دالة تحويل التواريخ بصيغة نيون نسبية خفيفة وسريعة بدلاً من الأرقام الجامدة
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

  // 📡 سحب التحركات الحية من جهازي الفواتير وتاريخ توليد السكريبتات
  useEffect(() => {
    const fetchLiveNotifications = async () => {
      if (!profile?.id) return

      try {
        // 1. جلب آخر 3 فواتير من كشف حساب المستخدم
        const { data: invoiceData } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(3)

        // 2. جلب آخر 3 عمليات صياغة محتوى من جدول التاريخ (history)
        const { data: historyData } = await supabase
          .from('history')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(3)

        // 3. هندسة وتشكيل فواتير ميسر لتصبح تنبيهات تجارية فخمة
        const formattedInvoices = (invoiceData || []).map(inv => ({
          id: `inv-${inv.id}`,
          text: `💳 معاملتك المالية الأخيرة لشحن أو ترقية [${inv.plan_type || 'PRO'}] بمبلغ ${inv.amount} SAR تمت بنجاح ملوكي باهر!`,
          created_at: inv.created_at,
          isNew: false
        }))

        // 4. هندسة عمليات محرك الـ AI لتصبح تنبيهات تكتيكية مشوقة
        const formattedHistory = (historyData || []).map(hist => ({
          id: `hist-${hist.id}`,
          text: `🔥 اخترق محرك الذكاء الاصطناعي الخوارزميات وصاغ لك سكريبت تيك توك بنجاح عن: "${hist.topic || hist.prompt || 'فكرتك المخصصة'}"!`,
          created_at: hist.created_at,
          isNew: false
        }))

        // 5. حقن تنبيه نظامي سيادي ترحيبي ثابت ومصحح إملائياً 💎
        const systemWelcome = {
          id: 'sys-welcome',
          text: `⚡ تم مزامنة حسابك بنجاح. عداد الكوتا والتوكنز لباقتك الحالية [${(profile?.plan || 'FREE').toUpperCase()}] يعمل بأقصى طاقة استيعابية.`,
          created_at: new Date().toISOString(),
          isNew: true
        }

        // 6. دمج وترتيب كافة التنبيهات من الأحدث للأقدم تنازلياً
        const combinedNotifs = [...formattedInvoices, ...formattedHistory]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        setNotifications([systemWelcome, ...combinedNotifs].slice(0, 5))
      } catch (err) {
        console.error('❌ [Notification System Failure]:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveNotifications()
  }, [profile])

  const hasNew = notifications.some(n => n.isNew)

  const markAllAsRead = () => {
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
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col gap-1 cursor-pointer ${
                    item.isNew ? 'bg-blue-500/5 dark:bg-cyan-500/5' : 'bg-transparent'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
                  <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-600 font-sans">{formatRelativeTime(item.created_at)}</span>
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
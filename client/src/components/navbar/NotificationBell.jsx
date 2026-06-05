import React, { useState, useRef, useEffect, useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext.jsx'

export default function NotificationBell() {
  const { theme } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const notifications = [
    { id: 1, text: '🔥 أحد سكريبتاتك المحفوظة حقق تقييم 98% في محرك الفايرال الاستراتيجي!', time: 'منذ 10 دقائق', isNew: true },
    { id: 2, text: '⚡ تم شحن وتصفير عداد الكوتا اليومي لباقتك تلقائياً وبنجاح.', time: 'منذ ساعتين', isNew: false },
    { id: 3, text: '💳 معاملتك المالية الأخيرة عبر بوابة دفع ميسر تمت بنجاح ملوكي باهر.', time: 'منذ يوم', isNew: false }
  ]

  const hasNew = notifications.some(n => n.isNew)

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
      
      {/* زر الضغط التفاعلي للأيقونة - محول لـ SVG معالج المنحنيات بالكامل */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all relative active:scale-95"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {hasNew && (
          <span className="absolute top-2 left-2.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-950 animate-pulse" />
        )}
      </button>

      {/* لوحة القائمة المنسدلة للإشعارات - متوافقة بالكامل مع المظهر السيبراني الداكن لـ TrendAura */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-scale-up text-right dir-rtl">
          <div className="p-3.5 border-b border-slate-900 flex items-center justify-between">
            <span className="text-xs font-black text-white">مركز تنبيهات المنظومة</span>
            <span className="text-[8px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md uppercase font-sans">Live System</span>
          </div>

          <div className="divide-y divide-slate-900 max-h-64 overflow-y-auto scrollbar-none">
            {notifications.map((item) => (
              <div 
                key={item.id} 
                className={`p-3.5 hover:bg-slate-900/60 transition-colors flex flex-col gap-1 cursor-pointer ${
                  item.isNew ? 'bg-blue-500/5' : 'bg-transparent'
                }`}
              >
                <p className="text-[11px] font-bold text-slate-300 leading-relaxed">{item.text}</p>
                <span className="text-[9px] font-semibold text-slate-600 font-sans">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-slate-900 text-center">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 rounded-lg text-[9px] font-black text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 transition-colors"
            >
              إغلاق لوحة التنبيهات
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
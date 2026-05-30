import React, { useState, useRef, useEffect } from 'react'

/**
 * TrendAura Premium Notification Core Dropdown
 * Handles dismissible real-time telemetry warnings and subscription updates.
 */
export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // إشعارات محاكاة حية متناسقة مع طبيعة عمليات التطبيق
  const notifications = [
    { id: 1, text: '🔥 أحد سكريبتاتك المحفوظة حقق تقييم 98% في محرك الفايرال!', time: 'منذ 10 دقائق', isNew: true },
    { id: 2, text: '⚡ تم شحن وتصفير عداد التوكنز اليومي لباقتك تلقائياً.', time: 'منذ ساعتين', isNew: false },
    { id: 3, text: '💳 معامتلك المالية الأخيرة عبر مدى تمت بنجاح ملوكي باهر.', time: 'منذ يوم', isNew: false }
  ]

  const hasNew = notifications.some(n => n.isNew)

  // إغلاق القائمة المنسدلة تلقائياً عند الضغط خارج حيز المكون في الشاشة
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
      {/* زر الضغط التفاعلي للأيقونة */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all relative active:scale-95"
      >
        <span className="text-base">🔔</span>
        {/* شارة نيون عائمة عند وجود إشعار غير مقروء */}
        {hasNew && (
          <span className="absolute top-2 left-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
        )}
      </button>

      {/* لوحة القائمة المنسدلة للإشعارات */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 animate-scale-up text-right dir-rtl">
          <div className="p-3.5 border-b border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black text-slate-900">مركز تنبيهات المنظومة</span>
            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">جديد</span>
          </div>

          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto scrollbar-none">
            {notifications.map((item) => (
              <div 
                key={item.id} 
                className={`p-3.5 hover:bg-slate-50/70 transition-colors flex flex-col gap-1 cursor-pointer ${
                  item.isNew ? 'bg-blue-50/20' : 'bg-transparent'
                }`}
              >
                <p className="text-[11px] font-bold text-slate-600 leading-normal">{item.text}</p>
                <span className="text-[9px] font-semibold text-slate-300 font-sans">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-slate-50 text-center">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 rounded-lg text-[9px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              إغلاق اللوحة
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
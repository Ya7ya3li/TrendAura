import React from 'react'

export default function Support() {
  const supportChannels = [
    { 
      name: 'قناة تليجرام VIP', 
      desc: 'تحديثات حية وحلول سريعة واقتناص للترندات', 
      color: 'hover:border-sky-300 dark:hover:border-sky-500/40 bg-sky-50 dark:bg-sky-500/5 text-sky-600 dark:text-sky-400', 
      action: 'https://t.me/y33_w', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    },
    { 
      name: 'محادثة واتساب مباشرة', 
      desc: 'تواصل فوري مع الدعم الفني لحل مشاكلك', 
      color: 'hover:border-emerald-300 dark:hover:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400', 
      action: 'https://wa.me/your_number', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.734-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 1.981 14.062.96 11.435.96c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.463 3.39 1.337 4.875l-.999 3.648 3.744-.971z"/>
        </svg>
      )
    },
    { 
      name: 'البريد الإلكتروني المباشر', 
      desc: 'للاستفسارات الرسمية والمعاملات المالية', 
      color: 'hover:border-blue-300 dark:hover:border-blue-500/40 bg-blue-50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400', 
      action: 'mailto:support@trendaura.app',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'فتح تذكرة دعم ', 
      desc: 'متابعة حالة مشكلتك الفنية خطوة بخطوة مع فريقنا', 
      color: 'hover:border-purple-300 dark:hover:border-purple-500/40 bg-purple-50 dark:bg-purple-500/5 text-purple-600 dark:text-purple-400', 
      action: '#',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-6 text-right dir-rtl font-sans animate-fade-in transition-colors duration-300">
      <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800/60 transition-colors">
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
          مركز دعم المشتركين 24/7 
          <svg className="w-5 h-5 text-blue-600 dark:text-cyan-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </h1>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 transition-colors">مرحباً بك في الدعم الخاص؛ فريقنا متاح على مدار الساعة لخدمتك.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportChannels.map((channel, idx) => (
          <a 
            key={idx} 
            href={channel.action} 
            target="_blank" 
            rel="noreferrer"
            className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-transparent transition-all duration-300 flex items-center gap-4 group ${channel.color}`}
          >
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800/60 group-hover:scale-110 transition-all duration-300">
              {channel.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{channel.name}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors">{channel.desc}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
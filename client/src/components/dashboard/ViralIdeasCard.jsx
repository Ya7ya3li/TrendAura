import React, { useState, useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext' // 🧬 ربط شريان المظهر الموحد

/**
 * TrendAura Viral Ideas Content Suggestion Card - Deep Expansion Edition
 * Re-engineered to clear legacy alerts and inject a premium predictive trend explorer.
 */
export default function ViralIdeasCard({ onMoreClick }) {
  const { theme } = useContext(ThemeContext)
  const [showTrendsModal, setShowTrendsModal] = useState(false)

  const ideas = [
    'كيف تبني عادة يومية قوية',
    'طرق لزيادة التركيز',
    'سر النجاح اللي ما يخبرونك عنه',
    'أخطاء تمنعك من التطور',
    'كيف تستغل وقتك صح'
  ]

  // بنك الأفكار التوسيعي المتفجر الذي يعرض عند الضغط على "عرض المزيد"
  const extendedTrends = [
    { title: 'أسرار صناعة الفيديوهات القصيرة المنتشرة', tag: '🔥 صاعد جداً', volume: '140K مشاهدة/ساعة' },
    { title: 'كيف تضاعف إنتاجيتك باستخدام أدوات الـ AI', tag: '⚡ تكنولوجيا', volume: '95K مشاهدة/ساعة' },
    { title: 'أخطاء مالية قاتلة يقع فيها الشباب في العشرينات', tag: '💰 ثقافة مالية', volume: '210K مشاهدة/ساعة' },
    { title: 'روتين صباحي مدته 10 دقائق يغير يومك بالكامل', tag: '🌱 حياة صحية', volume: '80K مشاهدة/ساعة' },
    { title: 'لماذا تفشل خططك السنوية دائماً وكيف تحلها؟', tag: '🎯 تطوير ذات', volume: '115K مشاهدة/ساعة' }
  ]

  return (
    <>
      <div className={`w-full border rounded-[28px] p-5 shadow-xl select-none flex flex-col justify-between animate-fade-in transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40 text-white'
          : 'bg-white border-slate-100 shadow-slate-200/40 text-slate-800'
      }`}>
        <div>
          <div className={`flex items-center gap-2 mb-4 pb-2 border-b transition-colors ${
            theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
          }`}>
            <span className="text-sm text-amber-500">💡</span>
            <h3 className="text-xs font-black tracking-tight">أفكار ترند</h3>
          </div>

          {/* مصفوفة النصوص المطابقة للهوية البصرية بنقاء */}
          <div className="space-y-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {ideas.map((idea, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                onClick={() => setShowTrendsModal(true)}
              >
                <span className="text-[9px] text-slate-300 dark:text-purple-500">•</span>
                <p className="truncate text-slate-700 dark:text-slate-200">{idea}</p>
              </div>
            ))}
          </div>
        </div>

        {/* زر عرض المزيد المطور والمحمي من التنبيهات البدائية القديمة */}
        <button
          type="button"
          onClick={onMoreClick || (() => setShowTrendsModal(true))}
          className={`w-full text-center mt-5 pt-3 border-t text-[10px] font-black flex items-center justify-center gap-1.5 transition-colors ${
            theme === 'dark' 
              ? 'border-[#1f1438]/50 text-slate-400 hover:text-cyan-400' 
              : 'border-slate-50 text-slate-400 hover:text-blue-600'
          }`}
        >
          <span>عرض وتوسيع المزيد</span>
          <span className="text-xs font-sans">➔</span>
        </button>
      </div>

      {/* 🔮 لوحة استكشاف وتوسيع ألبوم الترندات الساخن المنبثق (Premium Trend Explorer Modal) */}
      {showTrendsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowTrendsModal(false)} />
          
          <div className={`relative w-full max-w-lg border rounded-3xl p-6 shadow-2xl transition-all animate-scale-up ${
            theme === 'dark' ? 'bg-[#0d071d]/95 border-[#1f1438] text-white' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1f1438]/50 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <div className="flex flex-col text-right">
                  <h4 className="text-xs font-black">ألبوم الترندات والأفكار اليومية الموسّع</h4>
                  <span className="text-[9px] text-slate-400">أفكار سريعة ومقترحة مخصصة لاكتساح الاكسبلور لحظياً</span>
                </div>
              </div>
              <button 
                onClick={() => setShowTrendsModal(false)}
                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* ألبوم الأفكار الموسع والمدعم بالمقاييس الرقمية الـ Premium */}
            <div className="space-y-3 text-right dir-rtl max-h-[350px] overflow-y-auto pr-1">
              {extendedTrends.map((trend, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl border flex flex-col gap-1.5 transition-all ${
                    theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]/60 hover:border-cyan-500/30' : 'bg-slate-50 border-slate-100 hover:border-blue-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black ${
                      theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {trend.tag}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">{trend.volume}</span>
                  </div>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-normal">{trend.title}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTrendsModal(false)}
              className="w-full mt-5 py-2.5 bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-900 font-black text-[11px] rounded-xl transition-all active:scale-95"
            >
              إغلاق قائمة الإلهام ✦
            </button>
          </div>
        </div>
      )}
    </>
  )
}
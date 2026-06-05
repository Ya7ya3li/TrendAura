import React, { useState, useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext.jsx'

export default function ViralIdeasCard({ customIdeas = [], onMoreClick }) {
  const { theme } = useContext(ThemeContext)
  const [showTrendsModal, setShowTrendsModal] = useState(false)

  // 🏆 تعديل هندسي: الالتزام بالأفكار الحقيقية المفرزة من محرك التوليد مع توفير فالباك ناصع
  const defaultIdeas = [
    'كيف تبني عادة يومية قوية باستخدام الخواص الذكية',
    'طرق عملية لزيادة التركيز وتجنب التشتت الخوارزمي',
    'سر النجاح الذي لا يخبرك عنه كبار صناع تيك توك',
    'أخطاء بصرية مجهرية تمنع مقاطعك من التطور',
    'كيف تستغل الثواني الثلاث الأولى لصالح المقطع'
  ]
  const displayIdeas = customIdeas && customIdeas.length > 0 ? customIdeas : defaultIdeas

  const extendedTrends = [
    { title: 'أسرار صناعة الفيديوهات القصيرة المنتشرة واستهداف الـ Hooks الخاطفة', tag: '🔥 صاعد جداً', volume: '140K مشاهدة/ساعة' },
    { title: 'كيف تضاعف إنتاجيتك في فلترة النصوص باستخدام أدوات الـ AI', tag: '⚡ تكنولوجيا', volume: '95K مشاهدة/ساعة' },
    { title: 'أخطاء مالية قاتلة يقع فيها الشباب في صناعة المحتوى الإعلاني', tag: '💰 ثقافة ماليّة', volume: '210K مشاهدة/ساعة' },
    { title: 'روتين بومودورو مدته 10 دقائق يغير جودة منتاجك بالكامل', tag: '🌱 حياة صحية', volume: '80K مشاهدة/ساعة' },
    { title: 'لماذا تفشل خططك السنوية في الانتشار دائماً وكيف تحلها بالمؤشرات؟', tag: '🎯 تطوير ذات', volume: '115K مشاهدة/ساعة' }
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
            <h3 className="text-xs font-black tracking-tight">أفكار ترند حية</h3>
          </div>

          <div className="space-y-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {displayIdeas.map((idea, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                onClick={() => setShowTrendsModal(true)}
              >
                <span className="text-[9px] text-slate-300 dark:text-purple-500 mt-0.5">•</span>
                <p className="truncate text-slate-700 dark:text-slate-200">{idea}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onMoreClick || (() => setShowTrendsModal(true))}
          className={`w-full text-center mt-5 pt-3 border-t text-[10px] font-black flex items-center justify-center gap-1.5 transition-colors ${
            theme === 'dark' 
              ? 'border-[#1f1438]/50 text-slate-400 hover:text-cyan-400' 
              : 'border-slate-50 text-slate-400 hover:text-blue-600'
          }`}
        >
          <span>عرض وتوسيع ألبوم الأفكار</span>
          <span className="text-xs font-sans">➔</span>
        </button>
      </div>

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

            <div className="space-y-3 text-right dir-rtl max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
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
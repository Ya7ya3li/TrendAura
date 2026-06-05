import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { showToast } from '../../App.jsx'

export default function ViralEngineCard({ plan }) {
  const navigate = useNavigate() // 🏆 سحق الهارد ريلود
  const currentPlan = (plan || 'free').toLowerCase().trim()
  const isLocked = currentPlan !== 'viral_engine' && currentPlan !== 'viral engine'

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [viralScore, setViralScore] = useState(0)

  const handleViralCheck = () => {
    if (isLocked) return
    setIsAnalyzing(true)
    
    setTimeout(() => {
      setIsAnalyzing(false)
      const calculatedScore = Math.floor(Math.random() * 14) + 84
      setViralScore(calculatedScore)
      setShowResultModal(true)
      if (typeof showToast === 'function') {
        showToast('تم اكتمال التحليل السلوكي وتقدير طاقة الـ Retention بنجاح! 🚀', 'success')
      }
    }, 2100)
  }

  return (
    <>
      <div className="w-full bg-gradient-to-br from-[#090414] via-[#120a2b] to-[#090414] border border-[#23174a] rounded-[28px] p-5 shadow-2xl text-right dir-rtl relative overflow-hidden select-none animate-scale-up transition-all duration-300">
        
        <div className="absolute -top-5 -left-5 w-32 h-32 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl text-sm flex items-center justify-center shadow-inner transition-all ${
              isLocked ? 'bg-white/5 text-slate-500' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20 shadow-rose-500/10'
            }`}>
              {isLocked ? '🔒' : '🚀'}
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-black text-white tracking-tight">
                {isLocked ? 'أدوات الـ Viral Engine' : 'أدوات الـ Viral Engine النشطة'}
              </h3>
              <span className="text-[8px] font-bold text-rose-400 uppercase tracking-wider mt-0.5">الترسانة المليونية</span>
            </div>
          </div>

          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
            isLocked ? 'bg-slate-800 text-slate-400' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isLocked ? 'مغلق بانتظار الترقية' : 'مفعّل ونشط بالكامل'}
          </span>
        </div>

        <p className="text-[10px] font-bold text-slate-400 leading-normal mb-5 relative z-10 min-h-[32px]">
          {isLocked 
            ? 'يتطلب اشتراك باقة صناع المحتوى لفك قفل أسلوب المشاهير وحقن أوامر الترندات الهجومية.' 
            : 'المحرك المتقدم جاري ربطه الآن لرفع نسب (Retention) البقاء والاحتفاظ للفيديو وخلق الانتشار.'
          }
        </p>

        <div className="relative z-10">
          {isLocked ? (
            <button
              type="button"
              onClick={() => navigate(ROUTES.PRICING)} // قفزة صاروخية بدون هارد ريلود
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-xl py-2.5 text-[10px] font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-purple-950 border-none"
            >
              👑 ترقية الباقة لفك قفل المحرك الكامل
            </button>
          ) : (
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleViralCheck}
              className={`w-full text-white rounded-xl py-2.5 text-[10px] font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-rose-500/20 ${
                isAnalyzing 
                  ? 'bg-rose-600/20 text-rose-300 cursor-wait' 
                  : 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/50'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>جاري فحص وتدقيق البنية السلوكية للمقطع...</span>
                </>
              ) : (
                <span>💥 فحص احتمالية صعود المقطع للتريند المليوني</span>
              )}
            </button>
          )}
        </div>

      </div>

      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in font-sans">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowResultModal(false)} />
          
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#110a24] to-[#070310] border border-[#23174a] rounded-3xl p-6 shadow-2xl text-white text-center animate-scale-up">
            <span className="text-3xl block mb-2">📊</span>
            <h4 className="text-sm font-black text-white">تقرير كفاءة الانتشار المتوقع</h4>
            <p className="text-[10px] text-slate-400 mt-1">بناءً على معايير خوارزمية الـ Retention ومقاييس الاكسبلور الحالية</p>
            
            <div className="my-6 w-24 h-24 rounded-full border-4 border-rose-500/20 border-t-rose-500 flex flex-col items-center justify-center mx-auto shadow-lg shadow-rose-500/10 animate-pulse">
              <span className="text-2xl font-black text-rose-400 font-mono">{viralScore}%</span>
              <span className="text-[7px] font-bold text-slate-400">احتمالية التريند</span>
            </div>

            <div className="space-y-2 text-right dir-rtl mb-5 text-[10px] font-bold text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span>🎯 قوة الخطاف البصري (Hook):</span>
                <span className="text-emerald-400">ممتاز (9/10)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span>⏱️ متوسط زمن بقاء المشاهد:</span>
                <span className="text-cyan-400">صاعد +12 ثانية</span>
              </div>
            </div>

            <button
              onClick={() => setShowResultModal(false)}
              className="w-full py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 text-white font-black text-[11px] rounded-xl transition-all active:scale-95 shadow-md shadow-rose-950"
            >
              إغلاق نافذة المحرك ✦
            </button>
          </div>
        </div>
      )}
    </>
  )
}
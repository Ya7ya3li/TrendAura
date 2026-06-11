import React, { useState } from 'react'

export default function ViralEngineCard({ plan, scriptText }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  // 🚀 الاتصال الحقيقي بالسيرفر وفحص النص حياً
  const handleStartAnalysis = async () => {
    if (!scriptText) {
      alert("فضلاً اكتب فكرتك أو ولد سكريبت أولاً ليتمكن المحرك من فصحه حقيقياً!")
      return
    }
    
    setIsAnalyzing(true)
    setErrorMsg('')
    setAnalysisData(null)
    
    try {
      // 🏆 تم ضبط المسار ليتطابق بالملي مع راوت الباك إند الموحد
      const response = await fetch('http://localhost:5000/api/ai/analyze-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scriptText: scriptText })
      })

      const result = await response.json()

      if (result.success && result.data) {
        setAnalysisData(result.data) 
      } else {
        setErrorMsg(result.message || 'فشل جلب التحليل من السيرفر.')
      }
    } catch (err) {
      console.error("❌ [Fetch Analysis Error]:", err)
      setErrorMsg('عذراً، تعذر الاتصال بمحرك الفحص الفيروسي حالياً.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="w-full bg-slate-950/40 border border-slate-900 rounded-[28px] p-6 shadow-2xl backdrop-blur-md text-right dir-rtl font-sans transition-all duration-300">
      
      {/* 🔹 عنوان القسم */}
      <div className="text-center mb-6 flex flex-col items-center justify-center">
        <h2 className="text-base font-black text-white flex items-center justify-center gap-2 mb-1">
          <span>أدوات الـ Viral Engine النشطة</span>
          {/* SVG Rocket */}
          <svg className="w-5 h-5 text-indigo-500 animate-pulse shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5c.7-.7 1.5-1 2.5-1 .3 1-.1 1.8-.7 2.5M11.5 12.5l-4-4m1.5 9.5a13.9 13.9 0 005.5-2.5l4-4c1.1-1.1 1.7-2.6 1.5-4.2a4 4 0 00-4.3-4.3c-1.5-.2-3 .4-4.1 1.5l-4 4a13.9 13.9 0 00-2.6 5.5l-.5 2.5 2.5-.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l-3 3m0 0a1 1 0 01-1.5-1.5L7.5 14M4.5 19.5h.01" />
          </svg>
        </h2>
        <p className="text-[10px] font-bold text-slate-400 max-w-[320px] mx-auto leading-relaxed mt-1">
          حسّن مقاطعك من خلال تحليلنا المتقدم والمدعوم بالذكاء الاصطناعي للهوكس والاحتفاظ الجماهيري الحقيقي.
        </p>
      </div>

      {/* 🔹 زر الفحص */}
      <div className="w-full mb-6">
        <button
          type="button"
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          className={`w-full py-3.5 rounded-2xl text-xs font-black text-white transition-all duration-300 cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
            isAnalyzing 
              ? 'bg-slate-800 border border-slate-700/40 text-slate-500 cursor-wait' 
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-900/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>جاري تشريح السكريبت وقراءة الـ Hook...</span>
            </>
          ) : (
            <>
              <span>فحص السكريبت وتحليل Viral الحقيقي</span>
              {/* SVG Flame */}
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14l-1.121 2.121z" />
              </svg>
            </>
          )}
        </button>

        {/* 🛡️ إشعار حالة السكريبت (تم سحق الإيموجيز القديمة وحقن الـ SVGs بالملي هنا) */}
        <div className="mt-3 flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/30 border border-slate-900 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${scriptText ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            حالة السكريبت الجاري:
          </span>
          <span className="flex items-center gap-1.5 font-black">
            {scriptText ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">محمل وجاهز للتشريح</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-rose-400">فارغ</span>
              </>
            )}
          </span>
        </div>

        {errorMsg && (
          <p className="mt-2 text-[10px] font-bold text-rose-500 text-center">{errorMsg}</p>
        )}
      </div>

      {/* 🔹 📊 عرض تقرير التحليل من الـ API */}
      {analysisData && (
        <div className="w-full space-y-5 animate-fade-in">
          
          {/* كارت المؤشرات */}
          <div className="border border-indigo-500/20 rounded-[24px] p-5 bg-slate-900/20 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <h3 className="text-xs font-black text-white flex items-center gap-2 mb-4 border-b border-slate-900 pb-2">
              {/* SVG Report Chart */}
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>تقرير تحليل ViralEngine الذكي لـ سكريبتك</span>
            </h3>

            <div className="space-y-4">
              {/* احتمالية الصعود */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <span>احتمالية الصعود للتريند:</span>
                </span>
                <span className="text-xs font-black text-blue-400 tracking-wider">{analysisData.trendProbability}%</span>
              </div>

              {/* معدل الاحتفاظ */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>معدل الاحتفاظ المتوقع:</span>
                </span>
                <span className="text-xs font-black text-cyan-400 tracking-wider">{analysisData.retentionRate}%</span>
              </div>

              {/* قوة الهوك */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span>تصنيف قوة الهوك:</span>
                </span>
                <span className="text-[11px] font-black text-indigo-400">{analysisData.hookStrength}</span>
              </div>

              {/* تقييم الـ CTA */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>تقييم الـ CTA الخاتمة:</span>
                </span>
                <span className="text-[11px] font-black text-emerald-400">{analysisData.ctaRating}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end">
              <span className="px-3 py-1 rounded-lg text-[9px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md flex items-center gap-1">
                <svg className="w-3 h-3 text-slate-950" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                <span>تحليل دقيق حقيقي</span>
              </span>
            </div>
          </div>

          {/* كارت نصائح الهندسة */}
          <div className="border border-slate-900 rounded-[24px] p-5 bg-slate-900/10 backdrop-blur-sm">
            <h3 className="text-xs font-black text-white flex items-center gap-2 mb-3">
              {/* SVG Lightbulb */}
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>نصائح هندسة ViralEngine المخصصة لك:</span>
            </h3>
            
            <ul className="space-y-3 text-right">
              {analysisData.tips && analysisData.tips.map((tip, index) => (
                <li key={index} className="text-[10px] font-medium text-slate-300 leading-relaxed relative pr-4 before:content-[''] before:absolute before:right-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-indigo-500 before:rounded-full">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* حالة الانتظار قبل الضغط */}
      {!analysisData && !isAnalyzing && (
        <div className="w-full py-8 text-center border border-dashed border-slate-900 rounded-2xl bg-slate-950/20 flex flex-col items-center justify-center gap-2">
          {/* SVG Magic Scanner */}
          <svg className="w-7 h-7 text-slate-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          <p className="text-[10px] font-bold text-slate-500 max-w-[260px] leading-relaxed">
            اضغط على زر الفحص بالأعلى لإطلاق قوة المحرك الخارق الفعلي وكشف النسب الصادقة
          </p>
        </div>
      )}

    </div>
  )
}
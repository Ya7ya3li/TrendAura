import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import GeneratorBox from '../components/dashboard/GeneratorBox.jsx'
import ScriptCard from '../components/dashboard/ScriptCard.jsx'
import HashtagsCard from '../components/dashboard/HashtagsCard.jsx'
import BestTimeCard from '../components/dashboard/BestTimeCard.jsx'
import ViralIdeasCard from '../components/dashboard/ViralIdeasCard.jsx'
import ViralEngineCard from '../components/dashboard/ViralEngineCard.jsx'
import MobileResultSheet from '../components/mobile/MobileResultSheet.jsx'
import useAiGenerator from '../hooks/useAiGenerator.js'
import useResponsive from '../hooks/useResponsive.js'

export default function Dashboard() {
  const { profile, loading: authLoading } = useContext(AuthContext)
  const { prompt, setPrompt, loading: aiLoading, result, generateScript } = useAiGenerator()
  const { isMobile } = useResponsive()
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

  useEffect(() => {
    if (result && result.hook && result.script) {
      if (result.script !== 'تم صياغة السيناريو بنجاح.' && isMobile) {
        setIsMobileSheetOpen(true)
      }
    }
  }, [result, isMobile])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500 font-bold text-xs animate-pulse">
        جاري تحميل البيانات الملكية...
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto select-none animate-fade-in dir-rtl text-right font-sans">
      
      {/* الترويسة العليا للمستخدم */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-800/40">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            صناعة المحتوى بالذكاء الاصطناعي <span className="text-blue-500 dark:text-cyan-400">✦</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 mt-1">
            {profile?.full_name ? `أهلاً بك يا ${profile.full_name}، اكتب فكرتك المليونية وابدأ التوليد فوراً.` : 'اكتب فكرتك ودع المحرك الفايرال يصنع لك سكريبت يخترق الخوارزميات'}
          </p>
        </div>
      </div>

      {/* صندوق المدخلات الفاخر */}
      <div className="w-full mb-8">
        <GeneratorBox 
          prompt={prompt} 
          setPrompt={setPrompt} 
          loading={aiLoading} 
          onGenerate={generateScript} 
        />
      </div>

      {/* شبكة توزيع كروت النتائج والإحصائيات - لا تعرض الكروت مكررة على الجوال لمنع التشتت */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div className={`lg:col-span-1 h-full ${isMobile ? 'hidden' : 'block'}`}>
          <ScriptCard 
            hook={result?.hook} 
            script={result?.script} 
            cta={result?.cta} // ربط حقيقي مباشر مع مخرجات السيرفر
          />
        </div>

        <div className="flex flex-col gap-6">
          <HashtagsCard hashtags={result?.hashtags} />
          <BestTimeCard customTimes={result?.bestTimes} />
        </div>

        <div className="flex flex-col gap-6">
          <ViralIdeasCard customIdeas={result?.viralIdeas} />
          <ViralEngineCard plan={profile?.plan || 'free'} />
        </div>
      </div>

      {/* شاشة ورقة النتائج العائمة والخاصة بالجوال فقط لضمان تجربة مستخدم خرافية */}
      <MobileResultSheet 
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        hook={result?.hook}
        script={result?.script}
        hashtags={result?.hashtags}
      />

    </div>
  )
}
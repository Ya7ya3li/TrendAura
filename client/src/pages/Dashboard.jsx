import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import GeneratorBox from '../components/dashboard/GeneratorBox.jsx'
import ScriptCard from '../components/dashboard/ScriptCard.jsx'
import HashtagsCard from '../components/dashboard/HashtagsCard.jsx'
import BestTimeCard from '../components/dashboard/BestTimeCard.jsx'
import ViralIdeasCard from '../components/dashboard/ViralIdeasCard.jsx'
import ViralEngineCard from '../components/dashboard/ViralEngineCard.jsx'
import ProtectedFeature from '../components/common/ProtectedFeature.jsx' 
import useAiGenerator from '../hooks/useAiGenerator.js'

export default function Dashboard() {
  // 🚀 نأخذ فقط البروفايل، ولا نربط عرض اللوحة بأي لودينج فرعي هنا
  const { profile } = useContext(AuthContext)
  
  const { 
    prompt, 
    setPrompt, 
    loading: aiLoading, 
    result, 
    generateScript 
  } = useAiGenerator()

  const currentPlan = profile?.plan || 'free'

  return (
    <div className="w-full max-w-[1400px] mx-auto select-text animate-fade-in dir-rtl text-right font-sans">
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-900/60">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            صناعة المحتوى بالذكاء الاصطناعي <span className="text-blue-500 dark:text-cyan-400">✦</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 mt-1">
            {/* 🚀 الالتزام بالقاعدة الذهبية: لو الاسم لسه بالطريق، يظهر الفالباك الذكي فوراً بدون حجب الشاشة */}
            {profile?.full_name ? `أهلاً بك يا ${profile.full_name}، اكتب فكرتك المليونية وابدأ التوليد فوراً.` : 'اكتب فكرتك ودع المحرك الفايرال يصنع لك سكريبت يخترق الخوارزميات'}
          </p>
        </div>
      </div>

      <div className="w-full mb-8">
        <GeneratorBox prompt={prompt} setPrompt={setPrompt} loading={aiLoading} onGenerate={generateScript} />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 h-full block">
          <ScriptCard 
            hook={result?.hook} 
            script={result?.script} 
            cta={result?.cta} 
          />
        </div>

        <div className="flex flex-col gap-6">
          <ProtectedFeature minRequiredPlan="pro" featureName="الهاشتاقات الفايرال">
            <HashtagsCard hashtags={result?.hashtags} />
          </ProtectedFeature>
          <ProtectedFeature minRequiredPlan="pro" featureName="أفضل أوقات النشر">
            <BestTimeCard customTimes={result?.bestTimes || []} />
          </ProtectedFeature>
        </div>

        <div className="flex flex-col gap-6">
          <ProtectedFeature minRequiredPlan="viral_engine" featureName="أفكار المحتوى الفايرال">
            <ViralIdeasCard customIdeas={result?.viralIdeas || []} />
          </ProtectedFeature>
          <ProtectedFeature minRequiredPlan="viral_engine" featureName="محرك الفايرال الخارق">
            <ViralEngineCard plan={currentPlan} scriptText={result?.script} />
          </ProtectedFeature>
        </div>
      </div>
    </div>
  )
}
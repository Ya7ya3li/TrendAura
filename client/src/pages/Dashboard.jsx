import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { AuthContext } from '../context/AuthContext'
import GeneratorBox from '../components/dashboard/GeneratorBox'
import ScriptCard from '../components/dashboard/ScriptCard'
import HashtagsCard from '../components/dashboard/HashtagsCard'
import BestTimeCard from '../components/dashboard/BestTimeCard'
import ViralIdeasCard from '../components/dashboard/ViralIdeasCard'
import ViralEngineCard from '../components/dashboard/ViralEngineCard'
import useAiGenerator from '../hooks/useAiGenerator'

export default function Dashboard() {
  const { profile, loading: authLoading } = useContext(AuthContext)
  const { prompt, setPrompt, loading: aiLoading, result, generateScript } = useAiGenerator()

  // تم استبدال الـ Loader المعلق بـ نص بسيط يمنع تجميد الصفحة
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-bold text-xs">
        جاري تحميل البيانات...
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto select-none animate-fade-in dir-rtl text-right font-sans">
      
      {/* الترويسة */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-[#1f1438]/50">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            صناعة المحتوى بالذكاء الاصطناعي <span className="text-blue-600 dark:text-cyan-400">✦</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400">
            {profile?.full_name ? `أهلاً بك يا ${profile.full_name}، اكتب فكرتك وابدأ التوليد.` : 'اكتب فكرتك ودع الذكاء الاصطناعي يصنع لك سكريبت جاهز للانتشار'}
          </p>
        </div>
      </div>

      {/* صندوق المدخلات */}
      <div className="w-full mb-8">
        <GeneratorBox 
          prompt={prompt} 
          setPrompt={setPrompt} 
          loading={aiLoading} 
          onGenerate={generateScript} 
        />
      </div>

      {/* مصفوفة الشبكة */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 h-full">
          <ScriptCard 
            hook={result?.hook} 
            script={result?.script} 
            cta={result?.hook ? "إذا عجبك المحتوى لا تنسى اللايك والمتابعة" : ""}
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

    </div>
  )
}
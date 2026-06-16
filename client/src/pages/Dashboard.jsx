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
  const { profile } = useContext(AuthContext)
  const currentPlan = (profile?.plan || 'free').toLowerCase().trim()
  
  const { 
    prompt, 
    setPrompt, 
    loading: aiLoading, 
    result, 
    generateScript 
  } = useAiGenerator()

  const handleGenerationWithGate = async () => {
    // 🧠 بناء التوجيهات الخوارزمية الصارمة وتمريرها للهوك ليتصل بالسيرفر بناءً عليها حقيقياً
    let tierPromptInstructions = ''
    if (currentPlan === 'free') {
      tierPromptInstructions = 'اكتب سكربت قصير جداً ومحدود (30-45 ثانية فقط).'
    } else if (currentPlan === 'pro') {
      tierPromptInstructions = 'اكتب سكربت احترافي متكامل بأعلى جودة وعناوين جاذبة تخطف العين وتمنع التمرير.'
    } else if (currentPlan === 'viral_engine') {
      tierPromptInstructions = 'اكتب سكربت هجومي ناري مخصص وعميق (60-90 ثانية) يحاكي مشاهير التيك توك تماماً.'
    }

    await generateScript(tierPromptInstructions)
  }

  // ✂️ تطبيق مقص الحماية للبيانات (Slicing) لمنع التسريب للمجاني
  const displayedHashtags = currentPlan === 'free'
    ? (result?.hashtags ? result.hashtags.slice(0, 3) : [])  // عرض أول 3 هاشتاقات فقط للمجاني كعنصر تسويقي تحفيزي
    : (result?.hashtags ? result.hashtags.slice(0, 10) : []) 

  const displayedViralIdeas = currentPlan === 'free'
    ? (result?.viralIdeas ? result.viralIdeas.slice(0, 2) : [])  // فكرتين فقط للمجاني
    : (result?.viralIdeas ? result.viralIdeas.slice(0, 5) : []) 

  return (
    <div className="w-full max-w-[1400px] mx-auto select-text animate-fade-in dir-rtl text-right font-sans transition-colors duration-300">
      
      {/* ترويسة الصفحة مع حماية الألوان للوضعين الفاتح والغامق */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-900/60 transition-colors duration-300">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
            صناعة المحتوى بالذكاء الاصطناعي 
            <svg className="w-5 h-5 text-blue-600 dark:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 transition-colors">
            {profile?.full_name ? `أهلاً بك يا ${profile.full_name}، اكتب فكرتك المليونية وابدأ التوليد فوراً.` : 'اكتب فكرتك ودع المحرك يصنع لك سكريبت يخترق الخوارزميات'}
          </p>
        </div>
      </div>

      <div className="w-full mb-8">
        <GeneratorBox prompt={prompt} setPrompt={setPrompt} loading={aiLoading} onGenerate={handleGenerationWithGate} />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 h-full block">
          <ScriptCard 
            hook={result?.hook} 
            script={result?.script} 
            cta={result?.cta}
            showRegenerate={currentPlan !== 'free'} 
            onRegenerate={handleGenerationWithGate}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ProtectedFeature minRequiredPlan="pro" featureName="الهاشتاقات الفايرال">
            <HashtagsCard hashtags={displayedHashtags} />
            
            {/* بانر الترقية التحفيزي - تم ضبط ألوانه المزدوجة */}
            {currentPlan === 'free' && result?.hashtags?.length > 0 && (
              <div className="mt-3 text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 animate-pulse transition-colors duration-300">
                <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400 flex items-center justify-center gap-1.5 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  🔒 اشترك في باقة PRO VIP لفتح 7 هاشتاقات ترندية إضافية!
                </span>
              </div>
            )}
            
          </ProtectedFeature>
          <ProtectedFeature minRequiredPlan="pro" featureName="أفضل أوقات النشر">
            <BestTimeCard customTimes={result?.bestTimes || []} />
          </ProtectedFeature>
        </div>

        <div className="flex flex-col gap-6">
          <ProtectedFeature minRequiredPlan="viral_engine" featureName="أفكار المحتوى الفايرال">
            <ViralIdeasCard customIdeas={displayedViralIdeas} />
          </ProtectedFeature>
          <ProtectedFeature minRequiredPlan="viral_engine" featureName="محرك الفايرال الخارق">
            <ViralEngineCard plan={currentPlan} scriptText={result?.script} />
          </ProtectedFeature>
        </div>
      </div>
    </div>
  )
}
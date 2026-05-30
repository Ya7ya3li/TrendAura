import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { AuthContext } from '../context/AuthContext'
import GeneratorBox from '../components/dashboard/GeneratorBox'
import ScriptCard from '../components/dashboard/ScriptCard'
import HashtagsCard from '../components/dashboard/HashtagsCard'
import BestTimeCard from '../components/dashboard/BestTimeCard'
import ViralIdeasCard from '../components/dashboard/ViralIdeasCard'
import ViralEngineCard from '../components/dashboard/ViralEngineCard'
import useAiGenerator from '../hooks/useAiGenerator'

/**
 * TrendAura Central Operational Dashboard Hub - Clean Clean Edition
 * Pure pixel-perfect replication. Connected components to read active dynamic context records reactively.
 */
export default function Dashboard() {
  const { profile } = useContext(AuthContext)
  const { activeDashboardSection } = useContext(AppContext)
  
  // استدعاء محرك التوليد والربط اللحظي لضخ البيانات المتغيرة
  const { prompt, setPrompt, loading, result, generateScript } = useAiGenerator(profile?.id)

  return (
    <div className="w-full max-w-[1400px] mx-auto select-none animate-fade-in dir-rtl text-right font-sans">
      
      {/* 👑 أولاً: شريط الترويسة العلوي الفاخر */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-[#1f1438]/50">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            صناعة المحتوى بالذكاء الاصطناعي <span className="text-blue-600 dark:text-cyan-400">✦</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400">
            اكتب فكرتك، ودع الذكاء الاصطناعي يصنع لك سكريبت جاهز للانتشار
          </p>
        </div>
      </div>

      {/* 📝 ثانياً: صندوق المدخلات الكلاسيكي الفخم */}
      <div className="w-full mb-8">
        <GeneratorBox 
          prompt={prompt} 
          setPrompt={setPrompt} 
          loading={loading} 
          onGenerate={generateScript} 
        />
      </div>

      {/* 📊 ثالثاً: مصفوفة الشبكة الهندسية الثلاثية الحية 100% */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* العمود الأيمن: كرت السكريبت المستهدف */}
        <div className="lg:col-span-1 h-full">
          <ScriptCard 
            hook={result.hook || "90% من الناس ما يعرفون هذا السر المذهل..."}
            script={result.script || "في هذا الفيديو راح أشارك معك خطوة بخطوة كيف تقدر تطبق هذا السر وتحقق نتائج مذهلة في وقت قصير جداً!"}
            cta={result.hook ? "إذا عجبك المحتوى لا تنسى اللايك والمتابعة ومشاركة الفيديو" : ""}
          />
        </div>

        {/* العمود الأوسط: الهاشتاقات الحية + مواعيد النشر الديناميكية المتأثرة بالتوليد */}
        <div className="flex flex-col gap-6">
          <HashtagsCard hashtags={result.hashtags} />
          <BestTimeCard customTimes={result.bestTimes} />
        </div>

        {/* العمود الأيسر: أفكار الترند التفاعلية المخصصة لمجال الـ Prompt + كرت الفايرال */}
        <div className="flex flex-col gap-6">
          <ViralIdeasCard customIdeas={result.viralIdeas} />
          <ViralEngineCard plan={profile?.plan || 'free'} />
        </div>

      </div>

    </div>
  )
}
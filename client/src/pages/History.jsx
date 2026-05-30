import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext' // 🧬 حقن شريان المظهر العالمي
import { supabase } from '../config/supabase'
import { showToast } from '../App' // 🚀 نظام التنبيهات الفخم
import GlowCard from '../components/common/GlowCard'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import SectionTitle from '../components/common/SectionTitle'

/**
 * TrendAura Saved Scripts Archive & Analytics Hub - V2 Master Edition
 * Completely integrates total word telemetry, recent activity logs, and custom blueprint modules.
 */
export default function History() {
  const { user } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // حالة السكريبت النشط المختار حالياً للعرض داخل لوحة "السكريبت المولد"
  const [selectedScript, setSelectedScript] = useState(null)

  useEffect(() => {
    const loadSavedScripts = async () => {
      try {
        const { data, error } = await supabase
          .from('generated_scripts')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        const fetchedScripts = data || []
        setScripts(fetchedScripts)
        
        // تعيين أحدث سكريبت كعنصر فعال تلقائياً عند فتح الصفحة لملء الواجهة
        if (fetchedScripts.length > 0) {
          setSelectedScript(fetchedScripts[0])
        }
      } catch (err) {
        console.error('❌ [History Script Fetch Error]:', err.message)
        showToast('فشل نظام الأرشفة في جلب بيانات السجلات السحابية', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) loadSavedScripts()
  }, [user]) // 🎯 تم إصلاح القفلة هنا بإضافة الفاصلة الحارقة لمنع تعليق Vite!

  // 🧠 حساب المقاييس الرقمية والبيانات الفخرية ديناميكياً من مصفوفة السيرفر الحقيقية
  const totalWords = scripts.reduce((acc, item) => {
    const wordCount = item.content ? item.content.trim().split(/\s+/).length : 0
    return acc + wordCount
  }, 0)

  const lastActivity = scripts.length > 0 
    ? new Date(scripts[0].created_at).toLocaleDateString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    : 'لا يوجد نشاط'

  const latestTopic = scripts.length > 0 
    ? (scripts[0].prompt_summary || 'سيناريو غير مصنف') 
    : 'لا يوجد مواضيع'

  // دالة النسخ الاحترافية المربوطة بـ التنبيه الفخم بدل الـ alert
  const handleCopyScript = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    showToast('تم نسخ السيناريو بالكامل إلى ذاكرة الحافظة بنجاح ملوكي! 📋✨', 'success')
  }

  return (
    <div className={`w-full max-w-6xl mx-auto select-none dir-rtl text-right font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      
      {/* عنوان الترويسة الملوكي */}
      <SectionTitle 
        title="مستودع السكريبتات والأرشيف" 
        subtitle="استعرض إحصائيات صناعتك، وراقب كفاءة التوليد، وانسخ السيناريوهات التاريخية الفيروسية" 
        badge="الأرشيف والبيانات" 
      />

      {loading ? (
        <Loader label="جاري استرجاع مستودع البيانات وفك تشفير السجلات التاريخية..." />
      ) : scripts.length === 0 ? (
        <EmptyState 
          icon="📋" 
          title="سجل السكريبتات فارغ تماماً" 
          message="لم تقم بتوليد أو أرشفة أي سيناريو حتى الآن لعدم وجود اشتراك فعال أو توليدات جارية. توجه للرئيسية واصنع أول خطاف فايرال!" 
          actionText="توليد سكريبت الآن 🚀"
          onAction={() => window.location.href = '/dashboard'}
        />
      ) : (
        <div className="space-y-6">
          
          {/* 📊 أولاً: لوحة الكروت الإحصائية الثلاثية الفخمة المطابقة لمواصفاتك بالملّي */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* كرت: كلمة إجمالاً */}
            <div className={`border rounded-2xl p-4 shadow-sm transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'
            }`}>
              <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                <span className="text-xs">📝</span>
                <span className="text-[10px] font-black tracking-tight">كلمة إجمالاً</span>
              </div>
              <p className={`text-xl font-black font-mono ${theme === 'dark' ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]' : 'text-blue-600'}`}>
                {totalWords.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">كلمة AI</span>
              </p>
            </div>

            {/* كرت: آخر نشاط */}
            <div className={`border rounded-2xl p-4 shadow-sm transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'
            }`}>
              <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                <span className="text-xs">⚡</span>
                <span className="text-[10px] font-black tracking-tight">آخر نشاط</span>
              </div>
              <p className="text-xs font-black text-slate-700 dark:text-slate-200 truncate">
                {lastActivity}
              </p>
            </div>

            {/* كرت: أحدث موضوع */}
            <div className={`border rounded-2xl p-4 shadow-sm transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'
            }`}>
              <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                <span className="text-xs">🔥</span>
                <span className="text-[10px] font-black tracking-tight">أحدث موضوع</span>
              </div>
              <p className="text-xs font-black text-slate-700 dark:text-slate-200 truncate">
                {latestTopic}
              </p>
            </div>

          </div>

          {/* 🔗 ثانياً: مصفوفة الشبكة الثنائية المقسمة (سجل التوليدات + السكريبت المولد النشط) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            
            {/* 📋 العمود الأيمن (2 كتل): سجل السكريبت التوليدات */}
            <div className="lg:col-span-2 space-y-3 max-h-[550px] overflow-y-auto pr-1 scrollbar-none">
              <span className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                سجل السكريبت التوليدات ({scripts.length})
              </span>
              
              {scripts.map((item) => {
                const isActive = selectedScript?.id === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedScript(item)}
                    className={`p-4 rounded-2xl border text-right cursor-pointer transition-all active:scale-[0.99] ${
                      isActive
                        ? (theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-cyan-500/50 shadow-md'
                            : 'bg-blue-50/70 border-blue-500/30 shadow-sm')
                        : (theme === 'dark'
                            ? 'bg-[#160f30]/20 border-[#1f1438]/60 text-slate-300 hover:bg-[#160f30]/50'
                            : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50')
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 shrink-0">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
                        theme === 'dark' ? 'bg-[#0d071d] text-purple-300' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {new Date(item.created_at).toLocaleDateString('ar-SA')}
                      </span>
                      {isActive && <span className="text-[10px] text-blue-500 dark:text-cyan-400 animate-pulse">● فعال</span>}
                    </div>
                    <h4 className="text-xs font-black mt-2 truncate text-slate-900 dark:text-white">
                      {item.prompt_summary || 'سيناريو فيروسي مجهول'}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* 💎 العمود الأيسر (3 كتل): لوحة "سكريبت مولد" الكاملة والمتقدمة */}
            <div className="lg:col-span-3 h-full">
              <span className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">
                معاينة وقراءة السكريبت المولد الفعال ➔
              </span>

              {selectedScript ? (
                <div className={`border rounded-[28px] p-5 shadow-xl flex flex-col h-full transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#160f30]/40 border-[#1f1438] shadow-black/40 text-white'
                    : 'bg-white border-slate-100 shadow-slate-200/40 text-slate-800'
                }`}>
                  {/* ترويسة كرت المعاينة */}
                  <div className={`flex items-center justify-between border-b pb-3 mb-4 shrink-0 transition-colors ${
                    theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">💎</span>
                      <h3 className="text-xs font-black tracking-tight truncate max-w-[180px]">
                        {selectedScript.prompt_summary || 'مراجعة المخطط التوليدي'}
                      </h3>
                    </div>
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${
                      theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {selectedScript.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>

                  {/* كتلة النص المولد الكامل مفروداً داخل وعاء زجاجي مريح جداً للقراءة */}
                  <div className={`p-4 rounded-xl border text-xs font-bold leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto pr-1 select-text ${
                    theme === 'dark' ? 'bg-[#0d071d]/60 border-[#1f1438] text-slate-200' : 'bg-slate-50/60 border-slate-100 text-slate-700'
                  }`}>
                    {selectedScript.content}
                  </div>

                  {/* أزرار نسخ السكريبت المولد النشط */}
                  <div className={`flex items-center gap-2 border-t pt-3 mt-4 shrink-0 transition-colors ${
                    theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-50'
                  }`}>
                    <button
                      type="button"
                      onClick={() => handleCopyScript(selectedScript.content)}
                      className={`w-full py-2.5 rounded-xl text-[10px] font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-950'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                      }`}
                    >
                      📋 نسخ السيناريو المولد بالكامل
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs font-bold">
                  قم باختيار أحد عناصر السجل من القائمة الجانبية لقراءة تفاصيل السكريبت.
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  )
}
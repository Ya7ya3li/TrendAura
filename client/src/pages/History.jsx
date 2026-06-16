import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { supabase } from '../config/supabase.js'
import { ROUTES } from '../constants/routes.js'
import { showToast } from '../App.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'

export default function History() {
  const navigate = useNavigate()
  const { user, profile } = useContext(AuthContext)
  
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedScript, setSelectedScript] = useState(null)

  const currentPlan = (profile?.plan || 'free').toLowerCase().trim()

  // 🔒 طبقة حماية برمجية داخلية ثانية لمنع دخول المجاني عبر كتابة الرابط يدوياً بالمتصفح
  if (currentPlan === 'free') {
    return <Navigate to={ROUTES.PRICING} replace />
  }

  useEffect(() => {
    const loadSavedScripts = async () => {
      try {
        const { data, error } = await supabase
            .from('scripts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        if (error) throw error
        
        const fetchedScripts = data || []
        setScripts(fetchedScripts)
        
        if (fetchedScripts.length > 0) {
          setSelectedScript(fetchedScripts[0])
        }
      } catch (err) {
        console.error('❌ [History Script Fetch Error]:', err.message)
        if (typeof showToast === 'function') showToast('فشل جلب أرشيف البيانات', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) loadSavedScripts()
  }, [user])

  const totalWords = scripts.reduce((acc, item) => {
    const text = `${item.hook || ''} ${item.script || ''} ${item.cta || ''}`
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    return acc + wordCount
  }, 0)

  const lastActivity = scripts.length > 0 
    ? new Date(scripts[0].created_at).toLocaleDateString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    : 'لا يوجد نشاط'

  const latestTopic = scripts.length > 0
    ? (scripts[0].hook || 'سيناريو غير مصنف')
    : 'لا يوجد مواضيع'

  const handleCopyScript = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    if (typeof showToast === 'function') showToast('تم نسخ السيناريو بنجاح! 📋✨', 'success')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500 font-bold text-xs animate-pulse">
        جاري تحميل مستودع السجلات والمحفوظات...
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto select-none dir-rtl text-right font-sans transition-colors duration-300 text-slate-900 dark:text-slate-100">
      
      <SectionTitle 
        title="مستودع السكريبتات والأرشيف" 
        subtitle="استعرض إحصائيات صناعتك، وراقب كفاءة التوليد" 
        badge="الأرشيف والبيانات" 
      />

      {scripts.length === 0 ? (
        <EmptyState 
          icon={
            <svg className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          } 
          title="سجل السكريبتات فارغ" 
          message="لم تقم بتوليد أو أرشفة أي سيناريو حتى الآن." 
          actionText="توليد سكريبت الآن "
          onAction={() => navigate(ROUTES.DASHBOARD)} 
        />
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-2xl p-4 transition-colors duration-300 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 transition-colors">
                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                ... الكلمات المكتوبة
              </span>
              <p className="text-xl font-black text-blue-600 dark:text-cyan-400 mt-1 transition-colors">{totalWords.toLocaleString()}</p>
            </div>
            <div className="border rounded-2xl p-4 transition-colors duration-300 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 transition-colors">
                <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                آخر نشاط
              </span>
              <p className="text-xs font-black truncate text-slate-600 dark:text-slate-400 mt-2 font-sans transition-colors">{lastActivity}</p>
            </div>
            <div className="border rounded-2xl p-4 transition-colors duration-300 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 transition-colors">
                <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16" /></svg>
                أحدث موضوع
              </span>
              <p className="text-xs font-black truncate text-slate-600 dark:text-slate-400 mt-2 transition-colors">{latestTopic}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-3 max-h-[550px] overflow-y-auto scrollbar-thin">
              {scripts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedScript(item)} 
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    selectedScript?.id === item.id 
                      ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <h4 className="text-xs font-black truncate flex items-center gap-2 text-slate-800 dark:text-slate-200 transition-colors">
                    <svg className={`w-3.5 h-3.5 shrink-0 transition-colors ${selectedScript?.id === item.id ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    {item.hook}
                  </h4>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              {selectedScript ? (
                <div className="border rounded-[28px] p-5 h-full flex flex-col justify-between transition-colors duration-300 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60">
                  <div className="p-4 rounded-xl border text-xs whitespace-pre-wrap max-h-[380px] overflow-y-auto transition-colors duration-300 bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/40 text-slate-700 dark:text-slate-300">
                    {`${selectedScript.hook || ''}\n\n${selectedScript.script || ''}\n\n${selectedScript.cta || ''}`}
                  </div>
                  <button 
                    onClick={() => handleCopyScript(`${selectedScript.hook || ''}\n\n${selectedScript.script || ''}\n\n${selectedScript.cta || ''}`)} 
                    className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-2 4h5m0 0l-2-2m2 2l-2 2" /></svg>
                    نسخ السيناريو 
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
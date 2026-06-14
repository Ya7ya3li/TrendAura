import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { supabase } from '../config/supabase.js'
import { ROUTES } from '../constants/routes.js'
import { showToast } from '../App.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'

export default function History() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedScript, setSelectedScript] = useState(null)

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
    <div className={`w-full max-w-6xl mx-auto select-none dir-rtl text-right font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      
      <SectionTitle 
        title="مستودع السكريبتات والأرشيف" 
        subtitle="استعرض إحصائيات صناعتك، وراقب كفاءة التوليد" 
        badge="الأرشيف والبيانات" 
      />

      {scripts.length === 0 ? (
        <EmptyState 
          icon="📋" 
          title="سجل السكريبتات فارغ" 
          message="لم تقم بتوليد أو أرشفة أي سيناريو حتى الآن." 
          actionText="توليد سكريبت الآن 🚀"
          onAction={() => navigate(ROUTES.DASHBOARD)} // سحق الهارد ريلود
        />
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-2xl p-4 ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] font-black text-slate-500">كلمة إجمالاً</span>
              <p className="text-xl font-black text-blue-500 dark:text-cyan-400">{totalWords.toLocaleString()}</p>
            </div>
            <div className={`border rounded-2xl p-4 ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] font-black text-slate-500">آخر نشاط</span>
              <p className="text-xs font-black truncate text-slate-300">{lastActivity}</p>
            </div>
            <div className={`border rounded-2xl p-4 ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] font-black text-slate-500">أحدث موضوع</span>
              <p className="text-xs font-black truncate text-slate-300">{latestTopic}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-3 max-h-[550px] overflow-y-auto scrollbar-thin">
              {scripts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedScript(item)} 
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedScript?.id === item.id 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : (theme === 'dark' ? 'border-slate-800 bg-slate-900/20 hover:bg-slate-900/40' : 'border-slate-100 bg-white hover:bg-slate-50')
                  }`}
                >
                  <h4 className="text-xs font-black truncate">
                     {item.hook}
                  </h4>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              {selectedScript ? (
                <div className={`border rounded-[28px] p-5 h-full flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-100'}`}>
                  <div className={`p-4 rounded-xl border text-xs whitespace-pre-wrap max-h-[380px] overflow-y-auto ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/40 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                    {`${selectedScript.hook || ''}

                    ${selectedScript.script || ''}

                    ${selectedScript.cta || ''}`}
                  </div>
                  <button 
                    onClick={() =>
                     handleCopyScript(
                   `${selectedScript.hook || ''}

                    ${selectedScript.script || ''}

                    ${selectedScript.cta || ''}`
                      )
                    } 
                    className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all active:scale-[0.99]"
                  >
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
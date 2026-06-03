import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import { supabase } from '../config/supabase'
import { showToast } from '../App'
import EmptyState from '../components/common/EmptyState'
import SectionTitle from '../components/common/SectionTitle'

export default function History() {
  const { user } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
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
        
        if (fetchedScripts.length > 0) {
          setSelectedScript(fetchedScripts[0])
        }
      } catch (err) {
        console.error('❌ [History Script Fetch Error]:', err.message)
        showToast('فشل جلب البيانات', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) loadSavedScripts()
  }, [user])

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

  const handleCopyScript = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    showToast('تم نسخ السيناريو بنجاح! 📋✨', 'success')
  }

  // 🛡️ فك ارتباط الـ Loader المعلق
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-bold text-xs">
        جاري تحميل مستودع السجلات...
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
          onAction={() => window.location.href = '/dashboard'}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-2xl p-4 ${theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] font-black text-slate-400">كلمة إجمالاً</span>
              <p className="text-xl font-black text-blue-600">{totalWords.toLocaleString()}</p>
            </div>
            <div className={`border rounded-2xl p-4 ${theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] font-black text-slate-400">آخر نشاط</span>
              <p className="text-xs font-black truncate">{lastActivity}</p>
            </div>
            <div className={`border rounded-2xl p-4 ${theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'}`}>
              <span className="text-[10px] font-black text-slate-400">أحدث موضوع</span>
              <p className="text-xs font-black truncate">{latestTopic}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-3 max-h-[550px] overflow-y-auto">
              {scripts.map((item) => (
                <div key={item.id} onClick={() => setSelectedScript(item)} className={`p-4 rounded-2xl border cursor-pointer ${selectedScript?.id === item.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100'}`}>
                  <h4 className="text-xs font-black truncate">{item.prompt_summary}</h4>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              {selectedScript ? (
                <div className={`border rounded-[28px] p-5 h-full ${theme === 'dark' ? 'bg-[#160f30]/40' : 'bg-white'}`}>
                  <div className="p-4 rounded-xl border text-xs whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                    {selectedScript.content}
                  </div>
                  <button onClick={() => handleCopyScript(selectedScript.content)} className="w-full py-2.5 mt-4 rounded-xl bg-slate-900 text-white text-[10px] font-black">
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
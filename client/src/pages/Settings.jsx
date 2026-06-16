import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx' 
import { supabase } from '../config/supabase.js' 
import { ROUTES } from '../constants/routes.js' 
import ProfileSettings from '../components/settings/ProfileSettings.jsx'
import ThemeSettings from '../components/settings/ThemeSettings.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'
import { showToast } from '../App.jsx'

export default function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useContext(AuthContext) 

  // 🔒 محرك الحذف الشامل
  const handleDeleteAllScripts = async () => {
    const confirmDelete = window.confirm('تحذير صارم: هل أنت متأكد من تصفير مستودع السكريبتات؟ هذا الإجراء نهائي ولا يمكن استرجاعه.')
    if (!confirmDelete) return

    try {
      setIsDeleting(true)

      const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('user_id', user?.id)

      if (error) throw error

      if (typeof showToast === 'function') {
        showToast('تم مسح مستودع السكريبتات بنجاح 🗑️', 'success')
      }

      navigate(ROUTES.HISTORY || '/history')
    } catch (err) {
      console.error('❌ [Fatal Settings Delete Error]:', err.message)
      if (typeof showToast === 'function') showToast('فشل حذف السكربتات من الخادم', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const cardClass = "bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[32px] p-8 shadow-lg dark:shadow-2xl transition-colors duration-300"

  const settingsTabs = [
    { 
      id: 'profile', 
      label: 'البروفايل',
      icon: (
        <svg className="w-3.5 h-3.5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'theme', 
      label: 'المظهر',
      icon: (
        <svg className="w-3.5 h-3.5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.344l2.122-2.121a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <SectionTitle title="إعدادات الحساب" subtitle="تكوين الهوية الشخصية وتفضيلات المظهر " badge="System Config" />

      <div className="flex items-center gap-4 mb-8">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black transition-all flex items-center gap-2 group ${              
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`}          
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={cardClass}>
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <ProfileSettings />
            
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
              <div>
                <h4 className="text-xs font-black text-rose-600 dark:text-rose-400 transition-colors">منطقة التحكم </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 transition-colors">مسح نهائي لكامل محتوى السكريبتات المؤرشفة.</p>
              </div>
              <button
                type="button"
                onClick={handleDeleteAllScripts}
                disabled={isDeleting}
                className="px-6 py-3 bg-rose-50 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/40 hover:bg-rose-600 hover:border-rose-600 text-rose-600 dark:text-rose-400 hover:text-white text-[10px] font-black rounded-full transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              >
                {isDeleting ? (
                  <span>جاري التطهير...</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>مسح الأرشيف نهائياً</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'theme' && <ThemeSettings />}
      </div>
    </div>
  )
}
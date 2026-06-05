import React, { useContext, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext.jsx'
import ProfileSettings from '../components/settings/ProfileSettings.jsx'
import ThemeSettings from '../components/settings/ThemeSettings.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'
import { showToast } from '../App.jsx'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isDeleting, setIsDeleting] = useState(false)
  const { theme } = useContext(ThemeContext)

  const handleDeleteAllScripts = async () => {
    const confirmDelete = window.confirm('تحذير صارم: هل أنت متأكد من تصفير مستودع السكريبتات؟ هذا الإجراء نهائي ولا يمكن استرجاعه.')
    if (confirmDelete) {
      setIsDeleting(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (typeof showToast === 'function') showToast('تم تطهير مستودع السكريبتات بنجاح 🗑️', 'success')
      setIsDeleting(false)
    }
  }

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[32px] p-8 shadow-2xl"

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <SectionTitle title="إعدادات الحساب" subtitle="تكوين الهوية الشخصية وتفضيلات المظهر البنيوي" badge="System Config" />

      <div className="flex items-center gap-4 mb-8">
        {[
          { id: 'profile', label: '👤 البروفايل' },
          { id: 'theme', label: '🎨 المظهر' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-full text-[10px] font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={cardClass}>
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <ProfileSettings />
            
            <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-rose-400">منطقة التحكم الحساسة</h4>
                <p className="text-[10px] text-slate-400 mt-1">مسح نهائي وبتر لكامل محتوى السكريبتات والألبومات المؤرشفة.</p>
              </div>
              <button
                onClick={handleDeleteAllScripts}
                disabled={isDeleting}
                className="px-6 py-3 bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600 text-rose-400 hover:text-white text-[10px] font-black rounded-full transition-all"
              >
                {isDeleting ? 'جاري التطهير...' : '🗑️ مسح الأرشيف نهائياً'}
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'theme' && <ThemeSettings />}
      </div>
    </div>
  )
}
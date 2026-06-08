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
      if (typeof showToast === 'function') showToast('تم مسح مستودع السكريبتات بنجاح 🗑️', 'success')
      setIsDeleting(false)
    }
  }

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[32px] p-8 shadow-2xl"

  // 🏆 مصفوفة التبويب الملوكية الجديدة مع الـ SVGs المعقمة هندسياً
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
    <div className={`w-full max-w-4xl mx-auto p-6 font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <SectionTitle title="إعدادات الحساب" subtitle="تكوين الهوية الشخصية وتفضيلات المظهر " badge="System Config" />

      {/* 🏆 شريط التنقل المطور - يدعم محاذاة الأيقونات حياً بالملي */}
      <div className="flex items-center gap-4 mb-8">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black transition-all flex items-center gap-2 group ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
            
            <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-rose-400">منطقة التحكم </h4>
                <p className="text-[10px] text-slate-400 mt-1">مسح نهائي لكامل محتوى السكريبتات المؤرشفة.</p>
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
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import ProfileSettings from '../components/settings/ProfileSettings'
import ThemeSettings from '../components/settings/ThemeSettings'
import SectionTitle from '../components/common/SectionTitle'
import { showToast } from '../App'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isDeleting, setIsDeleting] = useState(false)
  const { theme } = useContext(ThemeContext)

  const handleDeleteAllScripts = async () => {
    const confirmDelete = window.confirm('تحذير: هل أنت متأكد من تصفير مستودع السكريبتات؟ هذا الإجراء نهائي ولا يمكن استرجاع البيانات.')
    if (confirmDelete) {
      setIsDeleting(true)
      // محاكاة لعملية حذف حقيقية من Supabase
      await new Promise(resolve => setTimeout(resolve, 1500))
      showToast('تم تطهير مستودع السكريبتات بنجاح 🗑️', 'success')
      setIsDeleting(false)
    }
  }

  // Neon Glassmorphism Card Style
  const cardClass = "bg-[#0d071d]/50 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl";

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <SectionTitle title="إعدادات الحساب" subtitle="تكوين الهوية الشخصية وتفضيلات النظام" badge="System Config" />

      {/* شريط التبويبات النيوني */}
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
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوى الإعدادات */}
      <div className={cardClass}>
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <ProfileSettings />
            
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-rose-400">منطقة التحكم الحساسة</h4>
                <p className="text-[10px] text-slate-400 mt-1">حذف نهائي لكامل محتوى السكريبتات والألبومات.</p>
              </div>
              <button
                onClick={handleDeleteAllScripts}
                disabled={isDeleting}
                className="px-6 py-3 bg-rose-600/20 border border-rose-500/50 hover:bg-rose-600 text-rose-400 hover:text-white text-[10px] font-black rounded-full transition-all"
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
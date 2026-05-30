import React, { useState, useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext' // 🧬 حقن شريان المظهر العالمي
import ProfileSettings from '../components/settings/ProfileSettings'
import ThemeSettings from '../components/settings/ThemeSettings'
import SectionTitle from '../components/common/SectionTitle'
import { showToast } from '../App'

/**
 * TrendAura Central Account Settings Operations Console - V2 Purged Edition
 * Strictly holds personal details and data wipe safety valves.
 */
export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile') // profile | theme
  const { theme } = useContext(ThemeContext)

  const handleDeleteAllScripts = () => {
    const confirmDelete = window.confirm('هل أنت متأكد من مسح وحذف جميع السكريبتات والسيناريوهات المحفوظة نهائياً من مستودع أرشيفك؟ هذا الإجراء لا يمكن التراجع عنه.')
    if (confirmDelete) {
      showToast('تم تصفير وتطهير كامل مستودع السيناريوهات المخزنة بنجاح! 🗑️', 'success')
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto select-none dir-rtl text-right animate-fade-in font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
    }`}>
      <SectionTitle title="الإعدادات العامة للحساب" subtitle="قم بتحديث بيانات ملفك الشخصي وإدارة تفضيلات لوحة التحكم الملوكية" badge="تكوين الحساب" />

      {/* شريط تبديل التبويبات الفخم المصفى ثنائياً */}
      <div className={`flex items-center gap-2 border-b pb-3 mb-6 transition-colors ${
        theme === 'dark' ? 'border-[#1f1438]/50' : 'border-slate-100'
      }`}>
        {[
          { id: 'profile', label: '👤 البروفايل الشخصي' },
          { id: 'theme', label: '🎨 مظهر الواجهات' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
              activeTab === tab.id 
                ? (theme === 'dark' 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/10' 
                    : 'bg-blue-600 text-white shadow-md shadow-blue-100')
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* الرندرة الهندسية والمطابقة */}
      <div className={`border rounded-3xl p-6 shadow-sm transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#160f30]/40 border-[#1f1438]' : 'bg-white border-slate-100'
      }`}>
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <ProfileSettings />
            
            {/* 🛑 كرت الحذف التكتيكي المضاف بنقاء 100% متناسب الألوان سيبرانياً */}
            <div className={`pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border-dashed border ${
              theme === 'dark' ? 'border-rose-500/20 bg-rose-500/5' : 'border-rose-200 bg-rose-50/30'
            }`}>
              <div className="flex flex-col">
                <span className="text-xs font-black text-rose-600 dark:text-rose-400">منطقة التحكم الحساسة والأرشيف</span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5 leading-normal">
                  تنظيف الذاكرة السحابية من مسودات السكريبتات المحفوظة وتصفير الألبومات دفعة واحدة.
                </span>
              </div>
              <button
                type="button"
                onClick={handleDeleteAllScripts}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black rounded-xl transition-all active:scale-95 shrink-0"
              >
                🗑️ حذف السكريبتات المحفوظة
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'theme' && <ThemeSettings />}
      </div>
    </div>
  )
}
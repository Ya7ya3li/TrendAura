import React, { useState, useContext, useRef, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { supabase } from '../../config/supabase.js'
import { showToast } from '../../App.jsx'
import Button from '../common/Button.jsx'

export default function ProfileSettings() {
  const { profile, setProfile } = useContext(AuthContext)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
  }, [profile])

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 2 * 1024 * 1024) {
      if (typeof showToast === 'function') {
        showToast('حجم ملف الصورة كبير جداً، الحد المسموح به أقصاه 2 ميجابايت', 'warning')
      }
      return
    }

    setLoading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const freshUrl = `${publicUrl}?t=${new Date().getTime()}`

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: freshUrl })
        .eq('id', profile.id)

      if (dbError) throw dbError

      setProfile(prev => ({ ...prev, avatar_url: freshUrl }))
      if (typeof showToast === 'function') showToast('تم تحديث بروفايل صورتك الشخصية بنجاح 🖼️', 'success')
      
    } catch (error) {
      console.error('❌ [Avatar Update Error]:', error.message)
      if (typeof showToast === 'function') showToast('فشل حفظ ومزامنة الصورة بالأرشيف', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      if (typeof showToast === 'function') showToast('حقل الاسم لا يمكن أن يكون فارغاً', 'warning')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', profile.id)

      if (error) throw error
      
      setProfile(prev => ({ ...prev, full_name: fullName.trim() }))
      if (typeof showToast === 'function') showToast('تم تحديث وتثبيت البيانات الشخصية بنجاح! ✨', 'success')
    } catch (error) {
      console.error('❌ [ProfileSettings Save Error]:', error.message)
      if (typeof showToast === 'function') showToast('حدث خطأ فني أثناء حفظ التحديث', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6 text-right dir-rtl select-none animate-fade-in font-sans">
      <div>
        <h3 className="text-xs font-black text-white tracking-tight mb-1">البيانات والملفات الشخصية</h3>
        <p className="text-[10px] font-bold text-slate-400"> تحديث اسم العرض وصورة البروفايل.</p>
      </div>

      <div className="flex items-center gap-4 pb-2">
        <div 
          onClick={() => !loading && fileInputRef.current.click()}
          className="relative w-16 h-16 rounded-2xl cursor-pointer group overflow-hidden border-2 border-dashed border-slate-800 hover:border-blue-500 transition-all flex items-center justify-center bg-slate-950"
        >
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <svg className="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-white font-black">
            {loading ? '...' : 'تعديل'}
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
        <div className="flex flex-col">
          <span className="text-xs font-black text-white">الصورة الشخصية </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400">الاسم </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 pr-4 pl-4 py-3 rounded-xl border border-slate-800 text-xs font-bold outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-500">البريد الإلكتروني الموثق</label>
          <input
            type="email"
            value={profile?.email || '...'}
            disabled
            className="w-full bg-slate-900/60 text-slate-500 pr-4 pl-4 py-3 rounded-xl border border-slate-800/40 text-xs font-bold cursor-not-allowed font-sans text-left dir-ltr"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <Button type="submit" variant="primary" loading={loading} className="px-6 py-2.5 rounded-xl text-[11px]">
          حفظ التغييرات الشخصية
        </Button>
      </div>
    </form>
  )
}
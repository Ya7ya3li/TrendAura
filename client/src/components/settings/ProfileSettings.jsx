import React, { useState, useContext, useRef, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../config/supabase'
import { showToast } from '../../App'
import Button from '../common/Button'

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

  // 📸 الكود الكامل لحفظ الصورة في القاعدة (Storage + DB)
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 2 * 1024 * 1024) {
      showToast('حجم الصورة كبير جداً، الحد الأقصى 2 ميجابايت', 'warning')
      return
    }

    setLoading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}_${Math.random()}.${fileExt}`
      
      // 1. رفع الصورة
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // 2. الحصول على الرابط
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // 3. تثبيت الرابط في قاعدة البيانات (جدول profiles)
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)

      if (dbError) throw dbError

      // 4. تحديث الواجهة فوراً
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      showToast('تم حفظ الصورة وتثبيتها في القاعدة بنجاح 🖼️', 'success')
      
    } catch (error) {
      console.error('Error:', error)
      showToast('فشل حفظ الصورة، تأكد من إعدادات التخزين في سوبابيس', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      showToast('حقل الاسم بالكامل لا يمكن أن يكون فارغاً', 'warning')
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
      showToast('تم تحديث البيانات الشخصية بنجاح ! ✨', 'success')
    } catch (error) {
      console.error('❌ [ProfileSettings Save Error]:', error.message)
      showToast('حدث خطأ أثناء الحفظ، يرجى المحاولة لاحقاً', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6 text-right dir-rtl select-none animate-fade-in font-sans">
      <div>
        <h3 className="text-xs font-black text-slate-900 tracking-tight mb-1">البيانات الشخصية</h3>
        <p className="text-[10px] font-bold text-slate-400">قم بتحديث اسم العرض الخاص بك وصورة العرض.</p>
      </div>

      <div className="flex items-center gap-4 pb-2">
        <div 
          onClick={() => fileInputRef.current.click()}
          className="relative w-16 h-16 rounded-2xl cursor-pointer group overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-500 transition-all flex items-center justify-center bg-slate-50"
        >
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <span className="text-xl text-slate-400 group-hover:text-blue-500 transition-colors">📸</span>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-white font-black">
            {loading ? 'جاري...' : 'تعديل'}
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800">الصورة</span>
          <span className="text-[9px] font-bold text-slate-400 mt-0.5">صورة جديدة</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-500">الاسم بالكامل</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 pr-4 pl-4 py-3 rounded-xl border border-slate-200/60 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400">البريد الإلكتروني</label>
          <input
            type="email"
            value={profile?.email || '...'}
            disabled
            className="w-full bg-slate-100 text-slate-500 pr-4 pl-4 py-3 rounded-xl border border-slate-200/40 text-xs font-bold cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-50 flex justify-end">
        <Button type="submit" variant="primary" loading={loading} className="px-6 py-2.5 rounded-xl text-[11px]">
          حفظ التغييرات الفورية 💾
        </Button>
      </div>
    </form>
  )
}
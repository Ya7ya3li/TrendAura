import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../config/supabase'
import { showToast } from '../App'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return
    setEmail(userData.user.email)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .maybeSingle()
    if (data) {
      setName(data.full_name || '')
      // إضافة طابع زمني عشوائي حتى عند التحميل لأول مرة لضمان جلب أحدث صورة من السيرفر
      if (data.avatar_url) {
        setAvatarUrl(`${data.avatar_url}?t=${new Date().getTime()}`)
      } else {
        setAvatarUrl(null)
      }
    }
  }

  const saveName = async () => {
    if (!name) return
    setSaving(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', userData.user.id)
      
      showToast('تم حفظ الاسم بنجاح', 'success')
    } catch (error) {
      console.error('Error saving name:', error)
      showToast('حدث خطأ أثناء حفظ الاسم', 'error')
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    
    try {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user.id
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}.${fileExt}`
      
      // رفع الصورة إلى Supabase Storage باستبدال الملف القديم
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
        
      if (uploadError) {
        showToast('فشل رفع الصورة الشخصية', 'error')
        setUploading(false)
        return
      }
      
      // جلب الرابط العام للملف المرفوع
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
        
      const publicUrl = urlData.publicUrl
      
      // تحديث رابط الصورة في جدول بروفايل المستخدم
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)
        
      // ✨ الحل السحري: إضافة ?t= وطابع الوقت الحالي لكسر كاش المتصفح وإجبار الصورة على التغير فوراً أمام المستخدم
      setAvatarUrl(`${publicUrl}?t=${new Date().getTime()}`)
      showToast('تم رفع وتحديث الصورة بنجاح', 'success')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      showToast('حدث خطأ غير متوقع أثناء الرفع', 'error')
    } finally {
      setUploading(false)
    }
  }

  const deleteAll = async () => {
    setShowConfirm(false)
    setDeleting(true)
    const { error } = await supabase.from('history').delete().gte('id', 0)
    if (error) {
      showToast('حدث خطأ أثناء الحذف', 'error')
      setDeleting(false)
      return
    }
    setDeleting(false)
    showToast('تم حذف كل السكريبتات', 'success')
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('light-mode')
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">

        {/* Modal تأكيد الحذف */}
        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <div className="confirm-icon">🗑️</div>
              <h3>حذف السكريبتات</h3>
              <p>هل أنت متأكد من حذف كل السكريبتات؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="confirm-btns">
                <button className="confirm-cancel" onClick={() => setShowConfirm(false)}>
                  إلغاء
                </button>
                <button className="confirm-delete" onClick={deleteAll}>
                  نعم، احذف الكل
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="topbar">
          <div>
            <h1>⚙️ الإعدادات</h1>
            <p>تحكم في حسابك وتفضيلاتك</p>
          </div>
        </div>

        <div className="settings-grid">

          <div className="glass-card">
            <h3>🖼️ صورة البروفايل</h3>
            <p className="setting-desc">ارفع صورة شخصية لحسابك</p>
            <div className="avatar-section">
              <div className="avatar-preview" onClick={() => !uploading && fileRef.current.click()}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" />
                ) : (
                  <span className="avatar-placeholder">📷</span>
                )}
                <div className="avatar-overlay">تغيير</div>
              </div>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={uploadAvatar}
              />
              <button
                className="upload-btn"
                onClick={() => fileRef.current.click()}
                disabled={uploading}
              >
                {uploading ? 'جاري الرفع...' : '📤 رفع صورة'}
              </button>
            </div>
          </div>

          <div className="glass-card">
            <h3>✏️ تغيير الاسم</h3>
            <p className="setting-desc">غيّر اسمك الظاهر في الموقع</p>
            <div className="name-form">
              <input
                type="text"
                placeholder="الاسم الجديد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="settings-input"
              />
              <p className="email-display">📧 {email}</p>
              <button
                className="save-btn"
                onClick={saveName}
                disabled={saving}
              >
                {saving ? 'جاري الحفظ...' : '💾 حفظ الاسم'}
              </button>
            </div>
          </div>

          <div className="glass-card">
            <h3>🎨 مظهر الموقع</h3>
            <p className="setting-desc">اختر بين الوضع الليلي والنهاري</p>
            <div className="toggle-row">
              <span>{darkMode ? '🌙 وضع ليلي' : '☀️ وضع نهاري'}</span>
              <button
                className={`toggle-btn ${darkMode ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                <span className="toggle-circle" />
              </button>
            </div>
          </div>

          <div className="glass-card danger-card">
            <h3>🗑️ حذف السكريبتات</h3>
            <p className="setting-desc">حذف جميع السكريبتات المحفوظة نهائياً</p>
            <button className="danger-btn" onClick={() => setShowConfirm(true)} disabled={deleting}>
              {deleting ? 'جاري الحذف...' : '🗑️ حذف كل السكريبتات'}
            </button>
          </div>

          <div className="glass-card">
            <h3>ℹ️ عن المنصة</h3>
            <div className="info-row"><span>الإصدار</span><span className="badge">v1.0.0</span></div>
            <div className="info-row"><span>المحرك</span><span className="badge">OpenRouter AI</span></div>
            <div className="info-row"><span>قاعدة البيانات</span><span className="badge">Supabase</span></div>
          </div>

        </div>
      </main>
    </div>
  )
}
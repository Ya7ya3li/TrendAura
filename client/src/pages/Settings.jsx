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
  
  // 1️⃣ حالات مخصصة لإدارة إلغاء الاشتراك
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [canceling, setCanceling] = useState(false)
  
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
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
        
      if (uploadError) {
        showToast('فشل رفع الصورة الشخصية', 'error')
        setUploading(false)
        return
      }
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
        
      const publicUrl = urlData.publicUrl
      
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)
        
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

  // 2️⃣ دالة معالجة إلغاء الاشتراك البرمجية
  const handleCancelSubscription = async () => {
    setShowCancelModal(false)
    setCanceling(true)
    
    try {
      // هنا مستقبلاً سنقوم بعمل fetch للباك إند الخاص بـ Stripe لإلغاء التجديد التلقائي
      // مثال: await fetch('/api/stripe/cancel-subscription', { method: 'POST' })
      
      // محاكاة استجابة السيرفر مؤقتاً لحين ربط الباك إند:
      setTimeout(() => {
        setCanceling(false)
        showToast('تم إلغاء التجديد التلقائي بنجاح. باقتك ستظل فعالة حتى نهاية الفترة الحالية لحفظ حقوقك 🌟', 'success')
      }, 1500)
      
    } catch (error) {
      console.error('Error canceling subscription:', error)
      showToast('حدث خطأ أثناء معالجة طلب الإلغاء', 'error')
      setCanceling(false)
    }
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

        {/* 3️⃣ Modal تأكيد إلغاء الاشتراك */}
        {showCancelModal && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <div className="confirm-icon" style={{ color: '#ef4444' }}>🥺</div>
              <h3>إلغاء الاشتراك</h3>
              <p>هل أنت متأكد يا بطل؟ بإلغاء اشتراكك ستفقد ميزات الذكاء الاصطناعي الخارقة والـ VIP Support بنهاية الفترة الحالية.</p>
              <div className="confirm-btns">
                <button className="confirm-cancel" onClick={() => setShowCancelModal(false)}>
                  تراجع، أريد البقاء
                </button>
                <button 
                  className="confirm-delete" 
                  style={{ backgroundColor: '#ef4444' }} 
                  onClick={handleCancelSubscription}
                >
                  تأكيد الإلغاء
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

          {/* 4️⃣ كارد الحساب والاشتراك الجديد لراحة العميل */}
          <div className="glass-card">
            <h3>💳 باقة الاشتراك</h3>
            <p className="setting-desc">إدارة تفاصيل خطتك الحالية والدفع</p>
            <div className="subscription-info" style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#333' }}>الخطة الحالية: <span style={{ color: '#7c3aed' }}>Pro Viral Engine 🚀</span></p>
                  <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>حالة التجديد: تلقائي</p>
                </div>
              </div>
              <button 
                className="danger-btn" 
                style={{ 
                  backgroundColor: '#fef2f2', 
                  color: '#ef4444', 
                  border: '1px solid #fee2e2',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }} 
                onClick={() => setShowCancelModal(true)}
                disabled={canceling}
              >
                {canceling ? 'جاري الإلغاء...' : 'إلغاء الاشتراك التلقائي'}
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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

export default function Success() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('جاري التحقق من عملية الدفع...')

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    try {
      const params = new URLSearchParams(window.location.search)
      const paymentId = params.get('id')
      // السطر السحري لاسترجاع الباقة
      const planType = params.get('plan') || localStorage.getItem('selectedPlan')

      if (!paymentId) {
        setMessage('معرف العملية غير موجود')
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id

      if (!userId) {
        setMessage('يجب تسجيل الدخول أولاً')
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentId,
            userId,
            planType
          })
        }
      )

      const data = await response.json()

      if (data.success) {
        setMessage('تم تفعيل اشتراكك بنجاح 🚀')
        localStorage.removeItem('selectedPlan')
      } else {
        setMessage(data.message || 'فشل التحقق من الدفع')
      }

    } catch (error) {
      console.error(error)
      setMessage('حدث خطأ أثناء التحقق')
    } finally {
      setLoading(false)
      setTimeout(() => {
        navigate('/')
      }, 4000)
    }
  }

  // تحديد حالة الواجهة بناءً على الرسالة
  const isSuccess = message.includes('نجاح')
  const isError = message.includes('فشل') || message.includes('خطأ') || message.includes('غير موجود')

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      direction: 'rtl', 
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: '#1e293b', 
        border: `1px solid ${loading ? '#3b82f6' : (isSuccess ? '#22c55e' : '#ef4444')}`, 
        boxShadow: loading ? '0 0 20px rgba(59, 130, 246, 0.2)' : (isSuccess ? '0 0 30px rgba(34, 197, 94, 0.3)' : '0 0 20px rgba(239, 68, 68, 0.2)'),
        borderRadius: '24px', 
        padding: '50px 30px', 
        textAlign: 'center', 
        maxWidth: '450px', 
        width: '100%',
        transition: 'all 0.5s ease'
      }}>
        
        <div style={{ fontSize: '80px', marginBottom: '20px', display: 'inline-block' }}>
          {loading ? '⏳' : (isSuccess ? '🎉' : '⚠️')}
        </div>
        
        <h1 style={{ 
          color: loading ? '#38bdf8' : (isSuccess ? '#22c55e' : '#ef4444'), 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '16px' 
        }}>
          {loading ? 'جاري التحقق...' : (isSuccess ? 'نجحت العملية' : 'تنبيه')}
        </h1>
        
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6' }}>
          {message}
        </p>

        {/* شريط تحميل جمالي يكتمل أو يوقف حسب الحالة */}
        <div style={{ 
          marginTop: '30px', 
          height: '4px', 
          width: '100%', 
          backgroundColor: '#334155', 
          borderRadius: '2px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            height: '100%', 
            backgroundColor: loading ? '#38bdf8' : (isSuccess ? '#22c55e' : '#ef4444'), 
            width: loading ? '60%' : '100%', 
            transition: 'width 0.5s ease' 
          }} />
        </div>
        
        {!loading && (
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '20px' }}>
            سيتم توجيهك تلقائياً للرئيسية...
          </p>
        )}
      </div>
    </div>
  )
}
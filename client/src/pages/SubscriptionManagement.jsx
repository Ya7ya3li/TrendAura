// داخل ملف SubscriptionManagement.jsx، قم بتحديث دالة handleCancelSubscription لتصبح هكذا:
  const handleCancelSubscription = async () => {
    const confirmCancel = window.confirm('هل أنت متأكد من إلغاء اشتراكك الحالي؟ ستفقد جميع ميزات النخبة فوراً وتعود للباقة المجانية.')
    if (!confirmCancel) return

    setPaymentLoading(true)
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'فشل الإلغاء')

      setProfile(prev => ({ ...prev, plan: 'free', subscription_status: 'cancelled' }))
      if (typeof showToast === 'function') showToast('تم إلغاء الاشتراك بنجاح وعودتك للباقة الحرة 💳', 'success')
    } catch (err) {
      if (typeof showToast === 'function') showToast(err.message || 'حدث خطأ أثناء إلغاء الاشتراك', 'error')
    } finally {
      setPaymentLoading(false)
    }
  }
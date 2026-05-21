import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

export const verifyMoyasarPayment = async (req, res) => {

  const { paymentId, userId, planType } = req.body

  // التحقق من البيانات المطلوبة
  if (!paymentId) {
    return res.status(400).json({ success: false, message: 'معرف العملية مطلوب' })
  }

  if (!userId) {
    return res.status(400).json({ success: false, message: 'معرف المستخدم مطلوب' })
  }

  try {
    // متغيرات البيئة
    const supabaseUrl = (process.env.SUPABASE_URL || '').trim()
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
    const secretKey = (process.env.MOYASAR_SECRET_KEY || '').trim()

    // التحقق من المفاتيح
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase ENV Missing')
      return res.status(500).json({ success: false, message: 'مشكلة في إعدادات Supabase' })
    }

    if (!secretKey) {
      console.error('❌ Moyasar Secret Missing')
      return res.status(500).json({ success: false, message: 'مفتاح ميسر غير موجود' })
    }

    // إنشاء Supabase Client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // التحقق من عملية الدفع من ميسر
    const response = await axios.get(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      auth: { username: secretKey, password: '' }
    })

    const paymentData = response.data

    console.log('💳 Payment Status:', paymentData.status)
    console.log('📦 Plan Type:', planType)

    // إذا الدفع ناجح
    if (paymentData.status === 'captured') {

      // تحديد الباقة الصحيحة
      let dbPlanName = 'free'

      if (planType === 'pro') {
        dbPlanName = 'pro'
      }

      // 🟢 التعديل السحري هنا:
      if (planType === 'viral_engine') {
        dbPlanName = 'Pro Viral Engine'
      }

      console.log(`🚀 Upgrading User ${userId} To ${dbPlanName}`)

      // تحديث قاعدة البيانات
      const { error } = await supabase
        .from('profiles')
        .update({
          plan: dbPlanName,
          subscription_status: 'active'
        })
        .eq('id', userId)

      // إذا فشل التحديث
      if (error) {
        console.error('❌ Supabase Update Error:', error)
        return res.status(500).json({ success: false, message: 'تم الدفع لكن فشل تحديث الاشتراك' })
      }

      // نجاح العملية
      return res.json({
        success: true,
        plan: dbPlanName,
        amount: paymentData.amount / 100,
        message: 'تم تفعيل الاشتراك بنجاح 🚀'
      })
    }

    // إذا العملية ليست captured
    return res.status(400).json({ success: false, message: `فشل الدفع، الحالة الحالية: ${paymentData.status}` })

  } catch (error) {
    console.error('❌ Verification Error:', error.response?.data || error.message)
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق من الدفع' })
  }
}
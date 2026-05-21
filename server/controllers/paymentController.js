import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

// 🟢 1. الدالة الجديدة اللي كانت ناقصة: مسؤولة عن إنشاء فاتورة الدفع وتوجيه العميل
export const createCheckout = async (req, res) => {
  const { userId, planType } = req.body

  if (!userId || !planType) {
    return res.status(400).json({ success: false, message: 'بيانات المستخدم أو الباقة مفقودة' })
  }

  // تحديد السعر حسب الباقة (بالهللة لميسر: 2900 = 29 ريال)
  let amount = 0
  let description = ''

  if (planType === 'pro') {
    amount = 2900 // 29 ريال
    description = 'اشتراك Pro'
  } else if (planType === 'viral_engine') {
    amount = 6900 // 69 ريال
    description = 'اشتراك Viral Engine'
  } else {
    return res.status(400).json({ success: false, message: 'نوع الباقة غير صالح' })
  }

  try {
    const secretKey = (process.env.MOYASAR_SECRET_KEY || '').trim()
    if (!secretKey) {
      console.error('❌ Moyasar Secret Missing')
      return res.status(500).json({ success: false, message: 'مفتاح ميسر غير موجود في الخادم' })
    }

    // رابط موقعك عشان ميسر يرجع العميل له بعد الدفع
    const frontendUrl = process.env.FRONTEND_URL || 'https://trendaura-two.vercel.app'

    // إنشاء فاتورة ميسر
    const response = await axios.post(
      'https://api.moyasar.com/v1/invoices',
      {
        amount,
        currency: 'SAR',
        description,
        success_url: `${frontendUrl}/success?plan=${planType}`,
        back_url: `${frontendUrl}/pricing`,
      },
      {
        auth: {
          username: secretKey,
          password: ''
        }
      }
    )

    if (response.data && response.data.url) {
      return res.json({ success: true, checkout_url: response.data.url })
    } else {
      return res.status(400).json({ success: false, message: 'لم يتم العثور على رابط الفاتورة من ميسر' })
    }
  } catch (error) {
    console.error('❌ Create Checkout Error:', error.response?.data || error.message)
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التواصل مع بوابة الدفع' })
  }
}

// 🟢 2. دالة التحقق (تم تطويرها عشان تدعم روابط الفواتير والدفع المباشر بدون أخطاء)
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

    let paymentData
    let isSuccessful = false

    // ميسر يرجع نوعين من المعرفات: فاتورة (inv) أو دفع مباشر (id). السيرفر الحين صار ذكي يفهمها كلها!
    if (paymentId.startsWith('inv_')) {
      const response = await axios.get(`https://api.moyasar.com/v1/invoices/${paymentId}`, {
        auth: { username: secretKey, password: '' }
      })
      paymentData = response.data
      isSuccessful = paymentData.status === 'paid' // الفواتير حالتها paid
    } else {
      const response = await axios.get(`https://api.moyasar.com/v1/payments/${paymentId}`, {
        auth: { username: secretKey, password: '' }
      })
      paymentData = response.data
      isSuccessful = paymentData.status === 'captured' // الدفع المباشر حالته captured
    }

    console.log('💳 Payment Status:', paymentData.status)
    console.log('📦 Plan Type:', planType)

    // إذا الدفع ناجح
    if (isSuccessful) {

      // تحديد الباقة الصحيحة للـ Database
      let dbPlanName = 'free'

      if (planType === 'pro') {
        dbPlanName = 'pro'
      }

      // مطابقة الاسم 100% مع قاعدة بياناتك عشان ما يعلق
      if (planType === 'viral_engine') {
        dbPlanName = 'Viral Engine'
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

    // إذا العملية لم تكتمل
    return res.status(400).json({ success: false, message: `فشل الدفع، الحالة الحالية: ${paymentData.status}` })

  } catch (error) {
    console.error('❌ Verification Error:', error.response?.data || error.message)
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق من الدفع' })
  }
}
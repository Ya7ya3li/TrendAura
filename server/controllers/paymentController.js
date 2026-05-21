import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws' // 🟢 التعديل الأول: استدعاء المكتبة بالشكل الجديد

// 🟢 1. دالة إنشاء فاتورة الدفع
export const createCheckout = async (req, res) => {
  const { userId, planType } = req.body

  if (!userId || !planType) {
    return res.status(400).json({ success: false, message: 'بيانات المستخدم أو الباقة مفقودة' })
  }

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

    const frontendUrl = process.env.FRONTEND_URL || 'https://trendaura-two.vercel.app'

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

// 🟢 2. دالة التحقق وتحديث الباقة
export const verifyMoyasarPayment = async (req, res) => {
  const { paymentId, userId, planType } = req.body

  if (!paymentId) {
    return res.status(400).json({ success: false, message: 'معرف العملية مطلوب' })
  }

  if (!userId) {
    return res.status(400).json({ success: false, message: 'معرف المستخدم مطلوب' })
  }

  try {
    const supabaseUrl = (process.env.SUPABASE_URL || '').trim()
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
    const secretKey = (process.env.MOYASAR_SECRET_KEY || '').trim()

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase ENV Missing')
      return res.status(500).json({ success: false, message: 'مشكلة في إعدادات Supabase' })
    }

    if (!secretKey) {
      console.error('❌ Moyasar Secret Missing')
      return res.status(500).json({ success: false, message: 'مفتاح ميسر غير موجود' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      },
      realtime: {
        transport: ws
      }
    })

    let paymentData
    let isSuccessful = false

    if (paymentId.startsWith('inv_')) {
      const response = await axios.get(`https://api.moyasar.com/v1/invoices/${paymentId}`, {
        auth: { username: secretKey, password: '' }
      })
      paymentData = response.data
      isSuccessful = paymentData.status === 'paid' || paymentData.status === 'captured'
    } else {
      const response = await axios.get(`https://api.moyasar.com/v1/payments/${paymentId}`, {
        auth: { username: secretKey, password: '' }
      })
      paymentData = response.data
      isSuccessful = paymentData.status === 'captured' || paymentData.status === 'paid'
    }

    console.log('💳 Payment Status:', paymentData.status)
    console.log('📦 Plan Type:', planType)
    console.log('💰 Paid Amount:', paymentData.amount)

    if (isSuccessful) {

      let dbPlanName = 'free'

      // 🟢 التعديل الذهبي والمضمون: التحقق من اسم الباقة المفرودة أو المبلغ المدفوع (6900 هللة = 69 ريال)
      if (planType === 'viral_engine' || planType === 'Viral Engine' || paymentData.amount === 6900) {
        dbPlanName = 'Viral Engine'
      } else if (planType === 'pro' || paymentData.amount === 2900) {
        dbPlanName = 'pro'
      }

      console.log(`🚀 Upgrading User ${userId} To ${dbPlanName}`)

      const { error } = await supabase
        .from('profiles')
        .update({
          plan: dbPlanName,
          subscription_status: 'active'
        })
        .eq('id', userId)

      if (error) {
        console.error('❌ Supabase Update Error:', error)
        return res.status(500).json({ success: false, message: 'تم الدفع لكن فشل تحديث الاشتراك' })
      }

      return res.json({
        success: true,
        plan: dbPlanName,
        amount: paymentData.amount / 100,
        message: 'تم تفعيل الاشتراك بنجاح 🚀'
      })
    }

    return res.status(400).json({ success: false, message: `فشل الدفع، الحالة الحالية: ${paymentData.status}` })

  } catch (error) {
    console.error('❌ Verification Error:', error.response?.data || error.message)
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق من الدفع' })
  }
}
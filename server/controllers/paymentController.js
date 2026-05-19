import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

export const verifyMoyasarPayment = async (req, res) => {
  const { paymentId, userId } = req.body

  if (!paymentId) {
    return res.status(400).json({ success: false, message: 'معرف العملية مطلوب' })
  }

  try {
    // 🛡️ نقلنا الاتصال هنا وحطينا trim() عشان يمسح أي مسافة منسوخة بالغلط في ريلوي
    const supabaseUrl = (process.env.SUPABASE_URL || '').trim()
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('⚠️ مفاتيح سوبابيز مفقودة أو غير صحيحة في متغيرات Railway')
      return res.status(500).json({ success: false, message: 'مشكلة في إعدادات الخادم' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const secretKey = process.env.MOYASAR_SECRET_KEY
    
    // التحقق من ميسر
    const response = await axios.get(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      auth: {
        username: secretKey,
        password: ''
      }
    })

    const paymentData = response.data

    if (paymentData.status === 'captured') {
      // تحديث الباقة
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('id', userId)

        if (error) {
          console.error('Supabase update error:', error)
          return res.status(500).json({ success: false, message: 'تم الدفع لكن فشل تحديث قاعدة البيانات' })
        }
      }

      return res.json({ 
        success: true, 
        message: 'تم تفعيل باقة Pro بنجاح! 🚀', 
        amount: paymentData.amount / 100 
      })

    } else {
      return res.status(400).json({ 
        success: false, 
        message: `فشلت عملية الدفع، حالة العملية الحالية: ${paymentData.status}` 
      })
    }

  } catch (error) {
    console.error('Verification Error:', error.response?.data || error.message)
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق من بوابة الدفع' })
  }
}
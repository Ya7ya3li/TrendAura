import axios from 'axios'
import { createClient } from '@supabase/supabase-js' // تم الاستيراد مرة واحدة فقط هنا ✅

// الاتصال بـ Supabase باستخدام الـ Service Role للحماية وتحديث قاعدة البيانات
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export const verifyMoyasarPayment = async (req, res) => {
  const { paymentId, userId } = req.body

  if (!paymentId) {
    return res.status(400).json({ success: false, message: 'معرف العملية مطلوب' })
  }

  try {
    const secretKey = process.env.MOYASAR_SECRET_KEY
    
    // التحقق من ميسر بـ Basic Auth
    const response = await axios.get(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      auth: {
        username: secretKey,
        password: ''
      }
    })

    const paymentData = response.data

    if (paymentData.status === 'captured') {
      // تحديث حالة المستخدم في السوبابيز إلى Pro
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan: 'pro' // تحديث حقل الباقة إلى pro مباشرة
          })
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
    console.error('Moyasar Verification Error:', error.response?.data || error.message)
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق من بوابة الدفع' })
  }
}
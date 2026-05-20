import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

export const verifyMoyasarPayment = async (req, res) => {
  const { paymentId, userId, planType } = req.body // استقبلنا نوع الباقة القادم من الموقع إذا كان موجوداً

  if (!paymentId) {
    return res.status(400).json({ success: false, message: 'معرف العملية مطلوب' })
  }

  try {
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
      
      // 🟢 الذكاء التلقائي: تحديد اسم الباقة بدقة ليتوافق مع القائمة الجانبية في موقعك
      let dbPlanName = 'viral_engine'; 
      
      // إذا كان موقعك يرسل مسمى معين، نتأكد ونطابقه هنا
      if (planType === 'pro' && !paymentData.description?.includes('Viral')) {
        dbPlanName = 'pro';
      }

      console.log(`💳 Payment Success! Upgrading user ${userId} to plan: ${dbPlanName}`);

      // تحديث الباقة تلقائياً في قاعدة البيانات
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ plan: dbPlanName }) 
          .eq('id', userId)

        if (error) {
          console.error('Supabase update error:', error)
          return res.status(500).json({ success: false, message: 'تم الدفع لكن فشل تحديث قاعدة البيانات' })
        }
      }

      return res.json({ 
        success: true, 
        message: 'تم تفعيل الاشتراك بنجاح! 🚀', 
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
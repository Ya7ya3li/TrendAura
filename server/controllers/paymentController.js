import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

export const verifyMoyasarPayment = async (req, res) => {

  const {
    paymentId,
    userId,
    planType
  } = req.body

  if (!paymentId) {

    return res.status(400).json({
      success: false,
      message: 'معرف العملية مطلوب'
    })

  }

  try {

    // =========================
    // Supabase Config
    // =========================

    const supabaseUrl =
    (process.env.SUPABASE_URL || '').trim()

    const supabaseKey =
    (
      process.env
      .SUPABASE_SERVICE_ROLE_KEY || ''
    ).trim()

    if (!supabaseUrl || !supabaseKey) {

      console.error(
        '⚠️ مفاتيح Supabase مفقودة'
      )

      return res.status(500).json({
        success: false,
        message: 'مشكلة في إعدادات الخادم'
      })

    }

    const supabase =
    createClient(
      supabaseUrl,
      supabaseKey
    )

    // =========================
    // Moyasar Config
    // =========================

    const secretKey =
    process.env.MOYASAR_SECRET_KEY

    if (!secretKey) {

      return res.status(500).json({
        success: false,
        message: 'مفتاح ميسر غير موجود'
      })

    }

    // =========================
    // Verify Payment
    // =========================

    const response =
    await axios.get(

      `https://api.moyasar.com/v1/payments/${paymentId}`,

      {
        auth: {
          username: secretKey,
          password: ''
        }
      }

    )

    const paymentData =
    response.data

    console.log(
      '💳 Payment Data:',
      paymentData
    )

    // =========================
    // Payment Success
    // =========================

    if (
      paymentData.status === 'captured'
    ) {

      // =========================
      // Determine Plan
      // =========================

      let dbPlanName = 'free'

      if (planType === 'pro') {

        dbPlanName = 'pro'

      }

      if (
        planType === 'viral_engine'
      ) {

        dbPlanName = 'viral_engine'

      }

      console.log({

        userId,

        planType,

        dbPlanName

      })

      // =========================
      // Update Database
      // =========================

      if (userId) {

        const { error } =
        await supabase
          .from('profiles')
          .update({

            plan: dbPlanName,

            subscription_status:
            'active'

          })
          .eq('id', userId)

        if (error) {

          console.error(
            '❌ Supabase Error:',
            error
          )

          return res.status(500).json({

            success: false,

            message:
            'تم الدفع لكن فشل تحديث قاعدة البيانات'

          })

        }

      }

      // =========================
      // Success Response
      // =========================

      return res.json({

        success: true,

        plan: dbPlanName,

        message:
        'تم تفعيل الاشتراك بنجاح 🚀',

        amount:
        paymentData.amount / 100

      })

    }

    // =========================
    // Payment Failed
    // =========================

    return res.status(400).json({

      success: false,

      message:
      `فشلت عملية الدفع، الحالة الحالية: ${paymentData.status}`

    })

  } catch (error) {

    console.error(

      '❌ Verification Error:',

      error.response?.data ||
      error.message

    )

    return res.status(500).json({

      success: false,

      message:
      'حدث خطأ أثناء التحقق من الدفع'

    })

  }

}
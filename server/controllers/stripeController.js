import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckout = async (req, res) => {
  try {
    // استقبال planType من الفرونت إند
    const { email, userId, planType } = req.body

    // تحديد الـ Price ID بناءً على نوع الباقة
    let priceId;
    if (planType === 'pro_viral') {
      priceId = process.env.STRIPE_PRICE_PRO_VIRAL;
    } else if (planType === 'pro') {
      priceId = process.env.STRIPE_PRICE_PRO;
    } else {
      return res.status(400).json({ error: 'نوع الباقة غير صالح' });
    }

    // التأكد من وجود مفاتيح Stripe في ملف .env
    if (!priceId) {
      console.error(`Missing Stripe Price ID for plan: ${planType}`);
      return res.status(500).json({ error: 'خطأ في إعدادات الخادم' });
    }

    // جعل الروابط ديناميكية (تعمل على Localhost وعلى الاستضافة بعد النشر)
    const baseUrl = req.headers.origin || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      // حفظ نوع الباقة في الـ metadata عشان نحتاجها بعد الدفع الناجح
      metadata: { userId, planType }, 
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing` // من الأفضل إعادته لصفحة الأسعار بدل الإعدادات
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error("Stripe Checkout Error:", error)
    res.status(500).json({ error: 'Checkout Failed' })
  }
}

export const getSubscription = async (req, res) => {
  try {
    const { email } = req.body

    const customers = await stripe.customers.list({ email, limit: 1 })

    if (customers.data.length === 0) {
      return res.json({ plan: 'free' })
    }

    const customer = customers.data[0]
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length > 0) {
      // جلب معرف السعر للاشتراك النشط
      const activePriceId = subscriptions.data[0].items.data[0].price.id;

      // تحديد نوع الباقة بناءً على السعر المشترك فيه
      if (activePriceId === process.env.STRIPE_PRICE_PRO_VIRAL) {
        return res.json({ plan: 'pro_viral' });
      } else if (activePriceId === process.env.STRIPE_PRICE_PRO) {
        return res.json({ plan: 'pro' });
      }
      
      // في حال كان السعر غير معروف، نرجعه لـ pro كإجراء احتياطي
      return res.json({ plan: 'pro' })
    }

    res.json({ plan: 'free' })
  } catch (error) {
    console.error("Stripe Get Subscription Error:", error)
    res.status(500).json({ plan: 'free' })
  }
}
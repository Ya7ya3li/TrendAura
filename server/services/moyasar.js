import axios from 'axios';
import { env } from '../config/env.js';

export const paymentService = {
  /**
   * 💸 تهيئة معاملة بنكية جديدة وتوليد رابط سداد آمن عبر ميسر
   */
  createInvoice: async (priceAmount, planId, userId, tokensToAdd = 50000) => {
    try {
      // بوابة ميسر السيادية تستقبل القيم بالهللات (ضرب المبلغ بـ 100)
      const parsedAmountInHalalas = Math.round(parseFloat(priceAmount) * 100);
      const authBase64 = Buffer.from(`${env.moyasarSecretKey}:`).toString('base64');

      const payload = {
        amount: parsedAmountInHalalas,
        currency: 'SAR',
        description: `ترقية وتفعيل باقة الترخيص الرقمي الملوكي: [${planId.toUpperCase()}] لبروفايل صانع المحتوى بـ TrendAura`,
        callback_url: `${env.nodeEnv === 'production' ? 'https://trendaura.app' : 'http://localhost:3000'}/success?plan=${planId}`,
        metadata: {
          user_id: userId,
          plan_id: planId,
          tokens_to_add: tokensToAdd // تشفير القيمة داخل الفاتورة لضمان عدم التلاعب بالرصيد
        }
      };

      const response = await axios.post('https://api.moyasar.com/v1/payments', payload, {
        headers: {
          'Authorization': `Basic ${authBase64}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.source && response.data.source.transaction_url) {
        return {
          success: true,
          checkoutUrl: response.data.source.transaction_url,
          paymentId: response.data.id
        };
      }

      throw new Error('فشلت بوابة ميسر في توليد مسار جدران السداد الآمن السحابي.');
    } catch (error) {
      console.error('❌ [paymentService Moyasar Exception]:', error.response?.data || error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
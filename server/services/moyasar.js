import axios from 'axios';
import { env } from '../config/env.js';

export const paymentService = {
  createInvoice: async (priceAmount, planId, userId, tokensToAdd = 0) => {
    try {
      // بوابة ميسر تستقبل القيمة بالهللات
      const parsedAmountInHalalas = Math.round(parseFloat(priceAmount) * 100);
      const authBase64 = Buffer.from(`${env.moyasarSecretKey}:`).toString('base64');

      const payload = {
        amount: parsedAmountInHalalas,
        currency: 'SAR',
        description: `ترقية وتفعيل باقة الاشتراك الرقمي الملوكي: ${planId} لبروفايل TrendAura`,
        callback_url: `${process.env.VITE_API_URL || 'http://localhost:3000'}/success`,
        metadata: {
          user_id: userId,
          plan_id: planId,
          tokens_to_add: tokensToAdd // شحن القيمة برمجياً بداخل خوادم ميسر للحماية من التلاعب
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

      throw new Error('فشلت بوابة ميسر في توليد مسار السداد الآمن.');
    } catch (error) {
      console.error('❌ [paymentService Moyasar Exception]:', error.response?.data || error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
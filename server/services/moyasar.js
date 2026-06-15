import axios from 'axios';
import { env } from '../config/env.js';

export const paymentService = {
  /**
   * 💸 تهيئة معاملة بنكية جديدة وتوليد رابط سداد آمن عبر ميسر
   */
  createInvoice: async (priceAmount, planId, userId, tokensToAdd) => {
    try {
      const cleanPlanId = String(planId || '').toLowerCase().trim();
      let verifiedTokens = tokensToAdd;

      // 🛡️ جدار حماية صارم: تثبيت قيم التوكنز بناءً على نوع الباقة لمنع الثغرات الافتراضية والتلاعب
      if (cleanPlanId === 'token_booster') {
        verifiedTokens = 5000; // باقة الشحن السريع بـ 49 ريال تمنح 5000 فقط قسرياً
      } else if (cleanPlanId === 'pro') {
        verifiedTokens = 1000;
      } else if (cleanPlanId === 'viral_engine') {
        verifiedTokens = 10000;
      } else {
        verifiedTokens = Number(verifiedTokens || 0);
      }

      // بوابة ميسر تستقبل القيم بالهللات (ضرب المبلغ بـ 100)
      const parsedAmountInHalalas = Math.round(parseFloat(priceAmount) * 100);
      const authBase64 = Buffer.from(`${env.moyasarSecretKey}:`).toString('base64');

      const payload = {
        amount: parsedAmountInHalalas,
        currency: 'SAR',
        description: `ترقية وتفعيل باقة الترخيص الرقمي : [${cleanPlanId.toUpperCase()}] لبروفايل صانع المحتوى بـ TrendAura`,
        callback_url: `${env.nodeEnv === 'production' ? 'https://trendaura-two.vercel.app' : 'http://localhost:3000'}/success?plan=${cleanPlanId}`,
        metadata: {
          user_id: userId,
          plan_id: cleanPlanId,
          tokens_to_add: verifiedTokens // تمرير القيمة المحصنة والمؤكدة لمنع التلاعب سحابياً
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
          invoiceUrl: response.data.source.transaction_url, // تم توحيد المخرج ليتطابق مع ملف SubscriptionManagement.jsx
          checkoutUrl: response.data.source.transaction_url, // خط دفاع تراجعي إضافي لمنع كسر أي ملفات أخرى
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
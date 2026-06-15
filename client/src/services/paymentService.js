import axiosInstance from '../config/axios';

/**
 * TrendAura Commercial Billing and Moyasar Gateway Connector Service
 */
export const paymentService = {
  /**
   * 💸 طلب فاتورة ورابط دفع مالي جديد مشفر من السيرفر الحي على Railway
   */
  async createInvoice(amount, planId, userId, tokensCount) {
    try {
      const cleanPlanId = String(planId || '').toLowerCase().trim();
      
      // 🛡️ توزين احتياطي ذكي في الفرونت إند لمطابقة الباقات بالملي قبل الإرسال
      let verifiedTokens = tokensCount;
      if (!verifiedTokens) {
        if (cleanPlanId === 'token_booster') verifiedTokens = 5000;
        else if (cleanPlanId === 'pro') verifiedTokens = 1000;
        else if (cleanPlanId === 'viral_engine') verifiedTokens = 10000;
        else verifiedTokens = 0;
      }

      // إرسال البيانات بشكل متوافق هندسياً بالكامل مع استقبال السيرفر والـ Webhook
      const response = await axiosInstance.post('/api/payment/create-invoice', {
        amount: Number(amount),
        planName: cleanPlanId,
        userId: userId,
        tokensToAdd: Number(verifiedTokens) // إرسال الحسبة الدقيقة والنظيفة
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [paymentService createInvoice Ingestion Failure]:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * استجواب السيرفر للتحقق من نجاح عملية السداد البنكي
   */
  async verifyPaymentStatus(paymentId) {
    try {
      const response = await axiosInstance.get(`/api/payment/verify/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ [paymentService verifyPaymentStatus Crash]:', error.message);
      return { success: false, error: error.message };
    }
  }
};
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
      
      // 🧠 تحديد نوع العملية بذكاء وإرسالها للسيرفر
      const productType = cleanPlanId === 'token_booster' ? 'tokens' : 'subscription';

      // إرسال البيانات للباك إند الخاص بك بأمان 100%
      const response = await axiosInstance.post('/api/payment/create-invoice', {
        amount: Number(amount),
        planName: cleanPlanId,
        userId: userId,
        tokensToAdd: Number(tokensCount || 0),
        productType: productType // 👈 إضافة محدد النوع
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
import axiosInstance from '../config/axios';

/**
 * TrendAura Commercial Billing and Moyasar Gateway Connector Service
 */
export const paymentService = {
  /**
   * 💸 طلب فاتورة ورابط دفع مالي جديد من السيرفر
   */
  async createInvoice(amount, planName, userId) {
    try {
      const response = await axiosInstance.post('/api/payment/create-invoice', {
        amount,
        planName,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('❌ [paymentService createInvoice Ingestion Failure]:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   *  استجواب السيرفر للتحقق من نجاح عملية السداد البنكي
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
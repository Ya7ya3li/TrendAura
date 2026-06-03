import { supabase } from '../config/supabase';

/**
 * TrendAura Telemetry Token Usage and Subscription Tier Validation Service
 */
export const usageService = {
  /**
   * 📊 جلب رصيد التوكنز الأخير والمستهلك لحساب المستخدم الحالي
   */
  async getUsageStats(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('tokens_used, plan')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ [usageService getUsageStats Failure]:', error.message);
      return { tokens_used: 0, plan: 'free' };
    }
  },

  /**
   * 🛡️ فحص أهلية وصلاحية العميل للتوليد بناءً على سقف الباقة المحددة
   */
 /**
   * 🛡️ فحص أهلية وصلاحية العميل للتوليد (نسخة المحترفين)
   */
  async checkEligibility(userId, currentPlan = 'free') {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('tokens_used')
        .eq('id', userId)
        .single();
      
      // إذا حدث خطأ في الاتصال، لا نمنع المستخدم فوراً، بل نفحص الـ data
      if (error || !data) {
        console.warn('⚠️ [usageService]: تعذر جلب الاستهلاك، استخدام القيمة الافتراضية 0');
      }
      
      const tokensUsed = data?.tokens_used || 0;
      
      // تعريف سقف الاستهلاك (يمكنك لاحقاً سحب هذه القيم من جدول plans في الداتابيز مباشرة)
      const limits = { free: 5, pro: 1000, enterprise: 999999 };
      const maxLimit = limits[currentPlan.toLowerCase().trim()] || 5;
      
      return tokensUsed < maxLimit;
    } catch (error) {
      console.error('❌ [usageService checkEligibility Exception]:', error.message);
      return false; // إجراء أمني: في حال الفشل التام نمنع التوليد للحماية
    }
  }
};
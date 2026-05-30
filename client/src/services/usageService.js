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
  async checkEligibility(userId, currentPlan = 'free') {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('tokens_used')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // التوفيق والربط المباشر مع أسقف الثوابت القياسية للباقات المعتمدة
      const planKey = currentPlan.toLowerCase().trim();
      const maxLimit = planKey === 'free' ? 5 : planKey === 'pro' ? 100 : 999999;
      
      return (data?.tokens_used || 0) < maxLimit;
    } catch (error) {
      console.error('❌ [usageService checkEligibility Exception]:', error.message);
      return false;
    }
  }
};
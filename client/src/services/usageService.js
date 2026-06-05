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
   * 🛡️ فحص أهلية وصلاحية العميل للتوليد بناءً على سقف الباقة الحقيقية
   */
  async checkEligibility(userId, currentPlan = 'free') {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('tokens_used')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        console.warn('⚠️ [usageService]: تعذر جلب الاستهلاك، استخدام القيمة الافتراضية 0');
      }
      
      const tokensUsed = data?.tokens_used || 0;
      
      // 🏆 تم سحق الثغرة: توحيد المسمى بالملي ليتطابق مع الثوابت الحقيقية للمشروع
      const limits = { free: 5, pro: 1000, viral_engine: 999999 };
      const maxLimit = limits[currentPlan.toLowerCase().trim()] || 5;
      
      return tokensUsed < maxLimit;
    } catch (error) {
      console.error('❌ [usageService checkEligibility Exception]:', error.message);
      return false; // إجراء أمني: في حال الفشل التام نمنع التوليد للحماية
    }
  }
};
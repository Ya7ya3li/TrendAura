import { supabase } from './supabase.js';

/**
 * TrendAura User Token & Usage Verification Service - V2 Database Core
 */
export const usageService = {
  /**
   * 🛡️ فحص أهلية العميل وخصم التوكنز بشكل آمن تراكمي ممتد
   */
  checkAndIncrementUsage: async (userId, featureRequired = 'free') => {
    try {
      if (!userId) return false;

      // 1. جلب بيانات المحفظة والرتبة الحالية من جدول البروفايل الرئيسي
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tokens, plan')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('❌ [usageService Profile Fetch Error]:', error?.message);
        return false;
      }

      const currentPlan = (profile.plan || 'free').toLowerCase().trim();

      // 2. فحص صرامة الصلاحيات الهندسية للباقات المعتمدة
      if (featureRequired === 'viral_engine' && currentPlan !== 'viral_engine') {
        console.warn(`⚠️ [Block Guard]: User ${userId} with plan [${currentPlan}] tried to bypass Viral Engine walls.`);
        return false;
      }

      if (featureRequired === 'pro' && currentPlan !== 'pro' && currentPlan !== 'viral_engine') {
        console.warn(`⚠️ [Block Guard]: User ${userId} tried to access Pro features illegally.`);
        return false;
      }

      // 3. فحص الأمان لعمق الرصيد المالي المتاح
      if ((profile.tokens ?? 0) <= 0) {
        console.warn(`⚠️ [Quota Depleted]: User ${userId} has zero token capacity.`);
        return false;
      }

      // 4. خصم 10 توكنز (خصم قياسي موحد متناسق مع الفرونت إند لكل عملية توليد شاملة)
      const currentTokensBalance = profile.tokens ?? 0;
      const updatedTokensBalance = Math.max(0, currentTokensBalance - 10);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tokens: updatedTokensBalance })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [usageService Token Decrement Error]:', updateError.message);
        return false;
      }

      return true; 
    } catch (err) {
      console.error('❌ [usageService Internal Failure Ingestion]:', err.message);
      return false;
    }
  }
};
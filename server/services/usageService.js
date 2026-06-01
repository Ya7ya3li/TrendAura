import { supabase } from './supabase.js';

/**
 * TrendAura User Token & Usage Verification Service - V2 Database Core
 * Validates, checks, enforces subscription tiers, and decrements tokens securely.
 */
export const usageService = {
  checkAndIncrementUsage: async (userId, featureRequired = 'free') => {
    try {
      if (!userId) return false;

      // 1. جلب بيانات رصيد التوكنز الحالي ونوع الباقة من جدول البروفايل
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tokens, plan')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('❌ [usageService Profile Fetch Error]:', error?.message);
        return false;
      }

      // 2. فحص صلاحيات الباقة (Subscription Logic Check)
      // إذا كانت الميزة تطلب محرك الفايرال، ولا يملكها المستخدم في باقته، نمنع الوصول
      if (featureRequired === 'viral_engine' && profile.plan !== 'viral_engine') {
        console.warn(`⚠️ [Block]: User ${userId} with plan ${profile.plan} tried to access Viral Engine.`);
        return false;
      }

      if (featureRequired === 'pro' && profile.plan !== 'pro' && profile.plan !== 'viral_engine') {
        console.warn(`⚠️ [Block]: User ${userId} tried to access Pro features.`);
        return false;
      }

      // 3. فحص الأمان المالي للتوكنز
      if (profile.tokens <= 0) {
        return false;
      }

      // 4. خصم توكن واحد (1 Token) بطريقة آمنة
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tokens: profile.tokens - 1 })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [usageService Token Update Error]:', updateError.message);
        return false;
      }

      return true; 
    } catch (err) {
      console.error('❌ [usageService Internal Failure]:', err.message);
      return false;
    }
  }
};
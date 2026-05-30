import { supabase } from './supabase.js';

/**
 * TrendAura User Token & Usage Verification Service - V2 Database Core
 * Validates, checks, and decrements user tokens from Supabase dynamically.
 */
export const usageService = {
  checkAndIncrementUsage: async (userId) => {
    try {
      if (!userId) return false;

      // 1. جلب بيانات رصيد التوكنز الحالي الخاص بالمستخدم من جدول البروفايل
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tokens, plan')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('❌ [usageService Profile Fetch Error]:', error?.message);
        return false;
      }

      // 2. فحص الأمان: إذا كان رصيد التوكنز مخلص أو صفر، نرفض التوليد فوراً ليظهر كرت الترقية
      if (profile.tokens <= 0) {
        return false;
      }

      // 3. خصم توكن واحد (1 Token) من الحساب مقابل عملية هندسة وتوليد السكريبت الحالية
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tokens: profile.tokens - 1 })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [usageService Token Update Error]:', updateError.message);
        return false;
      }

      return true; // تم التحقق والخصم بنجاح، مرر الطلب للذكاء الاصطناعي
    } catch (err) {
      console.error('❌ [usageService Internal Failure]:', err.message);
      return false;
    }
  }
};
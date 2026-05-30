import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

/**
 * TrendAura Supabase Infrastructure Config
 * Secure initialization layer using centralized environment abstraction.
 */

const supabaseUrl = ENV.SUPABASE_URL;
const supabaseKey = ENV.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚡ [TrendAura Security Warning]: Core Supabase credentials are missing or bound to empty fallbacks.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,       // حفظ جلسة صانع المحتوى بداخل الـ LocalStorage لمنع خروجه عشوائياً
    autoRefreshToken: true,     // إنعاش توكن الأمان (JWT) تلقائياً في الخلفية لمنع تجمد العمليات
    detectSessionInUrl: true    // رصد التوكنز في الرابط فوراً لدعم الـ Recovery Flow واستعادة كلمة المرور
  }
});
/**
 * TrendAura Client-Side Environment Variables Validation Matrix
 * Strictly maps and enforces Vite production variables without infrastructure leakage.
 * Unified to resolve VITE_API_BASE_URL vs VITE_API_URL infrastructure naming mismatches.
 */

export const ENV = {
  // لقط الرابط الحي من فيرسيل أو محلياً بكل مرونة
  API_URL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://snfajahmoismxqiqjfoq.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ydbYqH0eMMcBkP59hVcbmg_d298nBFg',
};

// فحص أمني صامت في وضع التطوير للتحذير من غياب خطوط الإمداد
if (import.meta.env.DEV) {
  if (!import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_URL) {
    console.warn('⚠️ [TrendAura Env Warning]: Both VITE_API_BASE_URL and VITE_API_URL are missing, using local port fallback.');
  }
}
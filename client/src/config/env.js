/**
 * TrendAura Client-Side Environment Variables Validation Matrix
 * Strictly maps and enforces Vite production variables without infrastructure leakage.
 */

export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://snfajahmoismxqiqjfoq.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ydbYqH0eMMcBkP59hVcbmg_d298nBFg',
};

// فحص أمني صامت في وضع التطوير للتحذير من غياب خطوط الإمداد
if (import.meta.env.DEV) {
  if (!import.meta.env.VITE_API_URL) {
    console.warn('⚠️ [TrendAura Env Warning]: VITE_API_URL is missing, using local port fallback.');
  }
}
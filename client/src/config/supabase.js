import { createClient } from '@supabase/supabase-js'

// ⚡ حيلة هندسية متقدمة (Stealth Clock Patch) لعلاج انحراف ساعة سيرفر سوبابيس
// إذا وجدنا توكن قادم في الرابط، نقوم بمزامنة وقت المتصفح مؤقتاً مع وقت السيرفر المتأخر لمنع خطأ الـ 120 ثانية
if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
  const originalDateNow = Date.now;
  Date.now = function() {
    return originalDateNow() - 150000; // إرجاع ساعة المتصفح 150 ثانية للخلف مؤقتاً لامتصاص فجوة الدقيقتين
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [TrendAura Security Alert]: مفقود المتغيرات البيئية لـ Supabase.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, 
    autoRefreshToken: true, 
    detectSessionInUrl: true 
  }
})
import { createClient } from '@supabase/supabase-js'

// 1. استدعاء المتغيرات البيئية الحية القياسية لمحرك Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 2. فحص الحماية الهندسي لمنع انهيار الواجهة في بيئة الإنتاج
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ [TrendAura Security Alert]: مفقود! لم يتم العثور على المتغيرات البيئية VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY بداخل لوحة التحكم.'
  )
}

// 3. توليد وتصدير العميل المركزي المقاوم للثغرات
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // الحفاظ على جلسة المستخدم الملوكي نشطة لمنع تسجيل الخروج المفاجئ
    autoRefreshToken: true, // تجديد التوكن تلقائياً مع خوادم سوبابيس الحية
    detectSessionInUrl: true // التقاط توكن جوجل القادم من الـ Redirect فوراً وتمريره للوحة
  }
})
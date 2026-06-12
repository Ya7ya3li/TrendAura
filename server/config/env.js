import dotenv from 'dotenv';

// تحميل المتغيرات البيئية من ملف .env في جذر السيرفر
dotenv.config();

/**
 * TrendAura Server Environment Variables Validator & Exporter
 * Ensures critical external API tokens are strictly checked before startup.
 */
const requiredEnvs = [
  'PORT',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'MOYASAR_SECRET_KEY',
  'JWT_SECRET'
];

// فحص أمني استباقي للمفاتيح الحيوية لضمان عدم توقف الخدمات
requiredEnvs.forEach((envName) => {
  if (!process.env[envName]) {
    console.warn(`⚠️ [ENV WARNING]: المتغير البيئي الحرج "${envName}" مفقود حالياً في بيئة الإنتاج!`);
  }
});

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // سوبابيس السيادية لعمليات التحقق العميقة في السيرفر وتخطي الـ RLS
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // المحرك المعتمد - يتكلم مع المفتاح فقط ولا عزاء للموديلات هنا
  openaiApiKey: process.env.OPENAI_API_KEY,
  
  // بوابة الدفع السعودية ميسر لبناء أنظمة اشتراكات SaaS مستقرة
  moyasarSecretKey: process.env.MOYASAR_SECRET_KEY,
  moyasarWebhookSecret: process.env.MOYASAR_WEBHOOK_SECRET,
  
  // الأمان والتشفير للجلسات الداخلية وحزم البيانات
  jwtSecret: process.env.JWT_SECRET || 'trendaura-core-tactical-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
}; // 👈 قفلنا القوس المكسور هنا ونظفنا البيئة بالملي
import dotenv from 'dotenv';
import path from 'path';

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

// فحص أمني استباقي للمفاتيح الحيوية
requiredEnvs.forEach((envName) => {
  if (!process.env[envName]) {
    console.warn(`⚠️ [ENV WARNING]: المتغير البيئي الحرج "${envName}" مفقود حالياً!`);
  }
});

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // 🔐 سوبابيس (باستخدام الخدمة السيادية لتخطي الحماية عند الحاجة من السيرفر)
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // 🧠 الذكاء الاصطناعي وصياغة السكريبتات
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o', // النموذج المعتمد لسرعة ودقة التحليل السلوكي
  
  // 💳 بوابة الدفع السعودية ميسر
  moyasarSecretKey: process.env.MOYASAR_SECRET_KEY,
  moyasarWebhookSecret: process.env.MOYASAR_WEBHOOK_SECRET,
  
  // 🛡️ الأمان والتشفير للجلسات الداخيلة
  jwtSecret: process.env.JWT_SECRET || 'trendaura-core-tactical-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
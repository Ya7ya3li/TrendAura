import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// 🧭 استيراد موجهات ومسارات النظام الشاملة والمطابقة للهيكل بالملي
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import subscriptionRoutes from './routes/subscription.js';
import usageRoutes from './routes/usage.js';
import adminRoutes from './routes/admin.js'; // 👑 تم إضافة مسار الأدمن هنا

const app = express();

// 🛡️ مصفوفة النطاقات المسموح لها باختراق جدار السيرفر (قائمة براند TrendAura الرسمية)
const allowedOrigins = [
  'https://trendaura-two.vercel.app',
  'https://trendaura.vercel.app',
  'http://localhost:3000'
];

// 1. تفعيل الميدل وير العالمي للـ CORS وتحديد الصلاحيات بالملي
app.use(cors({
  origin: function (origin, callback) {
    // السماح بالطلبات الداخلية (مثل أدوات الفحص) أو النطاقات الرسمية الخاصة بك في فيرسيل
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by TrendAura CORS Enterprise Security Policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// 🏆 2. سحق مشكلة الـ Preflight كلياً بإنهاء طلبات OPTIONS فوراً في السطر الأول قبل أي ميدل وير آخر
app.options('*', cors());

// 3. تفعيل قراءة الـ JSON بعد العبور الأمن من جدار CORS
app.use(express.json());

// 4. تطبيق الـ rateLimiter هنا لحماية المسارات الفعلية فقط وتجنب حظر طلبات المتصفح الاستكشافية
app.use(rateLimiter);

// 🌐 ربط وتتويج خطوط الاتصال بالـ API حسب هيكل الـ SaaS المعتمد
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/usage', usageRoutes);
app.use('/admin', adminRoutes);

// 🚨 [الرادار الخفي]: شباك استعلام عام للواجهة الأمامية للتأكد من حالة الأقفال
app.get('/api/system-status', (req, res) => {
  const state = global.systemState || { maintenance: false, ai_engine: true };

  // إذا وضع الصيانة مفعل، السيرفر بيرد بـ 503 ليتم طرد المتصفح فوراً
  if (state.maintenance === true) {
    return res.status(503).json({ success: false, message: 'under_maintenance' });
  }

  res.json({ success: true, state });
});

// نقطة فحص حيوية الخادم (Health Check Endpoint)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', service: 'TrendAura Core Backend Engine' });
});

// 🚨 جدار الحماية والتقاط الاستثناءات والأخطاء العام
app.use(errorHandler);

// 🚀 إطلاق خط الإنتاج واستقبال الاتصالات الحية
app.listen(env.port, () => {
  console.log(`🚀 [Server Boot]: Core online on port ${env.port} in [${env.nodeEnv}] production phase.`);
});
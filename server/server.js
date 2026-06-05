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

const app = express();

// 🛡️ إعداد بروتوكولات الميدل وير العالمية لحماية البيانات
app.use(cors({ origin: '*' })); 
app.use(express.json());       
app.use(rateLimiter);          

// 🌐 ربط وتتويج خطوط الاتصال بالـ API حسب هيكل الـ SaaS المعتمد
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/usage', usageRoutes);

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
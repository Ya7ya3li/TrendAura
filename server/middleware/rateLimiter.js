import { CONSTANTS } from '../config/constants.js';

// مستودع مؤقت في الذاكرة لتتبع الطلبات لكل IP
const ipRequestCache = new Map();

// إعدادات الحماية: الحد الأقصى 60 طلباً في الدقيقة لكل جهاز
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

/**
 * TrendAura DDOS Mitigation & Rate Limiting Guard
 */
export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown-client';
  const currentTime = Date.now();

  if (!ipRequestCache.has(ip)) {
    ipRequestCache.set(ip, { count: 1, startTime: currentTime });
    return next();
  }

  const clientData = ipRequestCache.get(ip);
  const timeElapsed = currentTime - clientData.startTime;

  if (timeElapsed > WINDOW_MS) {
    // تصفير العداد وتجديد النافذة الزمنية تلقائياً بعد انتهاء الدقيقة
    ipRequestCache.set(ip, { count: 1, startTime: currentTime });
    return next();
  }

  clientData.count += 1;

  // حظر العميل فوراً إذا تجاوز أسقف المرور المسموحة
  if (clientData.count > MAX_REQUESTS) {
    return res.status(CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: '⚠️ تم رصد حركة مرور غير طبيعية؛ يرجى التوقف عن إغراق السيرفر والمحاولة بعد دقيقة.'
    });
  }

  return next();
};
import { CONSTANTS } from '../config/constants.js';
import { env } from '../config/env.js';

/**
 * TrendAura Centralized Global Error Capture Hub
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;

  // طباعة الخطأ بداخل سيرفر التطوير للتصحيح والمراقبة
  console.error(`🚨 [Global System Error Exception]:`, {
    message: err.message,
    stack: env.nodeEnv === 'development' ? err.stack : '🔒 المحتوى محمي في الخوادم الرسمية',
    path: req.originalUrl,
    method: req.method
  });

  // توحيد نمط الخرج اللحظي لكافة الأخطاء المنهارة
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.nodeEnv === 'development' && { debugStack: err.stack })
  });
};
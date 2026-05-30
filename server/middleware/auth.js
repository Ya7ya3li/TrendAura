import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Core Authentication Guard Middleware
 * Validates incoming session bearer tokens before downstream execution.
 */
export const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // التحقق من وجود الهيدر وصيغة الـ Bearer المعتمدة عالمياً
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const token = authHeader.split(' ')[1];

    // فك تشفير التوكن والتحقق من صلاحيته الزمنية والأمنية
    jwt.verify(token, env.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'انتهت صلاحية الجلسة الأمنية، يرجى إعادة تسجيل الدخول.'
        });
      }

      // تلقيم بيانات المستخدم وفك تشفير الهوية بداخل الطلب حياً
      req.user = {
        id: decoded.id,
        email: decoded.email,
        plan: decoded.plan || 'free'
      };
      
      return next();
    });
  } catch (error) {
    console.error('❌ [authGuard Security Violation]:', error.message);
    return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: CONSTANTS.ERROR_MESSAGES.SERVER_ERROR
    });
  }
};
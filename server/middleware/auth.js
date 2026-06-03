import { env } from '../config/env.js';
import { CONSTANTS } from '../config/constants.js';

export const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🛡️ السماح بمرور الطلبات بدون توكن (للتعامل معها في الـ Controller)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    // 🚀 الحل القاطع: إرسال التوكن لـ Supabase للتحقق منه مباشرة
    // هذا يتجاوز مشكلة (ES256) لأن Supabase هو من سيقوم بفك التشفير
    const supabaseUrl = env.supabaseUrl || process.env.SUPABASE_URL;
    const supabaseKey = env.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [authGuard Error]: Missing Supabase Credentials in Server');
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'خطأ في إعدادات الخادم الأمنية.'
      });
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseKey
      }
    });

    if (!response.ok) {
      console.error('❌ [Supabase Verification Error]: Token Rejected by Supabase');
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول.'
      });
    }

    // 🟢 التوكن سليم! جلب بيانات المستخدم
    const user = await response.json();

    req.user = {
      id: user.id,
      email: user.email,
      plan: user.app_metadata?.plan || user.user_metadata?.plan || 'free'
    };

    return next();
  } catch (error) {
    console.error('❌ [authGuard Security Violation]:', error.message);
    return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: CONSTANTS.ERROR_MESSAGES.SERVER_ERROR
    });
  }
};
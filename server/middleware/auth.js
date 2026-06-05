import { env } from '../config/env.js';
import { CONSTANTS } from '../config/constants.js';

export const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // السماح بمرور الطلبات بدون توكن للتعامل معها في الـ Controller أو حظرها شرطياً
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const token = authHeader.split(' ')[1];

    // الحل القاطع: إرسال التوكن لـ Supabase للتحقق منه مباشرة لتخطي معايير تشفير ES256
    const supabaseUrl = env.supabaseUrl;
    const supabaseKey = env.supabaseServiceKey; // تم سحق الثغرة ومطابقتها للمتغير الفعلي بالملي

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [authGuard Error]: Missing Supabase Credentials in Server config');
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'خطأ في إعدادات الخادم الأمنية الفيدرالية.'
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
      console.error('❌ [Supabase Verification Error]: Token Rejected by Auth Engine');
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'انتهت صلاحية الجلسة الحية للمتصفح، يرجى إعادة تسجيل الدخول.'
      });
    }

    const user = await response.json();

    // حقن كائن المستخدم المصادق عليه بداخل الطلب الحالي
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
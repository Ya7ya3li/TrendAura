import { env } from '../config/env.js';
import { CONSTANTS } from '../config/constants.js';
import { supabase } from '../services/supabase.js'; // 👑 جلبنا المحرك الرسمي مباشرة

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

    // 👑 التعديل الجذري: استخدام دالة الفحص الرسمية النظيفة (بدون خلط المفاتيح)
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('❌ [Supabase Verification Error]:', error?.message || 'Token Rejected');
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'انتهت صلاحية الجلسة الحية للمتصفح، يرجى إعادة تسجيل الدخول.'
      });
    }

    // 👑 بروتوكول عزل الشبكة الصارم (Check Ban Status) 👑
    // نقوم بجلب حالة الحظر والباقة الحالية مباشرة من جدول الحسابات الشخصية
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_banned, plan')
      .eq('id', user.id)
      .single();

    // 🚨 إذا اكتشف الحارس أن الكيان معزول أو محظور، يتم قطع حرارته ورفض الطلب فوراً
    if (profile?.is_banned === true) {
      console.warn(`🔒 [Security Alert]: Banned user ${user.email} attempted to breach the gateway.`);
      return res.status(403).json({
        success: false,
        error: '🚨 تم عزل هذا الحساب وسحب صلاحياته الأمنية من الشبكة، يرجى مراجعة إدارة النظام.'
      });
    }

    // حقن كائن المستخدم المصادق عليه بداخل الطلب الحالي مع جلب الخصائص المحدثة
    req.user = {
      id: user.id,
      email: user.email,
      plan: (profile?.plan || user.app_metadata?.plan || user.user_metadata?.plan || 'free').toLowerCase().trim()
    };

    // 👑 التنفيذ الفعلي والصارم لمفاتيح الطوارئ (Kill Switches) 👑
    const sysState = global.systemState || { maintenance: false, ai_engine: true };

    // 1. تفعيل مفتاح الصيانة: طرد الجميع باستثناء طلبات لوحة التحكم لضمان عدم انغلاق النظام على الإدارة
    if (sysState.maintenance === true && !req.originalUrl.includes('/admin')) {
      return res.status(503).json({
        success: false,
        error: '🚨 النظام حالياً تحت الصيانة الفيدرالية الشاملة، نعود لكم قريباً!'
      });
    }

    // 2. تفعيل مفتاح الذكاء الاصطناعي: حظر مسارات التوليد وصناعة السكريبتات فوراً
    if (sysState.ai_engine === false && (req.originalUrl.includes('/ai') || req.originalUrl.includes('/generate') || req.originalUrl.includes('/viral'))) {
      return res.status(503).json({
        success: false,
        error: '🧠 محرك الذكاء الاصطناعي متوقف مؤقتاً للصيانة الفنية، يرجى المحاولة لاحقاً.'
      });
    }

    return next(); // السماح بالمرور إذا كانت الأمور سليمة
  } catch (error) {
    console.error('❌ [authGuard Security Violation]:', error.message);
    return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: CONSTANTS.ERROR_MESSAGES.SERVER_ERROR
    });
  }
};
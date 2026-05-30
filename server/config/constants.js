/**
 * TrendAura Global Server Business Rules & System Constants
 * Strictly maps license competency thresholds and operational metrics.
 */
export const CONSTANTS = {
  // 👑 حدود صلاحيات باقات الاشتراكات الرقمية حياً
  PLAN_LIMITS: {
    free: {
      dailyGenerations: 5,
      features: ['basic_hook', 'basic_script'],
      hasAiScore: false,
      hasRetentionCurve: false
    },
    pro: {
      dailyGenerations: 100,
      features: ['advanced_hook', 'advanced_script', 'hashtags', 'best_times'],
      hasAiScore: false,
      hasRetentionCurve: false
    },
    viral_engine: {
      dailyGenerations: 999999, // ♾️ لا محدود كلياً لصناع المحتوى المحترفين
      features: ['all_access', 'viral_engine_portal', 'hashtags', 'best_times'],
      hasAiScore: true,
      hasRetentionCurve: true
    }
  },

  // 📝 قيود هندسة ومراجعة النصوص والمدخلات
  PROMPT_CONSTRAINTS: {
    maxInputLength: 500,
    minInputLength: 5,
    defaultLanguage: 'ar'
  },

  // 🛡️ رموز واستجابات نظام الحماية والاتصال (HTTP Status Codes)
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  },

  // 🛑 رسائل النظام الموحدة عند حدوث الأخطاء
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'جلسة التحقق غير صالحة، يرجى تسجيل الدخول مجدداً.',
    FORBIDDEN: 'صلاحيات باقتك الحالية لا تسمح بالوصول لهذه الميزة.',
    LIMIT_EXCEEDED: '⚠️ لقد استهلكت كامل حصتك المتاحة لهذا اليوم، يرجى الترقية لإطلاق القدرات.',
    SERVER_ERROR: 'حدث خطأ داخلي في خوادم المعالجة، جاري المراجعة من الدعم الفني.'
  }
};
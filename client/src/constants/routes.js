/**
 * TrendAura Global Route Path Constants - V2 Enterprise Edition
 * المصدر الوحيد للحقيقة (Single Source of Truth) لجميع مسارات التنقل.
 * مُقفل (Frozen) لمنع التعديلات الجانبية وضمان استقرار الـ Routing.
 */

export const ROUTES = Object.freeze({
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
  PRICING: '/pricing',
  SUBSCRIPTION: '/subscription-management',
  SETTINGS: '/settings',
  SUCCESS: '/success',
  MAINTENANCE: '/maintenance',
  NOT_FOUND: '*',
});

/**
 * دالة مساعدة (Helper) للتحقق من المسارات المحمية
 * تم تحديثها لربط مسار الاشتراكات الداخلي بالملي
 */
export const isProtectedRoute = (path) => {
  const protectedRoutes = [
    ROUTES.DASHBOARD, 
    ROUTES.HISTORY, 
    ROUTES.PRICING, // تم إضافته لربط المسار وحمايته هيدروليكياً
    ROUTES.SUBSCRIPTION, 
    ROUTES.SETTINGS
  ];
  return protectedRoutes.includes(path);
};
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
 * تمنع أي تداخل في منطق الـ Route Guards
 */
export const isProtectedRoute = (path) => {
  const protectedRoutes = [
    ROUTES.DASHBOARD, 
    ROUTES.HISTORY, 
    ROUTES.SUBSCRIPTION, 
    ROUTES.SETTINGS
  ];
  return protectedRoutes.includes(path);
};
/**
 * TrendAura Branding and Technical Global Boundaries
 */
export const APP_CONFIG = {
  BRAND: {
    name: 'TrendAura',
    tagline: 'منصتك الذكية لتوليد سكربتات فيروسية تخترق الخوارزميات',
    version: '1.0.0',
    copyright: `جميع الحقوق محفوظة لمنصة TrendAura © ${new Date().getFullYear()}`
  },
  LIMITS: {
    maxPromptLength: 500,        // سقف الحروف المسموح بها بداخل مربع المدخلات في الداشبورد
    toastDuration: 3500          // مهلة عرض كبسولات التنبيهات بالملي ثانية
  },
  LEGAL: {
    termsOfService: '/terms',
    privacyPolicy: '/privacy'
  }
};
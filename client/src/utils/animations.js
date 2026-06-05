/**
 * TrendAura Dynamic Animation Class Orchestrator
 * Integrates directly with animations.css to build seamless, performance-optimized stagger effects.
 */
export const animations = {
  /**
   * توليد قيمة تأخير الحركة برمجياً لعناصر القوائم والكروت (Stagger Effect)
   */
  getStaggerDelay(index, baseDelay = 100) {
    return {
      animationDelay: `${index * baseDelay}ms`,
      animationFillMode: 'both'
    };
  },

  /**
   * دالة دمج كلاسات المؤثرات الحركية والشرطية بنقاء ودون فراغات مشوهة
   */
  cls(...classes) {
    return classes.filter(Boolean).join(' ');
  }
};
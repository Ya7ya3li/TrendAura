/**
 * TrendAura Programmatic Smooth-Motion Animation Utilities
 */
export const animations = {
  /**
   * النزول والانتقال البصري السلس إلى عنصر محدد في اللوحة
   */
  scrollToElement(elementId) {
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  },

  /**
   * إحداث اهتزاز ميكروي مؤقت للكروت عند حدوث رفض أو خطأ في الإدخال
   */
  triggerShake(elementRef) {
    if (elementRef && elementRef.current) {
      elementRef.current.classList.add('animate-shake');
      setTimeout(() => {
        elementRef.current.classList.remove('animate-shake');
      }, 400);
    }
  }
};
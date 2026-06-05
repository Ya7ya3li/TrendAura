/**
 * TrendAura Text Sanitization and Structural Reformatter
 * Cleans string anomalies and injects optimal typography bounds.
 */
export const formatText = {
  /**
   * تنظيف وتطهير النصوص من الفراغات المزدوجة والرموز المكسورة
   */
  sanitize(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  },

  /**
   * تقليص النصوص الطويلة مع وضع نقاط الاختصار لحماية كروت العرض في الواجهة
   */
  truncate(text, maxLength = 120) {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  },

  /**
   * استخراج علامات الهاشتاق المدمجة بداخل النص بشكل منفصل متكامل
   */
  extractHashtags(text) {
    if (!text) return [];
    // تعبير نمطي يدعم الرموز العربية والإنجليزية والأرقام لجمع دقيق
    const regex = /#[\u0621-\u064A\w]+/g;
    const matches = text.match(regex);
    return matches ? [...new Set(matches)] : [];
  }
};
/**
 * TrendAura Structural Form Input Validation Subsystem
 */
export const validators = {
  /**
   * التحقق من سلامة وصيغة البريد الإلكتروني
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * فحص قوة كلمة المرور لمنع الحسابات الهشة
   */
  isStrongPassword(password) {
    return password && password.length >= 6;
  },

  /**
   * فحص سقف الفكرة المكتوبة وحصرها بحدود الـ 500 حرف القياسية لـ TrendAura
   */
  validatePrompt(promptText) {
    if (!promptText || promptText.trim().length === 0) {
      return { isValid: false, message: 'حقل فكرة المحتوى لا يمكن أن يكون فارغاً' };
    }
    if (promptText.length > 500) {
      return { isValid: false, message: 'لقد تخطيت الحد الأقصى المسموح به (500 حرف)' };
    }
    return { isValid: true, message: '' };
  }
};
import { showToast } from '../App';

/**
 * TrendAura Async Clipboard Write Ingestion
 * Safely transfers layout buffer strings directly to client environment devices.
 */
export const copyToClipboard = async (text, successMessage = 'تم نسخ النص بنجاح ملوكي! 📋') => {
  if (!text || text.trim().length === 0) {
    if (typeof showToast === 'function') {
      showToast('لا يوجد نص صالح للنسخ حالياً', 'warning');
    }
    return false;
  }

  try {
    // 🛡️ فحص وجود محرك النسخ الحديث في متصفح العميل
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      if (typeof showToast === 'function') showToast(successMessage, 'success');
      return true;
    } else {
      // نظام الحماية الخلفي للمتصفحات القديمة أو بيئات الموبايل المقيدة
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      if (typeof showToast === 'function') showToast(successMessage, 'success');
      return true;
    }
  } catch (error) {
    console.error('❌ [copyToClipboard Utility Exception]:', error.message);
    if (typeof showToast === 'function') {
      showToast('فشل نسخ النص، يرجى المحاولة يدوياً', 'error');
    }
    return false;
  }
};
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Structural Content Verification Engine
 */
export const validateRequest = {
  generationBody: (req, res, next) => {
    const { prompt, option } = req.body;
    const { minInputLength, maxInputLength } = CONSTANTS.PROMPT_CONSTRAINTS;

    // 1. فحص وجود النص ونقائه من الفراغات
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'حقل فكرة السكريبت مطلوب ولا يمكن معالجة مدخلات فارغة.'
      });
    }

    const cleanPrompt = prompt.trim();

    // 2. فحص الطول الهندسي للكلمات والحدود المقفلة براداري
    if (cleanPrompt.length < minInputLength || cleanPrompt.length > maxInputLength) {
      return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: `حجم الفكرة يجب أن يتراوح بين ${minInputLength} إلى ${maxInputLength} حرف كحد أقصى مسموح به.`
      });
    }

    // تنظيف وتحديث جسم الطلب بالنص المصفى والمطهر
    req.body.prompt = cleanPrompt;
    return next();
  }
};
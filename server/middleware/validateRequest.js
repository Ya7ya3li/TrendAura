import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Structural Content Verification Engine
 */
export const validateRequest = {
  generationBody: (req, res, next) => {
    const { prompt } = req.body;
    const { minInputLength, maxInputLength } = CONSTANTS.PROMPT_CONSTRAINTS;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'حقل فكرة السكريبت مطلوب كلياً ولا يمكن معالجة مدخلات فارغة.'
      });
    }

    const cleanPrompt = prompt.trim();

    if (cleanPrompt.length < minInputLength || cleanPrompt.length > maxInputLength) {
      return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: `حجم الفكرة الفيروسية يجب أن يتراوح بين ${minInputLength} إلى ${maxInputLength} حرف كحد أقصى مسموح به بالنظام.`
      });
    }

    req.body.prompt = cleanPrompt;
    return next();
  }
};
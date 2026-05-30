import { openaiService } from '../services/openai.js';
import { usageService } from '../services/usageService.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura AI Core Script Generation Engine Controller
 */
export const aiController = {
  generateScript: async (req, res, next) => {
    try {
      const { prompt, option } = req.body;
      const userId = req.user?.id; // مستخرج من middleware الحماية

      // 1. فحص أمني لطول المدخلات
      if (!prompt || prompt.length > CONSTANTS.PROMPT_CONSTRAINTS.maxInputLength) {
        return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'النص المرفق يخالف المعايير القياسية لطول المدخلات.'
        });
      }

      // 2. التحقق من الحصة اليومية المتبقية للمستخدم في قاعدة البيانات
      const canGenerate = await usageService.checkAndIncrementUsage(userId);
      if (!canGenerate) {
        return res.status(CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS).json({
          success: false,
          error: CONSTANTS.ERROR_MESSAGES.LIMIT_EXCEEDED
        });
      }

      // 3. استدعاء خدمة OpenAI لمعالجة النص بالهندسة النفسية والسلوكية
      const scriptResult = await openaiService.generateViralContent(prompt, option);

      // 4. إعادة البيانات كاملة ومطابقة لمتطلبات كروت لوحة التحكم
      return res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: {
          hook: scriptResult.hook,
          script: scriptResult.script,
          cta: scriptResult.cta,
          hashtags: scriptResult.hashtags || ['#تطوير_ذات', '#ترند', '#TrendAura'],
          aiScore: scriptResult.aiScore || 94,
          retentionRate: scriptResult.retentionRate || 88
        }
      });
    } catch (error) {
      console.error('❌ [aiController Error]:', error.message);
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: CONSTANTS.ERROR_MESSAGES.SERVER_ERROR
      });
    }
  }
};
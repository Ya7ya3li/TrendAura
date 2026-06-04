// المسار: server/services/openai.js
import OpenAI from 'openai';
import { env } from '../config/env.js';

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
  // توجيه الطلبات إلى خوادم OpenRouter
  baseURL: "[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)",
});

/**
 * TrendAura AI Psychological Script Engineering Service
 * Modified for maximum compatibility with diverse OpenRouter free models.
 */
export const openaiService = {
  generateViralContent: async (userPrompt, option = 'تحفيزي') => {
    try {
      const systemContext = `
        أنت خبير سيكولوجية الجماهير وصناعة المحتوى الفيروسي الأكثر انتشاراً على تيك توك وسوشيال ميديا.
        مهمتك هي إعادة صياغة فكرة المستخدم وهندستها نصياً كسكريبت احترافي يمنع التمرير.
        
        مهم جداً: يجب أن تعيد الخرج بدقة مطلقة ككائن JSON فقط وبالمفاتيح التالية حصرياً.
        ممنوع منعاً باتاً إضافة أي نصوص أو شروحات قبل أو بعد كود الـ JSON. وممنوع استخدام علامات Markdown مثل \`\`\`json. أعد الكائن مباشرة هكذا:
        {
          "hook": "مقدمة خاطفة وصادمة وجذابة جداً لمنع التمرير في أول 3 ثوانٍ تتناسب مع خيار أسلوب المحتوى",
          "script": "عرض السيناريو والنص الجسدي والقصصي للفيديو بشكل مشوق ومختصر ومريح للقراءة",
          "cta": "نداء تفاعلي ذكي يحث المشاهد على المتابعة أو التعليق أو مشاركة الفيديو فوراً",
          "hashtags": ["ثلاثة", "هاشتاقات", "ترند"],
          "aiScore": 94,
          "retentionRate": 88
        }
        
        أسلوب المحتوى المطلوب الالتزام به: ${option}.
      `;

      const response = await openai.chat.completions.create({
        model: env.openaiModel || 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: `فكرة الفيديو: ${userPrompt}` }
        ],
        // 🗑️ تم إزالة response_format لمنع خطأ 400 مع موديلات جوجل و ميتا
        temperature: 0.75,
      });

      let rawJson = response.choices[0].message.content.trim();
      
      // 🧹 دالة تنظيف سريعة: في حال قام الموديل بإضافة علامات الماركداون بالخطأ نقوم بإزالتها
      if (rawJson.startsWith('```json')) {
        rawJson = rawJson.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (rawJson.startsWith('```')) {
        rawJson = rawJson.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      return JSON.parse(rawJson);

    } catch (error) {
      console.error('❌ [OpenAI Core Error]:', error.message);
      throw new Error('فشل الاتصال بمحرك الذكاء الاصطناعي: ' + error.message);
    }
  }
};
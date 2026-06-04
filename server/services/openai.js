import OpenAI from 'openai';
import { env } from '../config/env.js';

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

/**
 * TrendAura AI Psychological Script Engineering Service
 * Forces structured JSON format execution directly from OpenAI models.
 */
export const openaiService = {
  generateViralContent: async (userPrompt, option = 'تحفيزي') => {
    try {
      const systemContext = `
        أنت خبير سيكولوجية الجماهير وصناعة المحتوى الفيروسي الأكثر انتشاراً على تيك توك وسوشيال ميديا.
        مهمتك هي إعادة صياغة فكرة المستخدم وهندستها نصياً كسكريبت احترافي يمنع التمرير.
        
        يجب أن تعيد الخرج بدقة مطلقة ككائن JSON فقط وبالمفاتيح التالية حصرياً وبدون أي نصوص مقدمة أو خاتمة خارج الـ JSON:
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

      // 🛡️ التعديل: تأمين الموديل بقيمة افتراضية (gpt-3.5-turbo-1106) تدعم صيغة JSON
      const response = await openai.chat.completions.create({
        model: env.openaiModel || 'gpt-3.5-turbo-1106',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: `فكرة الفيديو: ${userPrompt}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.75,
      });

      const rawJson = response.choices[0].message.content;
      return JSON.parse(rawJson);

    } catch (error) {
      // 🚨 التعديل الجوهري: إزالة البيانات الوهمية ورمي الخطأ الحقيقي لنصطاده في الكونسول
      console.error('❌ [OpenAI Core Error]:', error.message);
      throw new Error('فشل الاتصال بمحرك الذكاء الاصطناعي: ' + error.message);
    }
  }
};
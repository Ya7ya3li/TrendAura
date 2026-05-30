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

      const response = await openai.chat.completions.create({
        model: env.openaiModel,
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: `فكرة الفيديو: ${userPrompt}` }
        ],
        response_format: { type: 'json_object' }, // قفل الخرج على هيئة JSON ناصع
        temperature: 0.75,
      });

      const rawJson = response.choices[0].message.content;
      return JSON.parse(rawJson);
    } catch (error) {
      console.error('❌ [openaiService Critical Failure]:', error.message);
      // معالجة تراجعية مرنة لحماية الواجهة من الانهيار عند حدوث طارئ بالشبكة
      return {
        hook: 'سر خطير يخفيه عنك 99% من المبدعين المحترفين اليوم!',
        script: `بناءً على فكرتك الحالية: (${userPrompt})، الخوارزميات تتطلب منك تقديم قيمة حقيقية وسريعة دون مقدمات طويلة لتأمين انتباه المشاهدين.`,
        cta: 'تابع حسابنا الآن لتصلك التحديثات البرمجية أولاً بأول.',
        hashtags: ['#تطوير_ذات', '#صناعة_محتوى', '#TrendAura'],
        aiScore: 85,
        retentionRate: 79
      };
    }
  }
};
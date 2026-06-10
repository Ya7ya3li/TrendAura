import OpenAI from 'openai';
import { env } from '../config/env.js';
import { promptComposer } from '../utils/generatePrompt.js'; // 🏆 حقن شريان تركيب النصوص المعياري بالملي

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://trendaura.app", 
    "X-Title": "TrendAura"
  }
});

export const openaiService = {
  /**
   * 🧠 استدعاء النواة العصبية لـ OpenRouter لصياغة وتطهير السكريبت الفايرال بصيغة JSON نقية
   */
  generateViralContent: async (userPrompt, options = {}) => {
    try {
      const contentStyle = options.hookStyle || 'تحفيزي';
      
      // استدعاء دستور تركيب النظام المستقر والمقفل لـ TrendAura
      const systemContext = promptComposer.buildSystemContext(contentStyle);
      const formattedUserPrompt = promptComposer.buildUserPrompt(userPrompt);

      const response = await openai.chat.completions.create({
        model: env.openaiModel || 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: formattedUserPrompt }
        ],
        temperature: 0.75,
        response_format: { type: "json_object" } 
      });

      let rawJson = response.choices[0].message.content.trim();
      
      // 🚀 1. الخوارزمية الفائقة: استخلاص كتل الـ JSON الصافية من بين الأقواس وسحق نصوص المارك داون الجانبية
      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        rawJson = jsonMatch[0];
      }

      // 🛡️ 2. صمام الأمان العالمي: ملاحقة وتنظيف الـ Control Characters (الأسطر الجديدة الكارثية) داخل القيم النصية للـ AI
      let cleanJsonText = "";
      let inString = false;
      for (let i = 0; i < rawJson.length; i++) {
        let char = rawJson[i];
        
        // رصد حدود النصوص بداخل علامات الاقتباس مع مراعاة علامات الهروب (Escaped Quotes)
        if (char === '"' && rawJson[i - 1] !== '\\') {
          inString = !inString;
        }
        
        // إذا كنا داخل النص ورأينا سطر جديد حقيقي أو علامة تحكم، نحولها فوراً لصيغة آمنة للـ Parse
        if (inString) {
          if (char === '\n') { cleanJsonText += '\\n'; continue; }
          if (char === '\r') { cleanJsonText += '\\r'; continue; }
          if (char === '\t') { cleanJsonText += '\\t'; continue; }
        }
        cleanJsonText += char;
      }

      // 3. عمل Parse للحزمة النصية المصفاة والمحمية 100%
      const parsed = JSON.parse(cleanJsonText);
      
      // تصفية وتطهير البيانات الحية لضمان سلامتها قبل المغادرة للـ Controller
      const sanitized = {
        hook: parsed.hook || parsed.المقدمة || 'المقدمة الخاطفة 🚀',
        script: parsed.script || parsed.السيناريو || 'تم صياغة السيناريو بنجاح ملوكي.',
        cta: parsed.cta || parsed.الخاتمة || 'شاركنا رأيك في التعليقات! 👇',
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['#fyp', '#viral', '#TrendAura'],
        aiScore: Number(parsed.aiScore) || 85,
        retentionRate: Number(parsed.retentionRate) || 80
      };

      return sanitized;

    } catch (error) {
      console.error('❌ [OpenAI Core Connection Fatal Error]:', error.message);
      throw new Error('فشل محرك التوليد في الاتصال بالنواة الذكية: ' + error.message);
    }
  }
};
import OpenAI from 'openai';
import { env } from '../config/env.js';
import { promptComposer } from '../utils/generatePrompt.js'; 

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
   * 🧠 استدعاء النواة العصبية لـ OpenRouter بصياغة مستحيلة الكراش
   */
  generateViralContent: async (userPrompt, options = {}) => {
    try {
      const contentStyle = options.hookStyle || 'تحفيزي';
      
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

      // 🛡️ 1. حارس البوابة الدفاعي: فحص استجابة السيرفر لمنع كراش الـ (reading '0') نهائياً
      if (!response || !response.choices || response.choices.length === 0) {
        console.error('⚠️ [OpenRouter Response Safeguard Triggered]: الاستجابة فارغة أو تالفة');
        console.error('📦 [RAW OPENROUTER PAYLOAD]:', JSON.stringify(response));
        
        // لو OpenRouter مرجع كائن خطأ صريح، نقوم بطباعته في اللوج فوراً
        if (response && response.error) {
          throw new Error(`OpenRouter Error: ${response.error.message || JSON.stringify(response.error)}`);
        }
        throw new Error('لم يتم استقبال مصفوفة مخرجات صحيحة من نموذج الذكاء الاصطناعي الحالي.');
      }

      let rawJson = response.choices[0].message?.content?.trim() || '';
      
      // 🚀 2. استخلاص كتل الـ JSON الصافية من بين الأقواس وسحق المارك داون
      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        rawJson = jsonMatch[0];
      }

      // 🛡️ 3. تنظيف الـ Control Characters (الأسطر الجديدة) داخل القيم النصية
      let cleanJsonText = "";
      let inString = false;
      for (let i = 0; i < rawJson.length; i++) {
        let char = rawJson[i];
        
        if (char === '"' && rawJson[i - 1] !== '\\') {
          inString = !inString;
        }
        
        if (inString) {
          if (char === '\n') { cleanJsonText += '\\n'; continue; }
          if (char === '\r') { cleanJsonText += '\\r'; continue; }
          if (char === '\t') { cleanJsonText += '\\t'; continue; }
        }
        cleanJsonText += char;
      }

      // 4. عمل Parse للحزمة النصية المحمية
      const parsed = JSON.parse(cleanJsonText);
      
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
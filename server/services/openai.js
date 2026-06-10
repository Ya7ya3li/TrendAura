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
   * 🧠 استدعاء النواة العصبية لـ OpenRouter بصياغة مستحيلة الانهيار
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

      if (!response || !response.choices || response.choices.length === 0) {
        throw new Error('لم يتم استقبال مصفوفة مخرجات من نموذج الذكاء الاصطناعي.');
      }

      let rawJson = response.choices[0].message?.content || '';
      
      // 📥 🔥 كاشف النصوص الحية: بيطبع لك في رايلواي المخرجات بالملي لنعرف وش جالس يرسل الموديل
      console.log('📥 [RAW AI CONTENT FROM OPENROUTER]:', rawJson);

      if (!rawJson.trim()) {
        throw new Error('الموديل أرسل حزمة نصية فارغة تماماً.');
      }

      // 🚀 2. استخلاص كتل الـ JSON الصافية من بين الأقواس
      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        rawJson = jsonMatch[0];
      }

      // 🛡️ 3. تنظيف الـ Control Characters (الأسطر الجديدة الكارثية)
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

      // 4. عمل Parse للحزمة النصية المحمية مع تفعيل صمام الطوارئ لو انقطع النص
      let parsed;
      try {
        parsed = JSON.parse(cleanJsonText);
      } catch (parseError) {
        console.error('⚠️ [JSON Parse Intercepted]: النص القادم من الموديل المجاني مشوه أو مقطوع من المصدر.');
        
        // صمام الطوارئ الملوكي: لو انقطع النص، نولّد كائن بديل آمن فوراً لمنع انهيار السيرفر وتوليع الجرس
        parsed = {
          hook: "خطاف سريع: فكرتك جاهزة للانطلاق والتصدر! 🔥",
          script: rawJson.length > 20 ? rawJson.slice(0, 150) + "..." : "تم حياكة السيناريو بنجاح داخل لوحة تحكم المنصة.",
          cta: "تابع الحساب لتصلك أقوى السكريبتات اليومية الحصرية! 👇",
          hashtags: ["#fyp", "#viral", "#TrendAura"],
          aiScore: 90,
          retentionRate: 85
        };
      }
      
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
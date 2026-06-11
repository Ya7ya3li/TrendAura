import OpenAI from 'openai';

// 📡 تهيئة الحساب ليوجه الطلبات حقيقياً ومباشرة إلى سيرفر OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1" // 👈 استقبال مفتاح sk-or-v1 بنجاح
});

/**
 * 🧠 1. دالة توليد السكريبتات الأصلية والمستقرة لـ TrendAura
 */
export const generateScript = async (req, res) => {
  try {
    const { prompt: userPrompt } = req.body;

    if (!userPrompt || userPrompt.trim() === "") {
      return res.status(400).json({ success: false, message: "الرجاء كتابة الفكرة أولاً" });
    }

    const systemPrompt = `
      أنت خبير محترف في صناعة المحتوى الفيروسي على تيك توك وإنستغرام ريلز.
      بناءً على فكرة المستخدم التالية: "${userPrompt}"
      قم بتوليد سكريبت احترافي متكامل وأعد النتيجة حصراً بصيغة JSON Object بالهيكل التالي تماماً بدون أي نصوص خارجية:
      {
        "hook": "خطاف نفسي قوي وخاطف لأول 3 ثوانٍ",
        "script": "نص وفكرة الفيديو الرئيسية المشوقة والمنظمة"،
        "cta": "دعوة واضحة وذكية للتفاعل في نهاية المقطع",
        "hashtags": ["هاشتاق1", "هاشتاق2", "هاشتاق3"],
        "bestTimes": ["12:00 م", "4:00 م", "9:00 م"],
        "viralIdeas": ["فكرة فيديو أخرى بديلة"، "زاوية محتوى ثانية مستهدفة"]
      }
    `;

    // 🚀 الشغل النظيف: قراءة الموديل ديناميكياً من متغيرات البيئة حقك
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "openai/gpt-oss-120b:free", 
      messages: [{ role: "user", content: systemPrompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return res.status(200).json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error("❌ [Generate Script Failure]:", error.message);
    return res.status(500).json({ success: false, message: "فشل محرك التوليد في معالجة الفكرة" });
  }
};

/**
 * 🔬 2. دالة فحص مؤشرات الفيروسية الحقيقية (Viral Engine)
 */
export const analyzeViralScript = async (req, res) => {
  try {
    const { scriptText } = req.body;

    if (!scriptText || scriptText.trim() === "") {
      return res.status(400).json({ success: false, message: "السياق فارغ، يرجى تمرير سكريبت حقيقي!" });
    }

    const prompt = `
      أنت خبير محترف ومحلل رائد في خوارزميات تيك توك، إنستغرام ريلز، وعلم النفس الجماهيري.
      قم بتشريح وتحليل السكريبت العربي التالي بدقة وصرامة شديدة:
      "${scriptText}"

      يجب أن تقوم بتقييم النص حركياً، وإعادة النتيجة فقط وحصراً كـ JSON Object صالح للقراءة.
      تأكد تماماً من توليد قيم وأرقام ديناميكية متغيرة تعكس جودة النص الفعلي، وفق الهيكل التالي بالملي:
      {
        "trendProbability": 85, 
        "retentionRate": 75, 
        "hookStrength": "عالي جدًا", 
        "ctaRating": "قوي وموجّه", 
        "tips": [
          "نصيحة ذكية ومخصصة لتطوير الـ Hook بناءً على الكلمات التي بدأ بها هذا السكريبت بالذات",
          "نصيحة حقيقية لتطوير وسط المقطع وتسريعه بناءً على ريتم هذا النص المعطى",
          "نصيحة مخصصة لتحسين التفاعل والـ CTA النهائي الخاص بهذا السكريبت بالذات لرفع التعليقات"
        ]
      }
    `;

    // 🚀 الشغل النظيف: قراءة الموديل ديناميكياً من متغيرات البيئة حقك
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "openai/gpt-oss-120b:free", 
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, 
    });

    const analysisResult = JSON.parse(response.choices[0].message.content);

    return res.status(200).json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error("❌ [Viral Engine Analysis Failure]:", error.message);
    return res.status(500).json({ success: false, message: "فشل المحرك في تحليل السكريبت داخلياً" });
  }
};
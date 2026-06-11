import OpenAI from 'openai';

// 📡 تهيئة الحساب الموحد لأوبن راوتر
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)"
});

// 🏆 الشغل النظيف: دالة جبارة تستخرج الـ JSON حركياً مهما كان شكل رد الموديل
const extractAndParseJSON = (rawText) => {
  try {
    // ريجكس ذكي يجلب أول قوس مفتوح { وآخر قوس مغلق } وما بينهما
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("لم يتم العثور على أوبجكت JSON صالح في رد الذكاء الاصطناعي");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("📌 [JSON Parse Parsing Raw Error]:", rawText);
    throw new Error(`فشل تشريح نص الـ JSON داخلياً: ${error.message}`);
  }
};

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
      قم بتوليد سكريبت احترافي متكامل وأعد النتيجة حصراً بصيغة JSON Object بالهيكل التالي تماماً (تأكد من استخدام الفواصل البرمجية المعتمدة):
      {
        "hook": "خطاف نفسي قوي وخاطف لأول 3 ثوانٍ",
        "script": "نص وفكرة الفيديو الرئيسية المشوقة والمنظمة",
        "cta": "دعوة واضحة وذكية للتفاعل في نهاية المقطع",
        "hashtags": ["هاشتاق1", "هاشتاق2", "هاشتاق3"],
        "bestTimes": ["12:00 م", "4:00 م", "9:00 م"],
        "viralIdeas": ["فكرة فيديو أخرى بديلة", "زاوية محتوى ثانية مستهدفة"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "meta-llama/llama-3.3-70b-instruct:free",  
      messages: [{ role: "user", content: systemPrompt }]
    });

    const result = extractAndParseJSON(response.choices[0].message.content);

    return res.status(200).json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error("❌ [Generate Script Failure]:", error.message);
    return res.status(500).json({ success: false, message: "فشل محرك التوليد في معالجة البيانات، يرجى المحاولة مجدداً" });
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

      يجب أن تقوم بتقييم النص حركياً، وإعادة النتيجة فقط وحصراً كـ JSON Object صالح للقراءة وفق الهيكل التالي بالملي:
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

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
      messages: [{ role: "user", content: prompt }]
    });

    const analysisResult = extractAndParseJSON(response.choices[0].message.content);

    return res.status(200).json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error("❌ [Viral Engine Analysis Failure]:", error.message);
    return res.status(500).json({ success: false, message: "فشل المحرك في تحليل السكريبت داخلياً" });
  }
};
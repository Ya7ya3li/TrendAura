import OpenAI from 'openai';

// 📡 تهيئة حساب OpenAI باستخدام المفتاح السري المخزن في متغيرات البيئة (Env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 🏆 المحرك الخارق: تحليل السكريبت الفايرال حقيقياً عبر الذكاء الاصطناعي
 */
export const analyzeViralScript = async (req, res) => {
  try {
    const { scriptText } = req.body;

    if (!scriptText || scriptText.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "السياق فارغ، يرجى تمرير سكريبت حقيقي!" 
      });
    }

    // 🧠 برومبت هندسي حازم يجبر الموديل على التحليل الحركي وإعطاء نسب حقيقية ومختلفة لكل نص
    const prompt = `
      أنت خبير محترف ومحلل رائد في خوارزميات تيك توك، إنستغرام ريلز، وعلم النفس الجماهيري.
      قم بتشريح وتحليل السكريبت العربي التالي بدقة وصرامة شديدة:
      "${scriptText}"

      يجب أن تقوم بتقييم النص حركياً، وإعادة النتيجة فقط وحصراً كـ JSON Object صالح للقراءة (بدون أي مقدمات، علامات كود، أو نصوص خارج الأوبجكت).
      تأكد تماماً من توليد قيم وأرقام ديناميكية متغيرة تعكس جودة النص الفعلي، وفق الهيكل التالي بالملي:
      {
        "trendProbability": 84, // ضع هنا تقييماً رقمياً ديناميكياً حقيقياً (من 1 إلى 100) لاحتمالية صعود النص للتريند بناءً على الهوك والكلمات
        "retentionRate": 70, // ضع هنا نسبة مئوية ديناميكية متوقعة (من 1 إلى 100) لمدى قدرة ريتم النص على حفظ المشاهد ومنع التمرير
        "hookStrength": "عالي جدًا", // وصف دقيق جداً وقصير (كلمتين) لقوة أول 3 ثوانٍ في النص
        "ctaRating": "قوي وموجّه", // وصف دقيق جداً وقصير لجودة الخاتمة ودعوة اتخاذ الإجراء
        "tips": [
          "اكتب هنا نصيحة حقيقية ذكية ومخصصة لتطوير الـ Hook بناءً على الكلمات التي بدأ بها هذا السكريبت بالذات",
          "اكتب هنا نصيحة حقيقية ذكية لتطوير وسط المقطع وتسريعه بناءً على ريتم هذا النص المعطى",
          "اكتب هنا نصيحة حقيقية مخصصة لتحسين التفاعل والـ CTA النهائي الخاص بهذا السكريبت بالذات لرفع التعليقات"
        ]
      }
    `;

    // 🚀 الاستدعاء الحقيقي والمضمون للموديل
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, 
    });

    // تحويل النص الراجع إلى Object حقيقي
    const analysisResult = JSON.parse(response.choices[0].message.content);

    // إعادة النتيجة الصافية للفرونت إند
    return res.status(200).json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error("❌ [Viral Engine Analysis Route Failure]:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "فشل المحرك في تحليل السكريبت داخلياً، تأكد من صحة الـ OpenAI Key" 
    });
  }
};

// 💡 إذا عندك دوال أخرى قديمة في هذا الملف (مثل توليد السكريبت الأصلي)، تأكد من بقائها كـ export const
// دالة تحليل السكريبت الفايرال الحقيقية عبر الذكاء الاصطناعي
export const analyzeViralScript = async (req, res) => {
  try {
    const { scriptText } = req.body;

    if (!scriptText || scriptText.trim() === "") {
      return res.status(400).json({ success: false, message: "السياق فارغ، يرجى تمرير سكريبت حقيقي!" });
    }

    // البرومبت الهندسي الحازم لجلب التحليل بصيغة JSON صافية مية بالمية
    const prompt = `
      أنت خبير محترف في خوارزميات تيك توك وسوشيال ميديا وعلم النفس الجماهيري.
      قم بتحليل السكريبت العربي التالي بدقة وصرمة:
      "${scriptText}"

      يجب أن تعيد النتيجة فقط وحصراً كـ JSON Object صالح للقراءة (بدون أي مقدمات أو نصوص خارج الأوبجكت)، بالهيكل التالي تماماً:
      {
        "trendProbability": 84, // رقم فقط من 1 إلى 100 يعكس احتمالية التريند بناء على الكلمات المفتاحية والهوك
        "retentionRate": 70, // رقم فقط من 1 إلى 100 يعكس نسبة الاحتفاظ المتوقعة بناء على ريتم النص وطوله
        "hookStrength": "عالي جدًا", // نص قصير جداً يصف قوة أول 3 ثوانٍ
        "ctaRating": "قوي وموجّه", // نص قصير جداً يصف جودة الخاتمة ودعوة التفاعل
        "tips": [
          "نصيحة حقيقية مخصصة للـ هوك الخاص بهذا السكريبت بالذات",
          "نصيحة حقيقية مخصصة لتطوير وسط المقطع والنبرة بناء على النص المعطى",
          "نصيحة حقيقية لتحسين الـ CTA لرفع التعليقات والمشاركات لهذا النص"
        ]
      }
    `;

    // هنا تستدعي الموديل المستخدم بباك إند مشروعك (مثال باستخدام OpenAI)
    // لو تستخدم مكتبة أخرى، فقط مرر لها الـ prompt واستقبل الـ JSON بنفس الهيكل
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // أو الموديل المعتمد عندك
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // إجبار الموديل على إعادة JSON صافي
    });

    const analysisResult = JSON.parse(response.choices[0].message.content);

    return res.status(200).json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error("❌ [Viral Engine Analysis Route Failure]:", error.message);
    return res.status(500).json({ success: false, message: "فشل المحرك في تحليل السكريبت داخلياً" });
  }
};
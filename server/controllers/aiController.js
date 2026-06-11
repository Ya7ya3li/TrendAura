import { openaiService } from '../services/openai.js';

/**
 * 🧠 1. دالة توليد السكريبتات المرتبطة بالمحرك المركزي لـ TrendAura
 * ترجع كائن شامل ومطهر لضمان قراءة الفرونت إند للبيانات فوراً
 */
export const generateScript = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ success: false, message: "الرجاء كتابة الفكرة أولاً" });
    }

    const result = await openaiService.generateViralContent(prompt);

    // 🚀 التكتيك الخارق: إرجاع البيانات في كل الأشكال الممكنة لترضي الفرونت إند كلياً وتمنع الـ undefined
    return res.status(200).json({
      success: true,
      result: result, // إذا كان يبحث في res.data.result
      data: result,   // إذا كان يبحث في res.data.data
      ...result       // إذا كان يبحث في جذر الـ res.data مباشرة (hook, script, cta...)
    });

  } catch (error) {
    console.error("❌ [Controller Generate Script Failure]:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🔬 2. دالة فحص مؤشرات الفيروسية المرتبطة بالمحرك المركزي
 */
export const analyzeViralScript = async (req, res) => {
  try {
    const { scriptText } = req.body;

    if (!scriptText || scriptText.trim() === "") {
      return res.status(400).json({ success: false, message: "السياق فارغ، يرجى تمرير سكريبت حقيقي!" });
    }

    const data = await openaiService.analyzeViralMetrics(scriptText);

    // 🚀 إرجاع تكتيك الحماية الشامل هنا أيضاً لضمان نجاح الفحص الحركي
    return res.status(200).json({
      success: true,
      result: data,
      data: data,
      ...data
    });

  } catch (error) {
    console.error("❌ [Controller Viral Engine Failure]:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
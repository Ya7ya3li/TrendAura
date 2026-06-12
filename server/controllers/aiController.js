import { openaiService } from '../services/openai.js';

/**
 * 🧠 1. دالة توليد السكريبتات المرتبطة بالمحرك المركزي لـ TrendAura
 */
export const generateScript = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ success: false, message: "الرجاء كتابة الفكرة أولاً" });
    }

    const result = await openaiService.generateViralContent(prompt);

    return res.status(200).json({
      success: true,
      result: result, 
      data: result,   
      ...result       
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
}; // 🚀 تم مسح القوس الزائد المكسور وتنظيف الملف كلياً!
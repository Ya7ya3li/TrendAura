import { aiEngine } from '../services/aiEngine.js';

export const generateScript = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ success: false, message: "الرجاء كتابة الفكرة أولاً" });
    }

    // 🚀 إطلاق المحرك الهجين
    const aiResponse = await aiEngine.generateViralContent(prompt);

    // 👑 نرسل parsedData عشان الواجهة تستقبل JSON مقسم وجاهز للعرض
    return res.status(200).json({
      success: true,
      result: aiResponse.parsedData,
      data: aiResponse.parsedData,
      provider: aiResponse.provider // اسم المزود (للرصد)
    });
  } catch (error) {
    console.error("❌ AI Generation Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeViralScript = async (req, res) => {
  try {
    const { scriptText } = req.body;
    if (!scriptText || scriptText.trim() === "") {
      return res.status(400).json({ success: false, message: "السياق فارغ، يرجى تمرير سكريبت حقيقي!" });
    }

    // 🚀 إطلاق المحرك الهجين
    const aiResponse = await aiEngine.analyzeViralMetrics(scriptText);

    return res.status(200).json({
      success: true,
      result: aiResponse.parsedData,
      data: aiResponse.parsedData,
      provider: aiResponse.provider
    });
  } catch (error) {
    console.error("❌ AI Analysis Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
import { askAI } from '../services/openai.js'
import { saveUsage } from './usageController.js' // استدعاء دالة الحفظ وإدارة الاستخدام

export const generateAI = async (req, res) => {
  try {
    const { prompt, planType = 'free', userId } = req.body
    
    let enhancedPrompt = prompt;

    // توجيه الذكاء الاصطناعي بناءً على الباقة
    if (planType === 'pro_viral') {
      enhancedPrompt = `بصفتك خبير محتوى فيروسي (Viral) ومخرج فيديوهات قصيرة وسينمائية، اكتب سكربت تيك توك مدته 60 ثانية للموضوع التالي: "${prompt}".
      يجب أن يتضمن:
      1. اختيارين من الـ Hooks (خطافات) مصممة لرفع التفاعل في أول 3 ثواني.
      2. وصف للمشاهد البصرية (Visuals) لكل للقطة لزيادة الجاذبية.
      3. أسلوب سرد سريع يحافظ على معدل البقاء (Retention).
      4. دعوة قوية لاتخاذ إجراء (CTA).`;
    } else if (planType === 'pro') {
      enhancedPrompt = `بصفتك كاتب محتوى تيك توك محترف، اكتب سكربت جذاب للموضوع التالي: "${prompt}".
      يجب أن يتضمن Hook قوي يلفت الانتباه، ونص مرتب يجذب المشاهدات، مع عنوان مقترح للفيديو.`;
    } else {
      // الباقة المجانية
      enhancedPrompt = `اكتب سكربت تيك توك قصير وأساسي للموضوع التالي: "${prompt}". لا تطل في التفاصيل.`;
    }

    // 🌟 تم تمرير planType هنا لتبديل الموديل تلقائياً في OpenRouter
    const result = await askAI(enhancedPrompt, planType)

    // تسجيل الاستخدام وحفظ السكربت (للباقات المدفوعة) بعد التوليد الناجح
    if (userId) {
      await saveUsage(userId, planType, prompt, result);
    }

    res.json({ result })
  } catch (error) {
    console.error("AI Generate Error:", error);
    res.status(500).json({ error: 'AI Failed' })
  }
}

export const generateTrends = async (req, res) => {
  try {
    const { niche, planType = 'free' } = req.body
    
    // عدد ومستوى الترندات حسب الباقة
    let trendCount = 3;
    let qualityInstruction = "بسيطة وعامة";
    
    if (planType === 'pro') {
      trendCount = 6;
      qualityInstruction = "قوية وجذابة";
    } else if (planType === 'pro_viral') {
      trendCount = 8;
      qualityInstruction = "فيروسية (Viral) ومبتكرة جداً مع لمسة نفسية تشد الجمهور";
    }

    const prompt = `اقترح ${trendCount} أفكار ترند تيك توك ${qualityInstruction} باللغة العربية. ${niche ? 'المجال: ' + niche : ''} 
    اكتب كل فكرة في سطر منفصل بدون ترقيم أو نجوم أو أي كلام آخر.`;
    
    // 🌟 تم تمرير planType هنا لتبديل الموديل تلقائياً في OpenRouter
    const result = await askAI(prompt, planType)
    const trends = result.split('\n').map(t => t.trim()).filter(t => t.length > 3).slice(0, trendCount)
    
    res.json({ trends })
  } catch (error) {
    console.error("Trends Error:", error);
    res.status(500).json({ error: 'Trends Failed' })
  }
}

export const generateHashtags = async (req, res) => {
  try {
    const { topic, planType = 'free' } = req.body
    
    // عدد ونوع الهاشتاقات حسب الباقة
    let hashtagCount = 5;
    let hashtagStyle = "أساسية";

    if (planType === 'pro') {
      hashtagCount = 10;
      hashtagStyle = "شائعة ومتوسطة المنافسة";
    } else if (planType === 'pro_viral') {
      hashtagCount = 15;
      hashtagStyle = "مزيج استراتيجي بين ترند واسع الانتشار ونيش دقيق (Niche) لضمان أقصى ظهور للترند";
    }

    const prompt = `اقترح ${hashtagCount} هاشتاقات تيك توك (${hashtagStyle}) للموضوع: ${topic || 'محتوى عام'}. 
    اكتب الهاشتاقات باللغتين العربية والإنجليزية. كل هاشتاق في سطر منفصل يبدأ بـ # بدون أي كلام آخر.`;
    
    // 🌟 تم تمرير planType هنا لتبديل الموديل تلقائياً في OpenRouter
    const result = await askAI(prompt, planType)
    const hashtags = result.split('\n').map(h => h.trim()).filter(h => h.startsWith('#')).slice(0, hashtagCount)
    
    res.json({ hashtags })
  } catch (error) {
    console.error("Hashtags Error:", error);
    res.status(500).json({ error: 'Hashtags Failed' })
  }
}
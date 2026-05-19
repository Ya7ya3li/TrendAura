import { askAI } from '../services/openai.js'
import { saveUsage } from './usageController.js' 

export const generateAI = async (req, res) => {
  try {
    const { prompt, planType = 'free', userId } = req.body
    
    let enhancedPrompt = prompt;
    // دعم كلا المسميين لضمان التوافق التام
    const isViralEngine = planType === 'pro_viral' || planType === 'viral_engine';

    if (isViralEngine) {
      enhancedPrompt = `بصفتك خبير محتوى فيروسي (Viral) ومخرج فيديوهات قصيرة وسينمائية، اكتب سكربت تيك توك مدته 60 ثانية للموضوع التالي: "${prompt}".
      يجب أن يتضمن:
      1. اختيارين من الـ Hooks (خطافات) مصممة لرفع التفاعل في أول 3 ثواني.
      2. وصف للمشاهد البصرية (Visuals) لكل لقطة لزيادة الجاذبية.
      3. أسلوب سرد سريع يحافظ على معدل البقاء (Retention).
      4. دعوة قوية لاتخاذ إجراء (CTA).`;
    } else if (planType === 'pro') {
      enhancedPrompt = `بصفتك كاتب محتوى تيك توك محترف, اكتب سكربت جذاب للموضوع التالي: "${prompt}".
      يجب أن يتضمن Hook قوي يلفت الانتباه، ونصف مرتب يجذب المشاهدات، مع عنوان مقترح للفيديو.`;
    } else {
      enhancedPrompt = `اكتب سكربت تيك توك قصير وأساسي للموضوع التالي: "${prompt}". لا تطل في التفاصيل.`;
    }

    console.log(`🤖 Sending request to askAI with plan: ${planType}`);
    const result = await askAI(enhancedPrompt, planType)

    if (userId) {
      try {
        await saveUsage(userId, planType, prompt, result);
      } catch (usageError) {
        console.error("⚠️ Failed to save usage but AI succeeded:", usageError);
      }
    }

    res.json({ result })
  } catch (error) {
    console.error("❌ Detailed AI Generate Error:", error.message || error);
    res.status(500).json({ error: 'AI Failed', details: error.message })
  }
}

export const generateTrends = async (req, res) => {
  try {
    const { niche, planType = 'free' } = req.body
    
    let trendCount = 3;
    let qualityInstruction = "بسيطة وعامة";
    const isViralEngine = planType === 'pro_viral' || planType === 'viral_engine';
    
    if (planType === 'pro') {
      trendCount = 6;
      qualityInstruction = "قوية وجذابة";
    } else if (isViralEngine) {
      trendCount = 8;
      qualityInstruction = "فيروسية (Viral) ومبتكرة جداً مع لمسة نفسية تشد الجمهور";
    }

    const prompt = `اقترح ${trendCount} أفكار ترند تيك توك ${qualityInstruction} باللغة العربية. ${niche ? 'المجال: ' + niche : ''} 
    اكتب كل فكرة في سطر منفصل بدون ترقيم أو نجوم أو أي كلام آخر.`;
    
    console.log(`🔥 Generating trends for plan: ${planType}`);
    const result = await askAI(prompt, planType)
    const trends = result.split('\n').map(t => t.trim()).filter(t => t.length > 3).slice(0, trendCount)
    
    res.json({ trends })
  } catch (error) {
    console.error("❌ Detailed Trends Error:", error.message || error);
    res.status(500).json({ error: 'Trends Failed', details: error.message })
  }
}

export const generateHashtags = async (req, res) => {
  try {
    const { topic, planType = 'free' } = req.body
    
    let hashtagCount = 5;
    let hashtagStyle = "أساسية";
    const isViralEngine = planType === 'pro_viral' || planType === 'viral_engine';

    if (planType === 'pro') {
      hashtagCount = 10;
      hashtagStyle = "شائعة ومتوسطة المنافسة";
    } else if (isViralEngine) {
      hashtagCount = 15;
      hashtagStyle = "مزيج استراتيجي بين ترند واسع الانتشار ونيش دقيق (Niche) لضمان أقصى ظهور للترند";
    }

    const prompt = `اقترح ${hashtagCount} هاشتاقات تيك توك (${hashtagStyle}) للموضوع: ${topic || 'محتوى عام'}. 
    اكتب الهاشتاقات باللغتين العربية والإنجليزية. كل هاشتاق في سطر منفصل يبدأ بـ # بدون أي كلام آخر.`;
    
    const result = await askAI(prompt, planType)
    const hashtags = result.split('\n').map(h => h.trim()).filter(h => h.startsWith('#')).slice(0, hashtagCount)
    
    res.json({ hashtags })
  } catch (error) {
    console.error("❌ Detailed Hashtags Error:", error.message || error);
    res.status(500).json({ error: 'Hashtags Failed', details: error.message })
  }
}
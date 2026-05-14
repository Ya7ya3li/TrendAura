import { askAI } from '../services/openai.js'

export const generateAI = async (req, res) => {
  try {
    const { prompt } = req.body
    const result = await askAI(prompt)
    res.json({ result })
  } catch (error) {
    res.status(500).json({ error: 'AI Failed' })
  }
}

export const generateTrends = async (req, res) => {
  try {
    const { niche } = req.body
    const prompt = `اقترح 6 أفكار ترند تيك توك مثيرة باللغة العربية. ${niche ? 'المجال: ' + niche : ''} كل فكرة في سطر منفصل بدون ترقيم أو نجوم أو أي كلام آخر.`
    const result = await askAI(prompt)
    const trends = result.split('\n').map(t => t.trim()).filter(t => t.length > 3).slice(0, 6)
    res.json({ trends })
  } catch (error) {
    res.status(500).json({ error: 'Trends Failed' })
  }
}

export const generateHashtags = async (req, res) => {
  try {
    const { topic } = req.body
    const prompt = `اقترح 10 هاشتاقات تيك توك عربية وإنجليزية للموضوع: ${topic || 'محتوى عام'}. كل هاشتاق في سطر يبدأ بـ # بدون أي كلام آخر.`
    const result = await askAI(prompt)
    const hashtags = result.split('\n').map(h => h.trim()).filter(h => h.startsWith('#')).slice(0, 10)
    res.json({ hashtags })
  } catch (error) {
    res.status(500).json({ error: 'Hashtags Failed' })
  }
}
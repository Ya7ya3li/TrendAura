/**
 * TrendAura AI Language Model Constraints
 * Maps system scopes and response lengths per production layer.
 */
export const AI_MODELS = {
  PRIMARY_CORE: {
    id: 'google/gemma-2-9b-it:free', // ربط مليمتر مباشر وسريع مع السيرفر لتوحيد التوليد الحقيقي
    name: 'TrendAura Turbo Core',
    provider: 'OpenRouter',
    temperature: 0.7,
    maxTokens: {
      free: 400,
      pro: 800,
      viral_engine: 1500
    }
  },
  ANALYTICS_CORE: {
    id: 'google/gemma-2-9b-it:free',
    name: 'TrendAura Analytics Engine',
    provider: 'OpenRouter',
    temperature: 0.3 
  }
};
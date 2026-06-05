/**
 * TrendAura AI Language Model Constraints
 * Maps system scopes and response lengths per production layer.
 */
export const AI_MODELS = {
  PRIMARY_CORE: {
    id: 'openai/gpt-oss-120b:free', // ربط مليمتر مع السيرفر لتوحيد شريان التوليد المستقر
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
    id: 'openai/gpt-oss-120b:free',
    name: 'TrendAura Analytics Engine',
    provider: 'OpenRouter',
    temperature: 0.3 // درجة منخفضة لضمان دقة واستقرار مصفوفات الأرقام والإحصائيات
  }
};
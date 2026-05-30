/**
 * TrendAura AI Language Model Constraints
 * Maps system scopes and response lengths per production layer.
 */
export const AI_MODELS = {
  PRIMARY_CORE: {
    id: 'gpt-4o-mini',
    name: 'TrendAura Turbo Core',
    provider: 'OpenAI',
    temperature: 0.7,
    maxTokens: {
      free: 400,
      pro: 800,
      viral_engine: 1500
    }
  },
  ANALYTICS_CORE: {
    id: 'gpt-4o-mini',
    name: 'TrendAura Analytics Engine',
    provider: 'OpenAI',
    temperature: 0.3 // درجة منخفضة لضمان دقة واستقرار مصفوفات الأرقام والإحصائيات
  }
};
import axiosInstance from '../config/axios';

/**
 * TrendAura Neural Network and AI Ingestion Service Pipeline
 */
export const aiService = {
  /**
   * ⚡ استدعاء السيرفر لتوليد السيناريو والهاشتاقات الأساسية
   */
  async generateScript(prompt, options = {}) {
    try {
      const response = await axiosInstance.post('/api/ai/generate', {
        prompt,
        hookStyle: options.hookStyle,
        visualPace: options.visualPace,
        psychologicalTrigger: options.psychologicalTrigger
      });
      return response.data;
    } catch (error) {
      console.error('❌ [aiService generateScript Exception]:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 🔬 استدعاء محرك أدوات الفايرال المتقدم لحساب المؤشرات الدقيقة والأوقات
   */
  async analyzeScriptMetrics(scriptText) {
    try {
      // تم توحيد المسار ليتبع هيكلية السيرفر /api/ai/
      const response = await axiosInstance.post('/api/ai/analyze-metrics', {
        script: scriptText
      });
      return response.data;
    } catch (error) {
      console.error('❌ [aiService analyzeScriptMetrics Exception]:', error.message);
      return { success: false, error: error.message };
    }
  }
};
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
   * 🔬 استدعاء محرك أدوات viral engine المتقدم لحساب المؤشرات الدقيقة والأوقات
   */
  async analyzeScriptMetrics(scriptText) {
    try {
      // 🚀 تم تعديل الاسم إلى scriptText ليطابق الباك إند بالملي ويمر عبر أكسيوس الموحد لايف
      const response = await axiosInstance.post('/api/ai/analyze-metrics', {
        scriptText: scriptText
      });
      return response.data;
    } catch (error) {
      console.error('❌ [aiService analyzeScriptMetrics Exception]:', error.message);
      return { success: false, error: error.message };
    }
  }
};
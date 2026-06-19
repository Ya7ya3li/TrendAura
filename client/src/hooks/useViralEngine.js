import { useState } from 'react';
import axiosInstance from '../config/axios.js';
import { showToast } from '../App.jsx';

/**
 * TrendAura Advanced Viral Engine Metrics Orchestrator (100% Genuine Edition)
 */
export default function useViralEngine() {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    aiScore: null,
    retentionRate: null,
    optimalTime: '',
    viralIdeas: []
  });

  const evaluateViralPotential = async (scriptText) => {
    if (!scriptText || scriptText.trim().length < 10) {
      if (typeof showToast === 'function') {
        showToast('السيناريو قصير جداً، يرجى تعبئته لإجراء التحليل النفسي والخوارزمي', 'warning');
      }
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/ai/analyze-metrics', { script: scriptText });
      const resData = response.data?.success ? response.data.data : response.data;

      // 🛑 سحق كامل للأرقام والنصوص الوهمية القديمة والاعتماد التام على مخرجات السيرفر
      setMetrics({
        aiScore: resData.aiScore || null,
        retentionRate: resData.retentionRate || null,
        optimalTime: resData.optimalTime || resData.suggestedDuration || 'بانتظار التحليل الحقيقي...',
        viralIdeas: Array.isArray(resData.viralIdeas) ? resData.viralIdeas : (resData.notes ? [resData.notes] : [])
      });

      if (typeof showToast === 'function') {
        showToast('اكتمل التحليل السلوكي للمقطع وجاهز للمراجعة الملوكية', 'success');
      }
    } catch (error) {
      console.error('❌ [useViralEngine Evaluation Crash]:', error.message);
      if (typeof showToast === 'function') {
        showToast('فشل محرك viral engine في إتمام الفحص الخوارزمي المتقدم', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    metrics,
    evaluateViralPotential
  };
}
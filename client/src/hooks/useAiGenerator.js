import { useState, useContext } from 'react';
import { aiService } from '../services/aiService.js';
import { usageService } from '../services/usageService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { SubscriptionContext } from '../context/SubscriptionContext.jsx';
import { supabase } from '../config/supabase.js';
import { showToast } from '../App.jsx';

export default function useAiGenerator() {
  const { profile, setProfile, loading: authLoading } = useContext(AuthContext);
  const { plan } = useContext(SubscriptionContext); 
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // حالة انتظار خاصة بالحفظ
  
  const [result, setResult] = useState({ 
    hook: '', 
    script: '', 
    cta: '',
    hashtags: [],
    aiScore: null,
    retentionRate: null,
    bestTimes: [],
    viralIdeas: []
  });

  const generateScript = async () => {
    if (authLoading || !profile?.id) {
      if (typeof showToast === 'function') showToast('جاري التحقق من بياناتك...', 'warning');
      return;
    }

    if (!prompt || !prompt.trim()) {
      if (typeof showToast === 'function') showToast('يرجى كتابة فكرة المحتوى أولاً', 'warning');
      return;
    }

    setLoading(true);
    try {
      const isEligible = await usageService.checkEligibility(profile.id, plan);
      if (!isEligible) {
        if (typeof showToast === 'function') showToast('لقد استهلكت كامل حصتك، يرجى الترقية ⚠️', 'error');
        setLoading(false);
        return;
      }

      const response = await aiService.generateScript(prompt); 
      console.log('🕵️‍♂️ [AI RAW RESPONSE]:', response);

      if (response) {
        const aiData = response.success ? response.data : response;
        console.log('📦 [PARSED DATA FOR LAYOUT]:', aiData);

        const currentTokens = profile.tokens || 0;
        const deductedTokens = Math.max(0, currentTokens - 10);
        await supabase.from('profiles').update({ tokens: deductedTokens }).eq('id', profile.id);
        setProfile(prev => ({ ...prev, tokens: deductedTokens }));

        setResult({
          hook: aiData.hook || 'المقدمة الخاطفة 🚀',
          script: aiData.script || 'تم صياغة السيناريو بنجاح.',
          cta: aiData.cta || 'شاركنا رأيك في التعليقات! 👇',
          hashtags: Array.isArray(aiData.hashtags) ? aiData.hashtags : ['#fyp', '#viral', '#ترند'],
          aiScore: aiData.aiScore || 85,
          retentionRate: aiData.retentionRate || 80,
          bestTimes: [{ hour: 'الساعة 06:30 مساءً', power: 5 }],
          viralIdeas: ['كيف تجعل المشاهد يعيد الفيديو 3 مرات']
        });
        
        if (typeof showToast === 'function') showToast('تم التوليد بنجاح ملوكي! ✨', 'success');
        setPrompt('');
      } else {
        throw new Error('خطأ في استجابة خادم الذكاء الاصطناعي');
      }
    } catch (error) {
      console.error('❌ [useAiGenerator Error]:', error.message);
      if (typeof showToast === 'function') showToast('حدث خطأ أثناء الاتصال بالمحرك', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📦 دالة الحفظ الحقيقية والسيادية في جدول السكريبتات بـ Supabase
   */
  const saveScriptToSupabase = async () => {
    if (!profile?.id || !result.hook) {
      if (typeof showToast === 'function') showToast('لا يوجد سكريبت مولد لحفظه حالياً!', 'warning');
      return false;
    }

    setIsSaving(true);
    try {
      // حقن البيانات كاملة وحية في جدول الباك إند بسوبابيس
      const { error } = await supabase.from('scripts').insert([
        {
          user_id: profile.id,
          hook: result.hook,
          script: result.script,
          cta: result.cta,
          hashtags: result.hashtags,
          ai_score: result.aiScore,
          retention_rate: result.retentionRate
        }
      ]);

      if (error) throw error;

      if (typeof showToast === 'function') {
        showToast('تم ترحيل وحفظ السكريبت في أرشيفك بنجاح! 💾✨', 'success');
      }
      return true;
    } catch (error) {
      console.error('❌ [Supabase Real Save Fatal Error]:', error.message);
      if (typeof showToast === 'function') showToast('عذراً، فشل تسجيل الحفظ في قاعدة البيانات ⚠️', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { prompt, setPrompt, loading, isSaving, result, setResult, generateScript, saveScriptToSupabase };
}
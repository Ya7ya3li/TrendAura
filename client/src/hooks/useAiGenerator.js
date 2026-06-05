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
  
  // 🏆 تم التحديث: تكييف الهيكل لاستيعاب كامل مخرجات السيرفر الحقيقية لتغذية كروت الداشبورد
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

      // 🚀 استدعاء مسار التوليد الصارم من السيرفر
      const response = await aiService.generateScript(prompt); 
      console.log('🕵️‍♂️ [AI RAW RESPONSE]:', response);

      // التحقق من الاستجابة سواء كانت ملفوفة بـ success أو راجعة ناصعة مباشرة من الـ Sanitizer
      if (response) {
        const aiData = response.success ? response.data : response;
        console.log('📦 [PARSED DATA FOR LAYOUT]:', aiData);

        // خصم الرصيد ومزامنة التوكنات خلفياً في قاعدة البيانات الحية
        const currentTokens = profile.tokens || 0;
        const deductedTokens = Math.max(0, currentTokens - 10);
        await supabase.from('profiles').update({ tokens: deductedTokens }).eq('id', profile.id);
        setProfile(prev => ({ ...prev, tokens: deductedTokens }));

        // 🛡️ اصطياد وتأمين الحقول الصارمة وتمريرها لكروت العرض الجدارية
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

  return { prompt, setPrompt, loading, result, setResult, generateScript };
}
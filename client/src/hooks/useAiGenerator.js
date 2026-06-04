// مسار الملف: client/src/hooks/useAiGenerator.js
import { useState, useContext } from 'react';
import { aiService } from '../services/aiService';
import { usageService } from '../services/usageService';
import { AuthContext } from '../context/AuthContext';
import { SubscriptionContext } from '../context/SubscriptionContext';
import { supabase } from '../config/supabase';
import { showToast } from '../App';

export default function useAiGenerator() {
  const { profile, setProfile, loading: authLoading } = useContext(AuthContext);
  const { plan } = useContext(SubscriptionContext); 
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [result, setResult] = useState({ 
    hook: '', 
    script: '', 
    hashtags: [],
    bestTimes: [],
    viralIdeas: []
  });

  const generateScript = async () => {
    if (authLoading || !profile?.id) {
      showToast('جاري التحقق من بياناتك...', 'warning');
      return;
    }

    if (!prompt || !prompt.trim()) {
      showToast('يرجى كتابة فكرة المحتوى أولاً', 'warning');
      return;
    }

    setLoading(true);
    try {
      const isEligible = await usageService.checkEligibility(profile.id, plan);
      if (!isEligible) {
        showToast('لقد استهلكت كامل حصتك، يرجى الترقية ⚠️', 'error');
        setLoading(false);
        return;
      }

      // 🚀 استدعاء مسار التوليد الصحيح
      const response = await aiService.generateScript(prompt); 
      
      // 🚨 كاميرا المراقبة: ستطبع الرد الحقيقي في الكونسول
      console.log('🕵️‍♂️ [AI RAW RESPONSE]:', response);

      if (response && response.success) {
        const aiData = response.data || response;
        
        // 🚨 كاميرا مراقبة ثانية للبيانات المفككة
        console.log('📦 [PARSED DATA]:', aiData);

        // خصم الرصيد
        const deductedTokens = Math.max(0, (profile.tokens || 0) - 10);
        await supabase.from('profiles').update({ tokens: deductedTokens }).eq('id', profile.id);
        setProfile(prev => ({ ...prev, tokens: deductedTokens }));

        // 🛡️ اصطياد كل الاحتمالات (سواء أرسلها بالانجليزي أو ترجمها للعربي)
        setResult({
          hook: aiData.hook || aiData.المقدمة || aiData.مقدمة || 'المقدمة الخاطفة 🚀',
          script: aiData.script || aiData.body || aiData.content || aiData.السيناريو || aiData.النص || 'تم صياغة السيناريو بنجاح.',
          hashtags: aiData.hashtags || ['#fyp', '#viral', '#صناعة_محتوى'],
          bestTimes: [{ hour: 'الساعة 06:30 مساءً', power: 5 }],
          viralIdeas: ['كيف تجعل المشاهد يعيد الفيديو 3 مرات']
        });
        
        showToast('تم التوليد بنجاح ملوكي! ✨', 'success');
        setPrompt('');
      } else {
        throw new Error(response?.error || 'خطأ في خادم الذكاء الاصطناعي');
      }
    } catch (error) {
      console.error('❌ [useAiGenerator Error]:', error.message);
      showToast('حدث خطأ أثناء الاتصال بالمحرك', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, loading, result, generateScript };
}
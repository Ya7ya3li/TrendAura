import { useState, useContext } from 'react';
import { aiService } from '../services/aiService.js';
import { usageService } from '../services/usageService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { SubscriptionContext } from '../context/SubscriptionContext.jsx';
import { supabase } from '../config/supabase.js';
import { showToast } from '../App.jsx';

export default function useAiGenerator() {
  // 🚀 التعديل: استدعاء initialized الصافي مباشرة وبدون ترقيع بأسماء قديمة
  const { profile, setProfile, initialized } = useContext(AuthContext);
  const { plan } = useContext(SubscriptionContext); 
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [result, setResult] = useState({ 
    hook: '', script: '', cta: '', hashtags: [], aiScore: null,
    retentionRate: null, bestTimes: [], viralIdeas: [], hookStrength: '',
    ctaRating: '', tips: []
  });

  const generateScript = async () => {
    // 🎯 الحارس الذكي: لو لم تكتمل التهيئة أو البروفايل لسه ما نزل، نبهه فوراً لحماية السيرفر
    if (!initialized || !profile?.id) {
      if (typeof showToast === 'function') showToast('جاري التحقق من بياناتك...', 'warning');
      return;
    }

    if (!prompt || !prompt.trim()) {
      if (typeof showToast === 'function') showToast('يرجى كتابة فكرة المحتوى أولاً', 'warning');
      return;
    }
    
    // بقية كود التوليد عندك...

    setLoading(true);
    try {
      const isEligible = await usageService.checkEligibility(profile.id, plan);
      if (!isEligible) {
        if (typeof showToast === 'function') showToast('لقد استهلكت كامل حصتك، يرجى الترقية ⚠️', 'error');
        setLoading(false);
        return;
      }

      const response = await aiService.generateScript(prompt); 
      
      if (response && (response.success || response.hook)) {
        const aiData = response.success ? response.data : response;

        // صهر وتوطين البيانات الحقيقية المستلمة كاملة ومطابقتها للكروت
        const finalResult = {
          hook: aiData.hook || '',
          script: aiData.script || '',
          cta: aiData.cta || '',
          hashtags: Array.isArray(aiData.hashtags) ? aiData.hashtags : [],
          aiScore: aiData.trendProbability || 85,
          retentionRate: aiData.retentionRate || 80,
          bestTimes: aiData.bestTime ? [{ hour: aiData.bestTime, power: 5 }] : [],
          viralIdeas: Array.isArray(aiData.ideas) ? aiData.ideas : [],
          hookStrength: aiData.hookStrength || 'قوي',
          ctaRating: aiData.ctaRating || 'ممتاز',
          tips: Array.isArray(aiData.tips) ? aiData.tips : []
        };

        // 🚀 1. كبس وحقن الحفظ التلقائي في سوبابيس وفحص الـ error الحقيقي
        const { error: insertError } = await supabase.from('scripts').insert([
          {
            user_id: profile.id,
            hook: finalResult.hook,
            script: finalResult.script,
            cta: finalResult.cta,
            hashtags: finalResult.hashtags,
            ai_score: finalResult.aiScore,
            retention_rate: finalResult.retentionRate
          }
        ]);

        // لو سوبابيس رفضت الحفظ، نرمي الخطأ فوراً بداخل الـ catch لمنع كود التوكنات وتنبيه المتصفح بالعلة الصريحة
        if (insertError) {
          console.error("❌ [Supabase Direct Insert Error]:", insertError);
          throw new Error(`سوبابيس رفضت الحفظ الآلي: ${insertError.message}`);
        }

        // 🚀 2. تحديث واجهة العرض بالبيانات (لا يتم التحديث إلا بعد نجاح الحفظ بالجدول صخر)
        setResult(finalResult);

        // 🚀 3. خصم التوكن ومزامنة الحساب بعد ضمان الحفظ الكامل
        const currentTokens = profile.tokens || 0;
        const deductedTokens = Math.max(0, currentTokens - 10);
        
        const { error: profileError } = await supabase.from('profiles').update({ tokens: deductedTokens }).eq('id', profile.id);
        if (profileError) throw profileError;

        setProfile(prev => ({ ...prev, tokens: deductedTokens }));
        
        if (typeof showToast === 'function') showToast('تم التوليد وحفظ السكريبت في أرشيفك فوراً! ✨💾', 'success');
        setPrompt('');
      } else {
        throw new Error('فشل السيرفر في توليد السكريبت الموحد.');
      }
    } catch (error) {
      console.error('❌ [useAiGenerator Real Exception Caught]:', error.message);
      if (typeof showToast === 'function') showToast(error.message || 'حدث خطأ أثناء الاتصال بالمحرك', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, loading, result, setResult, generateScript };
}
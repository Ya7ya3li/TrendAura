import { useState, useContext } from 'react';
import { aiService } from '../services/aiService.js';
import { usageService } from '../services/usageService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { SubscriptionContext } from '../context/SubscriptionContext.jsx';
import { supabase } from '../config/supabase.js';
import { showToast } from '../App.jsx';

export default function useAiGenerator() {
  const { profile, setProfile, initialized } = useContext(AuthContext);
  const { plan } = useContext(SubscriptionContext); 
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [result, setResult] = useState({ 
    hook: '', script: '', cta: '', hashtags: [], aiScore: null,
    retentionRate: null, bestTimes: [], viralIdeas: [], hookStrength: '',
    ctaRating: '', tips: []
  });

  const currentPlan = (plan || 'free').toLowerCase().trim();

  // 🛠️ الإصلاح: الدالة الآن تستقبل التعليمات المخصصة لكل باقة وتحقنها في الطلب
  const generateScript = async (extraInstructions = '') => {
    if (!initialized || !profile?.id) {
      if (typeof showToast === 'function') showToast('جاري التحقق من بياناتك...', 'warning');
      return;
    }

    if (!prompt || !prompt.trim()) {
      if (typeof showToast === 'function') showToast('يرجى كتابة فكرة المحتوى أولاً', 'warning');
      return;
    }
    
    setLoading(true);
    try {
      // 📊 الفحص المركزي الحقيقي من السيرفر لمنع ثغرات الـ F5 والتلاعب بالعدادات
      const isEligible = await usageService.checkEligibility(profile.id, plan);
      if (!isEligible) {
        if (typeof showToast === 'function') showToast('لقد استهلكت كامل حصتك، يرجى الترقية ⚠️', 'error');
        setLoading(false);
        return;
      }

      // دمج تعليمات الباقة مع برومبت المستخدم برمجياً
      const finalPrompt = extraInstructions ? `${prompt}\n\n${extraInstructions}` : prompt;
      const response = await aiService.generateScript(finalPrompt); 
      
      if (response && (response.success || response.hook)) {
        const aiData = response.success ? response.data : response;

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

        // 🔒 الإصلاح: منع الحفظ التلقائي في سوبابيس نهائياً إذا كان المستخدم على الباقة المجانية
        if (currentPlan !== 'free') {
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

          if (insertError) {
            console.error("❌ [Supabase Direct Insert Error]:", insertError);
            throw new Error(`سوبابيس رفضت الحفظ الآلي: ${insertError.message}`);
          } 
        }

        // تحديث الواجهة بالبيانات
        setResult(finalResult);

        // خصم التوكن ومزامنة الحساب للمشتركين فقط
        const currentTokens = profile.tokens || 0;
        const deductedTokens = Math.max(0, currentTokens - 10);
        
        const { error: profileError } = await supabase.from('profiles').update({ tokens: deductedTokens }).eq('id', profile.id);
        if (profileError) throw profileError;

        setProfile(prev => ({ ...prev, tokens: deductedTokens }));
        
        if (typeof showToast === 'function') {
          const successMessage = currentPlan === 'free' 
            ? 'تم توليد السكريبت المحدود بنجاح! ✨' 
            : 'تم التوليد وحفظ السكريبت في أرشيفك فوراً! ✨💾';
          showToast(successMessage, 'success');
        }
        setPrompt('');
      } else {
        throw new Error('فشل السيرفر في توليد السكريبت الموحد.');
      }
    } catch (error) {
      console.error('❌ [useAiGenerator Real Exception Caught]:', error.message);
      if (typeof showToast === 'function') showToast(error.message || 'حدث خطأ أثناء الاتصال بالمحرك', 'error');
    } window.history.replaceState({}, document.title, window.location.pathname); {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, loading, result, setResult, generateScript };
}
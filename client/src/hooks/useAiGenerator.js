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
      const currentDailyGens = profile.daily_generations || 0;
      const currentTokens = profile.tokens || 0;

      // 📊 1. هندسة حارس الأحقية الهجين (Hybrid Freemium Gate)
      let isEligible = false;
      let shouldChargeTokensForFreePlan = false;

      if (currentPlan === 'free') {
        if (currentDailyGens < 5) {
          // لسه تحت الـ 5 توليدات: مسموح له مجاناً بدون شروط توكنز
          isEligible = true;
          shouldChargeTokensForFreePlan = false;
        } else if (currentTokens >= 10) {
          // تخطى الـ 5 توليدات ومعه رصيد كافي: مسموح له بخصم توكنز
          isEligible = true;
          shouldChargeTokensForFreePlan = true;
        } else {
          // تخطى الـ 5 وما معه توكنز: قفل حتمي!
          isEligible = false;
        }
      } else {
        // الباقات المدفوعة Pro / Viral تعتمد على فحص السيرفر المعتاد
        isEligible = await usageService.checkEligibility(profile.id, plan);
        shouldChargeTokensForFreePlan = false; // الباقات المدفوعة لها منطقها الخاص بالتوكنز
      }

      // إذا غير مؤهل، ارفع الخطأ فوراً واقفل التوليد
      if (!isEligible) {
        const errorAlertMsg = currentPlan === 'free' && currentDailyGens >= 5
          ? '⚠️ لقد استهلكت الـ 5 توليدات المجانية وليس لديك رصيد توكنز كافٍ للاستمرار، يرجى الشحن أو الترقية!'
          : 'لقد استهلكت كامل حصتك، يرجى الترقية ⚠️';
          
        if (typeof showToast === 'function') showToast(errorAlertMsg, 'error');
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

        // 🔒 منع الحفظ التلقائي في سوبابيس نهائياً إذا كان المستخدم على الباقة المجانية
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

        // 🚀 2. خوارزمية تحديث العدادات الذكية وخصم التوكن الح ديناميكياً
        const nextDailyGens = currentDailyGens + 1;
        const deductedTokens = Math.max(0, currentTokens - 10);
        
        let databaseUpdatePayload = {};

        if (currentPlan === 'free') {
          if (shouldChargeTokensForFreePlan) {
            // خلص الـ 5 ومعه توكنز: نزيد العداد ونخصم 10 توكنز
            databaseUpdatePayload = { daily_generations: nextDailyGens, tokens: deductedTokens };
          } else {
            // لسه تحت الـ 5: نزيد عداد اليوم فقط بدون لمس التوكنز
            databaseUpdatePayload = { daily_generations: nextDailyGens };
          }
        } else {
          // الباقات المدفوعة: يخصم 10 توكنز ويزيد العداد الافتراضي
          databaseUpdatePayload = { tokens: deductedTokens, daily_generations: nextDailyGens };
        }

        // إطلاق أمر التحديث الموحد إلى جدول البروفايلات في Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .update(databaseUpdatePayload)
          .eq('id', profile.id);

        if (profileError) throw profileError;

        // مزامنة الـ Context محلياً لايف ليعكس الرصيد والعداد الجديد على الشاشة فوراً
        setProfile(prev => ({ ...prev, ...databaseUpdatePayload }));
        
        if (typeof showToast === 'function') {
          let successMessage = '';
          if (currentPlan === 'free') {
            successMessage = shouldChargeTokensForFreePlan
              ? `تم التوليد بنجاح بخصم 10 توكنز من رصيدك! ⚡`
              : `تم توليد السكريبت المحدود مجاناً! (${nextDailyGens} من أصل 5 اليوم) ✨`;
          } else {
            successMessage = 'تم التوليد وحفظ السكريبت في أرشيفك فوراً! ✨💾';
          }
          showToast(successMessage, 'success');
        }
        setPrompt('');
      } else {
        throw new Error('فشل السيرفر في توليد السكريبت الموحد.');
      }
    } catch (error) {
      console.error('❌ [useAiGenerator Real Exception Caught]:', error.message);
      if (typeof showToast === 'function') showToast(error.message || 'حدث خطأ أثناء الاتصال بالمحرك', 'error');
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
    }
  };

  return { prompt, setPrompt, loading, result, setResult, generateScript };
}
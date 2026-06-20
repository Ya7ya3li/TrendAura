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

      // 🎯 1. تحديد الحد اليومي الديناميكي بناءً على الباقة
      let MAX_DAILY_LIMIT = 5; // الافتراضي للمجاني
      if (currentPlan === 'pro') {
        MAX_DAILY_LIMIT = 50;
      } else if (currentPlan === 'viral_engine' || currentPlan === 'viral engine') {
        MAX_DAILY_LIMIT = 200;
      }

      // 📊 2. هندسة حارس الأحقية الموحد (Unified Quota Engine)
      let isEligible = false;
      let shouldChargeTokens = false;

      if (currentDailyGens < MAX_DAILY_LIMIT) {
        // المسار الأول: لسه تحت الحد اليومي المسموح لباقته (مجاني بالكامل)
        isEligible = true;
        shouldChargeTokens = false;
      } else if (currentTokens >= 10) {
        // المسار الثاني: تخطى الحد اليومي، لكن محفظة التوكنز فيها رصيد كافي للخصم
        isEligible = true;
        shouldChargeTokens = true;
      } else {
        // المسار الثالث: مفلس تماماً (لا حصة يومية ولا توكنز)
        isEligible = false;
      }

      // إذا غير مؤهل، ارفع الخطأ فوراً واقفل التوليد
      if (!isEligible) {
        const errorAlertMsg = '⚠️ لقد استهلكت كامل حصتك اليومية وليس لديك رصيد توكنز كافٍ للاستمرار، يرجى الشحن أو الترقية!';
        if (typeof showToast === 'function') showToast(errorAlertMsg, 'error');
        setLoading(false);
        return;
      }

      // 👑 دمج أسلوب الفيديو المختار (تحفيزي، تعليمي...) مع البرومبت بذكاء
      const finalPrompt = extraInstructions
        ? `${prompt}\n\n[ملاحظة هامة جداً: يجب أن يكون أسلوب ونبرة السكريبت: ${extraInstructions}]`
        : prompt;
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

        // 🚀 3. خوارزمية تحديث العدادات الذكية وخصم التوكن ديناميكياً
        const nextDailyGens = currentDailyGens + 1;
        const deductedTokens = Math.max(0, currentTokens - 10);

        let databaseUpdatePayload = {};

        if (shouldChargeTokens) {
          // انتهت الحصة اليومية، نخصم 10 توكنز ونكمل العداد
          databaseUpdatePayload = { daily_generations: nextDailyGens, tokens: deductedTokens };
        } else {
          // ضمن الحصة اليومية، نزيد عداد اليوم فقط بدون لمس التوكنز
          databaseUpdatePayload = { daily_generations: nextDailyGens };
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
          if (shouldChargeTokens) {
            successMessage = `تم التوليد بنجاح بخصم 10 توكنز من رصيدك! ⚡`;
          } else {
            if (currentPlan === 'free') {
              successMessage = `تم توليد السكريبت المحدود مجاناً! (${nextDailyGens} من أصل ${MAX_DAILY_LIMIT} اليوم) ✨`;
            } else {
              successMessage = `تم التوليد وحفظ السكريبت في أرشيفك! (${nextDailyGens}/${MAX_DAILY_LIMIT} من حصتك اليومية) ✨💾`;
            }
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
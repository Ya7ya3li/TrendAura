import { useState, useContext } from 'react';
import { aiService } from '../services/aiService';
import { usageService } from '../services/usageService';
import { AuthContext } from '../context/AuthContext';
import { SubscriptionContext } from '../context/SubscriptionContext';
import { supabase } from '../config/supabase';
import { showToast } from '../App';

// أضفنا التحقق من loading هنا أيضاً
export default function useAiGenerator() {
  const { profile, setProfile, loading: authLoading } = useContext(AuthContext);
  const { plan } = useContext(SubscriptionContext); 
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [result, setResult] = useState({ 
    hook: '', 
    script: '', 
    hashtags: ['#fyp', '#viral', '#explore'],
    bestTimes: [{ hour: 'الساعة 6:00 مساءً', power: 5 }],
    viralIdeas: ['اكتب فكرتك الملوكية أولاً']
  });

  const generateDynamicContext = (inputPrompt) => {
    // ... (نفس دالتك السابقة لا تغيير) ...
    const text = inputPrompt ? inputPrompt.toLowerCase() : '';
    if (text.includes('بزنس') || text.includes('فلوس') || text.includes('تسويق')) {
      return {
        hashtags: ['#بزنس', '#تجارة_إلكترونية', '#استثمار'],
        times: [{ hour: 'الساعة 09:00 صباحاً', power: 5 }, { hour: 'الساعة 08:00 مساءً', power: 5 }],
        ideas: ['3 أسرار يخفيها عنك أثرياء التجارة الإلكترونية', 'كيف تقنع أي عميل بالشراء منك']
      };
    }
    return {
      hashtags: ['#fyp', '#viral', '#صناعة_محتوى'],
      times: [{ hour: 'الساعة 06:30 مساءً', power: 5 }, { hour: 'الساعة 09:15 مساءً', power: 5 }],
      ideas: ['كيف تجعل المشاهد يعيد الفيديو 3 مرات', 'الخطة الذهبية للانتشار السريع']
    };
  };

  const generateScript = async () => {
    // 1. الحماية: لا تولد شيئاً إذا كان الـ Auth لم ينتهِ من التحميل أو الـ profile غير موجود
    if (authLoading || !profile?.id) {
      showToast('جاري التحقق من بياناتك، يرجى الانتظار ثوانٍ...', 'warning');
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
        showToast('لقد استهلكت كامل حصتك، يرجى الترقية للمتابعة ⚠️', 'error');
        setLoading(false);
        return;
      }

      const response = await aiService.analyzeScriptMetrics(prompt);
      
      if (response && response.success) {
        const dynamicContext = generateDynamicContext(prompt.trim());
        const deductedTokens = Math.max(0, (profile.tokens || 0) - 10);
        
        const { error: dbError } = await supabase
          .from('profiles')
          .update({ tokens: deductedTokens })
          .eq('id', profile.id);

        if (dbError) throw dbError;

        setProfile(prev => ({ ...prev, tokens: deductedTokens }));

        setResult({
          hook: response.hook || 'المقدمة الخاطفة 🚀',
          script: response.feedback || 'تم صياغة السيناريو بنجاح.',
          hashtags: dynamicContext.hashtags,
          bestTimes: dynamicContext.times,
          viralIdeas: dynamicContext.ideas
        });
        
        showToast('تم التوليد بنجاح ملوكي! ✨', 'success');
        setPrompt('');
      } else {
        throw new Error(response?.error || 'خطأ في خادم الذكاء الاصطناعي');
      }
    } catch (error) {
      console.error('❌ [useAiGenerator Error]:', error.message);
      // ... (نفس دالتك السابقة للتعامل مع الخطأ) ...
    } finally {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, loading, result, generateScript };
}
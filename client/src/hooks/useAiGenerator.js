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
    hashtags: ['#fyp', '#viral', '#explore'],
    bestTimes: [{ hour: 'الساعة 6:00 مساءً', power: 5 }],
    viralIdeas: ['اكتب فكرتك الملوكية أولاً']
  });

  const generateDynamicContext = (inputPrompt) => {
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

      // 🚀 التعديل الجوهري الأول: استدعاء دالة التوليد الحقيقية وليس دالة المؤشرات
      // تأكد أن الدالة في ملف aiService.js تضرب مسار السكربت الرئيسي
      const response = await aiService.generateScript(prompt); 
      
      if (response && response.success) {
        const dynamicContext = generateDynamicContext(prompt.trim());
        const deductedTokens = Math.max(0, (profile.tokens || 0) - 10);
        
        const { error: dbError } = await supabase
          .from('profiles')
          .update({ tokens: deductedTokens })
          .eq('id', profile.id);

        if (dbError) throw dbError;

        setProfile(prev => ({ ...prev, tokens: deductedTokens }));

        // 🚀 التعديل الجوهري الثاني: فك غلاف الكائن data واستخراج النصوص بدقة
        const aiData = response.data || response;

        setResult({
          hook: aiData.hook || 'المقدمة الخاطفة 🚀',
          script: aiData.script || aiData.body || aiData.content || 'تم صياغة السيناريو بنجاح.',
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
      showToast(error.message || 'حدث خطأ أثناء الاتصال بالمحرك', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, loading, result, generateScript };
}